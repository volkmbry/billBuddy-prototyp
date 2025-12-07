<script>
  import NavBar from '$lib/components/NavBar.svelte';

  let darkMode = false;

  function handleToggleTheme() {
    darkMode = !darkMode;
  }
</script>

<div class="app" class:dark={darkMode}>
  <NavBar {darkMode} onToggleTheme={handleToggleTheme} />

  <main class="page-container">
    <slot />
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

    /* Theme-Variablen (Light) */
    --bg: #f3f4f6;
    --fg: #111827;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --nav-bg: #ffffffee;
    --accent: #2563eb;
  }

  .app.dark {
    /* Theme-Variablen (Dark) */
    --bg: #020617;
    --fg: #e5e7eb;
    --card-bg: #020617;
    --border-color: #1f2937;
    --nav-bg: #020617ee;
    --accent: #38bdf8;
  }

  .app {
    background-color: var(--bg);
    color: var(--fg);
  }

  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1rem 2.5rem;
  }

  @media (min-width: 768px) {
    .page-container {
      padding-inline: 0;
      padding-top: 1.75rem;
    }
  }
</style>