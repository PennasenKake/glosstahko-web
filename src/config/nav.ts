/**
 * Sivun osiot ja niiden tabit yhdessä paikassa.
 * Header (tabit) ja Footer (pikalinkit) lukevat tästä, ja
 * useActiveSection käyttää id-listaa aktiivisen osion laskemiseen.
 *
 * Järjestyksen pitää vastaa osioiden järjestystä App.tsx:ssä.
 * `id` täsmää osion id-attribuuttiin (esim. <section id="palvelut">).
 */
export const navItems = [
  { id: 'etusivu', label: 'Etusivu' },
  { id: 'minusta', label: 'Minusta' },
  { id: 'palvelut', label: 'Palvelut' },
  { id: 'tahko', label: 'Tahko' },
  { id: 'ukk', label: 'UKK' },
  { id: 'yhteys', label: 'Yhteys' },
] as const

/** Pelkät id:t listana, esim. ['etusivu', 'minusta', ...] */
export const sectionIds: string[] = navItems.map((item) => item.id)
