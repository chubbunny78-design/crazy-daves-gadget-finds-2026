import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  Copy, 
  Smartphone, 
  Monitor, 
  FileCode, 
  ExternalLink, 
  ShieldCheck, 
  Star, 
  Tag, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, Article, AffiliateSettings } from '../types';

interface SeoStudioProps {
  products: Product[];
  articles: Article[];
  settings: AffiliateSettings;
}

export function SeoStudio({ products, articles, settings }: SeoStudioProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'snippets' | 'schema' | 'sitemap' | 'compliance'>('snippets');

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Dynamic JSON-LD for selected product
  const jsonLdPayload = selectedProduct ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': selectedProduct.title,
    'image': [selectedProduct.imageUrl],
    'description': selectedProduct.metaDescription,
    'sku': selectedProduct.id,
    'brand': {
      '@type': 'Brand',
      'name': selectedProduct.shortName.split(' ')[0]
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': selectedProduct.rating,
      'reviewCount': selectedProduct.reviewCount,
      'bestRating': '5',
      'worstRating': '1'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'lowPrice': selectedProduct.price,
      'highPrice': selectedProduct.originalPrice,
      'priceCurrency': 'USD',
      'offerCount': selectedProduct.stores.length,
      'offers': selectedProduct.stores.map(s => ({
        '@type': 'Offer',
        'price': s.price,
        'priceCurrency': 'USD',
        'availability': s.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'url': `https://affilipulse.ai/go/${selectedProduct.id}/${s.storeName.toLowerCase()}`,
        'seller': {
          '@type': 'Organization',
          'name': s.storeName
        }
      }))
    }
  } : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://affilipulse.ai/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${products.map(p => `  <url>
    <loc>https://affilipulse.ai/products/${p.id}</loc>
    <lastmod>${p.lastUpdated.split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
${articles.map(a => `  <url>
    <loc>https://affilipulse.ai/guides/${a.slug}</loc>
    <lastmod>${a.publishedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5" />
              SEO Engine & Schema Studio
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Rich Results Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Search Engine <span className="font-semibold italic text-indigo-400">Optimization Hub</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Simulate Google search rankings, audit Schema.org structured JSON-LD data, generate live XML sitemaps, and enforce FTC compliance.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-[#121214] border border-white/10 p-1 rounded-xl">
          {[
            { id: 'snippets', label: 'SERP Preview' },
            { id: 'schema', label: 'JSON-LD Schema' },
            { id: 'sitemap', label: 'XML Sitemap' },
            { id: 'compliance', label: 'FTC Disclosures' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: SERP Snippet Preview */}
      {activeTab === 'snippets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Select Product for SERP Audit
              </h3>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {products.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      p.id === selectedProduct.id
                        ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 font-semibold'
                        : 'bg-[#0D0D0F] border border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{p.shortName}</span>
                    <span className="text-[11px] font-mono shrink-0 ml-2 font-medium">${p.price.toFixed(0)}</span>
                  </button>
                ))}
              </div>

              {/* Viewport device toggle */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Device Rendering:</span>
                <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 ${deviceView === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 ${deviceView === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Keyword Density Score */}
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
                High-Intent Search Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.seoKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] bg-[#0D0D0F] border border-white/5 text-slate-300 font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Google SERP Simulation Container */}
          <div className="lg:col-span-8">
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-indigo-400" />
                  Live Google SERP Rich Snippet Simulation
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  CTR Boost: +38% with Rich Stars & Pricing
                </span>
              </div>

              {/* SERP Card Box */}
              <div className={`mx-auto bg-[#0A0A0B] text-[#bdc1c6] p-5 rounded-2xl font-sans border border-white/10 ${deviceView === 'mobile' ? 'max-w-md shadow-2xl' : 'w-full'}`}>
                
                {/* Breadcrumb Hierarchy */}
                <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] mb-1">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">⚡</span>
                  <span className="font-medium text-[#dadce0]">AffiliPulse AI</span>
                  <span>›</span>
                  <span>products</span>
                  <span>›</span>
                  <span className="truncate">{selectedProduct.category.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>

                {/* Google Blue Link Title */}
                <h3 className="text-lg sm:text-xl font-normal text-[#8ab4f8] hover:underline cursor-pointer leading-snug mb-1">
                  {selectedProduct.title} - Tested & In-Depth Review (2026)
                </h3>

                {/* Rich Snippet Stars + Price + In-Stock Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#bdc1c6] mb-2 font-sans">
                  <div className="flex items-center text-[#fbbc04]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#e8eaed]">Rating: {selectedProduct.rating}/5</span>
                  <span className="text-[#9aa0a6]">·</span>
                  <span className="text-[#9aa0a6]">{selectedProduct.reviewCount.toLocaleString()} reviews</span>
                  <span className="text-[#9aa0a6]">·</span>
                  <span className="text-[#81c995] font-bold">${selectedProduct.price.toFixed(2)}</span>
                  <span className="text-[#9aa0a6]">·</span>
                  <span className="text-[#81c995]">In stock</span>
                </div>

                {/* Meta Description Snippet */}
                <p className="text-sm text-[#bdc1c6] leading-relaxed">
                  {selectedProduct.metaDescription}
                </p>

                {/* Sitelinks Extension Simulation */}
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">Multi-Store Price Comparison</span>
                    <span className="text-[#9aa0a6] text-[11px]">Compare Amazon, Best Buy, and B&H</span>
                  </div>
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">Lab Testing & Verdict</span>
                    <span className="text-[#9aa0a6] text-[11px]">Who should buy vs who should skip</span>
                  </div>
                </div>

              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-[#0D0D0F] border border-white/5 text-xs text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  This preview incorporates Google Schema.org <code className="text-indigo-300">Product</code>, <code className="text-indigo-300">AggregateRating</code>, and <code className="text-indigo-300">AggregateOffer</code> tags, matching standard search crawler specifications.
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 2: JSON-LD Schema Inspector */}
      {activeTab === 'schema' && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-medium text-white">
                Valid Schema.org JSON-LD for "{selectedProduct.shortName}"
              </h3>
              <p className="text-xs text-slate-400">
                Ready for Google Search Console & Schema Markup Validator tests.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(JSON.stringify(jsonLdPayload, null, 2))}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Schema Code'}</span>
              </button>
            </div>
          </div>

          <pre className="bg-[#0A0A0B] border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px]">
            {JSON.stringify(jsonLdPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab 3: XML Sitemap */}
      {activeTab === 'sitemap' && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-medium text-white">
                Autonomous XML Sitemap (sitemap.xml)
              </h3>
              <p className="text-xs text-slate-400">
                Automatically generated with priority weights and lastmod timestamps for all catalog products and guides.
              </p>
            </div>

            <button
              onClick={() => handleCopy(xmlSitemap)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied Sitemap!' : 'Copy XML Sitemap'}</span>
            </button>
          </div>

          <pre className="bg-[#0A0A0B] border border-white/10 rounded-xl p-4 text-xs font-mono text-indigo-300 overflow-x-auto max-h-[500px]">
            {xmlSitemap}
          </pre>
        </div>
      )}

      {/* Tab 4: FTC Compliance */}
      {activeTab === 'compliance' && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-medium text-white flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              FTC Affiliate Compliance & Legal Disclosure Rules
            </h3>
            <p className="text-xs text-slate-400">
              AffiliPulse AI automatically embeds compliant affiliate disclosures before any outbound merchant links as mandated by FTC 16 CFR Part 255.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                1. Above-The-Fold Placement
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Disclosures are rendered in the top header and immediately before pricing tables, ensuring users are informed prior to clicking outbound tracking tags.
              </p>
            </div>

            <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                2. Rel Attributes
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All outbound merchant redirects specify <code className="text-indigo-300">rel="sponsored nofollow noopener"</code> to adhere to Google search webmaster guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
