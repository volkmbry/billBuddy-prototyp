# 💸 billBuddy – Finanzplaner Prototyp

billBuddy ist ein Prototyp für einen einfachen **Finanzplaner**, mit dem du Rechnungen erfassen, Belege hochladen und einen Überblick über deine Finanzen bekommst.

Die App ist mit **SvelteKit**, **MongoDB** und **Netlify** umgesetzt.

---

## 🚀 Features

### Seiten

- **Startseite (`/`)**
  - Kennzahlen:
    - Überfällige Rechnungen (Anzahl & Betrag)
    - Diese Woche fällig (Anzahl & Betrag)
    - Monatssumme (inkl. Veränderung in % zum Vormonat)
    - Restbudget (einfaches Beispielbudget)
  - Platzhalter für:
    - Donut-Diagramm „Ausgaben nach Kategorie“
    - Balkendiagramm „Ausgaben der letzten 6 Monate“
  - Tabelle mit allen Rechnungen:
    - Titel, Kategorie, Fälligkeitsdatum, Betrag, Status
    - Spalte **Beleg** (Icon zum Öffnen des hochgeladenen Bildes)
    - Spalte **Bezahlt** (Icon zum Umschalten `offen` ↔ `bezahlt`)

- **Rechnungen (`/rechnungen`)**
  - Formular zum Erfassen neuer Rechnungen:
    - Titel
    - Betrag
    - Fällig am
    - Kategorie
    - optionales Bild als **Beleg**
  - Liste aller Rechnungen mit:
    - Suchfeld (Titel, Kategorie, Status)
    - Beleg-Icon zum Bild anzeigen
    - Bezahlt/Unbezahlt-Icon zum Status wechseln

- **Einstellungen (`/einstellungen`)**
  - Dummy-Ansicht für Budgets pro Kategorie
  - Gesamtbudget-Anzeige (Beispielwerte)
  - Formular zum Hinzufügen neuer Kategorien (noch ohne echte Logik)

### Sonstiges

- **Nachtmodus** (Dark Mode) per Button in der Navigation
- Speicherung der Rechnungen in **MongoDB** (inkl. Bild als Data-URL)
- API-Routen in SvelteKit:
  - `GET /api/rechnungen` – alle Rechnungen laden
  - `POST /api/rechnungen` – neue Rechnung speichern
  - `PATCH /api/rechnungen/[id]/status` – Status `offen`/`bezahlt` umschalten

---

## 🧱 Tech-Stack

- [SvelteKit](https://kit.svelte.dev/)
- [Vite](https://vitejs.dev/)
- [MongoDB](https://www.mongodb.com/) (z.B. über MongoDB Atlas)
- [Netlify](https://www.netlify.com/) (Deployment)
- Styling mit einfachem CSS (keine UI-Library)

---

## ⚙️ Projektstruktur (Auszug)

```txt
src/
  lib/
    components/
      NavBar.svelte
    stores/
      rechnungen.js          # Svelte-Store für alle Rechnungen (spricht mit API)
    server/
      mongo.ts               # MongoDB-Verbindung (holeDatenbank)
  routes/
    +layout.svelte           # Layout mit Navigation & Dark Mode
    +page.svelte             # Startseite (Dashboard)
    rechnungen/
      +page.svelte           # Rechnungsverwaltung
    einstellungen/
      +page.svelte           # Budget-Einstellungen (Prototype)
    api/
      rechnungen/
        +server.ts           # GET/POST für Rechnungen
        [id]/
          status/
            +server.ts       # PATCH für Statuswechsel