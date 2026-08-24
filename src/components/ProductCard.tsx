import React from 'react';
import { Star, Check, ExternalLink, Bell, Layers, Tag } from 'lucide-react';
import { Product } from '../types';
import { getAmazonAffiliateUrl } from '../utils/affiliateHelper';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onSelectProduct: (product: Product) => void;
  onTogglePin: (productId: string) => void;
  isPinned: boolean;
  onOpenPriceAlert: (product: Product) => void;
  onOutboundClick: (product: Product, storeName: string) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  onTogglePin,
  isPinned,
  onOpenPriceAlert,
  onOutboundClick
}: ProductCardProps) {
  // Find lowest price store
  const availableStores = product.stores.filter(s => s.inStock);
  const lowestStore = availableStores.length > 0
    ? availableStores.reduce((prev, curr) => curr.price < prev.price ? curr : prev, availableStores[0])
    : product.stores[0];

  const amazonUrl = getAmazonAffiliateUrl(product);

  const savings = product.originalPrice > product.price 
    ? Math.round(product.originalPrice - product.price)
    : 0;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-[#121214] border border-white/5 hover:border-white/15 rounded-2xl p-4 flex flex-col justify-between group transition-all duration-200">
      
      {/* Top Image & Badge Header */}
      <div>
        <div 
          className="relative bg-[#0A0A0B] rounded-xl aspect-16/10 overflow-hidden cursor-pointer mb-3.5"
          onClick={() => onSelectProduct(product)}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214]/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
              {product.badge}
            </span>
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/90 text-black shadow-sm">
                Save ${savings} ({discountPercent}%)
              </span>
            )}
          </div>

          {/* Action icons overlay */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPriceAlert(product);
              }}
              className="p-1.5 rounded-lg bg-[#0A0A0B]/80 border border-white/10 backdrop-blur-md text-slate-300 hover:text-indigo-400 hover:bg-[#121214] transition-colors"
              title="Set Price Drop Alert"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(product.id);
              }}
              className={`p-1.5 rounded-lg border backdrop-blur-md transition-colors ${
                isPinned
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-[#0A0A0B]/80 border-white/10 text-slate-300 hover:text-white hover:bg-[#121214]'
              }`}
              title={isPinned ? 'Remove from comparison' : 'Add to side-by-side comparison'}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Pill */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-[10px] font-medium text-slate-300 bg-[#0A0A0B]/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
              {product.category}
            </span>
          </div>
        </div>

        {/* Rating & Performance Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-500 font-mono">({product.reviewCount.toLocaleString()})</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-400">
            Score: {product.benchmarkScores.performance}/10
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="text-base font-medium text-white group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer mb-1.5 leading-snug"
        >
          {product.title}
        </h3>

        {/* AI Summary Snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {product.summary}
        </p>

        {/* Top Pros Highlights */}
        <ul className="space-y-1 mb-4">
          {product.pros.slice(0, 2).map((pro, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="truncate">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing & CTA Zone */}
      <div className="pt-3 border-t border-white/5">
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-xl font-semibold text-indigo-400 font-mono tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-slate-500 line-through font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {lowestStore && (
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Lowest on</span>
              <span className="text-xs font-medium text-slate-300">{lowestStore.storeName}</span>
            </div>
          )}
        </div>

        {/* Dual Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelectProduct(product)}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-colors text-center truncate"
          >
            Review Specs
          </button>
          <a
            href={amazonUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => onOutboundClick(product, 'Amazon')}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center truncate"
          >
            <span>Get Deal</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>

        {/* Coupon alert if present */}
        {lowestStore?.couponCode && (
          <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 rounded-md py-1">
            <Tag className="w-3 h-3" />
            <span>Use code: <strong>{lowestStore.couponCode}</strong></span>
          </div>
        )}
      </div>

    </div>
  );
}
