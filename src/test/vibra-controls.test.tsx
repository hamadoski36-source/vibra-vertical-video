import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Route } from '@/routes/index';
vi.mock('@/lib/vibra-cloud',()=>({readCloudVideos:vi.fn().mockRejectedValue(new Error('Missing username column')),uploadCloudVideo:vi.fn()}));
beforeEach(()=>{
  vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
  vi.stubGlobal('ResizeObserver',class {observe(){} unobserve(){} disconnect(){}});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()});
it('toggles the 246 heart count and selected-video bookmark, and posts comments',async()=>{
  const App=Route.options.component;if(!App)throw Error('Missing app');render(<App/>);
  const like=screen.getByRole('button',{name:'Like video'});
  expect(like).toHaveTextContent('246');fireEvent.click(like);expect(like).toHaveTextContent('247');
  fireEvent.click(like);expect(like).toHaveTextContent('246');
  fireEvent.click(screen.getByRole('button',{name:'Save video'}));expect(screen.getByRole('button',{name:'Save video'})).toHaveAttribute('aria-pressed','true');
  fireEvent.click(screen.getByRole('button',{name:'Comments'}));
  fireEvent.change(screen.getByLabelText('Add comment'),{target:{value:'Hello Vibra'}});
  fireEvent.click(screen.getByRole('button',{name:'Post'}));
  await waitFor(()=>expect(screen.getByText('Hello Vibra')).toBeInTheDocument());
});it('LIVE buttons open the honest LIVE panel and Search focuses the search box',()=>{
  const App=Route.options.component;if(!App)throw Error('Missing app');render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'LIVE tab'}));
  expect(screen.getByRole('button',{name:/washa kamera/i})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Close panel'}));
  fireEvent.click(screen.getByRole('button',{name:'🔍 Search'}));
  expect(document.activeElement).toBe(screen.getByLabelText('Search videos'));
});
