// Generates event + blog detail pages from content data into /events and /blog.
// Run: node build-pages.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const ROOT = resolve(new URL('.', import.meta.url).pathname);

const chrome = ({ title, description, path, active }) => ({
  head: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — Rebels Fight Cancer</title>
<meta name="description" content="${escapeAttr(description)}" />
<link rel="icon" href="../brand_assets/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="../assets/tw.js"></script>
<link rel="stylesheet" href="../assets/site.css">
</head>
<body class="font-sans">

<svg width="0" height="0" style="position:absolute">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.24   0 0 0 0 0.20   0 0 0 0 0.15   0 0 0 0.08 0"/>
  </filter>
</svg>

<div class="bg-ink text-cream text-[12px] tracking-[0.14em] uppercase">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center">
    <span class="inline-flex items-center gap-2">
      <span class="ribbon-dot h-2.5 w-2.5 rounded-full"></span>
      Turning Awareness into Action
    </span>
    <span class="opacity-40 hidden sm:inline">/</span>
    <span class="text-gold-300">Student-Led 501(c)(3) × National Pediatric Cancer Foundation</span>
  </div>
</div>

<header class="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-ink/[0.06]">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 h-[72px] flex items-center justify-between">
    <a href="../index.html" class="flex items-center gap-3 group" aria-label="Rebels Fight Cancer — home">
      <span class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cream-paper shadow-gold-sm ring-1 ring-gold/20 overflow-hidden">
        <img src="../brand_assets/logo.png" alt="" class="h-9 w-9 object-contain" />
      </span>
      <span class="display text-[17px] font-semibold leading-none tracking-tight">
        Rebels <span class="text-gold-600">Fight</span> Cancer
      </span>
    </a>
    <nav class="hidden md:flex items-center gap-9 text-[14px] text-ink-soft">
      <a href="../index.html#mission" class="nav-link">Mission</a>
      <a href="../index.html#board" class="nav-link">About the Board</a>
      <a href="../index.html#events" class="nav-link ${active==='events'?'text-ink':''}">Events</a>
      <a href="../index.html#blog" class="nav-link ${active==='blog'?'text-ink':''}">Blog</a>
    </nav>
    <div class="flex items-center gap-3">
      <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
         class="btn-ghost hidden sm:inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[13px] font-medium text-ink-soft">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        @rebels.fight.cancer
      </a>
      <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
         class="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold">
        Donate
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </div>
</header>
`,
  foot: `
<section class="relative py-24 lg:py-28 section-accent">
  <div class="mx-auto max-w-4xl px-6 lg:px-10 text-center">
    <p class="text-[12px] uppercase tracking-[0.2em] text-gold-600 font-semibold">Support a cure</p>
    <h2 class="display mt-4 text-[40px] lg:text-[56px] leading-[0.98] font-semibold text-ink">
      Turn a small <span class="fraunces-italic text-gold-600">yes</span> into a kid's <span class="fraunces-italic text-gold-600">tomorrow</span>.
    </h2>
    <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
      <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
         class="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-4 text-[14px] font-semibold">
        Donate via NPCF
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
         class="btn-ghost inline-flex items-center gap-2 rounded-full border border-ink/25 bg-cream-paper/60 px-7 py-4 text-[14px] font-semibold text-ink">
        Follow on Instagram
      </a>
    </div>
  </div>
</section>

<footer class="relative bg-cream border-t border-ink/10">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid md:grid-cols-12 gap-10 items-start">
    <div class="md:col-span-5">
      <a href="../index.html" class="flex items-center gap-3">
        <span class="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-paper shadow-gold-sm ring-1 ring-gold/20 overflow-hidden">
          <img src="../brand_assets/logo.png" alt="" class="h-10 w-10 object-contain"/>
        </span>
        <span class="display text-[20px] font-semibold tracking-tight">
          Rebels <span class="text-gold-600">Fight</span> Cancer
        </span>
      </a>
      <p class="mt-5 max-w-sm text-[14px] leading-[1.7] text-ink-soft">
        A student-led 501(c)(3) nonprofit raising funds for pediatric cancer research in partnership with the National Pediatric Cancer Foundation. Founded at Great Neck South High School and growing chapter by chapter.
      </p>
    </div>
    <div class="md:col-span-3">
      <h4 class="text-[12px] uppercase tracking-[0.2em] font-semibold text-ink-mute">Explore</h4>
      <ul class="mt-4 space-y-2 text-[14px] text-ink-soft">
        <li><a class="hover:text-ink transition-colors" href="../index.html#mission">Mission</a></li>
        <li><a class="hover:text-ink transition-colors" href="../index.html#board">About the Board</a></li>
        <li><a class="hover:text-ink transition-colors" href="../index.html#events">Events</a></li>
        <li><a class="hover:text-ink transition-colors" href="../index.html#blog">Blog</a></li>
      </ul>
    </div>
    <div class="md:col-span-4">
      <h4 class="text-[12px] uppercase tracking-[0.2em] font-semibold text-ink-mute">Connect</h4>
      <ul class="mt-4 space-y-2 text-[14px] text-ink-soft">
        <li>
          <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 hover:text-ink transition-colors">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            @rebels.fight.cancer
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="border-t border-ink/10">
    <div class="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink-mute">
      <span>© <span data-year>2026</span> Rebels Fight Cancer · A student-led 501(c)(3) nonprofit</span>
      <span>Built for the kids.</span>
    </div>
  </div>
</footer>
<script>document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());</script>
</body>
</html>`
});

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeAttr(s) { return escapeHtml(s); }

function galleryHtml(images) {
  if (!images?.length) return '';
  return `
<section class="py-16 lg:py-20 bg-cream-deep">
  <div class="mx-auto max-w-7xl px-6 lg:px-10">
    <p class="text-[12px] uppercase tracking-[0.2em] text-gold-600 font-semibold">Gallery</p>
    <h2 class="display mt-3 text-[32px] lg:text-[40px] font-semibold leading-tight text-ink">From the day.</h2>
    <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${images.map(img => `
      <figure class="gallery-tile relative overflow-hidden rounded-2xl ring-1 ring-ink/5 bg-cream-paper shadow-ink-sm aspect-[4/3]">
        <img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" class="gallery-img absolute inset-0 h-full w-full object-cover"/>
        <div class="absolute inset-0 bg-gradient-to-tr from-gold-700/10 via-transparent to-transparent img-tone"></div>
      </figure>`).join('\n')}
    </div>
    <p class="mt-6 text-[13px] text-ink-mute italic">More photos landing as Aayan shares them.</p>
  </div>
</section>`;
}

function eventPage(e) {
  const c = chrome({ title: e.title, description: e.description, active: 'events' });
  const upcoming = !!e.upcoming;
  return `${c.head}
<section class="relative overflow-hidden hero-gradient">
  <div class="grain" style="filter:url(#grain)"></div>
  <div class="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-20 lg:pt-20 lg:pb-24">
    <a href="../index.html#events" class="inline-flex items-center gap-2 text-[13px] text-ink-mute hover:text-ink transition-colors">
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      All events
    </a>
    <div class="mt-8 grid lg:grid-cols-12 gap-10 items-start">
      <div class="lg:col-span-7">
        <div class="flex flex-wrap items-center gap-2 mb-5">
          ${upcoming ? `<span class="text-[10px] uppercase tracking-[0.18em] bg-gold text-gold-ink px-2.5 py-1 rounded-full ring-1 ring-gold-600 font-bold">Upcoming</span>` : `<span class="text-[10px] uppercase tracking-[0.18em] bg-cream-paper/90 text-ink-soft px-2.5 py-1 rounded-full ring-1 ring-ink/10 font-semibold">Recap</span>`}
          <span class="text-[11px] uppercase tracking-[0.2em] text-gold-600 font-semibold">${escapeHtml(e.dateLabel)}</span>
          ${e.location ? `<span class="text-[11px] uppercase tracking-[0.2em] text-ink-mute font-semibold">· ${escapeHtml(e.location)}</span>` : ''}
        </div>
        <h1 class="display text-[44px] lg:text-[64px] leading-[1.02] font-semibold text-ink">${e.titleHtml || escapeHtml(e.title)}</h1>
        <div class="prose-rfc mt-7">
          ${e.body}
        </div>
        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
             class="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold">
            Support this event
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
             class="btn-ghost inline-flex items-center gap-2 rounded-full border border-ink/25 bg-cream-paper/60 px-6 py-3.5 text-[14px] font-semibold text-ink">
            More on Instagram
          </a>
        </div>
      </div>
      <div class="lg:col-span-5">
        <figure class="relative overflow-hidden rounded-[24px] shadow-gold-lg ring-1 ring-gold/15 bg-cream-paper">
          <img src="../${escapeAttr(e.hero)}" alt="${escapeAttr(e.heroAlt)}" class="block w-full h-full object-cover aspect-[4/5]"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent img-tone"></div>
        </figure>
      </div>
    </div>
  </div>
</section>

${galleryHtml(e.gallery)}

${c.foot}`;
}

function blogPage(p) {
  const c = chrome({ title: p.title, description: p.description, active: 'blog' });
  return `${c.head}
<section class="relative overflow-hidden hero-gradient">
  <div class="grain" style="filter:url(#grain)"></div>
  <div class="relative mx-auto max-w-3xl px-6 lg:px-10 pt-16 pb-20 lg:pt-20 lg:pb-24">
    <a href="../index.html#blog" class="inline-flex items-center gap-2 text-[13px] text-ink-mute hover:text-ink transition-colors">
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      All posts
    </a>
    <div class="mt-8 flex flex-wrap items-center gap-2 mb-5">
      <span class="text-[10px] uppercase tracking-[0.18em] bg-gold text-gold-ink px-2.5 py-1 rounded-full ring-1 ring-gold-600 font-bold">${escapeHtml(p.kicker)}</span>
      <span class="text-[11px] uppercase tracking-[0.2em] text-ink-mute font-semibold">${escapeHtml(p.readTime)}</span>
    </div>
    <h1 class="display text-[40px] lg:text-[56px] leading-[1.04] font-semibold text-ink">${escapeHtml(p.title)}</h1>
    <p class="mt-5 text-[17px] leading-[1.7] text-ink-soft">${escapeHtml(p.dek)}</p>
  </div>
</section>

<section class="py-16 lg:py-20 bg-cream">
  <div class="mx-auto max-w-3xl px-6 lg:px-10">
    <article class="prose-rfc">
      ${p.body}
    </article>
    <a href="../index.html#blog" class="mt-14 inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-ink transition-colors">
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      Back to all posts
    </a>
  </div>
</section>

${c.foot}`;
}

// -------------------- Data --------------------

const placeholderRecap = `<p><em>Event recap coming soon</em> — Aayan will fill in the full story, numbers, and photo gallery. The outline below is a placeholder so the page has shape.</p>`;

const events = [
  {
    slug: 'walk-to-give-summer-back',
    title: 'Walk to Give Summer Back to Children with Cancer',
    titleHtml: 'Walk to Give Summer Back to <span class="fraunces-italic text-gold-600">Children with Cancer</span>',
    description: 'A walk to fund a free summer camp experience for kids fighting cancer, with the Sunrise Association — Sunday June 14, 2026, Sunrise Day Camp Long Island.',
    dateLabel: 'Sunday · June 14, 2026',
    location: 'Sunrise Day Camp LI · Wheatley Heights',
    upcoming: true,
    hero: 'brand_assets/instagram/sunrise-association.jpg',
    heroAlt: 'Rebels Fight Cancer members at the GNS library hosting the Sunrise Association, with a slide reading "Walk to Give Summer Back to Children with Cancer — Sunday June 14, 2026"',
    body: `
<p>We're walking with the <strong>Sunrise Association</strong> to fund a free summer camp experience for children with cancer and their siblings. Every registered walker and every dollar raised directly underwrites camp tuition — a full, medically-supported summer a kid wouldn't otherwise get.</p>
<h3>What, where, when</h3>
<ul>
  <li><strong>Date:</strong> Sunday, June 14, 2026</li>
  <li><strong>Location:</strong> Sunrise Day Camp Long Island · Wheatley Heights, NY</li>
  <li><strong>Who's coming:</strong> Rebels Fight Cancer, and friends from Great Neck South</li>
  <li><strong>Cost:</strong> Free to walk · donate what you can</li>
</ul>
<h3>How to join</h3>
<p>Sign up through our NPCF team page (button below) or DM us on Instagram. Bring a friend, a sibling, a parent — the walk is family-friendly and all pace levels.</p>
<blockquote>"Give summer back." It sounds small on a slide. It's the whole point.</blockquote>
<p><em>Full sign-up link, route map, and team photo landing closer to the date.</em></p>
`,
    gallery: [
      { src: '../brand_assets/instagram/sunrise-association.jpg', alt: 'Rebels Fight Cancer at the Sunrise Association speaker event with the Walk slide behind them' },
      { src: '../brand_assets/instagram/sunrise-event-promo.jpg', alt: 'Promotional flyer for the Sunrise Association speaker event' },
    ],
  },
  {
    slug: 'chipotle-fundraiser',
    title: 'Chipotle Fundraiser',
    description: 'A local Chipotle night where a share of every order supported Rebels Fight Cancer and NPCF — November 15, 2025.',
    dateLabel: 'November 15, 2025',
    location: 'Chipotle · Great Neck',
    upcoming: false,
    hero: 'brand_assets/instagram/chipotle-fundraiser.jpg',
    heroAlt: 'Three Rebels Fight Cancer members holding "Do Good With Chipotle" fundraiser flyers in front of the Chipotle at Gardens',
    body: `
<p>Every bowl and burrito ordered at our partner Chipotle on November 15th pushed us closer to our NPCF goal. Students, parents, teachers — hundreds of orders, one cause.</p>
<h3>Why Chipotle</h3>
<p>Restaurant-partnered nights are one of the highest-conversion fundraisers a student chapter can run: the donor doesn't have to change what they were already going to eat. You show up, you order, the store donates a percentage.</p>
<h3>Thank you</h3>
<p>Thanks to everyone who pulled up, to the Chipotle team that hosted us, and to the board for handing out flyers in the cold.</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/chipotle-fundraiser.jpg', alt: 'Members outside Chipotle with fundraiser flyers' },
    ],
  },
  {
    slug: 'cards-for-hospitalized-kids',
    title: 'Cards for Hospitalized Kids',
    description: '500+ handmade cards across two nights with Project: LIFE and the GNS Pre-Med Club — December 2 & 4, 2025.',
    dateLabel: 'December 2 & 4, 2025',
    location: 'Great Neck South · Room 609',
    upcoming: false,
    hero: 'brand_assets/instagram/cardmaking-dec4.jpg',
    heroAlt: 'Students at a classroom cardmaking event holding handmade cards for hospitalized kids',
    body: `
<p>Two nights, two rooms, and more than <strong>500 hand-made cards</strong> for kids in pediatric hospital wards. Co-hosted with <strong>Project: LIFE</strong> and the <strong>GNS Pre-Med Club</strong>.</p>
<h3>The math</h3>
<ul>
  <li><strong>12/2/2025:</strong> 300+ cards</li>
  <li><strong>12/4/2025:</strong> 200+ cards</li>
  <li><strong>Total:</strong> 500+ headed to hospital wards</li>
</ul>
<h3>Why it matters</h3>
<p>Cards are small. A kid stuck in a hospital room on a weekday reading a handwritten note from a stranger is not small. Low-cost events like this are how student groups keep momentum between bigger fundraisers.</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/cardmaking-dec4.jpg', alt: 'Students holding handmade cards at the Dec 4 event' },
      { src: '../brand_assets/instagram/cardmaking-dec2.jpg', alt: 'Students holding handmade cards at the Dec 2 event' },
      { src: '../brand_assets/instagram/cards-for-kids-promo.jpg', alt: 'Cardmaking event promotional graphic' },
    ],
  },
  {
    slug: 'popcorn-fundraiser',
    title: 'Popcorn Fundraiser',
    description: 'A week of popcorn sales at Great Neck South with all proceeds going to NPCF — December 9 to 13, 2025.',
    dateLabel: 'December 9–13, 2025',
    location: 'Great Neck South',
    upcoming: false,
    hero: 'brand_assets/instagram/popcorn-fundraiser.jpg',
    heroAlt: 'Popcorn fundraiser promotional graphic — every kernel counts',
    body: `
<p>Every kernel counts. A full week of popcorn sales in the Great Neck South hallways, with 100% of proceeds going directly to the <strong>National Pediatric Cancer Foundation</strong>.</p>
<h3>Why popcorn</h3>
<p>Low cost per unit, high volume, everyone eats it. The point isn't the popcorn — it's the daily touchpoint. Five straight days of seeing the logo trains the school to recognize the cause, which compounds later when we ask for bigger commitments.</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/popcorn-fundraiser.jpg', alt: 'Popcorn fundraiser promotional flyer' },
    ],
  },
  {
    slug: 'sunrise-speaker',
    title: 'Sunrise Association Speaker Event',
    description: 'Julia Kane and Bonnie Flatow from the Sunrise Association spoke at GNS on pediatric cancer and student involvement — December 15, 2025.',
    dateLabel: 'December 15, 2025 · 2:45 PM',
    location: 'GNS Library',
    upcoming: false,
    hero: 'brand_assets/instagram/sunrise-association.jpg',
    heroAlt: 'Rebels Fight Cancer members with Sunrise Association speakers at the GNS library',
    body: `
<p>We hosted <strong>Julia Kane</strong> and <strong>Bonnie Flatow</strong> from the <strong>Sunrise Association</strong> at the GNS Library on December 15th. The talk covered pediatric cancer from the family side of the experience — what Sunrise Day Camp does, what camp means for a kid in treatment, and the concrete ways students can plug in.</p>
<h3>What we heard</h3>
<p>Sunrise runs a free summer camp for children with cancer and their siblings. The camp is medically supported, and for many families it's the only week of the year that resembles a normal childhood. The economics are simple: the camp runs on donations, and every team that walks on June 14 funds more beds.</p>
<h3>What came next</h3>
<p>The speaker event led directly into our <a href="walk-to-give-summer-back.html">Walk to Give Summer Back</a> team sign-ups. If that's a through-line we want — host speakers, feed the walk — this was a good proof of concept.</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/sunrise-association.jpg', alt: 'Group photo after the Sunrise speaker event' },
      { src: '../brand_assets/instagram/sunrise-event-promo.jpg', alt: 'Promotional flyer for the Sunrise speaker event' },
    ],
  },
  {
    slug: 'candygram-sale',
    title: 'Candygram Sale',
    description: 'Holiday candygrams in the GNS main lobby — $2 for one, $3 for two, all proceeds to NPCF. December 16 to 18, 2025.',
    dateLabel: 'December 16–18, 2025',
    location: 'GNS Main Lobby',
    upcoming: false,
    hero: 'brand_assets/instagram/candygrams-promo.jpg',
    heroAlt: 'Candygram sale promotional graphic — $2 for 1, $3 for 2, main lobby before and after school',
    body: `
<p>Three mornings and three afternoons in the main lobby. <strong>$2 for one candygram, $3 for two.</strong> Every dollar routed to NPCF.</p>
<h3>Why candygrams</h3>
<p>They're a gift someone else buys for someone else, which makes the ask easy — you're not asking anyone to buy something for themselves. The social layer does the work.</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/candygrams-promo.jpg', alt: 'Candygram sale promotional flyer' },
    ],
  },
  {
    slug: 'candy-cane-fundraiser',
    title: 'Candy Cane Fundraiser',
    description: 'A holiday close-out fundraiser distributing candy canes across Great Neck South — December 2025.',
    dateLabel: 'December 2025',
    location: 'Great Neck South',
    upcoming: false,
    hero: 'brand_assets/instagram/candy-cane-fundraiser.jpg',
    heroAlt: 'Candy cane fundraiser thank-you post',
    body: `
<p>The holiday close-out for a semester of fundraising. Candy canes with a message attached, the kind of thing you hand someone in the hallway and say "this went to a good cause."</p>
${placeholderRecap}
`,
    gallery: [
      { src: '../brand_assets/instagram/candy-cane-fundraiser.jpg', alt: 'Candy cane fundraiser thank-you post' },
    ],
  },
];

