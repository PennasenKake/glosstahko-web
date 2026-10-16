import { useEffect, useState } from 'react'

/**
 * Palauttaa sen osion id:n, joka on parhaillaan ruudulla "lukulinjalla".
 * Header käyttää tätä korostamaan oikean tabin vieritettäessä.
 *
 * Miten: vieritettäessä käydään osiot läpi järjestyksessä, ja aktiiviseksi
 * tulee viimeinen osio, jonka yläreuna on lukulinjan (35 % ruudun korkeudesta)
 * yläpuolella. Sivun aivan alalaidassa viimeinen osio aktivoidaan aina,
 * koska lyhyt viimeinen osio ei muuten ehtisi koskaan lukulinjalle.
 *
 * Hook = funktio, jonka nimi alkaa "use" ja joka voi käyttää Reactin
 * tilaa (useState) ja sivuvaikutuksia (useEffect). Näin logiikka
 * on omassa tiedostossaan eikä sotke komponenttia.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1]

      // Sama arvo ei aiheuta uutta renderöintiä, joten tämä on kevyt
      setActive(current)
    }

    update() // heti kun sivu latautuu (esim. ankkurilinkistä)
    // passive: true kertoo selaimelle, ettei kuuntelija estä vieritystä (sujuvampi)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    // Siivous: kuuntelijat poistetaan, kun komponentti poistuu
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return active
}
