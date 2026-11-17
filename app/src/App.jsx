import { useEffect, useState } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import {
  getDestinatii,
  postDestinatie,
  patchVizitat,
  deleteDestinatie,
} from './api/destinatii.js'

import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Cautare from './components/Cautare.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
// eslint-disable-next-line no-unused-vars
import PanouStatistici from './components/PanouStatistici.jsx'
import './App.css'

export default function App() {
  // Exercițiul 1b: datele vin de la server
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  // Exercițiul 2c: butonul dezactivat cât timp cererea POST este în curs
  const [seTrimite, setSeTrimite] = useState(false)
  const [eroareActiune, setEroareActiune] = useState(null)

  // Exercițiul 3: textul căutat
  const [cautare, setCautare] = useState('')

  // Exercițiul 5c: paginarea
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  useEffect(() => {
    async function incarca() {
      try {
        const raspuns = await getDestinatii(pagina)
        setDestinatii(raspuns.data)
        setTotalPagini(raspuns.pages)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
}, [pagina])

  // Exercițiul 5c: la schimbarea paginii se arată din nou mesajul de încărcare.
  // (Nu se pune setIncarcare(true) în efect: fără lista de dependențe, de la fișa
  // punctul 1.3, fiecare cerere ar porni două cereri noi, nu una.)
  function schimbaPagina(nouaPagina) {
    setIncarcare(true)
    setEroare(null)
    setPagina(nouaPagina)
  }

  // Exercițiul 1c: modificarea trece întâi prin server
  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)
    try {
      setEroareActiune(null)
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (error) {
      setEroareActiune(error.message)
    }
  }

  // Exercițiul 2: în stare intră obiectul întors de server, cu id-ul lui
  async function handleAdd(destinatie) {
    setSeTrimite(true)
    try {
      setEroareActiune(null)
      const salvata = await postDestinatie(destinatie)
      setDestinatii((curent) => [...curent, salvata])
      return salvata
    } catch (error) {
      setEroareActiune(error.message)
      return null
    } finally {
      setSeTrimite(false)
    }
  }

  async function handleDelete(id) {
    try {
      setEroareActiune(null)
      await deleteDestinatie(id)
      setDestinatii((curent) => curent.filter((d) => d.id !== id))
    } catch (error) {
      setEroareActiune(error.message)
    }
  }

  // Rezumatul se calculează din starea completă, nu din lista filtrată
  const nevizitate = getNevizitate(destinatii)

  // Exercițiul 3b: filtrarea după oraș sau țară
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) || d.tara.toLowerCase().includes(text),
  )

  // Exercițiul 3c: două motive diferite pentru o listă goală
  let continut
  if (destinatii.length === 0) {
    continut = (
      <p className="gol">
        Nu există încă nicio destinație. Adaugă prima destinație din formularul de mai sus.
      </p>
    )
  } else if (afisate.length === 0) {
    continut = <p className="gol">Niciun rezultat pentru «{cautare.trim()}».</p>
  } else {
    continut = (
      <ListaDestinatii
        destinatii={afisate}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <main>
      <h1>City Explorer</h1>

      {/* Exercițiul 4 (fișa, punctul 3): se decomentează linia de mai jos doar cât timp
          se lucrează la panou. Montat, panoul trimite și el cereri GET /destinatii,
          care s-ar număra greșit la măsurătorile din fișă, punctele 1, 2, 4 și 5. */}
      <PanouStatistici />

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {!incarcare && eroare && (
        <p className="stare eroare">Nu am putut încărca destinațiile: {eroare}</p>
      )}

      {!incarcare && !eroare && (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />
          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          {eroareActiune && <p className="stare eroare">{eroareActiune}</p>}
          <Cautare valoare={cautare} onChange={setCautare} />
          {continut}

          {/* Exercițiul 5c: butoanele de paginare */}
          {totalPagini > 1 && (
            <div className="paginare">
              <button
                type="button"
                disabled={pagina === 1}
                onClick={() => schimbaPagina(pagina - 1)}
              >
                Înapoi
              </button>
              <span>
                pagina {pagina} din {totalPagini}
              </span>
              <button
                type="button"
                disabled={pagina === totalPagini}
                onClick={() => schimbaPagina(pagina + 1)}
              >
                Înainte
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
