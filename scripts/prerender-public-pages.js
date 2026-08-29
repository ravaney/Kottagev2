const fs = require('fs');
const path = require('path');

const routeMeta = require('../src/data/publicRouteMeta.json');
const websiteContent = require('../src/data/publicWebsiteContent.json');

const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(
    'build/index.html was not found. Run the client build first.'
  );
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');

const staticStyles = `
<style id="bk-static-prerender">
  :root {
    color-scheme: light;
    --bk-ink: #102739;
    --bk-ink-soft: #45606f;
    --bk-accent: #0f6c7a;
    --bk-white: #ffffff;
    --bk-border: rgba(16, 39, 57, 0.1);
    --bk-shadow: 0 24px 60px rgba(16, 39, 57, 0.12);
    --bk-radius-xl: 28px;
    --bk-radius-lg: 20px;
    --bk-max: 1200px;
  }

  .bk-shell * { box-sizing: border-box; }
  body { margin: 0; }
  .bk-shell a { color: inherit; text-decoration: none; }
  .bk-shell img { display: block; max-width: 100%; }

  .bk-shell {
    min-height: 100vh;
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    color: var(--bk-ink);
    background:
      radial-gradient(circle at top right, rgba(15, 108, 122, 0.12), transparent 28%),
      linear-gradient(180deg, #f8fbfd 0%, #ffffff 18%, #f7f3ed 100%);
  }
  .bk-nav-wrap {
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(18px);
    background: rgba(255, 255, 255, 0.84);
    border-bottom: 1px solid rgba(16, 39, 57, 0.08);
  }
  .bk-nav {
    width: min(var(--bk-max), calc(100vw - 32px));
    margin: 0 auto;
    min-height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .bk-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-weight: 800;
    letter-spacing: 0.01em;
  }
  .bk-brand img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }
  .bk-nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
  }
  .bk-nav-link {
    padding: 10px 14px;
    border-radius: 999px;
    color: var(--bk-ink-soft);
    font-weight: 700;
    font-size: 0.95rem;
  }
  .bk-nav-link.is-active {
    background: rgba(15, 108, 122, 0.12);
    color: var(--bk-accent);
  }
  .bk-page {
    width: min(var(--bk-max), calc(100vw - 32px));
    margin: 0 auto;
    padding: 40px 0 72px;
  }
  .bk-hero,
  .bk-detail-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 24px;
    align-items: stretch;
    margin-bottom: 40px;
  }
  .bk-hero-copy,
  .bk-hero-panel,
  .bk-card,
  .bk-tile,
  .bk-stat,
  .bk-event-tier,
  .bk-detail-block,
  .bk-event-card,
  .bk-detail-hero {
    border: 1px solid var(--bk-border);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--bk-shadow);
    border-radius: var(--bk-radius-lg);
  }
  .bk-hero-copy {
    border-radius: var(--bk-radius-xl);
    padding: 40px;
    background:
      linear-gradient(140deg, rgba(16, 39, 57, 0.96) 0%, rgba(15, 108, 122, 0.92) 100%);
    color: var(--bk-white);
  }
  .bk-eyebrow,
  .bk-card-label,
  .bk-event-pill,
  .bk-chip {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: var(--bk-white);
    font-weight: 800;
    font-size: 0.84rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .bk-card-label,
  .bk-event-pill,
  .bk-chip {
    background: rgba(15, 108, 122, 0.1);
    color: var(--bk-accent);
  }
  .bk-hero-copy h1,
  .bk-section-head h2,
  .bk-detail-main h1,
  .bk-card h3,
  .bk-tile h3,
  .bk-event-copy h3,
  .bk-detail-block h2 {
    line-height: 1.08;
    letter-spacing: -0.03em;
  }
  .bk-hero-copy h1 {
    font-size: clamp(2.3rem, 5vw, 4.6rem);
    margin: 18px 0 14px;
  }
  .bk-hero-copy p,
  .bk-section-head p,
  .bk-card p,
  .bk-tile p,
  .bk-event-copy p,
  .bk-detail-summary,
  .bk-detail-block p {
    line-height: 1.7;
    font-size: 1.02rem;
  }
  .bk-hero-copy p { color: rgba(255, 255, 255, 0.84); }
  .bk-section-head p,
  .bk-card p,
  .bk-tile p,
  .bk-event-copy p,
  .bk-detail-summary,
  .bk-detail-block p { color: var(--bk-ink-soft); }
  .bk-hero-description { max-width: 720px; margin-bottom: 26px; }
  .bk-hero-actions,
  .bk-chip-row,
  .bk-meta-list,
  .bk-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .bk-button,
  .bk-button-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    font-weight: 800;
  }
  .bk-button {
    background: var(--bk-white);
    color: var(--bk-ink);
  }
  .bk-button-secondary {
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--bk-white);
  }
  .bk-hero-panel {
    overflow: hidden;
    position: relative;
    min-height: 100%;
  }
  .bk-hero-panel img,
  .bk-detail-hero img {
    width: 100%;
    height: 100%;
    min-height: 360px;
    object-fit: cover;
  }
  .bk-hero-panel-copy {
    position: absolute;
    inset: auto 24px 24px 24px;
    border-radius: var(--bk-radius-lg);
    padding: 20px;
    background: rgba(16, 39, 57, 0.72);
    color: var(--bk-white);
    backdrop-filter: blur(10px);
  }
  .bk-grid {
    display: grid;
    gap: 20px;
  }
  .bk-grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .bk-grid.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .bk-section { margin-top: 28px; }
  .bk-section-head { margin-bottom: 18px; }
  .bk-section-head h2,
  .bk-detail-main h1 { font-size: clamp(1.8rem, 3vw, 3rem); margin: 0 0 12px; }
  .bk-detail-main h1 { font-size: clamp(2.2rem, 4vw, 4rem); margin-top: 18px; }
  .bk-card,
  .bk-tile,
  .bk-event-card,
  .bk-detail-hero { overflow: hidden; }
  .bk-card img,
  .bk-tile img { width: 100%; height: 220px; object-fit: cover; }
  .bk-card-copy,
  .bk-tile-copy,
  .bk-event-copy,
  .bk-detail-block,
  .bk-event-tier { padding: 20px; }
  .bk-card h3,
  .bk-tile h3,
  .bk-event-copy h3,
  .bk-detail-block h2 { margin: 14px 0 8px; }
  .bk-card-foot,
  .bk-meta-list { margin-top: 16px; color: var(--bk-ink-soft); font-weight: 700; }
  .bk-stat-row {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-bottom: 24px;
  }
  .bk-stat { padding: 20px; text-align: center; }
  .bk-stat strong { display: block; font-size: 2rem; margin-bottom: 8px; }
  .bk-list { margin: 0; padding-left: 18px; color: var(--bk-ink-soft); line-height: 1.7; }
  .bk-event-featured {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .bk-event-card {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
  }
  .bk-event-card img { width: 100%; height: 100%; min-height: 280px; object-fit: cover; }
  .bk-event-meta { display: grid; gap: 10px; margin-top: 18px; color: var(--bk-ink-soft); }
  .bk-event-tier strong { display: block; margin-bottom: 6px; }
  .bk-footer { padding: 30px 0 12px; color: var(--bk-ink-soft); font-size: 0.92rem; }

  @media (max-width: 960px) {
    .bk-hero,
    .bk-detail-grid,
    .bk-grid.cols-3,
    .bk-grid.cols-4,
    .bk-stat-row,
    .bk-event-featured,
    .bk-event-card { grid-template-columns: 1fr; }
    .bk-nav { align-items: flex-start; flex-direction: column; padding: 14px 0; }
    .bk-page { padding-top: 28px; }
  }
  @media (max-width: 720px) {
    .bk-hero-copy,
    .bk-card-copy,
    .bk-tile-copy,
    .bk-event-copy,
    .bk-detail-block,
    .bk-event-tier { padding: 18px; }
    .bk-hero-panel img,
    .bk-detail-hero img { min-height: 280px; }
  }
</style>
`;

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/Explore' },
  { label: 'Nomads', path: '/nomad-network' },
  { label: 'Events', path: '/Events' },
  { label: 'Search', path: '/search' },
];

