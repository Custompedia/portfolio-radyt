/**
 * SATU-SATUNYA sumber konten situs. Ganti isi file ini dan seluruh halaman ikut
 * berubah — tidak perlu menyentuh markup atau kode animasi.
 *
 * Semua teks di bawah adalah placeholder.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  handle: string;
  age: string;
}

export interface WorkItem {
  title: string;
  blurb: string;
  tags: string[];
  accent: string;
  href: string;
}

export interface Capability {
  title: string;
  body: string;
  icon: string;
}

export interface PricingTier {
  name: string;
  price: string;
  unit?: string;
  intro: string;
  features: string[];
  footnote: string;
  featured?: boolean;
}

export interface Testimonial {
  headline: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const brand = {
  name: 'RADYT',
  symbol: '®',
  role: 'Creative Front-End Developer',
  person: 'Radyt',
  tagline:
    'Working closely with your team to deliver builds that merge creativity, technical excellence, and long-term value.',
  email: 'hello@radyt.dev',
  bookingUrl: 'https://cal.com/',
  social: [
    { label: 'X', href: 'https://x.com/', icon: 'x' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  ],
} as const;

export const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'home' },
  { id: 'about', label: 'About me', href: '#about', icon: 'user' },
  { id: 'work', label: 'Projects', href: '#work', icon: 'briefcase' },
  { id: 'capabilities', label: 'What you get', href: '#capabilities', icon: 'layers' },
  { id: 'services', label: 'Services', href: '#services', icon: 'bolt' },
  { id: 'clients', label: 'Clients', href: '#clients', icon: 'people' },
  { id: 'faq', label: 'FAQ', href: '#faq', icon: 'question' },
];

export const hero = {
  eyebrow: 'The Front-End Expert.',
  eyebrowSecond: "That's Radyt.",
  headline: ['Motion,', 'Applied', 'Differently.'],
  stats: [
    { value: '80', suffix: '+', label: 'Projects' },
    { value: '7', suffix: '+', label: 'Years of experience' },
  ],
  traits: ['Creative', 'Reliable', 'Strategist', 'Builder', 'Efficient'],
  ctaPrimary: { label: 'Book a Call', href: brand.bookingUrl },
  ctaSecondary: { label: 'About Me', href: '#about' },
};

export const stats: Stat[] = [
  { value: '80+', label: 'Projects' },
  { value: '7+', label: 'Years of experience' },
];

export const clients: string[] = [
  'Northwind',
  'Invert',
  'SemiconBio',
  'Happy Ring',
  'Omicron',
  'Puck',
  'Alosant',
  'Lilipad',
  '1910',
];

export const about = {
  label: 'Start small grow big',
  headline: ['About Me (&)', 'My Journey'],
  intro: 'Seven years ago I opened my first code editor. What happened after that is easier to show than explain.',
};

export const timeline: TimelineEntry[] = [
  {
    year: '19',
    title: 'Starting out with a mentor',
    body: 'A friend showed me what a build pipeline actually does. I bothered them with questions for three months straight. They probably regret it.',
    handle: '@mentor',
    age: '7 years ago',
  },
  {
    year: '20',
    title: 'First paying client',
    body: 'A small landing page for a local studio. I charged far too little and learned far too much. Shipped on a Sunday night.',
    handle: '@firstclient',
    age: '6 years ago',
  },
  {
    year: '21',
    title: 'The project that broke me',
    body: 'A data-heavy platform with a schema that kept changing. It taught me to read requirements twice and write abstractions once.',
    handle: '@platform',
    age: '5 years ago',
  },
  {
    year: '22',
    title: 'Falling into motion design',
    body: 'Discovered GSAP and never really came back. Scroll-driven timelines became the thing people started hiring me for.',
    handle: '@motion',
    age: '4 years ago',
  },
  {
    year: '23',
    title: 'Referrals only',
    body: 'Stopped pitching. Every project since has come from someone I already worked with. That changed how I pick work.',
    handle: '@clients',
    age: '3 years ago',
  },
  {
    year: '24',
    title: 'A life-changing year',
    body: 'Life outside the editor got bigger. Suddenly everything I build has a deeper reason behind it.',
    handle: '@family',
    age: '2 years ago',
  },
  {
    year: '26',
    title: 'The journey continues',
    body: 'Seven years in. Still obsessed. Now figuring out where AI tooling actually fits into the craft, and where it does not.',
    handle: '@today',
    age: 'now',
  },
];

export const work = {
  label: 'Selected work',
  headline: ['Built to Last,', 'Made to Perform'],
  intro:
    "Over seven years I've helped teams turn ambitious designs into sites that stay fast, stay maintainable, and keep converting. Here's a look at some of that work.",
  items: [
    {
      title: 'Helios',
      blurb: 'A research platform where every interaction had to survive a scientist reading it twice.',
      tags: ['CMS', 'GSAP', 'API'],
      accent: '#1b2a4a',
      href: '#',
    },
    {
      title: 'SemiconBio',
      blurb: 'Fully realizing the promise of molecular electronics with a platform built for depth.',
      tags: ['CMS', 'API', 'Motion'],
      accent: '#232323',
      href: '#',
    },
    {
      title: 'Happy Ring',
      blurb: 'Accuracy validated to strict standards and all-day comfort exceeding expectations.',
      tags: ['CMS', 'GSAP', 'SEO'],
      accent: '#5b4636',
      href: '#',
    },
    {
      title: 'Northwind',
      blurb: 'Asset and inspection management purpose-built alongside councils for over 35 years.',
      tags: ['CMS', 'GSAP', 'Localization'],
      accent: '#14392c',
      href: '#',
    },
    {
      title: 'Lilipad',
      blurb: 'A children’s library service where the interface had to be readable by a six-year-old.',
      tags: ['CMS', 'Motion'],
      accent: '#3d2c56',
      href: '#',
    },
    {
      title: 'Omicron',
      blurb: 'A studio site that treats the scroll position as the primary storytelling device.',
      tags: ['GSAP', 'WebGL'],
      accent: '#101014',
      href: '#',
    },
    {
      title: 'Puck',
      blurb: 'Talent automation with a dashboard that had to feel instant on a five-year-old laptop.',
      tags: ['Performance', 'API'],
      accent: '#2a2118',
      href: '#',
    },
    {
      title: 'Alosant',
      blurb: 'A resident experience platform rebuilt around one very stubborn design system.',
      tags: ['CMS', 'Design System'],
      accent: '#1f3340',
      href: '#',
    },
    {
      title: 'RAY',
      blurb: 'An AI assistant landing page that ships a demo in the hero and still scores green.',
      tags: ['GSAP', 'Performance'],
      accent: '#241a2e',
      href: '#',
    },
  ] satisfies WorkItem[],
};

export const capabilities = {
  headline: ['What', 'You Get?'],
  label: 'Capabilities overview',
  /** Kata bertanda `[icon]` diganti chip ikon oleh WhatYouGet.astro. */
  paragraph:
    'Strategy, precision, and [chip] development combined - turning [chip] your vision into a powerful digital [chip] experience that feels [chip] effortless.',
  items: [
    {
      title: 'Front-End Development',
      body: 'Semantic, accessible markup and CSS that a future developer can actually read.',
      icon: 'code',
    },
    {
      title: 'Custom Integrations',
      body: 'APIs, CMS, forms, and third-party tools wired up so editors never need a developer.',
      icon: 'plug',
    },
    {
      title: 'SEO-Ready Setup',
      body: 'Structured data, metadata, and a crawlable DOM built in from the first commit.',
      icon: 'search',
    },
    {
      title: 'Creative & Interactive Motion',
      body: 'Scroll-driven timelines that carry the story instead of decorating it.',
      icon: 'spark',
    },
    {
      title: 'Performance & Optimization',
      body: 'Real budgets, measured on real devices, defended over the life of the project.',
      icon: 'gauge',
    },
  ] satisfies Capability[],
};

