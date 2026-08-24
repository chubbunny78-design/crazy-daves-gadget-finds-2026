import React, { useState } from 'react';
import { Sparkles, BarChart3, Menu, X, ArrowUpRight, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'catalog' | 'guides' | 'autopilot' | 'seo' | 'compare';
  setActiveTab: (tab: 'catalog' | 'guides' | 'autopilot' | 'seo' | 'compare') => void;
  pinnedCount: number;
  onOpenShoppingAdvisor: () => void;
  onOpenAnalytics: () => void;
  isAutopilotRunning: boolean;
}

export function Header({
  activeTab,
  setActiveTab,
  pinnedCount,
  onOpenShoppingAdvisor,
  onOpenAnalytics,
  isAutopilotRunning
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Deals & Catalog' },
    { id: 'guides', label: 'Buying Guides' },
    { id: 'autopilot', label: 'AI Autopilot' },
    { id: 'seo', label: 'SEO Studio' },
    { id: 'compare', label: pinnedCount > 0 ? `Compare (${pinnedCount})` : 'Compare' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Zone (Single text/wordmark element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-indigo-500 rounded-lg group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              ⚡
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              AffiliPulse<span className="text-indigo-400">.AI</span>
            </span>
          </button>

          {isAutopilotRunning ? (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px]">
              <span className="text-slate-400">Engine Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Optimizing
              </span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px]">
              <span className="text-slate-500">Engine Status:</span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                Standby
              </span>
            </div>
          )}
        </div>

        {/* Nav Links Zone (4-6 single-line links) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Actions Zone (1-2 single-line controls) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenShoppingAdvisor}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-400 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Shopper</span>
          </button>
          
          <button
            onClick={onOpenAnalytics}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            title="Affiliate Network & Earnings Hub"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Affiliate Hub</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenShoppingAdvisor}
            className="p-2 rounded-lg bg-indigo-600 text-white"
            aria-label="Ask AI Shopper"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0D0D0F] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAnalytics();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 flex items-center justify-between"
            >
              <span>Affiliate Earnings & Tags</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
