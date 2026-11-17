// Lucrarea 4, exercițiul 4: varianta CORECTATĂ.
// Fiecare corectură este marcată cu numărul simptomului din tabelul exercițiului.
// Varianta originală, cu greșeli, este în lab4-greseli/PanouStatistici.cu-greseli.jsx.
import { useEffect, useState } from 'react'

export default function PanouStatistici() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [prag, setPrag] = useState('3')

  useEffect(() => {
    async function incarca() {
      try {
        const response = await fetch('http://localhost:3001/destinatii')

        if (!response.ok) {
          throw new Error(`Serverul a răspuns cu ${response.status}`)
        }

        const date = await response.json()
        setDestinatii(date)
      } catch (err) {
        setEroare(err.message)
      } finally {
        // #5: oprirea indicatorului se face în finally, nu doar în try
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  if (incarcare) {
    return <p className="stare">Se încarcă statisticile...</p>
  }

  if (eroare) {
    return <p className="stare eroare">Statistici indisponibile: {eroare}</p>
  }

  // #3: „cel puțin” înseamnă >=, nu >
  const filtrate = destinatii.filter((d) => d.zile >= Number(prag))
  // #1: totalul se calculează din lista filtrată, nu din toată lista
  const totalZile = filtrate.reduce((suma, d) => suma + d.zile, 0)
  const medie = filtrate.length === 0 ? 0 : totalZile / filtrate.length

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <label>
        Cel puțin{' '}
        <input
          type="number"
          value={prag}
          // #4: onChange primește evenimentul, nu valoarea
          onChange={(e) => setPrag(e.target.value)}
        />{' '}
        zile
      </label>

      {/* #2: condiție booleană, mesajul apare doar când lista e goală */}
      {filtrate.length === 0 && (
        <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
      )}

      {filtrate.length > 0 && (
        <ul>
          <li>Destinații: {filtrate.length}</li>
          <li>Total zile: {totalZile}</li>
          <li>Media: {medie.toFixed(1)} zile</li>
        </ul>
      )}
    </section>
  )
}
