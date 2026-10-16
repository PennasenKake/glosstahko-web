import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import Tahko from './components/sections/Tahko'
import About from './components/sections/About'
import Faq from './components/sections/Faq'
import Contact from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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