const posts = [
  {
    slug: 'why-pediatric-cancer-research-is-underfunded',
    title: 'Why pediatric cancer research is underfunded',
    description: 'Less than 4% of federal cancer research funding goes to childhood cancer. The gap is mostly math, not cruelty. Here is why it exists and why NPCF matters.',
    kicker: 'Explainer',
    readTime: '4 min read',
    dek: 'Less than 4% of federal cancer research funding goes to childhood cancer. The gap is mostly math, not cruelty. Here is why it exists and why NPCF matters.',
    body: `
<p>Every September the gold ribbons come out, and every September a statistic gets passed around that most people never actually check. Less than 4% of federal cancer research funding in the United States goes to pediatric cancers. You can argue about the exact number depending on how you count survivorship research or shared-mechanism grants, but the shape of the problem is real. The cancers that kill the most kids get a fraction of what the cancers that kill the most adults get.</p>
<p>The reason is not cruelty. It is mostly math. Federal grants tend to follow disease burden, and burden is usually measured in total deaths or hospitalization days. Pediatric cancers are rare by those metrics. Around 10,500 American children are diagnosed with cancer each year. Breast cancer alone sees about 300,000. When a funding committee compares proposals, the one that touches more people often wins on cost per life year saved.</p>
<p>The pushback on that math is that kids have more life ahead of them, and that a cure at seven is not the same thing as a cure at seventy. Pediatric survivors also live with decades of late effects. Cardiac damage from anthracyclines. Secondary cancers from radiation. Infertility. Neurocognitive issues. These are not edge cases. They are the cost of treatments that were mostly designed for adult biology and scaled down afterwards.</p>
<p>Private foundations exist partly to fill this gap. The National Pediatric Cancer Foundation funds a consortium called the Sunshine Project, where research hospitals run trials on cancers that do not have a viable commercial market. There is no blockbuster drug in a disease that affects a few hundred kids a year. Nobody is going to make that money back on royalties. Someone still has to pay for the science.</p>
<p>That is where student chapters like ours come in. A few thousand dollars a semester will not fund a trial on its own, and it does not need to. NPCF's model is to aggregate thousands of small donors into grants big enough to move a trial forward. Our Chipotle night, on its own, is one night. Added to every other chapter's one night, it becomes real money.</p>
<p>None of this is meant to guilt anyone into donating. It is meant to be honest about why the gap exists in the first place. The funding shortfall is not a fixable bureaucratic glitch. It is a consequence of how cancer research money actually moves in this country. If we want pediatric cancer to get more of it, more people have to keep pushing. That is the whole job.</p>
`,
  },
  {
    slug: 'what-500-cards-actually-do',
    title: 'What 500 cards actually do',
    description: 'Two nights, over 500 cards, and an honest look at what that actually does for a kid in a hospital bed.',
    kicker: 'Field note',
    readTime: '3 min read',
    dek: 'Two nights. Over 500 cards. An honest look at what that actually does for a kid in a hospital bed, and why we keep running these nights anyway.',
    body: `
<p>We spent two afternoons in December making cards for hospitalized kids, and the number we ended up with was over 500. That is a number that sounds good on an Instagram caption. It is also not a very satisfying answer to the question of what a card actually does for a kid sitting in a hospital room.</p>
<p>Here is what we learned from the people who distribute them. A pediatric oncology ward is a place where most of a kid's inputs are medical. Nurses coming in. Blood draws. Chemo schedules. Vitals. Their parents are either trying to work from a laptop in the corner or pretending not to cry. Days run into each other. A card from a stranger that says something like "you are awesome" is not much, but it is not nothing. It is a non-medical input. It is evidence that there is a world outside that room, and that someone in it thought about them.</p>
<p>The research on this is thinner than you might hope, because it is hard to run a controlled study on whether a drawing from a high schooler in Long Island measurably changes a clinical outcome. But the people who have worked with long-hospitalization pediatric patients will tell you the same things. Boredom is a real clinical problem. Isolation has measurable effects on recovery. Small interventions that signal community are worth more than they look. Cards fit in a folder and cost almost nothing to distribute.</p>
<p>The 500 number also hides something. It was not our chapter alone. It was Project: LIFE. It was the GNS Pre-Med Club. It was whoever walked into room 609 that afternoon and picked up a glue stick. A club of fifteen people cannot produce 500 of anything in two hours. The whole point of running these events at school is that the work scales when you invite other people in.</p>
<p>So the cards are doing two things at once. They are going to kids whose days need more non-medical inputs. And they are turning our chapter into something that people outside the chapter actually participate in. We are not doing this instead of raising money for research. We are doing it because the work of this club was never only the fundraising. It is also the showing up.</p>
`,
  },
  {
    slug: 'how-an-npcf-dollar-travels',
    title: 'How an NPCF dollar travels',
    description: 'Where does a $2 candygram actually end up? Tracing the literal path from a cashbox in the GNS lobby to a pediatric clinical trial.',
    kicker: 'Explainer',
    readTime: '5 min read',
    dek: "A $2 candygram does not cure anyone. A million $2 candygrams funds a clinical trial. This is the path in between.",
    body: `
<p>When someone hands us $2 for a candygram, it is reasonable to wonder where the $2 actually ends up. Not the slogan version. The literal version. Here is what we can trace.</p>
<p>The $2 goes into our table's cashbox, which our treasurer counts at the end of the day and deposits into our chapter account. At the end of the semester, we transfer the total to our NPCF team page at <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener">give.nationalpcf.org/team/774854</a>. Every dollar we raise passes through that page. We do not take a cut. There is no chapter operating budget that skims off the top. The materials for our events come from members, partner clubs, or small school grants, not from the donations themselves.</p>
<p>From there, NPCF pools our team total with thousands of others and allocates it to its research funding mechanism, most of which runs through the Sunshine Project. The Sunshine Project is a consortium of pediatric cancer research hospitals that share data and co-run clinical trials on cancers too rare to attract industry funding on their own. A single hospital cannot run a trial on 14 kids. Ten hospitals together can.</p>
<p>Most of the money goes to things that look boring on paper and matter a lot in practice. Study coordinators who run the trial day to day. Tissue banks that let researchers compare samples across institutions. Statistical support for small-sample trials, which is harder than it sounds when you cannot just recruit another 5,000 patients to reach significance. The hospitals themselves pay for most of the clinical care, but trial infrastructure, which is what actually lets a new treatment get tested at all, often has to come from outside funding. That is the line item NPCF dollars tend to sit on.</p>
<p>The trial then either works or does not. Most do not. That is how research usually goes, and it is part of why pediatric trials are so expensive on a per kid basis. When one does work, the drug or protocol gets published, other hospitals adopt it, and eventually it becomes the new standard of care. Standards of care do not change because of one donor. They change because a trial crossed its endpoint, and the trial happened because the infrastructure existed, and the infrastructure existed because a few thousand people put $2 into a cashbox somewhere.</p>
<p>That is the path. It is slower and less photogenic than handing a hospital a big cardboard check. It is also the one that actually funds the treatments children will use years from now. A candygram does not cure anyone. A decade of candygrams does not either. A decade of candygrams plus every other chapter's decade of candygrams funds a trial that cures someone.</p>
`,
  },
  {
    slug: 'pediatric-cancer-is-not-rare',
    title: 'Pediatric cancer is not rare',
    description: 'Pediatric cancer gets called rare a lot. The math says otherwise, and the gap between how it is described and how it actually works matters.',
    kicker: 'Explainer',
    readTime: '4 min read',
    dek: 'Pediatric cancer gets called rare a lot. The math says otherwise, and the gap between how it is described and how it actually works matters.',
    body: `
<p>Pediatric cancer gets called rare a lot. The word shows up in news articles, in fundraising decks, in conversations with people who hear what we do and want a polite way to ask why we are spending time on it. The math does not actually support the word. About 10,500 American children are diagnosed with cancer every year. That is a small number compared to adult cancer, but it is not a small number compared to other things that affect kids.</p>
<p>Cancer is the leading cause of death by disease in American children past infancy. Not the leading cause of death overall. That is still accidents. But out of the things that happen inside a child's body and end their life, cancer is at the top of the list. It kills more children every year than every other childhood disease combined. The framing as "rare" comes from comparing pediatric cancers to adult cancers, where the numbers are genuinely lopsided. It is not rare in absolute terms. It is rare relative to a baseline that is not the right baseline.</p>
<p>This matters because the word "rare" does work in the funding conversation. Rare diseases get rare-disease research budgets. They get rare-disease drug development incentives. They get framed as edge cases that the existing system can address through specialty programs. Pediatric cancer behaves differently. There are at least a dozen distinct cancers under the pediatric umbrella, each with its own biology, each with its own small patient population, and each individually too small for industry to develop drugs for at a scale that makes commercial sense. Calling the whole category "rare" both undersells the burden and oversells the chance that the existing system will quietly solve it.</p>
<p>It also matters at a personal level. Families who get a diagnosis often spend the first weeks of treatment hearing the word "rare" from people who mean well. That word implies a situation that does not happen often, which suggests it is somehow random or unlucky. The actual experience is that pediatric cancer wards exist in every major children's hospital in the country, and the rooms are not empty. Ten thousand families a year is not random. It is a pattern.</p>
<p>We use the word "rare" in some of our own materials too, because it is the term that exists. We are slowly trying to swap it for "underfunded relative to incidence." That phrase is uglier and harder to put on a flyer. It is also more accurate.</p>
`,
  },
  {
    slug: 'how-to-start-a-chapter-at-your-school',
    title: 'How to start a chapter at your school',
    description: 'An honest, step-by-step on getting a Rebels Fight Cancer chapter off the ground at a new school. Less inspiration, more logistics.',
    kicker: 'Playbook',
    readTime: '5 min read',
    dek: 'An honest, step-by-step on getting a Rebels Fight Cancer chapter off the ground at a new school. Less inspiration, more logistics.',
    body: `
<p>This is a playbook, not a marketing page. If you are reading this because you actually want to start a chapter, here is what we did, in the order we did it.</p>
<p>Step one is finding a faculty advisor. Almost every school requires one for any official club, and you cannot run real fundraisers through a school account without one. The advisor does not need to be involved in day-to-day work. They mostly need to sign forms and exist on paper. A teacher who has a personal connection to cancer is usually the easiest yes. Failing that, any science or health teacher tends to be receptive once you show them what we do and who NPCF is.</p>
<p>Step two is the founding board. You need at least three people who actually want to do the work, not just put it on a college application. This part matters more than people admit. A chapter with five committed students will outperform a chapter with twenty casual ones every single time. Pick the people first, figure out roles second.</p>
<p>Step three is your first event. We strongly recommend it be small and easy to win. A bake sale with $40 of supplies that raises $200 is a much better first event than a gala with $400 of supplies that raises $50. The point of the first event is to build the habit of finishing things, not to maximize revenue. Once your team has shipped one event, the second one is much easier. The third becomes routine.</p>
<p>Step four is the NPCF connection. Once you have a chapter going, message us on Instagram and we will introduce you to NPCF and help you set up your own team page on give.nationalpcf.org. From that point you can start routing money through the same pipeline we use, and your raised totals get aggregated into the national chapter total. You stop being a club and start being part of a research funding network.</p>
<p>The whole thing takes a few weeks if you move on it. The hardest part is starting. The second hardest part is being honest about whether the people on your founding board actually want to be there. Once those two are solved, the rest is mostly logistics.</p>
`,
  },
];

// -------------------- Emit --------------------
await mkdir(join(ROOT, 'events'), { recursive: true });
await mkdir(join(ROOT, 'blog'), { recursive: true });

let count = 0;
for (const e of events) {
  await writeFile(join(ROOT, 'events', `${e.slug}.html`), eventPage(e));
  count++;
}
for (const p of posts) {
  await writeFile(join(ROOT, 'blog', `${p.slug}.html`), blogPage(p));
  count++;
}
console.log(`generated ${count} pages`);
