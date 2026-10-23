import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Intro from './components/sections/Intro'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Tahko from './components/sections/Tahko'
import Faq from './components/sections/Faq'
import Contact from './components/sections/Contact'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

export default function App() {
  // Paljastusanimaatio: elementit, joilla on data-reveal, liukuvat näkyviin vieritettäessä
  useRevealOnScroll()

  return (
    <>
      {/* Ensimmäinen Tab-painallus paljastaa tämän: ohittaa navigaation */}
      <a className="skip-link" href="#sisalto">
        Siirry sisältöön
      </a>

      <Header />
      <main id="sisalto">
        <Hero />
        <Intro />
        <About />
        <Services />
        <Tahko />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
