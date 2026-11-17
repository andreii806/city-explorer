# Laboratorul 4: notițe pentru rulare și pentru fișă

## Cum se pornește

Sunt necesare două terminale, ambele în directorul `app`:

```
npm install                              # o singură dată (instalează json-server, deja trecut în package.json)
npx json-server db.json --port 3001      # terminalul 1, rămâne deschis
npm run dev                              # terminalul 2
```

Verificare: http://localhost:3001/destinatii afișează cele 6 destinații, iar aplicația e la http://localhost:5173.

Pentru exercițiul 5 (2000 de destinații):

```
node genereaza.js                        # produce db-mare.json (e deja generat)
npx json-server db-mare.json --port 3002 # al treilea terminal
```

Apoi, în `src/api/destinatii.js`, se schimbă temporar `3001` în `3002`. Pentru punctul 4 al fișei (varianta
nepaginată) se pune tot acolo `PAGINARE = false`, iar pentru punctul 5 `PAGINARE = true`. La final se pun la loc
`3001` și `true`.

**Panoul de statistici (exercițiul 4) este demontat implicit** în `App.jsx`, pentru că trimite și el cereri
`GET /destinatii`, care ar strica numărătorile din fișă. Pentru punctul 3 al fișei se decomentează
`{/* <PanouStatistici /> */}`, apoi se comentează la loc.

**Punctul 1.3 din fișă (fără `[]`):** în `App.jsx` dependența este `[pagina]`, nu `[]`, deci se șterge `, [pagina]`
și se pune la loc imediat după cele 5 secunde.

**Punctul 2.2 din fișă:** linia de schimbat este în `FormularDestinatie.jsx`: `zile: Number(valori.zile),` devine
`zile: valori.zile,`. După măsurătoare, destinația adăugată se poate șterge cu butonul Șterge.

## Ce fișier rezolvă fiecare exercițiu

| Exercițiu | Fișiere |
|---|---|
| Secțiunea 2 (obligatorii din anexa A) | `src/main.jsx`, `src/utils/destinatii.js`, `src/components/Rezumat.jsx`, `db.json` |
| Exemplele din secțiunile 4–5 | `src/api/orase.js`, `src/components/ListaOrase.jsx`, `src/components/FormularBuget.jsx` (nemontate în App) |
| 1a: modulul de cereri | `src/api/destinatii.js` |
| 1b, 1c: încărcarea și PATCH | `src/App.jsx` |
| 2: formularul cu validare | `src/components/FormularDestinatie.jsx` (`valideaza`), `src/App.jsx` (`seTrimite`) |
| 3: căutarea și lista goală | `src/components/Cautare.jsx`, `src/App.jsx` |
| 3d: stilurile | finalul lui `src/App.css` |
| 4: depanarea | `src/components/PanouStatistici.jsx` (corectat), originalul cu greșeli e în `lab4-greseli/` |
| 5: optimizarea | `genereaza.js`, paginarea în `src/api/destinatii.js` și `src/App.jsx` |

Butonul de ștergere de la lucrarea 3 (cerința suplimentară) a rămas și trimite acum `DELETE` la server.

## Exercițiul 4: cele 7 greșeli (pentru fișă, punctul 3)

Pentru capturile cu simptomele, se copiază temporar `lab4-greseli/PanouStatistici.cu-greseli.jsx` peste
`src/components/PanouStatistici.jsx`, iar conținutul din `lab4-greseli/panou.cu-greseli.css` peste regulile `.panou`
de la finalul `App.css`. După capturi se pun la loc variantele corectate.

| # | Ce se vede | Cum afectează aplicația | Cauza și corectura |
|---|---|---|---|
| 1 | Numărul de destinații nu se potrivește cu totalul de zile și cu media (3 destinații, 22 zile, media 7,3). | Utilizatorul vede o medie umflată și ar planifica excursii mai lungi decât are de fapt. O valoare falsă care pare plauzibilă nu se observă. | `PanouStatistici.jsx`: `totalZile` se calcula din `destinatii` (toată lista). Corect: `filtrate.reduce(...)`. |
| 2 | Apar în același timp mesajul „Nicio destinație…” și lista de statistici. | Mesajele se contrazic, iar utilizatorul nu știe pe care să-l creadă. | `{filtrate.length && ...}`: pentru 3 elemente, `3 && <p>` afișează paragraful (iar pentru 0 ar afișa cifra 0). Corect: `{filtrate.length === 0 && ...}`. |
| 3 | La pragul 3 lipsește Porto (3 zile). | Destinațiile cu exact „pragul” de zile sunt excluse, deși eticheta spune „cel puțin”, deci toate cifrele sunt greșite. | `d.zile > Number(prag)`. Corect: `>=`. |
| 4 | Când se scrie în câmpul pragului, valoarea dispare și statisticile nu se mai afișează. | Panoul devine inutilizabil după prima tastare. | `onChange={setPrag}` pune în stare obiectul eveniment, nu textul. Corect: `onChange={(e) => setPrag(e.target.value)}`. |
| 5 | Cu serverul oprit, panoul rămâne la nesfârșit pe „Se încarcă statisticile...”. | Utilizatorul așteaptă degeaba, fără să afle că serverul e căzut. | `setIncarcare(false)` era doar în `try`. Corect: mutat în `finally`. |
| 6 | Colțurile casetei sunt drepte. | Doar estetic: panoul nu arată ca restul aplicației. | `App.css`, `.panou { border-radius: 10; }`: lipsește unitatea, deci declarația e invalidă (apare tăiată în Elements). Corect: `10px`. |
| 7 | Titlul „Statistici” e lipit de câmpul de dedesubt. | Doar estetic, dar îngreunează citirea. | A doua regulă `.panou h2 { margin: 0; }`, scrisă mai jos, anulează `margin-bottom: 0.6rem` (apare tăiată în Elements). Corect: regula duplicată se șterge. |

După corecturi, la pragul 3: **4 destinații, 18 zile, media 4,5**. La pragul 99 apare doar mesajul pentru lista goală.

## Valori de reper pentru măsurători

Acestea sunt doar ca să-ți verifici măsurătorile. Fișa cere ce măsori tu, cu capturile tale din fila Network.

- **1d.** La o reîncărcare, în modul dev cu `<StrictMode>`, fiecare efect rulează de două ori: 2 cereri `GET /destinatii`
  din App și încă 2 din `PanouStatistici`, cât timp e montat. **Fără lista de dependențe**, efectul rulează după fiecare
  desenare, iar `setDestinatii` provoacă o nouă desenare, deci cererile se repetă la nesfârșit.
  **La tastarea în căutare** nu pleacă nicio cerere, pentru că filtrarea se face în browser, pe starea existentă.
- **2d.** Corpul cererii POST are `oras, tara, zile, vizitat`, iar răspunsul are în plus `id`, generat de server.
  Cu `Number(...)`, `zile` este număr (`3`); fără, e text (`"3"`). Status: GET → 200, POST → 201, PATCH → 200.
- **5b/5d.** Răspunsul nepaginat, cu 2000 de destinații, are aproximativ 225 kB, iar cel paginat, cu 20 de destinații,
  aproximativ 2,5 kB, adică de circa 90 de ori mai mic. Pe pagină sunt 2000 de carduri, față de 20.
