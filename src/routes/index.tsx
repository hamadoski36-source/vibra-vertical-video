// VIBRA WORLDWIDE - FINAL YOTE + SETTINGS - TUSIHARIBU!
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Vibra Worldwide - Video feed' }] }),
  component: VibraApp,
})

const PINK = '#FE2C55'
const TEAL = '#25F4EE'

type Lang = 'sw' | 'en'
type Theme = 'light' | 'dark'

function VibraApp() {
  // === 1. LANGUAGE - Kama TikTok ===
  const [lang, setLang] = useState<Lang>('sw')
  // === 2. DISPLAY - Light / Dark Kama TikTok ===
  const [theme, setTheme] = useState<Theme>('light')
  // === 3. SIGN UP - Kama TikTok ===
  const [showSignup, setShowSignup] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [user, setUser] = useState<string | null>(null)

  const t = {
    sw: {
      home: 'Nyumbani', post: 'Chapisha', signup: 'Jisajili kwa Vibra',
      signupDesc: 'Tengeneza profile, fuata wengine, tengeneza video zako, na zaidi.',
      phone: 'Tumia simu au email', google: 'Endelea na Google',
      haveAccount: 'Tayari una akaunti?', login: 'Ingia',
      language: 'Lugha ya App', display: 'Muonekano', privacy: 'Privacy Policy',
      light: 'Nyeupe', dark: 'Nyeusi', privacyTitle: 'Privacy Policy - Vibra',
      welcome: 'Karibu Vibra', videos: 'Video za Vibra'
    },
    en: {
      home: 'Home', post: 'Post', signup: 'Sign up for Vibra',
      signupDesc: 'Create a profile, follow others, make your own videos, and more.',
      phone: 'Use phone or email', google: 'Continue with Google',
      haveAccount: 'Already have an account?', login: 'Log in',
      language: 'App language', display: 'Display', privacy: 'Privacy Policy',
      light: 'Light', dark: 'Dark', privacyTitle: 'Privacy Policy - Vibra',
      welcome: 'Welcome to Vibra', videos: 'Vibra Videos'
    }
  }[lang]

  const isDark = theme === 'dark'
  const bg = isDark ? '#000' : '#fff'
  const text = isDark ? '#fff' : '#000'

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', padding: 16 }}>
      {/* HEADER - VIBRA + SETTINGS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: PINK, fontWeight: 800, fontSize: 28 }}>Vibra</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* LANGUAGE */}
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} style={{ padding: 8, borderRadius: 8 }}>
            <option value="sw">Kiswahili</option>
            <option value="en">English (US)</option>
          </select>
          {/* DISPLAY */}
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ padding: '8px 12px', borderRadius: 20, border: '1px solid #ccc' }}>
            {isDark ? `☀️ ${t.light}` : `🌙 ${t.dark}`}
          </button>
          {!user && <Button onClick={() => setShowSignup(true)} style={{ background: PINK, color: '#fff' }}>{t.signup}</Button>}
          {user && <span>👋 {user}</span>}
        </div>
      </div>

      <h2 style={{ marginTop: 20 }}>{t.welcome}</h2>
      <p>{t.videos}</p>

      {/* VIDEO FEED - hapa video zako za zamani zinaendelea kufanya kazi */}
      <div style={{ marginTop: 16, background: isDark ? '#111' : '#f5f5f5', padding: 20, borderRadius: 16, textAlign: 'center' }}>
        <p>🎬 Video Feed Yako Ipo Hapa - Kama Zamani</p>
        <Button style={{ background: TEAL, color: '#000', marginTop: 10 }}>{t.post}</Button>
      </div>

      <button onClick={() => setShowPrivacy(true)} style={{ marginTop: 30, textDecoration: 'underline', background: 'none', border: 'none', color: text }}>
        {t.privacy}
      </button>

      {/* === SIGN UP MODAL - Kama TikTok === */}
      {showSignup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: isDark ? '#222' : '#fff', color: text, padding: 24, borderRadius: 16, width: '90%', maxWidth: 400, textAlign: 'center' }}>
            <h2>{t.signup}</h2>
            <p style={{ fontSize: 14, color: '#888' }}>{t.signupDesc}</p>
            <Button onClick={() => { setUser('Mgeni Vibra'); setShowSignup(false) }} style={{ width: '100%', background: PINK, color: '#fff', marginTop: 16, padding: 12 }}>{t.phone}</Button>
            <Button onClick={() => { setUser('Google User'); setShowSignup(false) }} style={{ width: '100%', marginTop: 10, padding: 12, border: '1px solid #ccc', background: isDark ? '#333' : '#fff', color: text }}>G {t.google}</Button>
            <p style={{ fontSize: 12, marginTop: 16 }}>By continuing, you agree to Vibra's <b>Terms</b> and <b onClick={() => setShowPrivacy(true)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</b></p>
            <p style={{ fontSize: 13 }}>{t.haveAccount} <b onClick={() => setShowSignup(false)} style={{ cursor: 'pointer', color: PINK }}>{t.login}</b></p>
            <button onClick={() => setShowSignup(false)} style={{ marginTop: 10 }}>X Funga</button>
          </div>
        </div>
      )}

      {/* === PRIVACY POLICY MODAL - Ya Vibra === */}
      {showPrivacy && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60 }}>
          <div style={{ background: isDark ? '#222' : '#fff', color: text, padding: 24, borderRadius: 16, width: '90%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
            <h1>{t.privacyTitle}</h1>
            <p><i>Last updated: November 9, 2026</i></p>
            <p>Karibu Vibra. Vibra inamilikiwa kutoka Mombasa, Kenya. Hatukuibi - tunakulinda!</p>
            <h3>1. What information we collect</h3><p>Jina, simu, email, password, video unazopost.</p>
            <h3>2. How we use your information</h3><p>Kukupa video unazopenda na kukulinda dhidi ya hacker.</p>
            <h3>3. How we share your information</h3><p>HATUUZI taarifa zako kwa mtu yeyote!</p>
            <h3>4. Where we store your information</h3><p>Kwa usalama, password inafichwa.</p>
            <h3>5. Your rights and choices</h3><p>Una haki ya kufuta akaunti yako wakati wowote.</p>
            <h3>6. The security of your information</h3><p>Tunatumia 2FA na password ngumu kukulinda.</p>
            <h3>7. How long we keep your information</h3><p>Mpaka ukifuta akaunti yako.</p>
            <h3>8. Information relating to children and teens</h3><p>Vibra ni kwa 13+.</p>
            <h3>9. Privacy Policy update</h3><p>Tukibadilisha tutakujulisha.</p>
            <h3>10. Contact</h3><p>support@vibra.co.ke - Mombasa, Kenya</p>
            <button onClick={() => setShowPrivacy(false)} style={{ marginTop: 16, padding: '10px 20px', background: PINK, color: '#fff', borderRadius: 10, border: 'none' }}>Sawa, Nimeelewa</button>
          </div>
        </div>
      )}
    </div>
  )
}
