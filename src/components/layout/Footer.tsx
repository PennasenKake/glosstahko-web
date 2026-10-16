// Ulkopuolella: lasketaan kerran, ei joka renderöinnillä
const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {year} GlossTahko</p>
    </footer>
  )
}
