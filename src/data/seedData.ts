import { Product, Article, AutopilotLog, AffiliateSettings } from '../types';
import { FULL_50_PRODUCTS_CATALOG } from './productsCatalog';

export const INITIAL_AFFILIATE_SETTINGS: AffiliateSettings = {
  amazonAssociateId: 'crazdaveaipic-20',
  impactPartnerId: 'impact_pulse_88',
  cjPublisherId: 'cj_pub_9921',
  shareASaleId: 'sas_44321',
  rakutenId: 'rak_7712',
  cloakedPrefix: '/go',
  autopilotFrequency: '6h',
  isAutopilotActive: true,
  autoPublishGuides: true,
  targetNiches: ['Tech & Audio', 'Smart Home & Automation', 'Creator & Office Gear', 'Outdoors & Fitness', 'Gaming & PC Gear', 'Kitchen & Coffee'],
};

export const INITIAL_PRODUCTS: Product[] = FULL_50_PRODUCTS_CATALOG;

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-best-noise-cancelling-headphones-2026',
    title: 'The Best Noise-Cancelling Headphones of 2026: Tested in Flight, Commute, and Office',
    slug: 'best-noise-cancelling-headphones-2026',
    metaDescription: 'We tested 18 top active noise cancelling headphones over 150 hours. Here are the best ANC headphones for travel, work, and pure audio bliss.',
    category: 'Tech & Audio',
    readTime: '7 min read',
    publishedAt: '2026-08-24T08:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    author: {
      name: 'Alex Thorne',
      role: 'Senior Audio & Hardware Editor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    intro: 'Active noise cancellation (ANC) has transformed from an airplane novelty into an essential productivity and wellness tool. Whether you are battling the low hum of jet turbines, the clatter of a crowded subway, or the incessant chatter of an open-plan office, the right pair of headphones provides an instant personal sanctuary.\n\nOver the past six months, our editorial team subjected leading over-ear and in-ear models to standardized decibel isolation benchmarks, binaural frequency analysis, and real-world daily endurance trials.',
    keyTakeaways: [
      'Best Overall: Sony WH-1000XM5 remains unbeatable for raw ANC horsepower and 30-hour battery life.',
      'Best Luxury & Transparency: Apple AirPods Max (USB-C) offers unrivaled industrial design and natural acoustics.',
      'Best Value Runner-Up: Sennheiser Momentum 4 delivers massive 60-hour playback for budget audiophiles.'
    ],
    sections: [
      {
        heading: '1. Why Noise Cancellation Matters More Than Ever in 2026',
        content: 'Modern hybrid work environments and urban density have created higher ambient acoustic pollution than ever. The latest generation of ANC utilizes dual dedicated processors and deep neural network (DNN) machine learning filters that actively adapt to unpredictable speech transients rather than just static low hums.',
      },
      {
        heading: '2. Top Pick Overall: Sony WH-1000XM5',
        content: 'Sony’s eighth iteration of its flagship QN1 audio chip sets the benchmark. During our subway trials on the NYC Lexington line, the WH-1000XM5 attenuated over 28dB of mid-band screeching while preserving crisp dynamic audio separation.',
        featuredProductSnippet: 'Sony WH-1000XM5'
      },
      {
        heading: '3. What to Look For: Frequency Attenuation vs Soundstage',
        content: 'When selecting high-end headphones, do not judge solely by spec sheet battery metrics. Consider clamping force (measured in Newtons), ear-cup heat dissipation, and whether the companion app allows lossless LDAC or aptX Adaptive high-res Bluetooth codec streaming.',
      }
    ],
    buyingCriteria: [
      { title: 'ANC Isolation (dB Reduction)', description: 'Attenuation across low sub-bass (20-100Hz) and human speech mid-band (500-3000Hz).', importance: 'Critical' },
      { title: 'Battery Longevity & Fast Charge', description: 'At least 24+ hours with ANC enabled, plus quick charge for emergency travel.', importance: 'High' },
      { title: 'Ergonomic Clamping Pressure', description: 'Even weight distribution under 280g to prevent skull fatigue over 4+ hours.', importance: 'Critical' },
      { title: 'Multipoint Bluetooth Stability', description: 'Instant seamless handoff between laptop and smartphone without dropped audio.', importance: 'Medium' }
    ],
    faqs: [
      {
        question: 'Is Active Noise Cancellation safe for long-term daily use?',
        answer: 'Yes, ANC uses anti-phase soundwaves to neutralize incoming acoustic waves without emitting hazardous radiation. In fact, by cutting background noise, it allows you to listen to audio at safer, lower volume levels (below 75dB).'
      },
      {
        question: 'Why did the Sony WH-1000XM5 beat the Apple AirPods Max for Best Overall?',
        answer: 'While Apple has unmatched aluminum craftsmanship and transparency, Sony is 35% lighter, offers 10 hours more battery, supports high-res LDAC codecs natively on Android/PC, and costs significantly less.'
      },
      {
        question: 'Do noise cancelling headphones work when powered off or wired?',
        answer: 'Most modern wireless ANC headphones can operate passively via an included 3.5mm auxiliary cable when the battery is depleted, though active noise cancellation circuitry requires battery power.'
      }
    ],
    jsonLdSchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Best Noise-Cancelling Headphones of 2026: Tested in Flight, Commute, and Office",
      "description": "We tested top active noise cancelling headphones over 150 hours. Here are the best ANC headphones for travel, work, and pure audio bliss.",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
      "datePublished": "2026-08-24T08:00:00Z",
      "dateModified": "2026-08-24T09:15:00Z",
      "author": {
        "@type": "Person",
        "name": "Alex Thorne",
        "jobTitle": "Senior Audio & Hardware Editor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AffiliPulse AI",
        "logo": {
          "@type": "ImageObject",
          "url": "https://affilipulse.ai/logo.png"
        }
      }
    }),
    featuredProductIds: ['prod-sony-wh1000xm5', 'prod-apple-airpods-max-usbc']
  },
  {
    id: 'art-smart-home-automation-guide-2026',
    title: 'The Ultimate Smart Home Automation Setup for 2026: Hands-Free Living',
    slug: 'smart-home-automation-guide-2026',
    metaDescription: 'Transform your living space with Matter-compatible robotic vacuums, adaptive circadian lighting, and smart thermostats that cut 20% on energy bills.',
    category: 'Smart Home & Automation',
    readTime: '6 min read',
    publishedAt: '2026-08-23T14:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
    author: {
      name: 'Maya Lin',
      role: 'Smart Living & IoT Specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    },
    intro: 'The promise of the smart home has finally matured from finicky apps and incompatible bridges into universal Matter-over-Thread interoperability. In 2026, automation means routines that trigger seamlessly without voice shouting or manual intervention.',
    keyTakeaways: [
      'Roborock S8 Pro Ultra leads the pack for completely autonomous multi-surface cleaning.',
      'Matter and Thread protocol support ensures future-proof local control even if home internet drops.',
      'Smart climate automation yields verifiable 15-22% reductions in HVAC utility costs.'
    ],
    sections: [
      {
        heading: '1. The Foundation: Matter over Thread Local Hubs',
        content: 'Avoid proprietary walled gardens. By deploying border routers that support Matter 1.3, your door locks, motion sensors, and lighting mesh communicate locally in under 15 milliseconds without round-tripping through cloud servers.',
      },
      {
        heading: '2. Hands-Free Floor Cleaning: The Roborock Revolution',
        content: 'Autonomous floor care has seen the largest evolutionary leap. With warm-air drying docks and dual silicone rollers, machines like the Roborock S8 Pro Ultra eliminate the two biggest friction points of robot vacs: roller hair clogs and smelly mop mildew.',
        featuredProductSnippet: 'Roborock S8 Pro Ultra'
      }
    ],
    buyingCriteria: [
      { title: 'Matter / Local Protocol Support', description: 'Local mesh response without cloud latency or subscription paywalls.', importance: 'Critical' },
      { title: 'True Maintenance Automation', description: 'Auto-emptying, auto-cleaning docks that require intervention less than once a month.', importance: 'High' },
      { title: 'Privacy & Local Encryption', description: 'On-device camera processing with zero unencrypted video streaming to external servers.', importance: 'Critical' }
    ],
    faqs: [
      {
        question: 'Do all smart home devices in 2026 work together across Apple Home, Google Home, and Alexa?',
        answer: 'Yes, any device carrying the certified Matter logo can be paired simultaneously to Apple Home, Google Home, Home Assistant, and Amazon Alexa without proprietary bridges.'
      },
      {
        question: 'How much energy does smart climate control actually save?',
        answer: 'Independent lab tests demonstrate that smart thermostats with presence detection and dynamic occupancy setbacks save an average of $180-$240 annually for typical 2,000 sq ft homes.'
      }
    ],
    jsonLdSchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Ultimate Smart Home Automation Setup for 2026",
      "description": "Transform your living space with Matter-compatible robotic vacuums and adaptive automation.",
      "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
      "datePublished": "2026-08-23T14:30:00Z",
      "author": {
        "@type": "Person",
        "name": "Maya Lin"
      }
    }),
    featuredProductIds: ['prod-roborock-s8-pro-ultra']
  }
];

