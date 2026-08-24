import React, { useState } from 'react';
import { X, Bell, TrendingDown, Check, Mail, Sparkles } from 'lucide-react';
import { Product, PriceAlert } from '../types';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export function PriceAlertModal({
  product,
  onClose,
  onSaveAlert
}: PriceAlertModalProps) {
  if (!product) return null;

  const defaultTarget = Math.round(product.price * 0.9); // 10% lower
  const [targetPrice, setTargetPrice] = useState<number>(defaultTarget);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      targetPrice,
      currentPrice: product.price,
      userEmail: email,
      createdAt: new Date().toISOString(),
      isTriggered: false
    };

    onSaveAlert(newAlert);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Set AI Price Drop Alert</h3>
              <p className="text-[11px] text-slate-400">Get notified the instant retail prices fall</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-white">Price Alert Configured!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              We will monitor Amazon, Best Buy, and B&H hourly. If the price drops to <strong className="text-white">${targetPrice}</strong>, you will receive an alert at <strong className="text-white">{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Product Summary */}
            <div className="flex items-center gap-3 bg-[#0D0D0F] p-3 rounded-xl border border-white/5">
              <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-[#0A0A0B] border border-white/5 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{product.title}</span>
                <span className="text-xs font-mono text-indigo-400 font-medium">
                  Current Best: ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Target Price input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Notify me when price drops to:
                </label>
                <span className="text-xs font-mono text-emerald-400">
                  Save ${(product.price - targetPrice).toFixed(0)} ({Math.round(((product.price - targetPrice) / product.price) * 100)}% off)
                </span>
              </div>
              
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={product.price}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                {[0.95, 0.90, 0.80].map((ratio) => {
                  const quickPrice = Math.round(product.price * ratio);
                  return (
                    <button
                      type="button"
                      key={ratio}
                      onClick={() => setTargetPrice(quickPrice)}
                      className="px-2.5 py-1 rounded-lg bg-[#0D0D0F] border border-white/5 text-[11px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-mono"
                    >
                      ${quickPrice} ({Math.round((1 - ratio) * 100)}% off)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Track Price Drop</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
