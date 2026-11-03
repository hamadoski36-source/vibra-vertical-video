import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: 'Privacy — Vibra Worldwide' },
    { name: 'description', content: 'Read the privacy policy for Vibra Worldwide.' },
    { property: 'og:title', content: 'Privacy — Vibra Worldwide' },
    { property: 'og:description', content: 'Read the privacy policy for Vibra Worldwide.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-300 leading-7 mb-3">At Vibra, we respect your privacy.</p>
      <p className="text-gray-300 leading-7 mb-3">Google AdSense placements are being prepared, but Google ads are not currently enabled in this version. If enabled after review, Google may use cookies and similar technologies; applicable consent choices must be available before ad requests.</p>
      <p className="text-gray-300 leading-7 mb-3">Your profile settings, demo coins and local uploads are stored in your browser. Local uploads are not automatically public; worldwide sharing requires a connected online upload service. Uploaded online content is sent to that service.</p>
      <p className="text-gray-300 leading-7 mb-3">External share buttons open the service you choose. Those services apply their own privacy policies. Demo coins have no cash value and are not advertising earnings.</p>
      <p className="text-gray-400 text-sm mt-4">Contact: vibra@hamadoski.com | Last updated: May 14, 2026</p>
      <a href="/" className="mt-6 inline-block text-cyan-400">← Back to Vibra</a>
    </div>
  )
}
