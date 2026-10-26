import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { Route } from '@/routes/index';

beforeEach(() => { localStorage.clear(); localStorage.setItem('vibra-state-v1', JSON.stringify({ seenTip: true, follows: ['afterglow'], followEdges: [{ from: 'afterglow', to: 'yourhandle' }] })); });
afterEach(() => { cleanup(); localStorage.clear(); });
async function start() {
  const App = Route.options.component;
  if (!App) throw new Error('App unavailable');
  render(<App/>);
  const profile = (await screen.findAllByRole('button', { name: /^Profile$/ }))[0];
  if (!profile) throw new Error('Profile unavailable');
  fireEvent.click(profile);
}
it('updates Follow, Following, Followers and mutual Friends through profile actions', async () => {
  await start();
  expect(screen.getByTestId('stat-followers')).toHaveTextContent('1');
  expect(screen.getByTestId('stat-following')).toHaveTextContent('1');
  expect(screen.getByTestId('stat-friends')).toHaveTextContent('1');
  fireEvent.click(screen.getAllByRole('button', { name: /^Home$/ })[0] ?? (() => { throw new Error('Home unavailable'); })());
  fireEvent.click(within(screen.getByTestId('card-clip-demo-2')).getAllByRole('button', { name: "Open Mina Sol's profile" })[0] ?? (() => { throw new Error('Creator unavailable'); })());
  fireEvent.click(screen.getByRole('button', { name: /^Following$/ }));
  expect(screen.getByTestId('stat-followers')).toHaveTextContent('0');
  expect(screen.getByTestId('stat-friends')).toHaveTextContent('0');
  fireEvent.click(screen.getByRole('button', { name: /^Follow$/ }));
  expect(screen.getByTestId('stat-followers')).toHaveTextContent('1');
  expect(screen.getByTestId('stat-friends')).toHaveTextContent('1');
});
it('saves, reads back, updates and removes social links without losing profile activity', async () => {
  await start();
  fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
  fireEvent.change(screen.getByLabelText('YouTube'), { target: { value: 'youtube.com/@vibra' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('link', { name: 'Open YouTube profile' })).toHaveAttribute('href', 'https://youtube.com/@vibra');
  expect(JSON.parse(localStorage.getItem('vibra-state-v1') ?? '{}').follows).toEqual(['afterglow']);
  cleanup(); await start();
  expect(screen.getByRole('link', { name: 'Open YouTube profile' })).toHaveAttribute('href', 'https://youtube.com/@vibra');
  fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
  expect(screen.getByLabelText('YouTube')).toHaveValue('https://youtube.com/@vibra');
  fireEvent.change(screen.getByLabelText('YouTube'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.queryByRole('link', { name: 'Open YouTube profile' })).toBeNull();
});