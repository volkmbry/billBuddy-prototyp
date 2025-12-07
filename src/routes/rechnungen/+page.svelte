<script>
  import { onMount } from 'svelte';
  import { rechnungen } from '$lib/stores/rechnungen';

  // Beim Laden der Seite Rechnungen aus der Mongo-API holen
  onMount(() => {
    rechnungen.laden();
  });

  let titel = '';
  let betrag = '';
  let faelligAm = '';
  let kategorie = '';

  let suchbegriff = '';

  // Datei-Upload
  let datei = null;
  let dateiEingabe;

  let ausgewaehltesBild = null;

  function dateiGeaendert(ereignis) {
    const ziel = ereignis.currentTarget;
    datei = ziel.files && ziel.files[0] ? ziel.files[0] : null;
  }

  function dateiAlsDataUrlLesen(datei) {
    return new Promise((erfolg, fehler) => {
      const lesevorgang = new FileReader();
      lesevorgang.onload = () => erfolg(lesevorgang.result);
      lesevorgang.onerror = fehler;
      lesevorgang.readAsDataURL(datei);
    });
  }

  async function formularAbsenden() {
    if (!titel || !betrag || !faelligAm || !kategorie) {
      alert('Bitte fülle Titel, Betrag, Fälligkeitsdatum und Kategorie aus.');
      return;
    }

    let belegBild = undefined;

    if (datei) {
      try {
        belegBild = await dateiAlsDataUrlLesen(datei);
      } catch (fehler) {
        console.error('Fehler beim Lesen des Bildes:', fehler);
        alert('Das Bild konnte nicht gelesen werden.');
      }
    }

    try {
      await rechnungen.rechnungHinzufuegen({
        titel,
        betrag: parseFloat(betrag),
        faelligAm,
        kategorie,
        belegBild
      });

      // Formular zurücksetzen
      titel = '';
      betrag = '';
      faelligAm = '';
      kategorie = '';
      datei = null;
      if (dateiEingabe) dateiEingabe.value = '';
    } catch (fehler) {
      console.error(fehler);
      alert('Rechnung konnte nicht gespeichert werden.');
    }
  }

  function statusKlicken(id) {
    rechnungen.statusUmschalten(id);
  }

  function belegAnzeigen(rechnung) {
    if (!rechnung.belegBild) return;
    ausgewaehltesBild = rechnung.belegBild;
  }

  function belegSchliessen() {
    ausgewaehltesBild = null;
  }

  function passtZurSuche(rechnung, begriff) {
    if (!begriff) return true;
    begriff = begriff.toLowerCase();
    return (
      rechnung.titel.toLowerCase().includes(begriff) ||
      rechnung.kategorie.toLowerCase().includes(begriff) ||
      rechnung.status.toLowerCase().includes(begriff)
    );
  }

  $: rechnungsListe = $rechnungen;
  $: gefilterteRechnungen = rechnungsListe.filter((r) =>
    passtZurSuche(r, suchbegriff)
  );
  $: gefiltertSortierteRechnungen = [...gefilterteRechnungen].sort(
    (a, b) => new Date(a.faelligAm) - new Date(b.faelligAm)
  );
</script>

<h1 class="seite-titel">Rechnungen</h1>
<p class="seite-untertitel">
  Neue Rechnungen erfassen, Belege hochladen und den Status verwalten.
</p>

