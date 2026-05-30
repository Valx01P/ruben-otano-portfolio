import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Stack from '@/components/Stack';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ParticleField from '@/components/ParticleField';

export default function Home() {
  return (
    <>
      <ParticleField />
      <Nav />
      <main className="noise relative z-10">
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer className="relative z-10" />
    </>
  );
}
