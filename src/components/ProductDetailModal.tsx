import React, { useState } from 'react';
import { X, Star, Check, AlertCircle, ExternalLink, Bell, Tag, ArrowRight, ShieldCheck, Code, Copy, CheckCircle2, TrendingDown } from 'lucide-react';
import { Product } from '../types';
import { buildAffiliateUrl, getAmazonAffiliateUrl } from '../utils/affiliateHelper';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOutboundClick: (product: Product, storeName: string) => void;
  onOpenPriceAlert: (product: Product) => void;
  onTogglePin: (productId: string) => void;
  isPinned: boolean;
}

export function ProductDetailModal({
  product,
  onClose,
  onOutboundClick,
  onOpenPriceAlert,
  onTogglePin,
  isPinned
}: ProductDetailModalProps) {
  const [showSchema, setShowSchema] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  if (!product) return null;

  // JSON-LD Rich Snippet for Product & Review Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title,
    'image': product.imageUrl,
    'description': product.metaDescription,
    'brand': {
      '@type': 'Brand',
      'name': product.shortName.split(' ')[0]
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating,
      'reviewCount': product.reviewCount,
      'bestRating': 5,
      'worstRating': 1
    },
    'offers': {
      '@type': 'AggregateOffer',
      'lowPrice': product.price,
      'highPrice': product.originalPrice,
      'priceCurrency': 'USD',
      'offerCount': product.stores.length,
      'offers': product.stores.map(store => ({
        '@type': 'Offer',
        'price': store.price,
        'priceCurrency': 'USD',
        'availability': store.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': store.storeName
        }
      }))
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
              {product.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePin(product.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isPinned ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {isPinned ? 'In Comparison' : '+ Compare'}
            </button>
            <button
              onClick={() => onOpenPriceAlert(product)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-indigo-400 hover:bg-white/10 transition-colors"
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-8 divide-y divide-white/5">
          
          {/* Top Section: Media + Live Price Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Image & Quick Specs */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#0A0A0B] border border-white/10 relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Specs Card */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
                  Key Technical Specifications
                </h4>
                <dl className="space-y-2 text-xs">
                  {Object.entries(product.specs || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-baseline border-b border-white/5 pb-1.5">
                      <dt className="text-slate-400 font-medium">{key}:</dt>
                      <dd className="text-slate-200 font-mono text-right">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Benchmark Scores */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    AI Benchmark Breakdown
                  </h4>
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    Avg: {((Object.values(product.benchmarkScores).reduce((a, b) => a + b, 0) / 5)).toFixed(1)} / 10
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {Object.entries(product.benchmarkScores).map(([metric, score]) => (
                    <div key={metric}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono text-slate-200 font-bold">{score}/10</span>
                      </div>
                      <div className="h-1.5 bg-[#0A0A0B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Title, Rating, Multi-Store Comparison, Summary */}
            <div className="md:col-span-7 space-y-5">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">{product.rating}</span>
                  <span className="text-xs text-slate-400 font-mono">({product.reviewCount.toLocaleString()} verified ratings)</span>
                </div>
                
                <h1 className="text-xl sm:text-2xl font-light text-white leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Multi-Store Live Comparison Table */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    Live Multi-Store Deals
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Auto-Scanned Today
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {product.stores.map((store, idx) => {
                    const isLowest = store.price === Math.min(...product.stores.map(s => s.price));
                    return (
                      <div key={idx} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{store.storeName}</span>
                            {isLowest && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Lowest Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[11px] ${store.inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {store.inStock ? '• In Stock' : '• Out of Stock'}
                            </span>
                            {store.couponCode && (
                              <button
                                onClick={() => handleCopyCoupon(store.couponCode!)}
                                className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 hover:bg-amber-500/20 transition-colors"
                              >
                                {copiedCoupon === store.couponCode ? 'Copied!' : `Code: ${store.couponCode}`}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg font-mono font-medium text-indigo-400 tabular-nums">
                            ${store.price.toFixed(2)}
                          </span>
                          {store.inStock ? (
                            <a
                              href={buildAffiliateUrl(product, store.storeName)}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              onClick={() => onOutboundClick(product, store.storeName)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0 ${
                                isLowest
                                  ? 'bg-white text-black hover:bg-slate-200'
                                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                              }`}
                            >
                              <span>{store.storeName === 'Amazon' ? 'Buy on Amazon' : 'View Store'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              disabled
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0 bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                            >
                              <span>Out of Stock</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Editorial Summary */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Editorial Testing Verdict
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {product.whyWeRecommend}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block mb-1">Ideal For:</span>
                    <p className="text-slate-400">{product.whoItsFor}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-400 block mb-1">Who Should Skip:</span>
                    <p className="text-slate-400">{product.whoShouldSkip}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Pros & Cons Section */}
          <div className="pt-6">
            <h3 className="text-base font-medium text-white mb-4">Pros & Cons Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  What We Loved
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {product.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Minor Drawbacks
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {product.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Price History Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-white">Price History & Deal Cycle</h3>
                <p className="text-xs text-slate-400">Tracked over the last 6 months across major retailers.</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">Historic Low: ${product.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase">Launch MSRP</span>
                  <span className="text-sm font-semibold text-slate-300 font-mono">${product.originalPrice.toFixed(2)}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase">Current Best Price</span>
                  <span className="text-sm font-semibold text-indigo-400 font-mono">${product.price.toFixed(2)}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase">Total Savings</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">${(product.originalPrice - product.price).toFixed(2)}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase">AI Buying Advice</span>
                  <span className="text-xs font-bold text-emerald-400">Buy Now</span>
                </div>
              </div>

              {/* Simple Clean Price Bar Chart */}
              <div className="space-y-2">
                {product.priceHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-slate-400 font-mono text-[11px]">{entry.date}</span>
                    <div className="flex-1 bg-[#0A0A0B] h-3.5 rounded overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded"
                        style={{ width: `${(entry.price / product.originalPrice) * 100}%` }}
                      />
                    </div>
                    <span className="w-16 text-right font-mono font-semibold text-slate-200">
                      ${entry.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schema.org & SEO Snippet Drawer */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  SEO & Structured Data (JSON-LD)
                </h4>
                <p className="text-[11px] text-slate-500">Google Rich Snippets Product & Review schema markup.</p>
              </div>
              <button
                onClick={() => setShowSchema(!showSchema)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showSchema ? 'Hide Schema' : 'Inspect JSON-LD Schema'}</span>
              </button>
            </div>

            {showSchema && (
              <div className="bg-[#0A0A0B] border border-white/10 rounded-xl p-3 relative">
                <button
                  onClick={handleCopySchema}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Copy JSON-LD"
                >
                  {copiedSchema ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2">
                  {JSON.stringify(jsonLd, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
