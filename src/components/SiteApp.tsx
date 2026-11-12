/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSimulation } from '@/components/HeroSimulation';
import { SovereignProof } from '@/components/SovereignProof';
import { TechStackCapabilities } from '@/components/TechStackCapabilities';
import { EngineeringTeamAdvantage } from '@/components/EngineeringTeamAdvantage';
import { ClientDashboard } from '@/components/ClientDashboard';
import { RfqContactSection } from '@/components/RfqContactSection';
import { Footer } from '@/components/Footer';
import { INITIAL_CLIENT_INQUIRIES } from '@/data/mockData';
import { ClientInquiry } from '@/types';
import { X, ShieldCheck, Activity } from 'lucide-react';

export default function SiteApp() {
  const [activeView, setActiveView] = useState<'showcase' | 'dashboard'>('showcase');
  const [inquiries, setInquiries] = useState<ClientInquiry[]>(INITIAL_CLIENT_INQUIRIES);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleInquiryCreated = (newInquiry: ClientInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
    setToastMessage(`Inquiry ${newInquiry.rfpNumber} has been logged to your Client Portal!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const scrollToSection = (id: string) => {
    setActiveView('showcase');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 max-sm:inline-flex max-sm:min-h-11 max-sm:min-w-11 max-sm:items-center max-sm:justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Header adhering to Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenRfq={() => scrollToSection('rfp-contact')}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'showcase' ? (
          <>
            {/* 1. Hero with Real-Time Traffic & DDoS Simulation */}
            <HeroSimulation
              onOpenRfq={() => scrollToSection('rfp-contact')}
              onExploreCaseStudies={() => scrollToSection('sovereign-cases')}
            />

            {/* 2. Sovereign Case Studies (AKSHI, ARRSH, Private FinTech) */}
            <SovereignProof onOpenRfq={() => scrollToSection('rfp-contact')} />

            {/* 3. Specialized Capabilities (VMware, Proxmox, Talos OS, pfSense, Cisco) */}
            <TechStackCapabilities onOpenRfq={() => scrollToSection('rfp-contact')} />

            {/* 4. The 50+ Albanian Engineering Powerhouse & Enterprise Cost Calculator */}
            <EngineeringTeamAdvantage onOpenRfq={() => scrollToSection('rfp-contact')} />

            {/* 5. Seamless Lead Generation / RFP Submission Engine */}
            <RfqContactSection
              onInquiryCreated={handleInquiryCreated}
              onViewInDashboard={() => {
                setActiveView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          /* Client Operations Portal & RFP Tracking Dashboard */
          <ClientDashboard
            inquiries={inquiries}
            onOpenNewRfq={() => {
              scrollToSection('rfp-contact');
            }}
            onBackToShowcase={() => {
              setActiveView('showcase');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Mobile Floating Quick Action Dock */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-40 flex items-center justify-between gap-1.5 p-1.5 rounded-2xl border border-slate-700/80 bg-[#090D16]/95 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => {
            scrollToSection('live-simulation');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 min-h-11 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeView === 'showcase'
              ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Simulator</span>
        </button>

        <button
          onClick={() => {
            setActiveView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 min-h-11 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
            activeView === 'dashboard'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Portal</span>
        </button>

        <button
          onClick={() => scrollToSection('rfp-contact')}
          className="flex-1 flex items-center justify-center gap-1 min-h-11 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/30 hover:bg-blue-500"
        >
          <span>Get RFP</span>
        </button>
      </div>

      {/* Global Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenDashboard={() => {
          setActiveView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRfq={() => scrollToSection('rfp-contact')}
      />
    </div>
  );
}