const publishedEvents = []
  .filter(event => event.status === 'published' || event.status === 'sold_out')
  .sort(
    (left, right) =>
      new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
  );

const isUpcomingEvent = event => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(event.endDate).getTime() >= today.getTime();
};

const upcomingPublishedEvents = publishedEvents.filter(isUpcomingEvent);

const featuredEvents = upcomingPublishedEvents
  .filter(event => event.featured)
  .slice(0, 2);

const eventsHeroSource =
  featuredEvents[0] || upcomingPublishedEvents[0] || publishedEvents[0] || null;

const escapeHtml = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = value =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatDateTime = value =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatDateRange = (startDate, endDate) =>
  `${formatDate(startDate)} - ${formatDate(endDate)}`;

const formatEventRange = event =>
  `${formatDateTime(event.startDate)} - ${formatDateTime(event.endDate)}`;

const getEventPriceLabel = event => {
  if (!Array.isArray(event.ticketTiers) || !event.ticketTiers.length) {
    return 'Ticket info coming soon';
  }

  const priced = event.ticketTiers
    .map(tier => Number(tier.price || 0))
    .filter(price => price > 0);

  if (!priced.length) {
    return event.ticketUrl || event.website
      ? 'Pricing on event site'
      : 'Ticket options available';
  }

  return `From $${Math.min(...priced)}`;
};

