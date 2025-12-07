<script>
  import { page } from '$app/stores';

  export let darkMode = false;
  export let onToggleTheme = () => {};
</script>

<nav class="navbar">
  <div class="navbar-left">
    <a href="/" class="logo">billBuddy</a>

    <a
      href="/"
      class:selected={$page.url.pathname === '/'}
    >
      Start
    </a>

    <a
      href="/rechnungen"
      class:selected={$page.url.pathname.startsWith('/rechnungen')}
    >
      Rechnungen
    </a>

    <a
      href="/einstellungen"
      class:selected={$page.url.pathname.startsWith('/einstellungen')}
    >
      Einstellungen
    </a>
  </div>

  <div class="navbar-right">
    <button
      type="button"
      class="theme-toggle"
      on:click={onToggleTheme}
    >
      {#if darkMode}
        ☀️ Tagmodus
      {:else}
        🌙 Nachtmodus
      {/if}
    </button>
  </div>
</nav>

<style>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--nav-bg);
    color: var(--fg);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(12px);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    font-weight: 700;
    font-size: 1.1rem;
    margin-right: 0.5rem;
    text-decoration: none;
    color: inherit;
  }

  .navbar a {
    text-decoration: none;
    font-size: 0.95rem;
    color: inherit;
    opacity: 0.8;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
  }

  .navbar a:hover {
    opacity: 1;
    background-color: rgba(148, 163, 184, 0.2);
  }

  .navbar a.selected {
    opacity: 1;
    background-color: var(--accent);
    color: white;
  }

  .theme-toggle {
    border-radius: 999px;
    border: 1px solid var(--border-color);
    padding: 0.35rem 0.9rem;
    font-size: 0.85rem;
    background: var(--card-bg);
    color: var(--fg);
    cursor: pointer;
  }

  .theme-toggle:hover {
    filter: brightness(1.05);
  }

  @media (max-width: 640px) {
    .navbar-left a:not(.logo) {
      display: none;
    }
  }
</style>