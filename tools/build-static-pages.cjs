const fs = require("fs");

const arrowSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>';

const navItems = [
  ["about", "About", "about.html"],
  ["programs", "Programs", "programs.html"],
  ["events", "Events", "events.html"],
  ["partners", "Partners", "partners.html"],
  ["donate", "Donate", "donate.html"],
  ["access", "Access", "accessibility.html"],
  ["contact", "Contact", "contact.html"]
];

function button(label, href, variant = "primary") {
  return `<a class="button ${variant}" href="${href}">${label}${arrowSvg}</a>`;
}

function header(current) {
  const nav = navItems.map(([key, label, href]) => {
    const currentAttr = current === key ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${currentAttr}>${label}</a></li>`;
  }).join("\n          ");

  return `<a class="skip-link" href="#main">Skip to main content</a>

  <div class="utility" aria-label="Site utilities">
    <div class="container utility-inner">
      <span>A Mission of Stability</span>
      <div class="utility-links">
        <a href="index.html#swahili">Kiswahili</a>
        <a href="index.html#easy-read">Easy Read</a>
        <button type="button" id="easyToggle" aria-pressed="false">Readable</button>
        <button type="button" id="quickExit" class="quick-exit">Quick exit</button>
      </div>
    </div>
  </div>

  <div class="brand-band" aria-hidden="true"><span></span><span></span><span></span><span></span></div>

  <header class="site-header">
    <div class="container nav-row">
      <a class="brand" href="index.html" aria-label="MDSK home">
        <img src="brand/logo/mdsk-emblem.svg" width="58" height="54" alt="" />
        <span class="brand-mark">
          <strong>MDSK</strong>
          <span>Men with Disabilities Society of Kenya</span>
        </span>
      </a>

      <button class="icon-button menu-button" id="menuToggle" type="button" aria-expanded="false" aria-controls="primaryNav" aria-label="Open menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>

      <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
        <ul>
          ${nav}
        </ul>
      </nav>

      <div class="a11y-controls" role="group" aria-label="Accessibility display controls">
        <button class="icon-button" type="button" id="fontDown" aria-label="Decrease text size" title="Decrease text size">A-</button>
        <button class="icon-button" type="button" id="fontUp" aria-label="Increase text size" title="Increase text size">A+</button>
        <button class="icon-button" type="button" id="contrastToggle" aria-label="Toggle high contrast" aria-pressed="false" title="High contrast">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /></svg>
        </button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="footer-brand">
          <img src="brand/logo/mdsk-emblem.svg" width="48" height="44" alt="" />
          <strong>MDSK</strong>
        </div>
        <p>Men with Disabilities Society of Kenya. Rights, dignity, inclusion, and full participation.</p>
      </div>
      <div>
        <p>&copy; <span id="year"></span> Men with Disabilities Society of Kenya. Built to prioritize accessibility, speed, consent, and dignity.</p>
      </div>
    </div>
  </footer>`;
}

function pageHero(page) {
  const img = page.heroImage;
  const imageClass = img.className ? ` class="${img.className}"` : "";
  return `<section class="page-hero" aria-labelledby="page-title">
      <picture>
        <source srcset="${img.webp}" type="image/webp" />
        <img${imageClass} src="${img.fallback}" width="${img.width}" height="${img.height}" alt="${img.alt}" fetchpriority="high" />
      </picture>
      <div class="container page-hero-content">
        <span class="eyebrow">${page.eyebrow}</span>
        <h1 id="page-title">${page.heading}</h1>
        <p class="page-intro">${page.intro}</p>
        ${page.actions ? `<div class="hero-actions">${page.actions}</div>` : ""}
      </div>
    </section>`;
}

function shell(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${page.description}" />
  <title>${page.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/mdsk.css" />
</head>
<body>
  ${header(page.current)}

  <main id="main">
    ${pageHero(page)}
    ${page.content}
  </main>

  ${footer()}

  <script src="assets/mdsk.js"></script>
</body>
</html>
`;
}

const pages = [
  {
    file: "about.html",
    current: "about",
    title: "About MDSK - Men with Disabilities Society of Kenya",
    description: "Learn about MDSK's mission, vision, values, leadership, and rights-based work for men and boys with disabilities and caregivers in Kenya.",
    eyebrow: "Who we are",
    heading: "A rights movement built by the people closest to the barriers.",
    intro: "MDSK is a national membership organization advancing dignity, inclusion, leadership, health, livelihoods, and equal participation for boys and men with disabilities and their caregivers across Kenya.",
    heroImage: {
      webp: "assets/optimized/boardroom-hats-1400.webp",
      fallback: "assets/optimized/boardroom-hats-1400.webp",
      width: "1733",
      height: "1153",
      alt: "MDSK members in branded hats meeting around a boardroom table",
      className: "image-focus-boardroom"
    },
    actions: `${button("See programs", "programs.html", "gold")}${button("Contact MDSK", "contact.html", "secondary")}`,
    content: `<section class="section">
      <div class="container split">
        <div class="copy-stack">
          <span class="eyebrow">Mandate</span>
          <h2>Disability inclusion, told from the inside.</h2>
          <p>MDSK addresses social, economic, educational, health, and leadership barriers through advocacy, awareness creation, capacity strengthening, strategic partnerships, and community-based support.</p>
          <p>The organization provides a safe platform for boys and men with disabilities and their caregivers to voice experience and aspiration, including on GBV, SRHR, HIV, mental health, psychosocial wellbeing, economic empowerment, inclusive education, caregiving support, and leadership development.</p>
        </div>
        <aside class="statement" aria-label="MDSK vision and mission">
          <strong>Vision</strong>
          <p>A society where boys and men with disabilities and their caregivers live with dignity, equality, inclusion, and full participation in all spheres of life.</p>
          <strong>Mission</strong>
          <p>To empower boys and men with disabilities and their caregivers in Kenya through advocacy, capacity building, inclusive education, economic empowerment, leadership development, partnerships, and access to inclusive services for sustainable development and social justice.</p>
        </aside>
      </div>
      <div class="container value-grid" aria-label="Core values">
        <div class="value"><span>Integrity</span><p>Transparent advocacy that honors member trust.</p></div>
        <div class="value"><span>Respect</span><p>Dignity-first language, imagery, and public engagement.</p></div>
        <div class="value"><span>Accountability</span><p>Clear commitments to members, caregivers, communities, and partners.</p></div>
        <div class="value"><span>Inclusivity</span><p>Participation across disability, language, location, and income barriers.</p></div>
        <div class="value"><span>Empathy</span><p>Support shaped by lived experience, trauma awareness, and practical care.</p></div>
        <div class="value"><span>Collaboration</span><p>Systems change through government, OPDs, CSOs, health actors, and media.</p></div>
        <div class="value"><span>Excellence</span><p>Accessible work delivered with discipline and high standards.</p></div>
      </div>
    </section>
    <section class="section work-band">
      <div class="container leadership">
        <figure class="leader-card">
          <picture>
            <source srcset="assets/optimized/benson-isaboke-redhat-720.webp" type="image/webp" />
            <img class="image-focus-face" src="assets/optimized/benson-isaboke-redhat-720.webp" width="720" height="720" loading="lazy" alt="Portrait of Benson Isaboke wearing a red hat and MDSK shirt" />
          </picture>
          <div>
            <h3>Benson Isaboke</h3>
            <p>Chairperson, MDSK</p>
          </div>
        </figure>
        <div class="copy-stack">
          <span class="eyebrow">Leadership and identity</span>
          <h2>The hats stay because they carry meaning.</h2>
          <p>Across MDSK's own photography, the hats mark presence in boardrooms, health forums, media briefings, community campaigns, and national advocacy spaces. They are not decoration. They are recognition, solidarity, and a public signature.</p>
          <p>This site keeps that identity intact: the emblem remains faithful, the photography is documentary, and members are presented as civic actors rather than charity subjects.</p>
        </div>
      </div>
    </section>`
  },
  {
    file: "programs.html",
    current: "programs",
    title: "Programs - MDSK",
    description: "Explore MDSK's strategic programs across rights, health, education, livelihoods, leadership, caregiving support, and partnerships.",
    eyebrow: "Programs",
    heading: "Six strategic objectives, one national inclusion mandate.",
    intro: "MDSK's work connects policy advocacy with practical support, member voice, health access, livelihoods, leadership, caregiver dignity, and institutional partnerships.",
    heroImage: {
      webp: "assets/optimized/hiv-ksl-podium-1100.webp",
      fallback: "assets/optimized/hiv-ksl-podium-1100.webp",
      width: "1733",
      height: "1153",
      alt: "A speaker addresses a disability-inclusive health and HIV response event while a Kenyan Sign Language interpreter signs beside the podium",
      className: "image-focus-ksl"
    },
    actions: `${button("Partner on programs", "partners.html", "gold")}${button("Ask MDSK Guide", "index.html#guide", "secondary")}`,
    content: `<section class="section work-band">
      <div class="container work-grid">
        <article class="work-card" style="--accent: var(--navy)"><span class="number">1</span><h3>Human rights and inclusion</h3><p>Protect rights, combat stigma and GBV, and make public systems disability-responsive.</p></article>
        <article class="work-card" style="--accent: var(--green)"><span class="number">2</span><h3>Health and psychosocial wellbeing</h3><p>Advance SRHR, HIV response, mental health, referral pathways, and accessible healthcare.</p></article>
        <article class="work-card" style="--accent: var(--gold)"><span class="number">3</span><h3>Inclusive education and skills</h3><p>Open equitable learning, vocational training, digital skills, and opportunity access.</p></article>
        <article class="work-card" style="--accent: var(--green)"><span class="number">4</span><h3>Economic empowerment</h3><p>Support entrepreneurship, workplace reintegration, financial inclusion, and livelihoods.</p></article>
        <article class="work-card" style="--accent: var(--red)"><span class="number">5</span><h3>Leadership and governance</h3><p>Develop civic participation, member leadership, and representation in decision-making.</p></article>
        <article class="work-card" style="--accent: var(--black)"><span class="number">6</span><h3>Partnerships and networking</h3><p>Coordinate government, OPDs, CSOs, development partners, academia, media, and private sector action.</p></article>
      </div>
    </section>
    <section class="section">
      <div class="container content-grid">
        <article class="content-panel"><h3>Rights, safety, and referral pathways</h3><p>Advocacy includes disability-responsive handling of GBV, SRHR, HIV, mental health, psychosocial wellbeing, neglect, stigma, discrimination, and violence.</p></article>
        <article class="content-panel"><h3>Family Inclusion and dignity supplies</h3><p>The Baba Diaper, Mama Diaper, and Tota Diaper campaign links caregiving, incontinence support, dignity supplies, and practical household realities.</p></article>
        <article class="content-panel"><h3>Skills and livelihoods</h3><p>Programs promote vocational skills, digital skills, entrepreneurship, financial inclusion, workplace reintegration, and social protection.</p></article>
        <article class="content-panel"><h3>Systems access</h3><p>MDSK advocates for accessible healthcare, education, governance, employment, transport, public infrastructure, and inclusive service design.</p></article>
      </div>
    </section>
    <section class="section tight">
      <div class="container action-strip">
        <div>
          <span class="eyebrow">Program coordination</span>
          <h2>Bring a serious partner table to the work.</h2>
          <p>Strong collaborations include health access, caregiving support, disability data, inclusive employment, KSL access, GBV/SRHR/HIV response, and member leadership.</p>
        </div>
        ${button("Start a partnership", "partners.html", "gold")}
      </div>
    </section>`
  },
  {
    file: "events.html",
    current: "events",
    title: "Events - MDSK",
    description: "MDSK events and public platforms including the National Conference 2025, World AIDS Day walk, International Men's Day, and health inclusion advocacy.",
    eyebrow: "Public platforms",
    heading: "Events that move disability inclusion into national rooms.",
    intro: "MDSK uses conferences, health forums, media spaces, walks, and partner convenings to make the realities of men and boys with disabilities visible in policy and public life.",
    heroImage: {
      webp: "assets/optimized/members-families-1000.webp",
      fallback: "assets/optimized/members-families-1000.webp",
      width: "1600",
      height: "1064",
      alt: "MDSK members, families, and supporters gathered for a group photograph",
      className: "image-focus-group"
    },
    actions: `${button("Contact event team", "contact.html", "gold")}${button("Support the next platform", "donate.html", "secondary")}`,
    content: `<section class="section">
      <div class="container content-grid">
        <div class="content-panel">
          <span class="eyebrow">Documented platforms</span>
          <h2>From conference halls to street advocacy.</h2>
          <ul class="timeline-list">
            <li><time datetime="2025-11-17">17-19 November 2025</time><strong>National Conference 2025</strong><span>AFRALTI and KISE, Nairobi. Theme: advancing rights, dignity, and inclusion of men and boys with disabilities and their caregivers.</span></li>
            <li><time datetime="2025-11-19">19 November 2025</time><strong>World Men's Day conference</strong><span>KISE platform for public visibility, partners, media, and the caregiving inclusion agenda.</span></li>
            <li><time>World AIDS Day walk</time><strong>Public health visibility</strong><span>Street-level advocacy connecting HIV response, disability inclusion, and member voice.</span></li>
            <li><time>2026</time><strong>Health Integration Summit engagement</strong><span>MDSK representation in wider Ministry of Health inclusion conversations.</span></li>
          </ul>
        </div>
        <figure class="media-panel">
          <picture>
            <source srcset="assets/optimized/chairperson-media-900.webp" type="image/webp" />
            <img class="image-focus-face" src="assets/optimized/chairperson-media-900.webp" width="1733" height="1153" loading="lazy" alt="Benson Isaboke speaks to journalists during a media interview" />
          </picture>
          <div><h3>Media as access infrastructure</h3><p>Press moments extend the conversation beyond the room and help normalize disability inclusion in national discourse.</p></div>
        </figure>
      </div>
    </section>
    <section class="section work-band">
      <div class="container content-grid">
        <article class="content-panel"><h3>What makes an MDSK event credible</h3><ul class="feature-list"><li><strong>KSL and access visibility</strong><span>Interpreters and inclusive participation should be visible where possible.</span></li><li><strong>Member voice</strong><span>Men with disabilities and caregivers shape the platform, not just attend it.</span></li><li><strong>Partner accountability</strong><span>Government, OPDs, health actors, and CSOs leave with concrete next steps.</span></li></ul></article>
        <article class="content-panel"><h3>Event opportunities</h3><p>MDSK can collaborate on conferences, policy roundtables, health inclusion forums, disability data conversations, media briefings, caregiver dignity campaigns, and community outreach.</p><div class="hero-actions">${button("Discuss an event", "contact.html", "primary")}</div></article>
      </div>
    </section>`
  },
  {
    file: "partners.html",
    current: "partners",
    title: "Partners - MDSK",
    description: "Partner with MDSK across health, accessibility, caregiver support, disability rights, employment, research, media, and inclusive public systems.",
    eyebrow: "Partners and networks",
    heading: "Institutional credibility, community truth, and shared action.",
    intro: "MDSK works with public agencies, OPDs, civil society, development partners, health institutions, media, and private sector actors to turn inclusion from language into systems.",
    heroImage: {
      webp: "assets/optimized/kcm-disability-team-900.webp",
      fallback: "assets/optimized/kcm-disability-team-900.webp",
      width: "1733",
      height: "1153",
      alt: "KCM Disability Constituency team members gathered for a Global Fund disability inclusion engagement",
      className: "image-focus-group-top"
    },
    actions: `${button("Start a partnership", "mailto:info@menwdsocietyk.org", "gold")}${button("See programs", "programs.html", "secondary")}`,
    content: `<section class="section work-band">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Partner landscape</span>
          <h2>Networks already visible in the MDSK evidence base.</h2>
        </div>
        <ul class="partner-list" aria-label="Partners and networks">
          <li>NCPWD</li><li>NSDCC</li><li>Ministry of Health</li><li>CBM Global</li>
          <li>Kenya Society for the Blind</li><li>Consolation East Africa</li><li>Riziki Source</li><li>British High Commission</li>
          <li>CDPOK</li><li>NGEC</li><li>UDPK</li><li>Sight of Relief</li>
          <li>Soft Dream Bays</li><li>Nairobi City County</li><li>National Special Programme</li><li>Media partners</li>
        </ul>
      </div>
    </section>
    <section class="section">
      <div class="container content-grid">
        <article class="content-panel"><h3>Best-fit collaboration areas</h3><ul class="feature-list"><li><strong>Health access</strong><span>Disability-responsive HIV, SRHR, mental health, psychosocial, and referral pathways.</span></li><li><strong>Caregiver dignity</strong><span>Family Inclusion, dignity supplies, caregiver support, and household-level barriers.</span></li><li><strong>Livelihoods and employment</strong><span>Skills, digital access, entrepreneurship, workplace reintegration, and inclusive hiring.</span></li><li><strong>Accessibility and communication</strong><span>KSL access, Easy Read, Kiswahili, digital inclusion, and public information design.</span></li></ul></article>
        <article class="content-panel"><h3>What partners can bring</h3><p>Technical expertise, funding, public-sector reach, inclusive service delivery, research, data, training, media access, assistive technology, venue access, transport support, and employment pathways.</p><div class="hero-actions">${button("Email MDSK", "mailto:info@menwdsocietyk.org", "primary")}</div></article>
      </div>
    </section>`
  },
  {
    file: "donate.html",
    current: "donate",
    title: "Donate - MDSK",
    description: "Support MDSK through M-Pesa Paybill 522533, Account 1344899730, and help fund disability inclusion, caregiving support, advocacy, and access.",
    eyebrow: "Donate",
    heading: "Fund dignity, access, and member-led advocacy.",
    intro: "Your support helps MDSK advance rights, caregiving dignity, health access, livelihoods, leadership, public education, and practical inclusion for men and boys with disabilities and their caregivers.",
    heroImage: {
      webp: "assets/optimized/members-families-1000.webp",
      fallback: "assets/optimized/members-families-1000.webp",
      width: "1600",
      height: "1064",
      alt: "MDSK members, families, and supporters gathered for a group photograph",
      className: "image-focus-group"
    },
    actions: `${button("Contact for receipts", "contact.html", "gold")}${button("Partner with MDSK", "partners.html", "secondary")}`,
    content: `<section class="section">
      <div class="container split">
        <div class="donation-feature" aria-label="MDSK donation details">
          <span class="eyebrow">M-Pesa donation details</span>
          <h2>Send support directly to MDSK.</h2>
          <dl>
            <dt>Paybill</dt><dd>522533</dd>
            <dt>Account</dt><dd>1344899730</dd>
          </dl>
          <p>Confirm the account name as Men With Disabilities Society of Kenya before completing the transaction.</p>
        </div>
        <div class="copy-stack">
          <span class="eyebrow">What donations support</span>
          <h2>Practical inclusion needs practical resources.</h2>
          <ul class="feature-list">
            <li><strong>Advocacy and public platforms</strong><span>Policy engagement, media visibility, conferences, and member-led public education.</span></li>
            <li><strong>Caregiver dignity</strong><span>Family Inclusion work, dignity supplies, referrals, and psychosocial support pathways.</span></li>
            <li><strong>Access costs</strong><span>KSL access, Easy Read material, transport support, assistive access, and accessible communication.</span></li>
            <li><strong>Skills and livelihoods</strong><span>Training, entrepreneurship, digital access, and inclusive employment pathways.</span></li>
          </ul>
          <figure class="media-panel portrait-media">
            <picture>
              <source srcset="assets/optimized/family-inclusion-760.webp" type="image/webp" />
              <img class="image-focus-portrait" src="assets/optimized/family-inclusion-760.webp" width="1067" height="1600" loading="lazy" alt="Family Inclusion campaign team members standing together in branded shirts in Nairobi" />
            </picture>
            <div><h3>Family Inclusion</h3><p>Caregiving, dignity supplies, and practical support remain visible without forcing a portrait image into a wide hero crop.</p></div>
          </figure>
        </div>
      </div>
    </section>
    <section class="section work-band">
      <div class="container content-grid">
        <article class="content-panel"><h3>Institutional giving</h3><p>Organizations can support targeted programs, events, accessibility production, caregiver dignity campaigns, health inclusion, research, or member leadership. Email MDSK to align the donation with the right program pathway.</p>${button("Email MDSK", "mailto:info@menwdsocietyk.org", "primary")}</article>
        <article class="content-panel"><h3>Donation care</h3><p>MDSK's site should never pressure a person in crisis to disclose private details. For personal safety, health, GBV, SRHR, HIV, mental health, or urgent support issues, contact MDSK directly when it is safe.</p>${button("Contact MDSK", "contact.html", "secondary")}</article>
      </div>
    </section>`
  },
  {
    file: "accessibility.html",
    current: "access",
    title: "Accessibility - MDSK",
    description: "MDSK accessibility statement covering keyboard navigation, high contrast, readable mode, Kiswahili, Easy Read, Kenyan Sign Language placeholders, and quick exit.",
    eyebrow: "Accessibility",
    heading: "Access is not a feature. It is the standard.",
    intro: "This site is designed for fast loading, keyboard use, readable content, high contrast, reduced motion, future KSL video summaries, Kiswahili architecture, and trauma-informed quick-exit patterns.",
    heroImage: {
      webp: "assets/optimized/hiv-cane-interpreter-900.webp",
      fallback: "assets/optimized/hiv-cane-interpreter-900.webp",
      width: "1733",
      height: "1153",
      alt: "A speaker using a cane addresses a health event while a Kenyan Sign Language interpreter signs nearby",
      className: "image-focus-ksl-left"
    },
    actions: `${button("Use MDSK Guide", "index.html#guide", "gold")}${button("Report an access issue", "contact.html", "secondary")}`,
    content: `<section class="section">
      <div class="container content-grid">
        <article class="content-panel"><h3>Current access features</h3><ul class="feature-list"><li><strong>Keyboard navigation</strong><span>Skip link, semantic landmarks, visible focus, and no drag-only interactions.</span></li><li><strong>Readable display controls</strong><span>Text-size controls, high contrast, readable mode, and strong line-height defaults.</span></li><li><strong>Reduced motion</strong><span>Motion respects user preferences and avoids aggressive parallax or auto-zoom effects.</span></li><li><strong>Data-frugal imagery</strong><span>Optimized WebP assets reduce load for mobile visitors.</span></li></ul></article>
        <article class="content-panel"><h3>Language and format roadmap</h3><ul class="feature-list"><li><strong>Kiswahili</strong><span>The site architecture supports bilingual English and Kiswahili content.</span></li><li><strong>Easy Read</strong><span>Plain-language routes help visitors understand the same mission with lower cognitive load.</span></li><li><strong>Kenyan Sign Language</strong><span>Key pages are ready for KSL video summaries once clips are supplied.</span></li><li><strong>Guide support</strong><span>The MDSK Guide keeps common questions local and avoids sensitive data capture.</span></li></ul></article>
      </div>
    </section>
    <section class="section work-band">
      <div class="container split">
        <div class="copy-stack">
          <span class="eyebrow">Sensitive pathways</span>
          <h2>Trauma-informed access for GBV, SRHR, HIV, mental health, and safety questions.</h2>
          <p>Sensitive pages and guide responses should keep data collection minimal, avoid tracking personal disclosures, and keep the quick-exit control visible. The guide is not an emergency, medical, or legal service.</p>
        </div>
        <aside class="statement">
          <strong>Quick exit</strong>
          <p>The quick-exit button sends the visitor away from the site immediately. It is visible in the utility bar on every page.</p>
          <strong>Access issue?</strong>
          <p>Email info@menwdsocietyk.org with the page, device, browser, and barrier encountered.</p>
        </aside>
      </div>
    </section>`
  },
  {
    file: "contact.html",
    current: "contact",
    title: "Contact - MDSK",
    description: "Contact Men with Disabilities Society of Kenya for membership, partnerships, donations, media, events, accessibility, or program coordination.",
    eyebrow: "Contact",
    heading: "Reach MDSK directly.",
    intro: "For membership, partnerships, donations, media, events, accessibility, caregiver support, or program coordination, use the direct channels below.",
    heroImage: {
      webp: "assets/optimized/chairperson-media-900.webp",
      fallback: "assets/optimized/chairperson-media-900.webp",
      width: "1733",
      height: "1153",
      alt: "Benson Isaboke speaks to journalists during a media interview",
      className: "image-focus-face"
    },
    actions: `${button("Email MDSK", "mailto:info@menwdsocietyk.org", "gold")}${button("Call office", "tel:+254739000171", "secondary")}`,
    content: `<section class="section">
      <div class="container content-grid">
        <article class="content-panel">
          <h2>Direct channels</h2>
          <ul class="contact-methods">
            <li><strong>Office</strong><span>Kenbanco House, Moi Avenue, Nairobi<br />P.O. Box 56984-00200, Nairobi</span></li>
            <li><strong>Email</strong><span><a href="mailto:info@menwdsocietyk.org">info@menwdsocietyk.org</a><br /><a href="mailto:menwdsocietyk@gmail.com">menwdsocietyk@gmail.com</a></span></li>
            <li><strong>Phone</strong><span><a href="tel:+254739000171">+254 739 000 171</a><br /><a href="tel:+254782131112">+254 782 131 112</a><br /><a href="tel:+254736535796">+254 736 535 796</a></span></li>
            <li><strong>Social</strong><span><a href="https://facebook.com/profile.php?id=61569322708590">Facebook</a><br /><a href="https://www.youtube.com/@menwdsocietyk">YouTube</a></span></li>
          </ul>
        </article>
        <article class="content-panel">
          <h2>Best route by need</h2>
          <ul class="feature-list">
            <li><strong>Membership or caregiver support</strong><span>Call or email with your county, support need, and safest contact method.</span></li>
            <li><strong>Partnerships and institutions</strong><span>Email the program area, proposed contribution, timeline, and contact person.</span></li>
            <li><strong>Media</strong><span>Use email first, then call the office line for urgent interview coordination.</span></li>
            <li><strong>Donations</strong><span>Use the Paybill on the donate page and email MDSK for formal follow-up.</span></li>
          </ul>
          <div class="hero-actions">${button("Donation details", "donate.html", "primary")}${button("Partner page", "partners.html", "secondary")}</div>
        </article>
      </div>
    </section>`
  }
];

for (const page of pages) {
  fs.writeFileSync(page.file, shell(page));
  console.log(`Wrote ${page.file}`);
}