export const INITIAL_AUTOPILOT_LOGS: AutopilotLog[] = [
  {
    id: 'log-cycle-884',
    timestamp: '2026-08-24T09:30:00Z',
    summary: 'Autonomous cycle scanned 50 merchant endpoints across Tech, Smart Home, Creator, Fitness, Gaming, and Kitchen niches. 3 price drops identified.',
    actionsPerformed: [
      'Crawled Amazon, Best Buy, and B&H Product Graph APIs for 50 monitored SKUs',
      'Detected 25% flash discount on Roborock S8 Pro Ultra ($1599.99 → $1199.99)',
      'Refreshed Sony WH-1000XM5 lowest price badges & affiliate partner query tags',
      'Audited Schema.org JSON-LD markup: 100% valid with 0 rich snippet errors',
      'Synchronized FTC affiliate disclosure notice across all dynamic landing pages'
    ],
    priceUpdates: [
      { productName: 'Roborock S8 Pro Ultra', oldPrice: 1599.99, newPrice: 1199.99, changePercent: -25.0, dealReason: 'Summer Flash Deal & Merchant Coupon' },
      { productName: 'Sony Alpha 7 IV', oldPrice: 2499.99, newPrice: 2298.00, changePercent: -8.1, dealReason: 'Creator Bundle Promotion' },
      { productName: 'Garmin Forerunner 965', oldPrice: 599.99, newPrice: 549.99, changePercent: -8.3, dealReason: 'Endurance Series Sale' }
    ],
    trendingOpportunity: {
      niche: 'Creator & Office Gear',
      searchVolumeSurge: '+142% MoM for "Ergonomic Chairs with Lower Back Support"',
      recommendation: 'Expand Herman Miller and Secretlab lineup with a targeted SEO comparison roundup.'
    },
    generatedArticleIdea: {
      title: 'Top 5 Ergonomic Desk Chairs for Remote Programmers in 2026',
      targetKeywords: ['best desk chair for programmers', 'herman miller vs steelcase', 'lumbar support chair 2026'],
      estimatedMonthlySearchVolume: 38400
    },
    seoHealthScore: 98
  }
];
