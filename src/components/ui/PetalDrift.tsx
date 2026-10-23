/**
 * Koristeelliset kultaiset terälehdet otsikon reunoille.
 * Ei peitä tekstiä: pointer-events none, aria-hidden, z-index alle otsikon.
 */
export default function PetalDrift() {
  return (
    <div className="petals" aria-hidden="true">
      <span className="petal petal--1" />
      <span className="petal petal--2" />
      <span className="petal petal--3" />
      <span className="petal petal--4" />
      <span className="petal petal--5" />
      <span className="petal petal--6" />
    </div>
  )
}