(() => {
  // Change this single value to switch the homepage web search provider.
  const SEARCH_PROVIDER = 'startpage';
  const searchProviders = {
    google: { action: 'https://www.google.com/search', queryParam: 'q' },
    duckduckgo: { action: 'https://duckduckgo.com/', queryParam: 'q' },
    brave: { action: 'https://search.brave.com/search', queryParam: 'q' },
    startpage: { action: 'https://www.startpage.com/sp/search', queryParam: 'query' },
  };

  const services = [
    {
      name: 'Office',
      url: 'https://docs.chushin.space',
      domain: 'docs.chushin.space',
      kicker: 'Workspace / documents',
      description: 'Projects, notes, and essential files.',
      keywords: 'office workspace documents notes files projects',
      wide: false,
    },
    {
      name: 'Drop',
      url: 'https://zl.chushin.space',
      domain: 'zl.chushin.space',
      kicker: 'Upload / share',
      description: 'A place for quick uploads and media links.',
      keywords: 'drop upload share video media links',
      wide: false,
    },
    {
      name: 'Track',
      url: 'https://track.chushin.space',
      domain: 'track.chushin.space',
      kicker: 'Watch / listen / read',
      description: 'Your watchlists, reading lists, and media history.',
      keywords: 'track trakt anilist watchlists reading lists media history movies shows books',
      wide: false,
    },
    {
      name: 'Core',
      url: 'https://zima.chushin.space',
      domain: 'zima.chushin.space',
      kicker: 'System / overview',
      description: 'Server status, resources, and system controls.',
      keywords: 'core system server status resources dashboard controls',
      wide: true,
    },
    {
      name: 'Arcade',
      url: 'https://roms.chushin.space',
      domain: 'roms.chushin.space',
      kicker: 'Games / collection',
      description: 'The game collection.',
      keywords: 'arcade games collection roms play',
      wide: false,
    },
    {
      name: 'Inventory',
      url: 'https://inv.chushin.space',
      domain: 'inv.chushin.space',
      kicker: 'Items / locations',
      description: 'Items, locations, and household records.',
      keywords: 'inventory items locations household records homebox',
      wide: false,
    },
    {
      name: 'Archive',
      url: 'https://paperless.chushin.space',
      domain: 'paperless.chushin.space',
      kicker: 'Records / search',
      description: 'A searchable record of important documents.',
      keywords: 'archive records search documents paperless files',
      wide: true,
    },
  ];

  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const webSearch = document.querySelector('[data-web-search]');
  const webQuery = document.querySelector('[data-web-query]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const favicon = document.querySelector('[data-dark-href][data-light-href]');
  const themedImages = document.querySelectorAll('[data-dark-src][data-light-src]');
  const desktopNav = document.querySelector('.service-nav');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavPanel = document.querySelector('.mobile-services-panel');
  const serviceGrid = document.querySelector('[data-service-grid]');
  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-service-search]');
  const searchClear = document.querySelector('[data-search-clear]');
  const searchStatus = document.querySelector('[data-search-status]');
  const emptyState = document.querySelector('[data-empty-state]');
  const serviceCountElements = document.querySelectorAll('[data-service-count]');
  const dateElement = document.querySelector('[data-date]');
  const timeElement = document.querySelector('[data-time]');

  const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderDesktopNav = () => {
    if (!desktopNav) return;
    desktopNav.innerHTML = services
      .map((service) => `<a href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.name)}</a>`)
      .join('');
  };

  const renderMobileNav = () => {
    if (!mobileNavPanel) return;
    mobileNavPanel.innerHTML = services
      .map((service) => `<a href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.name)}<span aria-hidden="true">↗</span></a>`)
      .join('');
  };

  const renderCards = (query = '') => {
    if (!serviceGrid) return;
    const normalizedQuery = query.trim().toLowerCase();
    const visibleServices = services.filter((service) => {
      const searchableText = `${service.name} ${service.domain} ${service.kicker} ${service.description} ${service.keywords}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    serviceGrid.innerHTML = visibleServices
      .map((service) => `
        <a class="service-card${service.wide ? ' service-card-wide' : ''}" href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open chushin ${escapeHtml(service.name)} at ${escapeHtml(service.domain)}">
          <div class="card-topline">
            <span class="card-index">${String(services.indexOf(service) + 1).padStart(2, '0')}</span>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </div>
          <div class="card-content">
            <p class="card-kicker">${escapeHtml(service.kicker)}</p>
            <h3>${escapeHtml(service.name)}</h3>
            <p class="card-description">${escapeHtml(service.description)}</p>
          </div>
          <span class="card-domain">${escapeHtml(service.domain)}</span>
        </a>
      `)
      .join('');

    if (emptyState) emptyState.hidden = visibleServices.length !== 0;
    if (searchStatus) {
      searchStatus.textContent = normalizedQuery
        ? `${visibleServices.length} ${visibleServices.length === 1 ? 'service' : 'services'} found`
        : '';
    }
  };

  const updateServiceCounts = () => {
    serviceCountElements.forEach((element) => {
      element.textContent = String(services.length).padStart(2, '0');
    });
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem('chushin-theme', theme);
    } catch (error) {
      // Theme switching still works when storage is unavailable.
    }

    if (themeToggle) {
      const isLight = theme === 'light';
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark mode' : 'Switch to light mode',
      );
    }

    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#f4f4f0' : '#080808');
    }

    themedImages.forEach((image) => {
      image.src = image.dataset[`${theme}Src`];
    });

    if (favicon) {
      favicon.href = favicon.dataset[`${theme}Href`];
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    if (dateElement) {
      dateElement.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(now).toUpperCase();
    }
    if (timeElement) {
      timeElement.textContent = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      timeElement.dateTime = now.toISOString();
    }
  };

  renderDesktopNav();
  renderMobileNav();
  const selectedSearchProvider = searchProviders[SEARCH_PROVIDER] || searchProviders.google;
  if (webSearch) webSearch.action = selectedSearchProvider.action;
  if (webQuery) webQuery.name = selectedSearchProvider.queryParam;
  renderCards();
  updateServiceCounts();
  applyTheme(root.dataset.theme || 'dark');
  updateDateTime();
  window.setInterval(updateDateTime, 1000);

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });

  mobileNavToggle?.addEventListener('click', () => {
    const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNavPanel.hidden = isOpen;
    mobileNavToggle.querySelector('.mobile-nav-chevron').textContent = isOpen ? '↓' : '↑';
  });

  const closeMobileNav = () => {
    if (!mobileNavToggle || !mobileNavPanel) return;
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNavPanel.hidden = true;
    const chevron = mobileNavToggle.querySelector('.mobile-nav-chevron');
    if (chevron) chevron.textContent = '↓';
  };

  mobileNavPanel?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMobileNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav();
  });

  document.addEventListener('click', (event) => {
    if (!mobileNavPanel || mobileNavPanel.hidden) return;
    if (!event.target.closest('.mobile-nav-wrap')) closeMobileNav();
  });

  searchInput?.addEventListener('input', () => {
    renderCards(searchInput.value);
    if (searchClear) searchClear.hidden = searchInput.value.length === 0;
  });

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  searchClear?.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = '';
    searchClear.hidden = true;
    renderCards();
    searchInput.focus();
  });
})();
