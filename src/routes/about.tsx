import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Vibra</h1>
      <p className="text-gray-300 leading-7">
        Vibra is a worldwide vertical video platform built from Mombasa, Kenya - Faraja Bamburi. Created by Hamadoski to give everyone a voice.
      </p>
      <a href="/" className="mt-6 inline-block text-cyan-400">← Back to Vibra</a>
    </div>
  )
}
