import { useEffect, useState } from 'react'

/**
 * Kertoo, onko header vielä hero-osion päällä (true) vai sen jo ohitettu (false).
 * Heron päällä header on läpinäkyvä, ohituksen jälkeen utuinen vaalea palkki.
 *
 * `bottom` on elementin alareunan etäisyys ruudun yläreunasta. Kun se on
 * pienempi kuin headerin korkeus, hero on kokonaan headerin yläpuolella.
 */
export function useOverHero(heroId: string): boolean {
  // Sivu avautuu yleensä ylhäältä, joten aloitetaan arvolla true
  const [overHero, setOverHero] = useState(true)

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById(heroId)
      const header = document.querySelector('.site-header')
      if (!hero || !header) return
      setOverHero(hero.getBoundingClientRect().bottom > header.getBoundingClientRect().height)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [heroId])

  return overHero
}