export const services = {
  label: 'Services',
  headline: ['Solutions', 'That Deliver'],
  intro: 'Same quality, same attention to detail. The only difference is scope and pace.',
  tiers: [
    {
      name: 'Ongoing Support',
      price: '$3,000',
      unit: '/ 30 hours',
      intro: '30 hours a month. Whatever your site needs, handled. Minimum 3 month commitment.',
      features: [
        'New pages, sections, and features',
        'Campaign-driven updates (modules, content blocks, assets)',
        'Maintenance, bug fixes, and content updates',
        'Technical SEO and performance optimization',
        'Unused hours roll over (up to 3 months)',
      ],
      footnote: 'For brands that need continuous growth and long-term collaboration.',
    },
    {
      name: 'Starter Build',
      price: '$5,000',
      intro: 'Everything a small team needs for a solid online presence without the complexity.',
      features: [
        'Up to 6 pages',
        'CMS setup',
        'Mid-level animations and interactions',
        'Technical SEO setup',
        'Launch within one to two weeks',
        'Editor training after launch',
      ],
      footnote: 'For new sites or migrations that need a fast, clean start.',
      featured: true,
    },
    {
      name: 'Custom Project',
      price: 'Book a Call',
      intro: 'High-end development for complex projects. Every scope is different, so every project starts with a conversation.',
      features: [
        'Advanced interaction and animation systems',
        'Scalable CMS architecture with multi-collection setups',
        'Complex layouts, modular components and dynamic content',
        'Integration ready structure for external tools and APIs',
        '14 days post-launch support included',
      ],
      footnote: 'For complex projects that go beyond the basics and need a tailored approach.',
    },
  ] satisfies PricingTier[],
};