<section class="spalten-layout">
  <div class="formular-spalte karte">
    <h2 class="karten-titel">Neue Rechnung erfassen</h2>

    <form class="rechnungs-formular" on:submit|preventDefault={formularAbsenden}>
      <div class="feld">
        <label for="titel">Titel</label>
        <input
          id="titel"
          name="titel"
          placeholder="z.B. Miete Wohnung"
          bind:value={titel}
        />
      </div>

      <div class="feld-gruppe">
        <div class="feld">
          <label for="betrag">Betrag (CHF)</label>
          <input
            id="betrag"
            name="betrag"
            type="number"
            step="0.05"
            min="0"
            placeholder="0.00"
            bind:value={betrag}
          />
        </div>

        <div class="feld">
          <label for="faelligAm">Fällig am</label>
          <input
            id="faelligAm"
            name="faelligAm"
            type="date"
            bind:value={faelligAm}
          />
        </div>
      </div>

      <div class="feld">
        <label for="kategorie">Kategorie</label>
        <select
          id="kategorie"
          name="kategorie"
          bind:value={kategorie}
        >
          <option value="">Bitte wählen</option>
          <option>Wohnen</option>
          <option>Nebenkosten</option>
          <option>Abos</option>
          <option>Versicherung</option>
          <option>Sonstiges</option>
        </select>
      </div>

      <div class="feld">
        <label for="belegBild">Beleg (Bild)</label>
        <input
          id="belegBild"
          type="file"
          accept="image/*"
          bind:this={dateiEingabe}
          on:change={dateiGeaendert}
        />
        <p class="hinweis">
          Optional – das Bild bleibt lokal in deinem Browser gespeichert.
        </p>
      </div>

      <button type="submit" class="primaer-knopf">
        Rechnung speichern
      </button>
    </form>
  </div>

  <div class="liste-spalte">
    <div class="karte listen-karte">
      <div class="listen-kopf">
        <h2 class="karten-titel">Bestehende Rechnungen</h2>
        <input
          class="such-eingabe"
          placeholder="Nach Rechnung suchen"
          bind:value={suchbegriff}
        />
      </div>

      <div class="tabelle-huelle">
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Kategorie</th>
              <th>Fällig</th>
              <th>Betrag</th>
              <th>Status</th>
              <th>Beleg</th>
              <th>Bezahlt</th>
            </tr>
          </thead>
          <tbody>
            {#if gefiltertSortierteRechnungen.length === 0}
              <tr>
                <td colspan="7" class="leer">
                  Noch keine Rechnungen erfasst.
                </td>
              </tr>
            {:else}
              {#each gefiltertSortierteRechnungen as rechnung}
                <tr>
                  <td>{rechnung.titel}</td>
                  <td>{rechnung.kategorie}</td>
                  <td>{rechnung.faelligAm}</td>
                  <td>CHF {rechnung.betrag.toFixed(2)}</td>
                  <td>{rechnung.status}</td>
                  <td>
                    {#if rechnung.belegBild}
                      <button
                        type="button"
                        class="symbol-knopf"
                        on:click={() => belegAnzeigen(rechnung)}
                        title="Beleg anzeigen"
                      >
                        🧾
                      </button>
                    {:else}
                      <span class="abgeblendet">–</span>
                    {/if}
                  </td>
                  <td>
                    <button
                      type="button"
                      class="symbol-knopf"
                      on:click={() => statusKlicken(rechnung.id)}
                      title={rechnung.status === 'offen'
                        ? 'Als bezahlt markieren'
                        : 'Zahlung rückgängig machen'}
                    >
                      {rechnung.status === 'offen' ? '✅' : '↩️'}
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

{#if ausgewaehltesBild}
  <div class="modal-hintergrund" on:click={belegSchliessen}>
    <div class="modal" on:click|stopPropagation>
      <button class="schliessen-knopf" type="button" on:click={belegSchliessen}>
        ×
      </button>
      <img src={ausgewaehltesBild} alt="Beleg" />
    </div>
  </div>
{/if}

<style>
  .seite-titel {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .seite-untertitel {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .spalten-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  @media (min-width: 900px) {
    .spalten-layout {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    }
  }

  .karte {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  }

  .karten-titel {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.85rem;
    opacity: 0.85;
  }

  .rechnungs-formular {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    font-size: 0.9rem;
  }

  .feld {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  label {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  input,
  select {
    border-radius: 0.6rem;
    border: 1px solid var(--border-color);
    padding: 0.5rem 0.6rem;
    background-color: transparent;
    font-size: 0.9rem;
    color: inherit;
  }

  input[type='file'] {
    padding: 0.35rem 0;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  .feld-gruppe {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .feld-gruppe {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .primaer-knopf {
    margin-top: 0.25rem;
    padding: 0.6rem 0.9rem;
    border-radius: 0.7rem;
    border: none;
    background-color: var(--accent);
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .primaer-knopf:hover {
    filter: brightness(1.05);
  }

  .liste-spalte {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .listen-karte {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .listen-kopf {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .such-eingabe {
    min-width: 220px;
  }

  .tabelle-huelle {
    border-radius: 0.9rem;
    border: 1px solid var(--border-color);
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 0.7rem 0.9rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    font-weight: 500;
    opacity: 0.8;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .symbol-knopf {
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: transparent;
    padding: 0.25rem 0.45rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .symbol-knopf:hover {
    filter: brightness(1.2);
  }

  .abgeblendet {
    opacity: 0.5;
    font-size: 0.85rem;
  }

  .leer {
    text-align: center;
    opacity: 0.7;
    font-size: 0.9rem;
  }

  .hinweis {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .modal-hintergrund {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
  }

  .modal {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: var(--card-bg);
    border-radius: 1rem;
    padding: 0.75rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .modal img {
    max-width: 80vw;
    max-height: 80vh;
    display: block;
    border-radius: 0.75rem;
  }

  .schliessen-knopf {
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    border: none;
    background: transparent;
    font-size: 1.4rem;
    cursor: pointer;
  }
</style>