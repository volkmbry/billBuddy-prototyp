<script>
  import { onMount } from 'svelte';
  import { rechnungen } from '$lib/stores/rechnungen';

  onMount(() => {
    rechnungen.laden();
  });

  let ausgewaehltesBild = null;

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

  function berechneKennzahlen(liste) {
    const heute = new Date();
    const heuteStart = new Date(
      heute.getFullYear(),
      heute.getMonth(),
      heute.getDate()
    );
    const wochenEnde = new Date(heuteStart);
    wochenEnde.setDate(wochenEnde.getDate() + 7);

    let ueberfaelligeAnzahl = 0;
    let ueberfaelligerBetrag = 0;
    let dieseWocheAnzahl = 0;
    let dieseWocheBetrag = 0;

    const aktuellerMonat = heuteStart.getMonth();
    const aktuellesJahr = heuteStart.getFullYear();
    const vorherigerMonatsTag = new Date(aktuellesJahr, aktuellerMonat - 1, 1);
    const vorherigerMonat = vorherigerMonatsTag.getMonth();
    const vorherigesJahr = vorherigerMonatsTag.getFullYear();

    let monatsSumme = 0;
    let vorherigeMonatsSumme = 0;

    for (const rechnung of liste) {
      if (!rechnung.faelligAm) continue;
      const datum = new Date(rechnung.faelligAm);

      if (datum < heuteStart && rechnung.status !== 'bezahlt') {
        ueberfaelligeAnzahl += 1;
        ueberfaelligerBetrag += rechnung.betrag;
      }

      if (
        datum >= heuteStart &&
        datum <= wochenEnde &&
        rechnung.status !== 'bezahlt'
      ) {
        dieseWocheAnzahl += 1;
        dieseWocheBetrag += rechnung.betrag;
      }

      if (
        datum.getFullYear() === aktuellesJahr &&
        datum.getMonth() === aktuellerMonat
      ) {
        monatsSumme += rechnung.betrag;
      } else if (
        datum.getFullYear() === vorherigesJahr &&
        datum.getMonth() === vorherigerMonat
      ) {
        vorherigeMonatsSumme += rechnung.betrag;
      }
    }

    let verAenderungZumVormonatProzent = 0;
    if (vorherigeMonatsSumme > 0) {
      verAenderungZumVormonatProzent =
        ((monatsSumme - vorherigeMonatsSumme) / vorherigeMonatsSumme) * 100;
    }

    const beispielMonatsbudget = 3000;
    const restbudget = Math.max(0, beispielMonatsbudget - monatsSumme);

    return {
      ueberfaelligeAnzahl,
      ueberfaelligerBetrag,
      dieseWocheAnzahl,
      dieseWocheBetrag,
      monatsSumme,
      verAenderungZumVormonatProzent,
      restbudget
    };
  }

  $: rechnungsListe = $rechnungen;
  $: kennzahlen = berechneKennzahlen(rechnungsListe);
  $: sortierteRechnungen = [...rechnungsListe].sort(
    (a, b) => new Date(a.faelligAm) - new Date(b.faelligAm)
  );
</script>

<h1 class="seite-titel">Finanzübersicht</h1>
<p class="seite-untertitel">
  Hier siehst du deine wichtigsten Kennzahlen und Rechnungen auf einen Blick.
</p>

