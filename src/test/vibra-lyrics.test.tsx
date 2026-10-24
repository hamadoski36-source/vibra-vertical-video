import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Route } from '@/routes/index';

describe('Per-video lyrics', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('vibra-state-v1', JSON.stringify({ seenTip: true, clips: [
      { id: 'first', title: 'First track', creator: 'Creator', username: 'creator', palette: 'coral', shape: 'orb', caption: '', createdAt: 1, lyrics: 'Provided first line\nProvided second line' },
      { id: 'second', title: 'Second track', creator: 'Creator', username: 'creator', palette: 'lime', shape: 'flower', caption: '', createdAt: 2, lyrics: 'Different provided verse' },
    ] }));
  });
  afterEach(() => { cleanup(); localStorage.clear(); });

  it('reads the supplied lyrics only from the clip whose action was tapped', async () => {
    const App = Route.options.component;
    if (!App) throw new Error('Vibra component is unavailable');
    render(<App />);
    fireEvent.click(within(await screen.findByTestId('card-clip-first')).getByRole('button', { name: /^Lyrics$/ }));
    const first = screen.getByRole('dialog');
    expect(first.textContent).toContain('Provided first line\nProvided second line');
    expect(first.textContent).not.toContain('Different provided verse');
    fireEvent.click(within(first).getByRole('button', { name: 'Close lyrics' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(within(screen.getByTestId('card-clip-second')).getByRole('button', { name: /^Lyrics$/ }));
    expect(screen.getByRole('dialog').textContent).toContain('Different provided verse');
    expect(screen.getByRole('dialog').textContent).not.toContain('Provided first line');
  });
});