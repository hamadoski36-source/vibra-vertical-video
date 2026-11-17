import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: 'About Vibra Worldwide' },
    { name: 'description', content: 'Learn about the Vibra Worldwide short-video project.' },
    { property: 'og:title', content: 'About Vibra Worldwide' },
    { property: 'og:description', content: 'Learn about the Vibra Worldwide short-video project.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Vibra</h1>
    <div className="text-gray-300 leading-7 space-y-4">  
       <p>
Vibra is a worldwide vertical video platform built from Mombasa, Kenya.
</p>
<p>
Vibra was created to give young creators a place to share funny videos, love stories, couple goals, and everyday moments that make people smile. Anyone can watch videos for free, follow their favourite creators, like and comment.
</p>
<p>
Our mission is simple: make someone smile every day. We believe laughter brings people together, no matter where you come from.
</p>
<p>
If you are a creator in Kenya, Tanzania, Uganda or anywhere in the world, Vibra is your home. Post your videos, grow your fans, and be part of the Vibra family.
</p>
<p>
Contact us: vibra254@gmail.com - Mombasa, Kenya
</p>
    </div>
         <a href="/" className="mt-6 inline-block text-cyan-400">← Back to Vibra</a>
    </div>
  )
}
