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
<title>${escapeHtml(title)} | Rebels Fight Cancer</title>
<meta name="description" content="${escapeAttr(description)}" />
<link rel="icon" href="../brand_assets/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="../assets/tw.js"></script>
<link rel="stylesheet" href="../assets/site.css">
</head>
<body class="font-sans text-ink">

<div class="bg-ink text-white/85 text-[13px]">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 py-2 text-center">
    Turning awareness into action<span class="hidden sm:inline"><span class="mx-2 text-white/40" aria-hidden="true">·</span>A student-led 501(c)(3) partnered with the National Pediatric Cancer Foundation</span>
  </div>
</div>

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-paper-line">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
    <a href="../index.html" class="flex items-center gap-2.5 rounded-md" aria-label="Rebels Fight Cancer home">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-paper-line bg-white overflow-hidden">
        <img src="../brand_assets/logo.png" alt="" class="h-9 w-9 object-contain" />
      </span>
      <span class="text-[17px] font-bold tracking-[-0.01em] leading-none sm:whitespace-nowrap">Rebels Fight Cancer</span>
    </a>
    <nav aria-label="Main" class="hidden md:flex items-center gap-5 lg:gap-8 text-[14px] lg:text-[15px] text-ink-soft whitespace-nowrap">
      <a href="../index.html#mission" class="nav-link">Mission</a>
      <a href="../index.html#board" class="nav-link">About the Board</a>
      <a href="../index.html#events" class="nav-link ${active==='events'?'text-ink':''}">Events</a>
      <a href="../index.html#blog" class="nav-link ${active==='blog'?'text-ink':''}">Blog</a>
    </nav>
    <div class="flex items-center gap-2.5">
      <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
         class="btn-ghost hidden sm:inline-flex md:hidden xl:inline-flex items-center gap-2 rounded-lg border border-paper-line px-3.5 py-2.5 text-[14px] font-medium text-ink-soft">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        @rebels.fight.cancer
      </a>
      <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
         class="btn-primary inline-flex items-center rounded-lg px-4 py-2.5 text-[14px] font-semibold">
        Donate
      </a>
    </div>
  </div>
</header>
`,
  foot: `
<section class="bg-ribbon">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 py-14 lg:py-16 grid lg:grid-cols-12 gap-8 lg:items-end">
    <div class="lg:col-span-7">
      <h2 class="text-[30px] lg:text-[40px] leading-[1.05] font-extrabold tracking-[-0.025em]">Support pediatric cancer research</h2>
      <p class="mt-4 max-w-2xl text-[17px] leading-[1.7]">Donate through our NPCF team page, come to one of our events, or tell a friend about us.</p>
    </div>
    <div class="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
      <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
         class="btn-dark inline-flex items-center rounded-lg px-5 py-3 text-[15px] font-semibold">
        Donate through NPCF
      </a>
      <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
         class="btn-ghost inline-flex items-center rounded-lg border border-ink/30 px-5 py-3 text-[15px] font-semibold">
        Follow on Instagram
      </a>
    </div>
  </div>
</section>

