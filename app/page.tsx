import Hero from '@/components/Hero'
import ProtocolFormWrapper from '@/components/ProtocolFormWrapper'

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="py-24 px-4">
        <ProtocolFormWrapper />
      </section>
    </main>
  )
}
