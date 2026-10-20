// Exercițiul 1.b
// 1. Obținerea numelor orașelor
export const getOrase = (list) => list.map((d) => d.oras)

// 2. Destinațiile nevizitate
export const getNevizitate = (list) => list.filter((d) => !d.vizitat)

// 3. Suma zilelor
export const totalZile = (list) => list.reduce((total, d) => total + d.zile, 0)

// 4. Formatarea unei destinații
export const formatDestinatie = ({ oras, tara, zile, vizitat }) =>
  `${vizitat ? '[x]' : '[ ]'} ${oras}, ${tara} (${zile} zile)`

// 5. Numărul de destinații pe fiecare țară
export const numarPeTara = (list) =>
  list.reduce((acc, { tara }) => ({ ...acc, [tara]: (acc[tara] ?? 0) + 1 }), {})

// 6. Ordonarea descrescătoare după zile (pe o copie)
export const sortDupaZile = (list) => [...list].sort((a, b) => b.zile - a.zile)

// Exercițiul 2 (Modificare imutabilă)
// 1. Inversarea stării vizitat pentru un ID
export const marcheazaVizitat = (list, id) =>
  list.map((d) => (d.id === id ? { ...d, vizitat: !d.vizitat } : d))

// 2. Adăugarea unei destinații noi
export const adaugaDestinatie = (list, d) => [...list, d]

// 3. Ștergerea unei destinații
export const stergeDestinatie = (list, id) => list.filter((d) => d.id !== id)