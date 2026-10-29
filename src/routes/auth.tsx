import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth')({
  component: VibraAuth,
})

function VibraAuth() {
  const [name, setName] = useState('vibra_boy')
  const navigate = useNavigate()

  function ingia() {
    if (!name.trim()) { alert('Weka jina!'); return }
    const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_')
    localStorage.setItem('vibra_user', cleanName)
    localStorage.setItem('vibra_display', name)
    alert(`Umeingia kama @${cleanName}! Karibu Vibra! 🎉`)
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Ingia Vibra 🔥</h1>
      <p className="opacity-60 mt-2 text-sm">Karibu @vibra_boy!</p>
      
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className="mt-6 w-full max-w-sm bg-zinc-800 p-4 rounded-2xl text-white font-bold text-center text-lg"
      />

      <button onClick={ingia} className="mt-5 w-full max-w-sm bg-white text-black p-4 rounded-2xl font-bold text-lg">
        Ingia kama @vibra_boy 🚀
      </button>
      <p className="opacity-40 mt-4 text-xs">Jina la siri, hakuna jina la kweli!</p>
    </div>
  )
}
