import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the Supabase client so tests never touch the network.
const clips = [
  { id: '1001', title: 'Nairobi nights', creator: 'amina', username: 'amina', caption: 'Kenya', video_url: 'https://example.supabase.co/storage/v1/object/public/Vibra%20clips/u1/a.webm', created_at: 2000 },
  { id: '1002', title: 'Tokyo lights', creator: 'kenji', username: 'kenji', caption: 'Japan', video_url: 'https://example.supabase.co/storage/v1/object/public/Vibra%20clips/u2/b.webm', created_at: 3000 },
];

const storageRemove = vi.fn().mockResolvedValue({ error: null });
const storageUpload = vi.fn().mockResolvedValue({ error: null });
const deleteEq = vi.fn().mockResolvedValue({ error: null });
const tableInsert = vi.fn().mockResolvedValue({ error: null });
let currentUser: { id: string; email: string } | null = null;

function thenable(result: unknown) {
  const builder: any = new Promise((resolve) => resolve(result));
  for (const m of ['select', 'eq', 'order', 'range', 'delete', 'single']) {
    builder[m] = vi.fn(() => (m === 'delete' ? { eq: deleteEq } : builder));
  }
  builder.insert = vi.fn((row: unknown) => { tableInsert(row); return tableInsert.mock.results.length ? Promise.resolve({ error: null }) : Promise.resolve({ error: null }); });
  return builder;
}

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => thenable({ data: clips, error: null })),
    auth: {
      getUser: vi.fn(async () => ({ data: { user: currentUser } })),
      getSession: vi.fn(async () => ({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: storageUpload,
        remove: storageRemove,
        getPublicUrl: (name: string) => ({ data: { publicUrl: `https://example.supabase.co/storage/v1/object/public/Vibra%20clips/${name}` } }),
      })),
    },
  },
}));

import { Route } from '@/routes/index';

async function start() {
  const App = Route.options.component;
  if (!App) throw new Error('Vibra component is unavailable');
  render(<App />);
  await screen.findByText('Nairobi nights');
}

describe('Worldwide Supabase feed', () => {
  beforeEach(() => { vi.clearAllMocks(); currentUser = null; });
  afterEach(() => cleanup());

  it('loads the feed from the cloud clips table, not localStorage', async () => {
    localStorage.setItem('vibra-state-v1', JSON.stringify({ clips: [{ id: 'local-only', title: 'Local ghost' }] }));
    await start();
    expect(screen.getByText('Tokyo lights')).toBeInTheDocument();
    expect(screen.queryByText('Local ghost')).toBeNull();
  });

  it('uploads to the cloud bucket, inserts a row and shows "Uploaded worldwide!"', async () => {
    currentUser = { id: 'user-9', email: 'me@example.com' };
    await start();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'my clip.webm', { type: 'video/webm' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText('Uploaded worldwide!')).toBeInTheDocument());
    expect(storageUpload).toHaveBeenCalledOnce();
    expect(tableInsert).toHaveBeenCalledOnce();
    const row = tableInsert.mock.calls[0][0] as Record<string, unknown>;
    expect(row.video_url).toContain('Vibra%20clips');
    expect(typeof row.created_at).toBe('number');
  });

  it('deletes a clip from bucket and table when signed in', async () => {
    currentUser = { id: 'user-1', email: 'me@example.com' };
    await start();
    const tokyo = screen.getByText('Tokyo lights').closest('div')!.parentElement!;
    fireEvent.click(Array.from(tokyo.querySelectorAll('button')).find(b => b.textContent === 'Delete my video')!);
    await waitFor(() => expect(screen.getByText('Deleted')).toBeInTheDocument());
    expect(storageRemove).toHaveBeenCalledWith(['u2/b.webm']);
    expect(deleteEq).toHaveBeenCalledWith('id', '1002');
    expect(screen.queryByText('Tokyo lights')).toBeNull();
  });

  it('refuses to delete when signed out', async () => {
    await start();
    const tokyo = screen.getByText('Tokyo lights').closest('div')!.parentElement!;
    fireEvent.click(Array.from(tokyo.querySelectorAll('button')).find(b => b.textContent === 'Delete my video')!);
    await waitFor(() => expect(screen.getByText('Please login first')).toBeInTheDocument());
    expect(storageRemove).not.toHaveBeenCalled();
  });
});
