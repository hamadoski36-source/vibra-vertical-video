import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: 'Contact Vibra Worldwide' },
    { name: 'description', content: 'Contact the Vibra Worldwide team.' },
    { property: 'og:title', content: 'Contact Vibra Worldwide' },
    { property: 'og:description', content: 'Contact the Vibra Worldwide team.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-300 mb-2">Have questions? Reach us:</p>
      <p className="text-white font-bold">Email: vibra@hamadoski.com</p>
      <p className="text-white font-bold">Location: Faraja, Bamburi - Mombasa, Kenya</p>
      <p className="text-white font-bold">Creator: Hamadoski - Vibra Worldwide 🌍</p>
      <p className="text-gray-400 mt-6 text-sm">We reply within 24 hours.</p>
      <a href="/" className="mt-6 inline-block text-cyan-400">← Back to Vibra</a>
    </div>
  )
}
