import React from 'react';
import { X, Check, Star, ExternalLink, ArrowRight, Layers, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ComparisonMatrixModalProps {
  pinnedProducts: Product[];
  onClose: () => void;
  onRemovePinned: (id: string) => void;
  onClearAllPinned: () => void;
  onSelectProduct: (product: Product) => void;
  onOutboundClick: (product: Product, storeName: string) => void;
}

export function ComparisonMatrixModal({
  pinnedProducts,
  onClose,
  onRemovePinned,
  onClearAllPinned,
  onSelectProduct,
  onOutboundClick
}: ComparisonMatrixModalProps) {
  if (pinnedProducts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md p-6 text-center shadow-2xl">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Products Pinned for Comparison</h3>
          <p className="text-xs text-slate-400 mb-5">
            Click the compare icon on any 2 to 4 products in the catalog to generate a side-by-side AI matrix.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  // Collect all unique specs keys
  const allSpecKeys = Array.from(
    new Set(pinnedProducts.flatMap(p => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Side-by-Side Product Comparison ({pinnedProducts.length} items)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAllPinned}
              className="px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto p-5 sm:p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-indigo-400 w-44 shrink-0">
                  Feature / Spec
                </th>
                {pinnedProducts.map(p => (
                  <th key={p.id} className="p-3 min-w-[220px] max-w-[280px] align-top">
                    <div className="relative bg-[#0D0D0F] border border-white/5 rounded-xl p-3 space-y-3">
                      <button
                        onClick={() => onRemovePinned(p.id)}
                        className="absolute top-2 right-2 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="aspect-16/10 rounded-lg overflow-hidden bg-[#0A0A0B] border border-white/5">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase block w-max mb-1 tracking-wider">
                          {p.badge}
                        </span>
                        <h4 
                          onClick={() => {
                            onClose();
                            onSelectProduct(p);
                          }}
                          className="text-xs font-semibold text-white hover:text-indigo-400 cursor-pointer line-clamp-2"
                        >
                          {p.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-base font-medium font-mono text-indigo-400">
                          ${p.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => onOutboundClick(p, p.stores[0]?.storeName || 'Amazon')}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Get Deal</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              
              {/* Overall AI Rating */}
              <tr>
                <td className="p-3 font-medium text-slate-400 bg-white/5">AI Verdict Score</td>
                {pinnedProducts.map(p => (
                  <td key={p.id} className="p-3 font-mono font-bold text-emerald-400">
                    {p.benchmarkScores.performance}/10 ({p.rating} ★)
                  </td>
                ))}
              </tr>

              {/* Who It's For */}
              <tr>
                <td className="p-3 font-medium text-slate-400 bg-white/5">Ideal For</td>
                {pinnedProducts.map(p => (
                  <td key={p.id} className="p-3 text-slate-300">
                    {p.whoItsFor}
                  </td>
                ))}
              </tr>

              {/* Top Advantage */}
              <tr>
                <td className="p-3 font-medium text-slate-400 bg-white/5">Key Strength</td>
                {pinnedProducts.map(p => (
                  <td key={p.id} className="p-3 text-slate-300">
                    <span className="text-emerald-400 font-bold mr-1">✓</span>
                    {p.pros[0]}
                  </td>
                ))}
              </tr>

              {/* Dynamic Specs Rows */}
              {allSpecKeys.map(specKey => (
                <tr key={specKey}>
                  <td className="p-3 font-medium text-slate-400 bg-white/5">{specKey}</td>
                  {pinnedProducts.map(p => (
                    <td key={p.id} className="p-3 text-slate-200 font-mono">
                      {p.specs?.[specKey] || '—'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Benchmark Sub-scores */}
              <tr>
                <td className="p-3 font-medium text-slate-400 bg-white/5">Build Quality</td>
                {pinnedProducts.map(p => (
                  <td key={p.id} className="p-3 font-mono text-slate-200">
                    {p.benchmarkScores.buildQuality}/10
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400 bg-white/5">Value for Money</td>
                {pinnedProducts.map(p => (
                  <td key={p.id} className="p-3 font-mono text-slate-200">
                    {p.benchmarkScores.valueForMoney}/10
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
