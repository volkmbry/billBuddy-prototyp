<script>
  const budgets = [
    { id: 1, category: 'Wohnen', monthlyBudget: 2000, spent: 1840 },
    { id: 2, category: 'Lebensmittel', monthlyBudget: 600, spent: 420 },
    { id: 3, category: 'Transport', monthlyBudget: 200, spent: 150 },
    { id: 4, category: 'Freizeit', monthlyBudget: 300, spent: 120 }
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyBudget, 0);
</script>

<h1 class="page-title">Einstellungen</h1>
<p class="page-subtitle">
  Definiere deine Budgets, Kategorien und behalte dein Gesamtbudget im Blick.
</p>

<section class="settings-grid">
  <article class="card">
    <h2 class="card-title">Gesamtbudget pro Monat</h2>
    <p class="budget-main">CHF {totalBudget.toFixed(2)}</p>
    <p class="budget-sub">Summe aller Kategorien (Dummy-Werte)</p>
  </article>

  <article class="card">
    <h2 class="card-title">Budgets nach Kategorie</h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Kategorie</th>
            <th>Budget (CHF)</th>
            <th>Ausgegeben (CHF)</th>
          </tr>
        </thead>
        <tbody>
          {#each budgets as b}
            <tr>
              <td>{b.category}</td>
              <td>CHF {b.monthlyBudget.toFixed(2)}</td>
              <td>CHF {b.spent.toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </article>

  <article class="card">
    <h2 class="card-title">Neue Kategorie hinzufügen</h2>

    <form class="category-form" on:submit|preventDefault>
      <div class="field">
        <label for="catName">Name der Kategorie</label>
        <input id="catName" placeholder="z.B. Kleider" />
      </div>

      <div class="field">
        <label for="catBudget">Monatsbudget (CHF)</label>
        <input
          id="catBudget"
          type="number"
          step="0.05"
          min="0"
          placeholder="0.00"
        />
      </div>

      <button type="submit" class="primary-btn">
        Kategorie speichern (Logik folgt)
      </button>

      <p class="hint">
        Das ist aktuell nur ein UI-Placeholder – die eigentliche Speicherlogik
        bauen wir später.
      </p>
    </form>
  </article>
</section>

<style>
  .page-title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  @media (min-width: 900px) {
    .settings-grid {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    }
  }

  @media (min-width: 1200px) {
    .settings-grid {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    }
  }

  .card {
    background-color: var(--card-bg);
    border-radius: 1rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
  }

  .card-title {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    opacity: 0.85;
  }

  .budget-main {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .budget-sub {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .table-wrapper {
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

  .category-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    font-size: 0.9rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  label {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  input {
    border-radius: 0.6rem;
    border: 1px solid var(--border-color);
    padding: 0.5rem 0.6rem;
    background-color: transparent;
    font-size: 0.9rem;
    color: inherit;
  }

  input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent);
  }

  .primary-btn {
    margin-top: 0.25rem;
    padding: 0.6rem 0.9rem;
    border-radius: 0.7rem;
    border: none;
    background-color: var(--accent);
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .primary-btn:hover {
    filter: brightness(1.05);
  }

  .hint {
    font-size: 0.8rem;
    opacity: 0.7;
  }
</style>