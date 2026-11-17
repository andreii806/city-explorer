// Lucrarea 4, exercițiul 1a (+ paginarea de la exercițiul 5c).
// Pentru exercițiul 5 (cele 2000 de destinații) se schimbă temporar portul în 3002.
const API_URL = 'http://localhost:3001'

// Exercițiul 5 / fișa: pentru măsurătorile pe varianta NEPAGINATĂ (fișa, punctul 4)
// se pune temporar false; pentru varianta paginată (fișa, punctul 5) rămâne true.
const PAGINARE = true
const PE_PAGINA = 20

async function verifica(response) {
  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }
  return response.json()
}

// GET /destinatii?_page=N&_per_page=20
// Întoarce obiectul primit de la server: { first, prev, next, last, pages, items, data }
export async function getDestinatii(pagina) {
  if (!PAGINARE) {
    // varianta nepaginată: GET /destinatii aduce toată lista
    const response = await fetch(`${API_URL}/destinatii`)
    const lista = await verifica(response)
    return { data: lista, pages: 1 }
  }

  const response = await fetch(
    `${API_URL}/destinatii?_page=${pagina}&_per_page=${PE_PAGINA}`,
  )
  return verifica(response)
}

// POST /destinatii, întoarce obiectul salvat, cu id-ul generat de server
export async function postDestinatie(d) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
  })
  return verifica(response)
}

// PATCH /destinatii/:id, schimbă doar câmpul vizitat
export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vizitat }),
  })
  return verifica(response)
}

// DELETE /destinatii/:id, pentru butonul de ștergere (cerința suplimentară din lucrarea 3)
export async function deleteDestinatie(id) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'DELETE',
  })
  return verifica(response)
}