const formatTierPrice = price =>
  Number(price) > 0 ? `$${price}` : 'Price TBA';
const formatTierAvailability = remaining =>
  Number(remaining) > 0
    ? `${remaining} remaining`
    : 'Availability announced by organizer';

const injectMetadata = (html, meta, extraHead = '') => {
  const withTitle = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  const withDescription = withTitle.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  return withDescription.replace(
    /<\/head>/i,
    `${staticStyles}
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="website" />
    ${extraHead}
  </head>`
  );
};

const injectRootMarkup = (html, markup) =>
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

const routeToFilePath = routePath => {
  if (routePath === '/') {
    return indexPath;
  }

  return path.join(
    buildDir,
    ...routePath.replace(/^\/+/, '').split('/'),
    'index.html'
  );
};

const writeRoute = (routePath, meta, markup, extraHead = '') => {
  const filePath = routeToFilePath(routePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const withMeta = injectMetadata(baseHtml, meta, extraHead);
  const finalHtml = injectRootMarkup(withMeta, markup);
  fs.writeFileSync(filePath, finalHtml, 'utf8');
};

const renderNav = activePath => `
  <div class="bk-nav-wrap">
    <div class="bk-nav">
      <a class="bk-brand" href="/">
        <img src="/blue logo.png" alt="Blue Kottage" />
        <span>Blue Kottage</span>
      </a>
      <nav class="bk-nav-links" aria-label="Primary">
        ${navItems
          .map(
            item => `
              <a class="bk-nav-link${
                item.path === activePath ? ' is-active' : ''
              }" href="${item.path}">
                ${escapeHtml(item.label)}
              </a>
            `
          )
          .join('')}
      </nav>
    </div>
  </div>
`;

const renderShell = ({ activePath, content, footerCopy }) => `
  <div class="bk-shell">
    ${renderNav(activePath)}
    <main class="bk-page">
      ${content}
      <footer class="bk-footer">
        ${escapeHtml(
          footerCopy ||
            'Static public HTML is generated at build time for faster first paint and better indexing, while the app experience still takes over after load.'
        )}
      </footer>
    </main>
  </div>
`;