<footer class="border-t border-paper-line">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid md:grid-cols-12 gap-10 items-start">
    <div class="md:col-span-5">
      <a href="../index.html" class="inline-flex items-center gap-2.5 rounded-md">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-paper-line bg-white overflow-hidden">
          <img src="../brand_assets/logo.png" alt="" class="h-9 w-9 object-contain"/>
        </span>
        <span class="text-[17px] font-bold tracking-[-0.01em]">Rebels Fight Cancer</span>
      </a>
      <p class="mt-4 max-w-sm text-[15px] leading-[1.7] text-ink-soft">
        A student-led <span class="whitespace-nowrap">501(c)(3)</span> raising money for pediatric cancer research with the National Pediatric Cancer Foundation. Founded at Great Neck South High School.
      </p>
    </div>
    <nav aria-label="Footer" class="md:col-span-3">
      <h2 class="text-[14px] font-semibold">Explore</h2>
      <ul class="mt-3 space-y-2 text-[15px] text-ink-soft">
        <li><a class="hover:text-ink hover:underline underline-offset-4" href="../index.html#mission">Mission</a></li>
        <li><a class="hover:text-ink hover:underline underline-offset-4" href="../index.html#board">About the Board</a></li>
        <li><a class="hover:text-ink hover:underline underline-offset-4" href="../index.html#events">Events</a></li>
        <li><a class="hover:text-ink hover:underline underline-offset-4" href="../index.html#blog">Blog</a></li>
      </ul>
    </nav>
    <div class="md:col-span-4">
      <h2 class="text-[14px] font-semibold">Connect</h2>
      <ul class="mt-3 space-y-2 text-[15px] text-ink-soft">
        <li>
          <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
             class="inline-flex items-center gap-2 hover:text-ink hover:underline underline-offset-4">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            @rebels.fight.cancer
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="border-t border-paper-line">
    <div class="mx-auto max-w-7xl px-6 lg:px-10 py-5 text-[13px] text-ink-mute">
      © <span data-year>2026</span> Rebels Fight Cancer. A student-led <span class="whitespace-nowrap">501(c)(3)</span> nonprofit.
    </div>
  </div>
</footer>
<script>document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());</script>
</body>
</html>`
});

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeAttr(s) { return escapeHtml(s); }

const backLink = (href, label) => `<a href="${href}" class="inline-flex items-center gap-2 text-[14px] font-medium text-ink-mute hover:text-ink transition-colors">
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      ${label}
    </a>`;

const metaLine = (parts) => parts.filter(Boolean).map(escapeHtml).join(' <span aria-hidden="true">·</span> ');

function galleryHtml(images) {
  if (!images?.length) return '';
  return `
<section class="py-16 lg:py-20 bg-paper-tint">
  <div class="mx-auto max-w-7xl px-6 lg:px-10">
    <h2 class="text-[28px] lg:text-[32px] leading-tight font-bold tracking-[-0.02em]">Photos</h2>
    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${images.map(img => `
      <figure class="gallery-tile overflow-hidden rounded-lg bg-white aspect-[4/3]">
        <img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy" class="gallery-img media block h-full w-full object-cover"/>
      </figure>`).join('\n')}
    </div>
  </div>
</section>`;
}

function eventPage(e) {
  const c = chrome({ title: e.title, description: e.description, active: 'events' });
  const status = e.upcoming ? 'Upcoming' : 'Recap';
  return `${c.head}
<main>
<section class="border-b border-paper-line">
  <div class="mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-16 lg:pt-14 lg:pb-20">
    ${backLink('../index.html#events', 'All events')}
    <div class="mt-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div class="lg:col-span-7">
        <p class="text-[14px] font-semibold text-ink-mute">${metaLine([status, e.dateLabel, e.location])}</p>
        <h1 class="mt-3 text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.04] font-extrabold tracking-[-0.025em]">${escapeHtml(e.title)}</h1>
        <div class="prose-rfc mt-7">
          ${e.body}
        </div>
        <div class="mt-10 flex flex-wrap items-center gap-3">
          <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener"
             class="btn-primary inline-flex items-center rounded-lg px-5 py-3 text-[15px] font-semibold">
            Donate through NPCF
          </a>
          <a href="https://www.instagram.com/rebels.fight.cancer/" target="_blank" rel="noopener"
             class="btn-ghost inline-flex items-center rounded-lg border border-ink/20 px-5 py-3 text-[15px] font-semibold">
            More on Instagram
          </a>
        </div>
      </div>
      <figure class="lg:col-span-5">
        <div class="overflow-hidden rounded-xl">
          <img src="../${escapeAttr(e.hero)}" alt="${escapeAttr(e.heroAlt)}" class="media block w-full aspect-[4/5] object-cover"/>
        </div>
      </figure>
    </div>
  </div>
</section>

${galleryHtml(e.gallery)}
</main>

${c.foot}`;
}

function blogPage(p) {
  const c = chrome({ title: p.title, description: p.description, active: 'blog' });
  return `${c.head}
