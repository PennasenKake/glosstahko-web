const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer>
      <p>© {year} GlossTahko</p>
    </footer>
  )
}