export const cta = {
  headline: ['Transform Your', 'Front-End', 'Experience'],
  rotating: ['Experience', 'Journey', 'Roadmap'],
  body: 'Every site has room to grow. You get a free audit of what is slowing yours down and a clear plan for what to fix first.',
  points: ['A recorded walkthrough of your current site', 'Prioritised list of fixes', 'No obligation, no pitch deck'],
};

export const testimonials = {
  label: 'Testimonials',
  headline: ["From People", "I've Worked with"],
  items: [
    {
      headline: 'Trusted long-term collaborator.',
      quote:
        'A fantastic partner to work with and an essential part of our team. Communicates clearly and promptly, and the work consistently exceeds expectations.',
      name: 'Placeholder Name',
      role: 'VP of Marketing',
      company: 'company.com',
    },
    {
      headline: 'Thinks through the entire experience.',
      quote:
        'Does not just write code — thinks through the experience. Motion, pacing, narrative flow: all aligned with technical excellence.',
      name: 'Placeholder Name',
      role: 'Founder',
      company: 'studio.co',
    },
    {
      headline: 'Reliable, sharp, and easy to work with.',
      quote:
        'Great to work with. Delivered on time, gave our designers smarter solutions, and stayed reliable through every revision round.',
      name: 'Placeholder Name',
      role: 'Product Manager',
      company: 'agency.com',
    },
    {
      headline: 'Made our handoff painless.',
      quote:
        'The build matched the design file pixel for pixel, and the documentation meant our internal team could take over immediately.',
      name: 'Placeholder Name',
      role: 'Co-Founder',
      company: 'moat.co',
    },
    {
      headline: 'Solved problems we had not spotted.',
      quote:
        'Flagged three accessibility issues in our design before development even started. That kind of care is rare.',
      name: 'Placeholder Name',
      role: 'Creative Director',
      company: 'legacy.io',
    },
    {
      headline: 'Motion that actually serves the story.',
      quote:
        'Every animation had a reason. Nothing moved just because it could. Our bounce rate dropped in the first month.',
      name: 'Placeholder Name',
      role: 'Product Designer',
      company: 'design.co',
    },
    {
      headline: 'Fast without cutting corners.',
      quote:
        'Turned around a full rebuild in under three weeks and still hit every performance target we set.',
      name: 'Placeholder Name',
      role: 'Founder',
      company: 'see.design',
    },
    {
      headline: 'A genuine technical partner.',
      quote:
        'Pushed back when our brief was wrong, and was right. That saved us a quarter of rework.',
      name: 'Placeholder Name',
      role: 'CEO',
      company: 'autorank.io',
    },
  ] satisfies Testimonial[],
};

export const faq = {
  label: 'FAQ',
  headline: ['Got any', 'questions?'],
  items: [
    {
      question: 'Why Astro instead of a heavier framework?',
      answer:
        'Astro ships zero JavaScript by default, so the only script on the page is the animation engine. That leaves the performance budget for motion instead of hydration.',
    },
    {
      question: 'Do you handle design, or only development?',
      answer:
        'Development is the core service. I work best from an existing design file, but I will happily refine spacing, motion, and responsive behaviour along the way.',
    },
    {
      question: 'Already have a site that needs work?',
      answer:
        'Yes. Audits and incremental improvements are common. I start with a recorded walkthrough of what is slowing the current site down.',
    },
    {
      question: 'What does ongoing support look like?',
      answer:
        'A fixed block of hours each month covering new sections, content updates, bug fixes, and performance work. Unused hours roll over up to three months.',
    },
    {
      question: "What's the process from start to launch?",
      answer:
        'Kick-off call, technical plan, staged builds you can review at any point, then a launch checklist covering SEO, analytics, and accessibility.',
    },
    {
      question: 'How do you handle revisions and feedback?',
      answer:
        'Feedback goes into a single shared list, prioritised together. Two full revision rounds are included in every fixed-scope build.',
    },
    {
      question: 'Do you work under NDA?',
      answer: 'Yes. Send yours over before the kick-off call and I will sign it, or I can provide a standard mutual NDA.',
    },
    {
      question: 'Not sure which plan fits your project?',
      answer:
        'Book a call. If none of the tiers fit, I will tell you that and point you toward what does — including other developers when the fit is better.',
    },
    {
      question: 'Can you work with our existing team?',
      answer:
        'Often the best setup. I can slot into your repo, follow your conventions, and join stand-ups for the duration of the project.',
    },
  ] satisfies FaqItem[],
};

export const footer = {
  headline: 'Have something in mind?',
  body: 'The fastest way to start is a 20 minute call. No pitch deck, no pressure.',
};
