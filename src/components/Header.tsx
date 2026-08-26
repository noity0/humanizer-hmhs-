import React from "react";
import { Sparkles, Search, FileText, BookmarkCheck, Feather, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeTab: "humanize" | "inspector" | "handmade" | "saved";
  setActiveTab: (tab: "humanize" | "inspector" | "handmade" | "saved") => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <Feather className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight font-serif">
                Humanizer<span className="text-amber-400">.Studio</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Anti-AI v3.7
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Convert AI text into authentic human writing & handwritten note files
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-humanize"
            onClick={() => setActiveTab("humanize")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "humanize"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Humanize</span>
          </button>

          <button
            id="nav-tab-inspector"
            onClick={() => setActiveTab("inspector")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "inspector"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>AI Inspector</span>
          </button>

          <button
            id="nav-tab-handmade"
            onClick={() => setActiveTab("handmade")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "handmade"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Handmade Canvas</span>
          </button>

          <button
            id="nav-tab-saved"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "saved"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {savedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
