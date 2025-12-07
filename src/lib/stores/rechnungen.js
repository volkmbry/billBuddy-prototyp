import { writable } from 'svelte/store';

function erstelleRechnungsStore() {
  const { subscribe, set, update } = writable([]);
  let istGeladen = false;

  async function laden() {
    if (istGeladen) return;

    try {
      const antwort = await fetch('/api/rechnungen');
      if (!antwort.ok) {
        console.error(
          'Fehler beim Laden der Rechnungen:',
          await antwort.text()
        );
        return;
      }

      const daten = await antwort.json();
      set(daten);
      istGeladen = true;
    } catch (fehler) {
      console.error('Laden der Rechnungen fehlgeschlagen:', fehler);
    }
  }

  async function rechnungHinzufuegen(felddaten) {
    const antwort = await fetch('/api/rechnungen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(felddaten)
    });

    if (!antwort.ok) {
      console.error('Antwort vom Server:', await antwort.text());
      throw new Error('Rechnung konnte nicht gespeichert werden');
    }

    const neueRechnung = await antwort.json();
    update((liste) => [neueRechnung, ...liste]);
  }

  async function statusUmschalten(id) {
    const antwort = await fetch(`/api/rechnungen/${id}/status`, {
      method: 'PATCH'
    });

    if (!antwort.ok) {
      console.error('Antwort vom Server:', await antwort.text());
      throw new Error('Status konnte nicht geändert werden');
    }

    const aktualisierteRechnung = await antwort.json();

    update((liste) =>
      liste.map((r) =>
        r.id === aktualisierteRechnung.id ? aktualisierteRechnung : r
      )
    );
  }

  return {
    subscribe,
    laden,
    rechnungHinzufuegen,
    statusUmschalten
  };
}

export const rechnungen = erstelleRechnungsStore();