const renderHome = () => {
  const home = websiteContent.home;

  return renderShell({
    activePath: '/',
    content: `
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <span class="bk-eyebrow">${escapeHtml(home.eyebrow)}</span>
          <h1>${escapeHtml(home.headline)}</h1>
          <p class="bk-hero-description">${escapeHtml(home.description)}</p>
          <div class="bk-hero-actions">
            <a class="bk-button" href="/search">Search stays</a>
            <a class="bk-button-secondary" href="/Events">See upcoming events</a>
            <a class="bk-button-secondary" href="/nomad-network">Browse nomad stays</a>
          </div>
        </div>
        <div class="bk-hero-panel">
          <img src="/swift river.jpg" alt="Jamaica riverside escape" />
          <div class="bk-hero-panel-copy">
            <strong>Plan the stay with more context</strong>
            <div>Find the property, the event, or the remote-work setup before you commit to the trip.</div>
          </div>
        </div>
      </section>

      <section class="bk-stat-row">
        ${home.stats
          .map(
            stat => `
              <div class="bk-stat">
                <strong>${escapeHtml(stat.value)}</strong>
                <div>${escapeHtml(stat.label)}</div>
              </div>
            `
          )
          .join('')}
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Featured stays</h2>
          <p>Build a stronger first impression before JavaScript loads, then hand off to the full search experience.</p>
        </div>
        <div class="bk-grid cols-3">
          ${home.featuredStays
            .map(
              stay => `
                <article class="bk-card">
                  <img src="${escapeHtml(stay.image)}" alt="${escapeHtml(stay.name)}" />
                  <div class="bk-card-copy">
                    <span class="bk-card-label">${escapeHtml(stay.tag)}</span>
                    <h3>${escapeHtml(stay.name)}</h3>
                    <p>${escapeHtml(stay.summary)}</p>
                    <div class="bk-card-foot">${escapeHtml(stay.location)} • ${escapeHtml(stay.price)}</div>
                    <div class="bk-meta-list">
                      <a class="bk-button" href="${escapeHtml(stay.link)}">Explore</a>
                    </div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Why this becomes hybrid first</h2>
          <p>The public site gets route-specific HTML, while host, admin, staff, and booking flows stay app-like and unchanged.</p>
        </div>
        <div class="bk-grid cols-3">
          ${home.highlights
            .map(
              item => `
                <article class="bk-tile">
                  <div class="bk-tile-copy">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.body)}</p>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Start from the kind of trip</h2>
          <p>Static website sections can still guide guests toward the richer search pages behind them.</p>
        </div>
        <div class="bk-grid cols-3">
          ${home.regions
            .map(
              region => `
                <article class="bk-card">
                  <img src="${escapeHtml(region.image)}" alt="${escapeHtml(region.title)}" />
                  <div class="bk-card-copy">
                    <h3>${escapeHtml(region.title)}</h3>
                    <p>${escapeHtml(region.body)}</p>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    `,
  });
};

const renderSearch = () =>
  renderShell({
    activePath: '/search',
    content: `
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <span class="bk-eyebrow">Search stays</span>
          <h1>Search Jamaica stays with a cleaner first page load.</h1>
          <p class="bk-hero-description">This route now ships build-time HTML for the website shell, and the interactive search experience takes over once the app bundle loads.</p>
          <div class="bk-hero-actions">
            <a class="bk-button" href="/Explore">Browse collections</a>
            <a class="bk-button-secondary" href="/nomad-network">See Nomads</a>
          </div>
        </div>
        <div class="bk-hero-panel">
          <img src="/images/portland.png" alt="Portland, Jamaica" />
          <div class="bk-hero-panel-copy">
            <strong>Then hand off to the app</strong>
            <div>Dates, guests, filters, and results still come from the existing React search flow.</div>
          </div>
        </div>
      </section>
    `,
  });

const renderExplore = () => {
  const explore = websiteContent.explore;

  return renderShell({
    activePath: '/Explore',
    content: `
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <span class="bk-eyebrow">${escapeHtml(explore.eyebrow)}</span>
          <h1>${escapeHtml(explore.headline)}</h1>
          <p class="bk-hero-description">${escapeHtml(explore.description)}</p>
          <div class="bk-hero-actions">
            <a class="bk-button" href="/search">Open full search</a>
            <a class="bk-button-secondary" href="/Events">Match it with an event</a>
          </div>
        </div>
        <div class="bk-hero-panel">
          <img src="/images/travel heart.png" alt="Explore Jamaica" />
          <div class="bk-hero-panel-copy">
            <strong>Editorial first, filters second</strong>
            <div>Use the website layer to frame the trip before the app does the heavier work.</div>
          </div>
        </div>
      </section>
      <section class="bk-section">
        <div class="bk-grid cols-4">
          ${explore.collections
            .map(
              item => `
                <article class="bk-card">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
                  <div class="bk-card-copy">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.body)}</p>
                    <div class="bk-meta-list">
                      <a class="bk-button" href="${escapeHtml(item.link)}">Continue</a>
                    </div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    `,
  });
};

const renderNomads = () => {
  const nomads = websiteContent.nomads;

  return renderShell({
    activePath: '/nomad-network',
    content: `
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <span class="bk-eyebrow">${escapeHtml(nomads.eyebrow)}</span>
          <h1>${escapeHtml(nomads.headline)}</h1>
          <p class="bk-hero-description">${escapeHtml(nomads.description)}</p>
          <div class="bk-chip-row">
            <span class="bk-chip">Nomad Pass ${escapeHtml(nomads.passPrice)}</span>
            <span class="bk-chip">Checkout add-on only</span>
            <span class="bk-chip">No monthly subscription in v1</span>
          </div>
          <div class="bk-hero-actions" style="margin-top:22px;">
            <a class="bk-button" href="/search">Search eligible stays</a>
            <a class="bk-button-secondary" href="/Events">Pair it with an event</a>
          </div>
        </div>
        <div class="bk-hero-panel">
          <img src="/bluemountain.jpg" alt="Nomad stay in Jamaica" />
          <div class="bk-hero-panel-copy">
            <strong>Work. Travel. Stay connected.</strong>
            <div>Fast Wi-Fi visibility, workspace details, and longer-stay energy without promising a separate app product.</div>
          </div>
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>What the Nomad page needs to prove quickly</h2>
        </div>
        <div class="bk-grid cols-3">
          ${nomads.perks
            .map(
              perk => `
                <article class="bk-tile">
                  <div class="bk-tile-copy">
                    <h3>${escapeHtml(perk.title)}</h3>
                    <p>${escapeHtml(perk.body)}</p>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Sample Nomad Verified stays</h2>
          <p>These cards are part of the static website layer; the live listing grid still comes from the existing route.</p>
        </div>
        <div class="bk-grid cols-3">
          ${nomads.properties
            .map(
              property => `
                <article class="bk-card">
                  <img src="${escapeHtml(property.image)}" alt="${escapeHtml(property.name)}" />
                  <div class="bk-card-copy">
                    <span class="bk-card-label">Nomad Verified</span>
                    <h3>${escapeHtml(property.name)}</h3>
                    <p>${escapeHtml(property.summary)}</p>
                    <div class="bk-chip-row">
                      ${property.tags
                        .map(
                          tag =>
                            `<span class="bk-chip">${escapeHtml(tag)}</span>`
                        )
                        .join('')}
                    </div>
                    <div class="bk-card-foot">${escapeHtml(property.location)}</div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    `,
  });
};

const renderEvents = () =>
  renderShell({
    activePath: '/Events',
    content: `
      <section class="bk-hero">
        <div class="bk-hero-copy">
          <span class="bk-eyebrow">Upcoming in Jamaica</span>
          <h1>Find the event before you book the stay.</h1>
          <p class="bk-hero-description">The events route now gets real route HTML at build time, then the interactive event filters, ticket flows, coupon saving, and calendar actions load on top.</p>
          <div class="bk-hero-actions">
            <a class="bk-button" href="/search">Search stays nearby</a>
            <a class="bk-button-secondary" href="/Explore">Explore the island</a>
          </div>
        </div>
        <div class="bk-hero-panel">
          <img src="${escapeHtml(eventsHeroSource?.image || '/Geejam2.jpg')}" alt="Featured Jamaica event" />
          <div class="bk-hero-panel-copy">
            <strong>${escapeHtml(eventsHeroSource?.title || 'Upcoming events')}</strong>
            <div>${escapeHtml(eventsHeroSource?.summary || 'Browse festivals, nightlife, retreats, and cultural experiences across Jamaica.')}</div>
          </div>
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Featured events</h2>
        </div>
        <div class="bk-event-featured">
          ${featuredEvents
            .map(
              event => `
                <article class="bk-event-card">
                  <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" />
                  <div class="bk-event-copy">
                    <span class="bk-event-pill">${escapeHtml(event.category)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.summary)}</p>
                    <div class="bk-event-meta">
                      <div><strong>When:</strong> ${escapeHtml(formatEventRange(event))}</div>
                      <div><strong>Where:</strong> ${escapeHtml(event.venue.name)}, ${escapeHtml(event.venue.city)}, ${escapeHtml(event.venue.parish)}</div>
                      <div><strong>Tickets:</strong> ${escapeHtml(getEventPriceLabel(event))}</div>
                    </div>
                    <div class="bk-meta-list">
                      <a class="bk-button" href="/Events/${escapeHtml(event.id)}">View event</a>
                    </div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="bk-section">
        <div class="bk-section-head">
          <h2>Upcoming events</h2>
          <p>Every sample event detail page also gets its own prebuilt HTML file.</p>
        </div>
        <div class="bk-grid cols-3">
          ${upcomingPublishedEvents
            .map(
              event => `
                <article class="bk-card">
                  <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" />
                  <div class="bk-card-copy">
                    <span class="bk-card-label">${escapeHtml(event.category)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.summary)}</p>
                    <div class="bk-card-foot">${escapeHtml(formatDate(event.startDate))} • ${escapeHtml(event.venue.city)}, ${escapeHtml(event.venue.parish)}</div>
                    <div class="bk-meta-list">
                      <a class="bk-button" href="/Events/${escapeHtml(event.id)}">View details</a>
                    </div>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    `,
  });

const renderEventDetail = event =>
  renderShell({
    activePath: '/Events',
    content: `
      <section class="bk-detail-grid">
        <div class="bk-detail-main">
          <span class="bk-eyebrow">${escapeHtml(event.category)}</span>
          <h1>${escapeHtml(event.title)}</h1>
          <p class="bk-detail-summary">${escapeHtml(event.summary)}</p>
          <div class="bk-chip-row" style="margin: 16px 0 20px;">
            <span class="bk-chip">${escapeHtml(formatDateRange(event.startDate, event.endDate))}</span>
            <span class="bk-chip">${escapeHtml(event.venue.city)}, ${escapeHtml(event.venue.parish)}</span>
            <span class="bk-chip">${escapeHtml(getEventPriceLabel(event))}</span>
          </div>
          <div class="bk-detail-actions">
            <a class="bk-button" href="/Events">Back to events</a>
            ${
              event.ticketUrl
                ? `<a class="bk-button-secondary" href="${escapeHtml(
                    event.ticketUrl
                  )}" target="_blank" rel="noreferrer">Ticket site</a>`
                : ''
            }
            ${
              event.website
                ? `<a class="bk-button-secondary" href="${escapeHtml(
                    event.website
                  )}" target="_blank" rel="noreferrer">Event website</a>`
                : ''
            }
          </div>
          <section class="bk-section">
            <div class="bk-detail-block">
              <h2>About this event</h2>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </section>
          <section class="bk-section">
            <div class="bk-detail-block">
              <h2>Guest perks</h2>
              <div class="bk-chip-row">
                ${event.perks
                  .map(
                    perk => `<span class="bk-chip">${escapeHtml(perk)}</span>`
                  )
                  .join('')}
              </div>
            </div>
          </section>
          ${
            event.lineup && event.lineup.length
              ? `
                <section class="bk-section">
                  <div class="bk-detail-block">
                    <h2>Lineup / speakers</h2>
                    <ul class="bk-list">
                      ${event.lineup
                        .map(item => `<li>${escapeHtml(item)}</li>`)
                        .join('')}
                    </ul>
                  </div>
                </section>
              `
              : ''
          }
        </div>
        <div>
          <div class="bk-detail-hero">
            <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" />
          </div>
          <section class="bk-section">
            <div class="bk-detail-block">
              <h2>Event details</h2>
              <div class="bk-event-meta">
                <div><strong>When:</strong> ${escapeHtml(formatEventRange(event))}</div>
                <div><strong>Venue:</strong> ${escapeHtml(event.venue.name)}</div>
                <div><strong>Address:</strong> ${escapeHtml(event.venue.address)}</div>
                <div><strong>Organizer:</strong> ${escapeHtml(event.organizer)}</div>
              </div>
            </div>
          </section>
          <section class="bk-section">
            <div class="bk-detail-block">
              <h2>Ticket tiers</h2>
              <div class="bk-grid">
                ${event.ticketTiers
                  .map(
                    tier => `
                      <div class="bk-event-tier">
                        <strong>${escapeHtml(tier.name)}</strong>
                        <div>${escapeHtml(formatTierPrice(tier.price))}</div>
                        <p>${escapeHtml(formatTierAvailability(tier.remaining))}</p>
                        <ul class="bk-list">
                          ${tier.perks
                            .map(perk => `<li>${escapeHtml(perk)}</li>`)
                            .join('')}
                        </ul>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </section>
          ${
            event.coupon
              ? `
                <section class="bk-section">
                  <div class="bk-detail-block">
                    <h2>Coupon offer</h2>
                    <p><strong>${escapeHtml(event.coupon.code)}</strong></p>
                    <p>${escapeHtml(event.coupon.discountText)}</p>
                    <p>${escapeHtml(event.coupon.description)}</p>
                  </div>
                </section>
              `
              : ''
          }
        </div>
      </section>
    `,
  });

writeRoute('/', routeMeta['/'], renderHome());
writeRoute('/search', routeMeta['/search'], renderSearch());
writeRoute('/Explore', routeMeta['/Explore'], renderExplore());
writeRoute('/nomad-network', routeMeta['/nomad-network'], renderNomads());
writeRoute('/Events', routeMeta['/Events'], renderEvents());

publishedEvents.forEach(event => {
  const meta = {
    title: `${event.title} | Events | Blue Kottage`,
    description: event.summary,
  };

  const extraHead = `<meta property="og:image" content="${escapeHtml(
    event.image
  )}" />`;

  writeRoute(`/Events/${event.id}`, meta, renderEventDetail(event), extraHead);
});

console.log(
  `Generated prerendered public pages for ${publishedEvents.length + 5} routes.`
);
