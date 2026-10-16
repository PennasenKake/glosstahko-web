export type Service = {
  id: string
  name: string
  minutes: number // kesto minuutteina (alaraja)
  minutesMax?: number // jos kesto on haarukka, yläraja
  price: number // euroa, sisältää alv:n
  priceFrom?: boolean // näytetään "alk."
  addon?: boolean // lisäpalvelu, näytetään "+"
  note?: string
}

export type ServiceCategory = {
  id: string
  title: string
  description?: string
  services: Service[]
}