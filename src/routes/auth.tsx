import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!email) {
      alert('Weka email yako!')
      return
    }
    // Tunahifadhi login kwenye simu yako
    localStorage.setItem('vibra_user', email)
    alert('Umeingia! Karibu Vibra! 🎉')
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-2">Ingia Vibra 🔥</h1>
      <p className="text-gray-400 mb-6">Ingiza email yako uanze ku-upload</p>
      
      <input
        type="email"
        placeholder="email yako@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm p-4 rounded-xl bg-gray-800 border border-gray-700 mb-4 text-white"
      />
      
      <button
        onClick={handleLogin}
        className="w-full max-w-sm p-4 bg-purple-600 rounded-xl font-bold"
      >
        Ingia Sasa
      </button>

      <p className="mt-4 text-sm text-gray-500">Hakuna password inahitajika kwa sasa</p>
    </div>
  )
}