<main>
<section class="border-b border-paper-line">
  <div class="mx-auto max-w-3xl px-6 lg:px-10 pt-10 pb-12 lg:pt-14 lg:pb-16">
    ${backLink('../index.html#blog', 'All posts')}
    <p class="mt-8 text-[14px] font-semibold text-ink-mute">${metaLine([p.kicker, p.readTime])}</p>
    <h1 class="mt-3 text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.06] font-extrabold tracking-[-0.025em]">${escapeHtml(p.title)}</h1>
    <p class="mt-5 text-[19px] leading-[1.6] text-ink-soft">${escapeHtml(p.dek)}</p>
  </div>
</section>

<section class="py-12 lg:py-16">
  <div class="mx-auto max-w-3xl px-6 lg:px-10">
    <article class="prose-rfc">
      ${p.body}
    </article>
    <div class="mt-14">
      ${backLink('../index.html#blog', 'Back to all posts')}
    </div>
  </div>
</section>
</main>

${c.foot}`;
}

// -------------------- Data --------------------

const events = [
  {
    slug: 'walk-to-give-summer-back',
    title: 'Walk to Give Summer Back to Children with Cancer',
    description: 'A walk with the Sunrise Association to fund free summer camp for kids with cancer. Sunday, June 14, 2026, at Sunrise Day Camp Long Island.',
    dateLabel: 'Sunday, June 14, 2026',
    location: 'Sunrise Day Camp Long Island, Wheatley Heights',
    upcoming: true,
    hero: 'brand_assets/instagram/sunrise-association.jpg',
    heroAlt: 'Rebels Fight Cancer members at the GNS library hosting the Sunrise Association, with a slide reading "Walk to Give Summer Back to Children with Cancer, Sunday June 14, 2026"',
    body: `
<p>We're walking with the <strong>Sunrise Association</strong> to raise money for Sunrise Day Camp, a free summer camp for children with cancer and their siblings. The camp has medical support on site, and walks like this one help pay for it.</p>
<h3>What, where, when</h3>
<ul>
  <li><strong>Date:</strong> Sunday, June 14, 2026</li>
  <li><strong>Location:</strong> Sunrise Day Camp Long Island, Wheatley Heights, NY</li>
  <li><strong>Who's coming:</strong> Rebels Fight Cancer, plus friends from Great Neck South</li>
  <li><strong>Cost:</strong> Free to walk. Donate what you can.</li>
