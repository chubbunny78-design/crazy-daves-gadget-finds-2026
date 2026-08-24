import React, { useState } from 'react';
import { X, DollarSign, MousePointerClick, TrendingUp, Shield, Check, Save, ExternalLink, RefreshCw } from 'lucide-react';
import { AffiliateSettings, Product, ClickRecord } from '../types';

interface AffiliateAnalyticsModalProps {
  onClose: () => void;
  settings: AffiliateSettings;
  setSettings: React.Dispatch<React.SetStateAction<AffiliateSettings>>;
  products: Product[];
  clickRecords: ClickRecord[];
}

export function AffiliateAnalyticsModal({
  onClose,
  settings,
  setSettings,
  products,
  clickRecords
}: AffiliateAnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'tags'>('analytics');
  const [formData, setFormData] = useState<AffiliateSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute stats
  const totalClicks = products.reduce((acc, p) => acc + (p.outClicks || 0), 0) + clickRecords.length;
  const estimatedConversionRate = 0.082; // 8.2% average affiliate conversion
  const avgCommissionPerSale = 24.50;
  const estimatedRevenue = (totalClicks * estimatedConversionRate * avgCommissionPerSale);
  const epc = totalClicks > 0 ? (estimatedRevenue / totalClicks) : 0;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Affiliate Performance & Network Tags</h3>
              <p className="text-[11px] text-slate-400">Manage Amazon Associates, Impact, CJ Partner Tags and telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0A0A0B] border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Earnings Telemetry
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'tags' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Network ID Setup
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'analytics' ? (
            <div className="space-y-6">
              
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0D0D0F] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Outbound Clicks</span>
                  <span className="text-xl sm:text-2xl font-light font-mono text-white">{totalClicks.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1 font-mono">+18% this month</span>
                </div>

                <div className="bg-[#0D0D0F] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">Est. EPC (Earnings/Click)</span>
                  <span className="text-xl sm:text-2xl font-light font-mono text-indigo-400">${epc.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">Industry avg: $1.20</span>
                </div>

                <div className="bg-[#0D0D0F] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">Est. Conversion Rate</span>
                  <span className="text-xl sm:text-2xl font-light font-mono text-indigo-300">8.2%</span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">High-intent traffic</span>
                </div>

                <div className="bg-[#0D0D0F] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">Est. Total Commissions</span>
                  <span className="text-xl sm:text-2xl font-light font-mono text-emerald-400">${estimatedRevenue.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1 font-mono">Simulated 2026</span>
                </div>
              </div>

              {/* Top Performing Converting Products */}
              <div className="bg-[#0D0D0F] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    Highest-Converting Catalog SKUs
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Click-Through Leaderboard</span>
                </div>

                <div className="divide-y divide-white/5">
                  {products.slice(0, 5).map((p, idx) => (
                    <div key={p.id} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono text-slate-500 font-bold">#{idx + 1}</span>
                        <img src={p.imageUrl} alt={p.title} className="w-9 h-9 rounded-lg object-cover bg-[#0A0A0B] border border-white/5 shrink-0" />
                        <div>
                          <span className="font-semibold text-white block truncate max-w-xs">{p.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">${p.price.toFixed(2)} • {p.category}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <span className="font-semibold text-white block">{p.outClicks} clicks</span>
                        <span className="text-emerald-400 font-semibold text-[11px]">
                          ~${(p.outClicks * 0.082 * 24.50).toFixed(0)} est. rev
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Click Telemetry Log */}
              {clickRecords.length > 0 && (
                <div className="bg-[#0D0D0F] border border-white/5 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
                    Recent Outbound Redirect Activity (This Session)
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {clickRecords.slice(0, 5).map(record => (
                      <div key={record.id} className="text-xs font-mono text-slate-300 flex items-center justify-between bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5">
                        <span className="truncate">{record.productTitle} → {record.storeName}</span>
                        <span className="text-emerald-400 font-bold shrink-0 ml-2">+${record.estimatedCommission.toFixed(2)} comm.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Affiliate network credentials saved and synchronized across all dynamic product links!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Amazon Associates Tag (US/Global):
                  </label>
                  <input
                    type="text"
                    value={formData.amazonAssociateId}
                    onChange={(e) => setFormData({ ...formData, amazonAssociateId: e.target.value })}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. affilipulse-20"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Injected into Amazon ASIN outbound URLs</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Impact Radius Partner ID:
                  </label>
                  <input
                    type="text"
                    value={formData.impactPartnerId}
                    onChange={(e) => setFormData({ ...formData, impactPartnerId: e.target.value })}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. impact_pulse_88"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Target, Best Buy, Walmart integration</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CJ Affiliate Publisher ID:
                  </label>
                  <input
                    type="text"
                    value={formData.cjPublisherId}
                    onChange={(e) => setFormData({ ...formData, cjPublisherId: e.target.value })}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. cj_pub_9921"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">B&H Photo and specialized electronics</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cloaked Redirect Prefix:
                  </label>
                  <input
                    type="text"
                    value={formData.cloakedPrefix}
                    onChange={(e) => setFormData({ ...formData, cloakedPrefix: e.target.value })}
                    className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. /go"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Server router redirection path</span>
                </div>

              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Partner Settings</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