<section class="kennzahlen-gitter">
  <article class="karte">
    <h2 class="karten-titel">Überfällige Rechnungen</h2>
    <p class="karten-haupt">
      <span class="karten-zahl">{kennzahlen.ueberfaelligeAnzahl}</span>
      <span class="karten-beschriftung">Rechnungen</span>
    </p>
    <p class="karten-betrag">
      Total: CHF {kennzahlen.ueberfaelligerBetrag.toFixed(2)}
    </p>
  </article>

  <article class="karte">
    <h2 class="karten-titel">Diese Woche fällig</h2>
    <p class="karten-haupt">
      <span class="karten-zahl">{kennzahlen.dieseWocheAnzahl}</span>
      <span class="karten-beschriftung">Rechnungen</span>
    </p>
    <p class="karten-betrag">
      Total: CHF {kennzahlen.dieseWocheBetrag.toFixed(2)}
    </p>
  </article>

  <article class="karte">
    <h2 class="karten-titel">Monatssumme</h2>
    <p class="karten-haupt">
      <span class="karten-zahl">
        CHF {kennzahlen.monatsSumme.toFixed(2)}
      </span>
    </p>
    <p
      class="karten-aenderung"
      class:negativ={kennzahlen.verAenderungZumVormonatProzent > 0}
      class:positiv={kennzahlen.verAenderungZumVormonatProzent <= 0}
    >
      {kennzahlen.verAenderungZumVormonatProzent > 0 ? '▲' : '▼'}
      {Math.abs(kennzahlen.verAenderungZumVormonatProzent).toFixed(1)} % vs.
      Vormonat
    </p>
  </article>

  <article class="karte">
    <h2 class="karten-titel">Restbudget</h2>
    <p class="karten-haupt">
      <span class="karten-zahl">
        CHF {kennzahlen.restbudget.toFixed(2)}
      </span>
    </p>
    <p class="karten-beschriftung">
      Beispielbudget von CHF 3000 / Monat
    </p>
  </article>
</section>

<section class="diagramm-reihe">
  <article class="karte diagramm-karte">
    <h2 class="karten-titel">Ausgaben nach Kategorie</h2>
    <div class="diagramm-platzhalter">
      <span>Donut-Diagramm (Platzhalter)</span>
    </div>
  </article>

  <article class="karte diagramm-karte">
    <h2 class="karten-titel">Ausgaben der letzten 6 Monate</h2>
    <div class="diagramm-platzhalter">
      <span>Balken-Diagramm (Platzhalter)</span>
    </div>
  </article>
</section>

<section class="tabelle-bereich">
  <header class="tabelle-kopf">
    <h2 class="karten-titel">Rechnungen</h2>
    <a href="/rechnungen" class="link">Rechnung erfassen</a>
  </header>

  <div class="tabelle-huelle">
    <table>
      <thead>
        <tr>
          <th>Titel</th>
          <th>Kategorie</th>
          <th>Fällig am</th>
          <th>Betrag</th>
          <th>Status</th>
          <th>Beleg</th>
          <th>Bezahlt</th>
        </tr>
      </thead>
      <tbody>
        {#if sortierteRechnungen.length === 0}
          <tr>
            <td colspan="7" class="leer">
              Noch keine Rechnungen erfasst.
            </td>
          </tr>
        {:else}
          {#each sortierteRechnungen as rechnung}
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

  .kennzahlen-gitter {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  .karte {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  }

  .karten-titel {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.35rem;
    opacity: 0.85;
  }

  .karten-haupt {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    margin-bottom: 0.1rem;
  }

  .karten-zahl {
    font-size: 1.4rem;
    font-weight: 600;
  }

  .karten-beschriftung {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .karten-betrag {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.15rem;
  }

  .karten-aenderung {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  .karten-aenderung.positiv {
    color: #16a34a;
  }

  .karten-aenderung.negativ {
    color: #dc2626;
  }

  .diagramm-reihe {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 900px) {
    .diagramm-reihe {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    }
  }

  .diagramm-karte {
    display: flex;
    flex-direction: column;
  }

  .diagramm-platzhalter {
    flex: 1;
    margin-top: 0.75rem;
    border-radius: 0.75rem;
    border: 1px dashed var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    opacity: 0.7;
    min-height: 220px;
  }

  .tabelle-bereich {
    margin-top: 0.5rem;
  }

  .tabelle-kopf {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .tabelle-huelle {
    background-color: var(--card-bg);
    border-radius: 1rem;
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

  .link {
    font-size: 0.85rem;
    text-decoration: none;
    color: var(--accent);
  }

  .link:hover {
    text-decoration: underline;
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