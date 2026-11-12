import React, { useState } from 'react';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeView: 'showcase' | 'dashboard';
  setActiveView: (view: 'showcase' | 'dashboard') => void;
  onOpenRfq: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onOpenRfq }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveView('showcase');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single element Brand wordmark with logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('showcase');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-slate-100 transition-opacity hover:opacity-90"
          >
            {/* Custom geometric Integrity IT Shield Logo */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 ring-1 ring-blue-400/40">
              <Shield className="h-5 w-5 text-white stroke-[2.2]" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-[#090D16]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Integrit
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-blue-400 font-semibold">
                Cloud & Defense
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('live-simulation')}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Live Architecture
          </button>
          <button
            onClick={() => scrollTo('sovereign-cases')}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Sovereign Case Studies
          </button>
          <button
            onClick={() => scrollTo('tech-capabilities')}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            Engineering Stacks
          </button>
          <button
            onClick={() => scrollTo('engineering-advantage')}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            50+ Engineers (Albania Center)
          </button>
          <button
            onClick={() => {
              setActiveView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeView === 'dashboard'
                ? 'text-blue-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Client Portal & RFP
            <span className="text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-1.5 py-0.2">
              Live
            </span>
          </button>
        </nav>

        {/* Zone 3: CTA button (visible on desktop + compact on mobile) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenRfq}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap min-h-[38px]"
          >
            <span className="hidden xs:inline">Request Enterprise RFP</span>
            <span className="xs:hidden">Get RFP</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 lg:hidden border-b border-slate-800 bg-[#090D16] px-5 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1 pb-2 border-b border-slate-800/80">
              <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">
                Tirana Engineering Center · 50+ Architects
              </span>
              <span className="text-xs text-slate-400">
                Mission-critical cloud & defense infrastructure
              </span>
            </div>

            <nav className="space-y-1 text-sm font-medium">
              <button
                onClick={() => scrollTo('live-simulation')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-900 hover:text-blue-400 flex items-center justify-between"
              >
                <span>Live Architecture Simulator</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  Interactive
                </span>
              </button>
              <button
                onClick={() => scrollTo('sovereign-cases')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-900 hover:text-blue-400 flex items-center justify-between"
              >
                <span>Sovereign Case Studies</span>
                <span className="text-[10px] text-slate-400 font-mono">AKSHI & ARRSH</span>
              </button>
              <button
                onClick={() => scrollTo('tech-capabilities')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-900 hover:text-blue-400"
              >
                Engineering Stacks (VMware, Proxmox, LXC, Talos)
              </button>
              <button
                onClick={() => scrollTo('engineering-advantage')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-slate-900 hover:text-blue-400 flex items-center justify-between"
              >
                <span>50+ Engineers (Albania Center)</span>
                <span className="text-[10px] text-emerald-400 font-mono">TCO Calculator</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>Client Portal & RFP Tracker</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 rounded px-1.5 py-0.5">
                  Live Hub
                </span>
              </button>
            </nav>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRfq();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-md hover:bg-blue-500 min-h-[44px]"
              >
                <span>Request Enterprise Proposal</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <div className="text-center text-[11px] font-mono text-slate-500">
                HQ: Tirana, Albania · 24/7 Defense Operations
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
