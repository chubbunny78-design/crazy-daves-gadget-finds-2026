import { Info } from 'lucide-react';

export function FtcDisclaimerBanner() {
  return (
    <div className="bg-[#0D0D0F] border-b border-white/5 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <p className="truncate text-[11px] text-slate-400">
            <strong className="text-slate-200 font-medium">FTC Disclosure:</strong> We independently test and audit gear. When you buy through our links, we may earn an affiliate commission at no extra cost to you.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-slate-500 font-mono text-[10px]">
          <span className="text-slate-400">AI Engine: Gemini 3.7 Flash</span>
          <span className="text-white/10">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Autonomous Crawl: Active
          </span>
        </div>
      </div>
    </div>
  );
}

