
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

function RootComponent() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .catch((error) => console.error('VIBRA SW:', error))
    }
  }, [])

  return <Outlet />
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: 'VIBRA WORLDWIDE' },
      { name: 'theme-color', content: '#000000' },
      { name: 'description', content: 'VIBRA WORLDWIDE - Short Videos for Everyone' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  }),
  component: RootComponent,
})
