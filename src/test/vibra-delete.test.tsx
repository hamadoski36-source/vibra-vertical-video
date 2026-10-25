import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Route } from '@/routes/index';

const clip = (id: string, username = 'yourhandle') => ({ id, title: id, creator: username, username, palette: 'coral', shape: 'orb', caption: '', createdAt: 1 });
const original = {
  seenTip: true, clips: [clip('Selected video'), clip('Keep video'), clip('Other creator', 'someoneelse')],
  profile: { name: 'My name', handle: 'yourhandle', bio: 'Keep my bio' },
  liked: ['Selected video', 'Keep video', 'demo-1'], saved: ['Keep video', 'demo-2'],
  comments: { 'Keep video': [{ id: 'note', text: 'Keep this comment', createdAt: 1 }] }, follows: ['afterglow'],
};

async function openProfile() {
  const App = Route.options.component;
  if (!App) throw new Error('Vibra component is unavailable');
  render(<App/>);
  fireEvent.click((await screen.findAllByRole('button', { name: /^Profile$/ }))[0]);
}

describe('Confirmed owned video deletion', () => {
  beforeEach(() => { localStorage.clear(); localStorage.setItem('vibra-state-v1', JSON.stringify(original)); });
  afterEach(() => { cleanup(); localStorage.clear(); });

  it('requires confirmation and cancellation leaves every video untouched', async () => {
    await openProfile();
    fireEvent.click(screen.getByRole('button', { name: 'Delete Selected video' }));
    expect(JSON.parse(localStorage.getItem('vibra-state-v1') ?? '{}').clips).toEqual(original.clips);
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(JSON.parse(localStorage.getItem('vibra-state-v1') ?? '{}')).toEqual(original);
  });

  it('deletes only the confirmed video and persists all other videos and user data', async () => {
    await openProfile();
    fireEvent.click(screen.getByRole('button', { name: 'Delete Selected video' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete video' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(JSON.parse(localStorage.getItem('vibra-state-v1') ?? '{}')).toEqual({ ...original, clips: original.clips.filter(c => c.id !== 'Selected video') });
    expect(screen.queryByRole('button', { name: 'Delete Selected video' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Delete Keep video' })).toBeInTheDocument();
    cleanup();
    await openProfile();
    expect(screen.queryByRole('button', { name: 'Delete Selected video' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Delete Keep video' })).toBeInTheDocument();
  });

  it('does not offer deletion for another creator or demo clips', async () => {
    await openProfile();
    expect(screen.queryByRole('button', { name: 'Delete Other creator' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /^Liked/ }));
    expect(screen.queryByRole('button', { name: 'Delete A little color, a lot of feeling' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Delete Selected video' })).toBeInTheDocument();
  });
});