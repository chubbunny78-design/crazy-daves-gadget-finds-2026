import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Play, 
  Pause, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Tag, 
  Search, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import { AutopilotLog, AffiliateSettings, Product } from '../types';

interface AutopilotCommandCenterProps {
  settings: AffiliateSettings;
  setSettings: React.Dispatch<React.SetStateAction<AffiliateSettings>>;
  logs: AutopilotLog[];
  onTriggerAutopilotCycle: () => Promise<void>;
  onTriggerProductScout: (niche?: string) => Promise<void>;
  onOpenArticleGenerator: () => void;
  isAutopilotRunning: boolean;
  isActionLoading: boolean;
  totalProductsCount: number;
}

export function AutopilotCommandCenter({
  settings,
  setSettings,
  logs,
  onTriggerAutopilotCycle,
  onTriggerProductScout,
  onOpenArticleGenerator,
  isAutopilotRunning,
  isActionLoading,
  totalProductsCount
}: AutopilotCommandCenterProps) {
  const [selectedNicheForScout, setSelectedNicheForScout] = useState('Tech & Audio');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);

  const availableNiches = [
    'Tech & Audio',
    'Smart Home & Automation',
    'Creator & Office Gear',
    'Outdoors & Fitness',
    'Espresso & Coffee Gear',
    'Minimalist Everyday Carry'
  ];

  const handleToggleNiche = (niche: string) => {
    if (settings.targetNiches.includes(niche)) {
      if (settings.targetNiches.length > 1) {
        setSettings(prev => ({
          ...prev,
          targetNiches: prev.targetNiches.filter(n => n !== niche)
        }));
      }
    } else {
      setSettings(prev => ({
        ...prev,
        targetNiches: [...prev.targetNiches, niche]
      }));
    }
  };

  const latestLog = logs[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              Autonomous Engine
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Gemini 3.7 Flash Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            AI Autopilot <span className="font-semibold italic text-indigo-400">Command Center</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Manages automated product discovery, merchant price scraping, SEO review drafting, and FTC link compliance without manual intervention.
          </p>
        </div>

        {/* Global Autopilot Toggle */}
        <div className="flex items-center gap-3 bg-[#121214] border border-white/10 p-2 rounded-xl">
          <div className="flex items-center gap-2 px-2">
            <span className={`w-2 h-2 rounded-full ${settings.isAutopilotActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs font-semibold text-white font-mono">
              {settings.isAutopilotActive ? 'OPTIMIZING' : 'PAUSED'}
            </span>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, isAutopilotActive: !prev.isAutopilotActive }))}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              settings.isAutopilotActive
                ? 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {settings.isAutopilotActive ? 'Pause Engine' : 'Resume Autopilot'}
          </button>
        </div>
      </div>

      {/* Autonomous AI Agent Fleet Cards */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          Autonomous Sub-Agent Fleet Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Agent 1 */}
          <div className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Search className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Product Scout Agent</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crawls trending hardware releases, analyzes sentiment from 10k+ buyers, and generates technical spec sheets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Catalog Size:</span>
              <strong className="text-slate-200">{totalProductsCount} SKUs</strong>
            </div>
          </div>

          {/* Agent 2 */}
          <div className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Tag className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  POLLING
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Price & Deal Tracker</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitors Amazon, Best Buy, and B&H pricing feeds. Automatically marks historic lows and discount badges.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Frequency:</span>
              <strong className="text-slate-200">Every {settings.autopilotFrequency}</strong>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  RANKING
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">SEO Copywriter</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authors search-optimized buying guides with JSON-LD Schema markup, FAQ accordions, and comparison matrices.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>SEO Health:</span>
              <strong className="text-emerald-400">{latestLog?.seoHealthScore || 98}/100</strong>
            </div>
          </div>

          {/* Agent 4 */}
          <div className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  COMPLIANT
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">FTC & Cloaker Agent</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintains affiliate redirect parameters (`{settings.cloakedPrefix}/...`), checks partner terms, and audits disclaimers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Amazon Tag:</span>
              <strong className="text-slate-200 truncate">{settings.amazonAssociateId}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* Manual Actions & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Instant AI Action Triggers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Manual On-Demand AI Execution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Trigger instant cycles to expand your store catalog or update merchant discounts in real-time.
            </p>

            <div className="space-y-4">
              
              {/* Scout Products Box */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">AI Product Scout & Ingest</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Discovers 3 trending products in selected niche with complete reviews, specs, and merchant links.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Niche:</span>
                    <select
                      value={selectedNicheForScout}
                      onChange={(e) => setSelectedNicheForScout(e.target.value)}
                      className="bg-[#0A0A0B] border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                    >
                      {availableNiches.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => onTriggerProductScout(selectedNicheForScout)}
                  disabled={isActionLoading}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isActionLoading ? 'Scouting...' : 'Scout 3 Products'}</span>
                </button>
              </div>

              {/* Price Drop Cycle Trigger */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">Run Autonomous Market Cycle</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Simulates scheduled scan for price drops, coupon codes, and SEO keyword opportunities.
                  </p>
                </div>

                <button
                  onClick={onTriggerAutopilotCycle}
                  disabled={isActionLoading}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isActionLoading ? 'animate-spin' : ''}`} />
                  <span>{isActionLoading ? 'Running Cycle...' : 'Run Market Scan'}</span>
                </button>
              </div>

              {/* SEO Article Generator Trigger */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-white">Draft SEO Buyer's Guide</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Creates an authoritative, long-form buying guide with rich Schema markup and product roundups.
                  </p>
                </div>

                <button
                  onClick={onOpenArticleGenerator}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generate Article</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Autopilot Schedule & Target Niches */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Autopilot Schedule & Target Niches
            </h3>

            {/* Frequency Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Automated Price Crawl Frequency:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['1h', '6h', '12h', '24h'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSettings(prev => ({ ...prev, autopilotFrequency: freq }))}
                    className={`py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
                      settings.autopilotFrequency === freq
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-[#0D0D0F] border border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Niches Checkboxes */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Active Autopilot Niches:
              </label>
              <div className="space-y-1.5">
                {availableNiches.map((niche) => {
                  const isChecked = settings.targetNiches.includes(niche);
                  return (
                    <button
                      key={niche}
                      onClick={() => handleToggleNiche(niche)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-colors ${
                        isChecked
                          ? 'bg-white/5 border-indigo-500/50 text-white'
                          : 'bg-[#0D0D0F] border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{niche}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto Publish Toggle */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-200 block">Auto-Publish Buying Guides</span>
                <span className="text-[11px] text-slate-500">Publish high-ranking guides without manual approval</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, autoPublishGuides: !prev.autoPublishGuides }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.autoPublishGuides ? 'bg-indigo-600' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.autoPublishGuides ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Live Autopilot Execution Log Terminal */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-[#0D0D0F] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              Live Autonomous Execution Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {logs.length} Records Logged
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {logs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-white/5 transition-colors">
                
                {/* Summary Row */}
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-xs font-medium text-white">
                        {log.summary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      SEO: {log.seoHealthScore}/100
                    </span>
                    <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                      {isExpanded ? 'Collapse' : 'Inspect'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 text-xs animate-in fade-in duration-150">
                    
                    {/* Actions Performed */}
                    <div>
                      <h4 className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-2">
                        Actions Executed by Agents:
                      </h4>
                      <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
                        {log.actionsPerformed.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400">›</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price Updates */}
                    {log.priceUpdates.length > 0 && (
                      <div>
                        <h4 className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-2">
                          Price Adjustments & Discovered Deals:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {log.priceUpdates.map((item, idx) => (
                            <div key={idx} className="bg-[#0D0D0F] border border-white/5 p-3 rounded-xl">
                              <span className="font-semibold text-slate-200 block truncate">{item.productName}</span>
                              <div className="flex items-center gap-2 mt-1 font-mono">
                                <span className="text-slate-500 line-through">${item.oldPrice.toFixed(2)}</span>
                                <span className="text-indigo-400 font-bold">${item.newPrice.toFixed(2)}</span>
                                <span className="text-emerald-400 text-[10px]">({item.changePercent}%)</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-1">{item.dealReason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Opportunity */}
                    {log.trendingOpportunity && (
                      <div className="bg-[#0D0D0F] border border-white/5 p-3 rounded-xl flex items-start gap-3">
                        <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-200 block">
                            Market Surge: {log.trendingOpportunity.niche} ({log.trendingOpportunity.searchVolumeSurge})
                          </span>
                          <p className="text-slate-400 mt-0.5">{log.trendingOpportunity.recommendation}</p>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