</ul>
<h3>How to join</h3>
<p>DM us on Instagram to walk with our team. Friends, siblings, and parents are welcome, and you can go at any pace.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/sunrise-association.jpg', alt: 'Rebels Fight Cancer at the Sunrise Association speaker event with the Walk slide behind them' },
      { src: '../brand_assets/instagram/sunrise-event-promo.jpg', alt: 'Flyer for the Sunrise Association speaker event' },
    ],
  },
  {
    slug: 'chipotle-fundraiser',
    title: 'Chipotle Fundraiser',
    description: 'A fundraiser night at our local Chipotle, where a share of every order went to NPCF. November 15, 2025.',
    dateLabel: 'November 15, 2025',
    location: 'Chipotle, Great Neck',
    upcoming: false,
    hero: 'brand_assets/instagram/chipotle-fundraiser.jpg',
    heroAlt: 'Three Rebels Fight Cancer members holding "Do Good With Chipotle" fundraiser flyers in front of the Chipotle at Gardens',
    body: `
<p>On November 15, our local Chipotle donated a share of every order to our NPCF team. Students, parents, and teachers came out for it.</p>
<h3>Why Chipotle</h3>
<p>Restaurant nights are one of the easiest fundraisers a student club can run. People were going to eat dinner anyway, and the restaurant donates a percentage of what they spend.</p>
<h3>Thank you</h3>
<p>Thanks to everyone who pulled up, to the Chipotle team that hosted us, and to the board for handing out flyers in the cold.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/chipotle-fundraiser.jpg', alt: 'Members outside Chipotle with fundraiser flyers' },
    ],
  },
  {
    slug: 'cards-for-hospitalized-kids',
    title: 'Cards for Hospitalized Kids',
    description: 'More than 500 handmade cards for hospitalized kids, made over two days with Project: LIFE and the GNS Pre-Med Club. December 2 and 4, 2025.',
    dateLabel: 'December 2 and 4, 2025',
    location: 'Great Neck South High School',
    upcoming: false,
    hero: 'brand_assets/instagram/cardmaking-dec4.jpg',
    heroAlt: 'Students at a classroom cardmaking event holding handmade cards for hospitalized kids',
    body: `
<p>Over two days we made more than <strong>500 handmade cards</strong> for kids in pediatric hospital wards. We co-hosted with <strong>Project: LIFE</strong> and the <strong>GNS Pre-Med Club</strong>.</p>
<h3>Card count</h3>
<ul>
  <li><strong>December 2:</strong> 300+ cards</li>
  <li><strong>December 4:</strong> 200+ cards</li>
  <li><strong>Total:</strong> 500+ cards headed to hospital wards</li>
</ul>
<h3>Why cards</h3>
<p>A card is a small thing. For a kid stuck in a hospital room on a weekday, a handwritten note from a stranger can still matter a lot. Card drives also cost us almost nothing, which keeps the club busy between bigger fundraisers.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/cardmaking-dec4.jpg', alt: 'Students holding handmade cards at the Dec 4 event' },
      { src: '../brand_assets/instagram/cardmaking-dec2.jpg', alt: 'Students holding handmade cards at the Dec 2 event' },
      { src: '../brand_assets/instagram/cards-for-kids-promo.jpg', alt: 'Card-making event flyer' },
    ],
  },
  {
    slug: 'popcorn-fundraiser',
    title: 'Popcorn Fundraiser',
    description: 'A week of popcorn sales at Great Neck South with all proceeds going to NPCF. December 9 to 13, 2025.',
    dateLabel: 'December 9–13, 2025',
    location: 'Great Neck South',
    upcoming: false,
    hero: 'brand_assets/instagram/popcorn-fundraiser.jpg',
    heroAlt: 'Popcorn fundraiser flyer reading "Every kernel counts"',
    body: `
<p>We sold popcorn in the Great Neck South hallways for a full week, and 100% of the proceeds went to the <strong>National Pediatric Cancer Foundation</strong>.</p>
<h3>Why popcorn</h3>
<p>Popcorn doesn't cost much and almost everyone will buy a bag. Selling it five days in a row also meant most of the school walked past our table at some point and saw what we were raising money for.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/popcorn-fundraiser.jpg', alt: 'Popcorn fundraiser flyer' },
    ],
  },
  {
    slug: 'sunrise-speaker',
    title: 'Sunrise Association Speaker Event',
    description: 'Julia Kane and Bonnie Flatow from the Sunrise Association spoke at GNS about pediatric cancer and how students can help. December 15, 2025.',
    dateLabel: 'December 15, 2025, 2:45 PM',
    location: 'GNS Library',
    upcoming: false,
    hero: 'brand_assets/instagram/sunrise-association.jpg',
    heroAlt: 'Rebels Fight Cancer members with Sunrise Association speakers at the GNS library',
    body: `
<p>On December 15, we hosted <strong>Julia Kane</strong> and <strong>Bonnie Flatow</strong> from the <strong>Sunrise Association</strong> at the GNS Library. They talked about pediatric cancer from a family's point of view: what Sunrise Day Camp does, what camp means for a kid in treatment, and how students can help.</p>
<h3>What we heard</h3>
<p>Sunrise runs a free summer camp for children with cancer and their siblings, with medical support on site. For many families it's the part of the year that feels most like a normal childhood. The camp is paid for by donations, including money raised at the June 14 walk.</p>
<h3>What came next</h3>
<p>After the talk, students started signing up for our <a href="walk-to-give-summer-back.html">Walk to Give Summer Back</a> team.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/sunrise-association.jpg', alt: 'Group photo after the Sunrise speaker event' },
      { src: '../brand_assets/instagram/sunrise-event-promo.jpg', alt: 'Flyer for the Sunrise speaker event' },
    ],
  },
  {
    slug: 'candygram-sale',
    title: 'Candygram Sale',
    description: 'Holiday candygrams in the GNS main lobby, $2 for one or $3 for two, with all proceeds to NPCF. December 16 to 18, 2025.',
    dateLabel: 'December 16–18, 2025',
    location: 'GNS Main Lobby',
    upcoming: false,
    hero: 'brand_assets/instagram/candygrams-promo.jpg',
    heroAlt: 'Candygram sale flyer: $2 for 1, $3 for 2, main lobby before and after school',
    body: `
<p>For three days we sold candygrams in the main lobby before and after school: <strong>$2 for one, $3 for two.</strong> All of the money went to NPCF.</p>
<h3>Why candygrams</h3>
<p>People buy candygrams for their friends, not for themselves, which makes it an easy thing to say yes to.</p>
`,
    gallery: [
      { src: '../brand_assets/instagram/candygrams-promo.jpg', alt: 'Candygram sale flyer' },
    ],
  },
  {
    slug: 'candy-cane-fundraiser',
    title: 'Candy Cane Fundraiser',
    description: 'A candy cane fundraiser at Great Neck South to finish the fall semester. December 2025.',
    dateLabel: 'December 2025',
    location: 'Great Neck South',
    upcoming: false,
    hero: 'brand_assets/instagram/candy-cane-fundraiser.jpg',
    heroAlt: 'Candy cane fundraiser thank-you post',
    body: `
<p>This was our last fundraiser of the fall semester. Each candy cane came with a message attached, the kind of thing you hand someone in the hallway while telling them it went to a good cause.</p>
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
    description: 'Less than 4% of federal cancer research funding goes to childhood cancer. Most of that gap comes from how research money gets allocated, and private funders like NPCF are trying to close it.',
    kicker: 'Explainer',
    readTime: '4 min read',
    dek: 'Less than 4% of federal cancer research funding goes to childhood cancer. Most of that gap comes from how research money gets allocated, and private funders like NPCF are trying to close it.',
    body: `
<p>Every September the gold ribbons come out, and every September a statistic gets passed around that most people never actually check. Less than 4% of federal cancer research funding in the United States goes to pediatric cancers. You can argue about the exact number depending on how you count survivorship research or shared-mechanism grants, but the shape of the problem is real. The cancers that kill the most kids get a fraction of what the cancers that kill the most adults get.</p>
<p>Most of the reason is math. Federal grants tend to follow disease burden, and burden is usually measured in total deaths or hospitalization days. Pediatric cancers are rare by those metrics. Around 10,500 American children are diagnosed with cancer each year. Breast cancer alone sees about 300,000. When a funding committee compares proposals, the one that touches more people often wins on cost per life year saved.</p>
<p>The pushback on that math is that kids have more life ahead of them, and that a cure at seven is not the same thing as a cure at seventy. Pediatric survivors also live with decades of late effects: cardiac damage from anthracyclines, secondary cancers from radiation, infertility, and neurocognitive issues. Those problems are common, and they come from treatments that were mostly designed for adult biology and scaled down afterwards.</p>
<p>Private foundations exist partly to fill this gap. The National Pediatric Cancer Foundation funds a consortium called the Sunshine Project, where research hospitals run trials on cancers that do not have a viable commercial market. There is no blockbuster drug in a disease that affects a few hundred kids a year. Nobody is going to make that money back on royalties. Someone still has to pay for the science.</p>
<p>That is where student chapters like ours come in. A few thousand dollars a semester will not fund a trial on its own, and it does not need to. NPCF's model is to aggregate thousands of small donors into grants big enough to move a trial forward. Our Chipotle night, on its own, is one night. Added to every other chapter's one night, it becomes real money.</p>
<p>We're not writing this to guilt anyone into donating. We want to be honest about where the gap comes from. It isn't a bureaucratic glitch that one fix will solve. It comes from how cancer research money moves in this country, so getting more of it to pediatric cancer takes a lot of people pushing for a long time.</p>
`,
  },
  {
    slug: 'what-500-cards-actually-do',
    title: 'What 500 cards actually do',
    description: "We made more than 500 cards in two days. Here's what a card can and can't do for a kid in a hospital bed.",
    kicker: 'Field note',
    readTime: '3 min read',
    dek: "We made more than 500 cards in two days. Here's what a card can and can't do for a kid in a hospital bed, and why we keep running these drives.",
    body: `
<p>We spent two days in December making cards for hospitalized kids, and the number we ended up with was over 500. That is a number that sounds good on an Instagram caption. It is also not a very satisfying answer to the question of what a card actually does for a kid sitting in a hospital room.</p>
<p>Here is what we learned from the people who distribute them. A pediatric oncology ward is a place where most of a kid's inputs are medical. Nurses coming in. Blood draws. Chemo schedules. Vitals. Their parents are either trying to work from a laptop in the corner or pretending not to cry. Days run into each other. A card from a stranger that says something like "you are awesome" is a small thing, but it's one of the few things in the room that has nothing to do with treatment. It shows there is a world outside that room, and that someone in it thought about them.</p>
<p>The research on this is thinner than you might hope, because it is hard to run a controlled study on whether a drawing from a high schooler on Long Island changes a clinical outcome. Still, people who work with kids on long hospital stays tend to say the same thing: boredom and isolation make a hard situation worse, and small signs that other people care help more than you'd expect. Cards fit in a folder and cost almost nothing to distribute.</p>
<p>The 500 number also hides something. Our chapter didn't make them alone. Project: LIFE and the GNS Pre-Med Club were there, along with whoever walked into room 609 and picked up a glue stick. A club of fifteen people cannot make 500 of anything in two hours. Running these events at school means the work grows when other people join in.</p>
<p>So the cards do two things. They reach kids whose days are mostly medical, and they get people outside our chapter involved. Raising money for research is still the main job. Showing up for kids in person is part of it too.</p>
`,
  },
  {
    slug: 'how-an-npcf-dollar-travels',
    title: 'How an NPCF dollar travels',
    description: 'Where does a $2 candygram end up? We traced it from a cashbox in the GNS lobby to a pediatric clinical trial.',
    kicker: 'Explainer',
    readTime: '5 min read',
    dek: "A $2 candygram won't fund a clinical trial on its own. This is how it gets pooled with everyone else's money until it can.",
    body: `
<p>When someone hands us $2 for a candygram, it is reasonable to wonder where the $2 actually ends up. Here is what we can trace.</p>
<p>The $2 goes into our table's cashbox, which our treasurer counts at the end of the day and deposits into our chapter account. At the end of the semester, we transfer the total to our NPCF team page at <a href="https://give.nationalpcf.org/team/774854" target="_blank" rel="noopener">give.nationalpcf.org/team/774854</a>. Every dollar we raise passes through that page. We do not take a cut. There is no chapter operating budget that skims off the top. The materials for our events come from members, partner clubs, or small school grants, not from the donations themselves.</p>
<p>From there, NPCF pools our team total with thousands of others and allocates it to its research funding mechanism, most of which runs through the Sunshine Project. The Sunshine Project is a consortium of pediatric cancer research hospitals that share data and co-run clinical trials on cancers too rare to attract industry funding on their own. A single hospital cannot run a trial on 14 kids. Ten hospitals together can.</p>
<p>Most of the money goes to things that look boring on paper and matter a lot in practice. Study coordinators who run the trial day to day. Tissue banks that let researchers compare samples across institutions. Statistical support for small-sample trials, which is harder than it sounds when you cannot just recruit another 5,000 patients to reach significance. The hospitals themselves pay for most of the clinical care, but trial infrastructure, which is what actually lets a new treatment get tested at all, often has to come from outside funding. That is the line item NPCF dollars tend to sit on.</p>
<p>The trial then either works or does not. Most do not. That is how research usually goes, and it is part of why pediatric trials are so expensive on a per kid basis. When one does work, the drug or protocol gets published, other hospitals adopt it, and eventually it becomes the new standard of care. Standards of care do not change because of one donor. They change because a trial crossed its endpoint, and the trial happened because the infrastructure existed, and the infrastructure existed because a few thousand people put $2 into a cashbox somewhere.</p>
<p>It's slower and less photogenic than handing a hospital a giant cardboard check, but it's how new treatments for kids get tested. One candygram won't do that on its own. Years of candygrams from every chapter, pooled with everyone else's donations, can help pay for the trial that does.</p>
`,
  },
  {
    slug: 'pediatric-cancer-is-not-rare',
    title: 'Pediatric cancer is not rare',
    description: 'Pediatric cancer gets called rare a lot. About 10,500 American kids are diagnosed every year, and calling that rare affects how it gets funded.',
    kicker: 'Explainer',
    readTime: '4 min read',
    dek: 'Pediatric cancer gets called rare a lot. About 10,500 American kids are diagnosed every year, and calling that rare affects how it gets funded.',
    body: `
<p>Pediatric cancer gets called rare a lot. The word shows up in news articles, in fundraising decks, in conversations with people who hear what we do and want a polite way to ask why we are spending time on it. The math does not actually support the word. About 10,500 American children are diagnosed with cancer every year. That is a small number compared to adult cancer, but it is not a small number compared to other things that affect kids.</p>
<p>Cancer is the leading cause of death by disease in American children past infancy. Not the leading cause of death overall. That is still accidents. But out of the things that happen inside a child's body and end their life, cancer is at the top of the list. The "rare" framing comes from comparing pediatric cancers to adult cancers, where the numbers really are lopsided. Next to adult cancer, pediatric cancer looks rare. That's the wrong comparison.</p>
<p>This matters because the word "rare" does work in the funding conversation. Rare diseases get rare-disease research budgets. They get rare-disease drug development incentives. They get framed as edge cases that the existing system can address through specialty programs. Pediatric cancer behaves differently. There are at least a dozen distinct cancers under the pediatric umbrella, each with its own biology, each with its own small patient population, and each individually too small for industry to develop drugs for at a scale that makes commercial sense. Calling the whole category "rare" both undersells the burden and oversells the chance that the existing system will quietly solve it.</p>
<p>It also matters at a personal level. Families who get a diagnosis often spend the first weeks of treatment hearing the word "rare" from people who mean well. That word implies a situation that does not happen often, which suggests it is somehow random or unlucky. The actual experience is that pediatric cancer wards exist in every major children's hospital in the country, and the rooms are not empty. Ten thousand families a year is not a fluke.</p>
<p>We use the word "rare" in some of our own materials too, because it is the term that exists. We are slowly trying to swap it for "underfunded relative to incidence." That phrase is uglier and harder to put on a flyer. It is also more accurate.</p>
`,
  },
  {
    slug: 'how-to-start-a-chapter-at-your-school',
    title: 'How to start a chapter at your school',
    description: 'What we did to start our chapter, in order: finding an advisor, picking a board, running a first event, and connecting with NPCF.',
    kicker: 'Playbook',
    readTime: '5 min read',
    dek: 'What we did to start our chapter, in order: finding an advisor, picking a board, running a first event, and connecting with NPCF.',
    body: `
<p>If you want to start a chapter at your school, here is what we did, in the order we did it.</p>
<p>Step one is finding a faculty advisor. Almost every school requires one for any official club, and you cannot run real fundraisers through a school account without one. The advisor does not need to be involved in day-to-day work. They mostly need to sign forms and exist on paper. A teacher who has a personal connection to cancer is usually the easiest yes. Failing that, any science or health teacher tends to be receptive once you show them what we do and who NPCF is.</p>
<p>Step two is the founding board. You need at least three people who actually want to do the work, not just put it on a college application. This part matters more than people admit. A chapter with five committed students will outperform a chapter with twenty casual ones every single time. Pick the people first, figure out roles second.</p>
<p>Step three is your first event. We strongly recommend it be small and easy to win. A bake sale with $40 of supplies that raises $200 is a much better first event than a gala with $400 of supplies that raises $50. The point of the first event is to build the habit of finishing things, not to maximize revenue. Once your team has run one event, the second one is much easier. The third becomes routine.</p>
<p>Step four is the NPCF connection. Once you have a chapter going, message us on Instagram and we will introduce you to NPCF and help you set up your own team page on give.nationalpcf.org. From that point your chapter's money goes through the same pipeline we use, and your totals count toward the national chapter total.</p>
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
