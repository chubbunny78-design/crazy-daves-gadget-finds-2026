import React from 'react';
import { Search, Sparkles, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  totalProducts: number;
  totalDeals: number;
  onTriggerScout: () => void;
  isScouting: boolean;
}

export function HeroBanner({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalProducts,
  totalDeals,
  onTriggerScout,
  isScouting
}: HeroBannerProps) {
  return (
    <section className="bg-[#0A0A0B] border-b border-white/5 relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Intelligence Pill Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Autonomous Multi-Retailer Sync
            </span>
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-400 font-medium">
              {totalProducts} Verified Products Indexed
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span>{totalDeals} Live Price Drops</span>
            </span>
            <span className="text-white/10">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              100% Unbiased Specs
            </span>
          </div>
        </div>

        {/* Headline & Value Proposition with Elegant typography */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-3 leading-tight">
            Smart <span className="font-semibold italic text-indigo-400">Storefront</span> & Price Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Real-time price tracking across Amazon, Best Buy, and B&H, benchmark-scored hardware specs, and programmatic buying guides powered by autonomous AI.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search headphones, robot vacuums, 4K cameras, laptops..."
              className="w-full bg-[#121214] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={onTriggerScout}
            disabled={isScouting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
          >
            <Sparkles className={`w-4 h-4 ${isScouting ? 'animate-spin' : ''}`} />
            <span>{isScouting ? 'Scouting AI Catalog...' : 'AI Scout New Products'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest shrink-0 mr-1 text-[10px]">
            Niche:
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Gear ({totalProducts})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
