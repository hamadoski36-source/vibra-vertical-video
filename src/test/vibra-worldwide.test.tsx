import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the Supabase client so tests never touch the network.
const clips = [
  { id: 'c1', title: 'Nairobi nights', creator: 'amina', username: 'amina', caption: 'Kenya', video_url: 'https://example.supabase.co/storage/v1/object/public/Vibra%20clips/u1/a.webm', owner_id: 'user-1', visibility: 'public', created_at: '2026-10-01' },
  { id: 'c2', title: 'Tokyo lights', creator: 'kenji', username: 'kenji', caption: 'Japan', video_url: 'https://example.supabase.co/storage/v1/object/public/Vibra%20clips/u2/b.webm', owner_id: 'user-2', visibility: 'public', created_at: '2026-10-02' },
];

const storageRemove = vi.fn().mockResolvedValue({ error: null });
const storageUpload = vi.fn().mockResolvedValue({ error: null });
const tableDelete = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
const tableInsert = vi.fn().mockResolvedValue({ error: null });
let currentUser: { id: string; email: string } | null = null;

function thenable(result: unknown) {
  const builder: any = new Promise((resolve) => resolve(result));
  for (const m of ['select', 'eq', 'order', 'range', 'insert', 'delete', 'single']) {
    builder[m] = vi.fn(() => (m === 'insert' ? tableInsert() : m === 'delete' ? tableDelete() : builder));
  }
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

  it('uploads to the cloud bucket, inserts a row and shows the worldwide success message', async () => {
    currentUser = { id: 'user-9', email: 'me@example.com' };
    await start();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'my clip.webm', { type: 'video/webm' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Uploaded WORLDWIDE!/)).toBeInTheDocument());
    expect(storageUpload).toHaveBeenCalledOnce();
    expect(tableInsert).toHaveBeenCalledOnce();
  });

  it('blocks deleting a video owned by someone else', async () => {
    currentUser = { id: 'user-1', email: 'me@example.com' };
    await start();
    const tokyo = screen.getByText('Tokyo lights').closest('div')!.parentElement!;
    fireEvent.click(Array.from(tokyo.querySelectorAll('button')).find(b => b.textContent === 'Delete my video')!);
    await waitFor(() => expect(screen.getByText('You can only delete your own videos')).toBeInTheDocument());
    expect(storageRemove).not.toHaveBeenCalled();
  });
});
