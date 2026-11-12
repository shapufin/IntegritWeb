'use client';

import React, { useState } from 'react';
import {
  Building2,
  Server,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { CASE_STUDIES } from '../data/mockData';
import { CaseStudy } from '../types';

interface SovereignProofProps {
  onOpenRfq: () => void;
}

export const SovereignProof: React.FC<SovereignProofProps> = ({ onOpenRfq }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>('akshi-sovereign-cloud');
  const [selectedDeepDive, setSelectedDeepDive] = useState<CaseStudy | null>(null);

  const currentCase = CASE_STUDIES.find((c) => c.id === activeCaseId) || CASE_STUDIES[0];

  return (
    <section id="sovereign-cases" className="relative w-full py-16 sm:py-20 lg:py-28 border-t border-slate-800/80 bg-[#070b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
            <span>Sovereign Proof of Execution</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">National Government & Enterprise Scale</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Engineered For National Sovereignty. Delivered For Enterprise Scale.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            When national agencies require defense against cyber warfare and zero-downtime availability for millions of citizens, they engage Integrit. We bring this identical level of technical rigor to global mid-market and enterprise infrastructure.
          </p>
        </div>

        {/* Case Study Switcher Tabs */}
        <div className="mt-10 flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
          {CASE_STUDIES.map((cs) => {
            const isActive = cs.id === activeCaseId;
            return (
              <button
                key={cs.id}
                onClick={() => setActiveCaseId(cs.id)}
                className={`flex items-center gap-2 min-h-11 sm:min-h-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-blue-500 text-white bg-slate-900/60 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Building2 className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{cs.clientName.split(' ')[0]}</span>
                <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                  ({cs.clientType.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Spotlight */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0b111c] p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                  <span>{currentCase.clientType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{currentCase.clientName}</span>
                </div>
                <h3 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display">
                  {currentCase.tagline}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {currentCase.summary}
                </p>
              </div>

              {/* Challenge vs Solution Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    <span>The Technical Challenge</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentCase.challenge}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Integrit Engineering Delivery</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentCase.solution}
                  </p>
                </div>
              </div>

              {/* Verified Technical Stack Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Mission Architecture & Deployment Stack
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Virtualization Tier</span>
                    <span className="text-slate-200 font-medium">{currentCase.hypervisorStack}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Container & Storage</span>
                    <span className="text-slate-200 font-medium">{currentCase.containerStack}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Network & Perimeter</span>
                    <span className="text-slate-200 font-medium">{currentCase.securityStack}</span>
                  </div>
                </div>
              </div>

              {/* Verified Testimonial Quote */}
              {currentCase.testimonial && (
                <div className="border-l-2 border-blue-500 pl-4 py-1 text-slate-300 italic text-sm">
                  "{currentCase.testimonial.quote}"
                  <div className="mt-2 text-xs font-normal text-slate-400 not-italic font-mono">
                    <span className="text-white font-medium">{currentCase.testimonial.author}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{currentCase.testimonial.title}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quantitative Proof Metrics (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <FileCheck2 className="h-4 w-4 text-blue-400" />
                  <span>Audited Performance KPIs</span>
                </div>

                <div className="space-y-4">
                  {currentCase.metrics.map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-xs font-semibold text-blue-400">{metric.label}</div>
                      <div className="text-[11px] text-slate-400 leading-normal">
                        {metric.context}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedDeepDive(currentCase)}
                    className="min-h-11 sm:min-h-0 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600/15 border border-blue-500/30 px-4 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <span>View Architecture Blueprint</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Architecture Blueprint Modal */}
      {selectedDeepDive && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedDeepDive(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-[#0c121e] p-6 sm:p-8 shadow-2xl text-left space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase">
                  Technical Architecture Specification
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedDeepDive.clientName}
                </h3>
                <p className="text-xs text-slate-400">{selectedDeepDive.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedDeepDive(null)}
                className="max-sm:inline-flex max-sm:min-h-11 max-sm:min-w-11 max-sm:items-center max-sm:justify-center text-slate-400 hover:text-white text-lg p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">Full Stack Integration Detail</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Virtualization Fabric:</strong>{' '}
                      {selectedDeepDive.hypervisorStack} with zero-downtime vMotion/Live-Migration and automated host quorum fencing.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Container & Storage Engine:</strong>{' '}
                      {selectedDeepDive.containerStack} enforcing immutable read-only rootfs and API-driven cluster reconciliations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Network Security Perimeter:</strong>{' '}
                      {selectedDeepDive.securityStack} state synchronization, BGP EVPN dampening, and Suricata intrusion mitigation.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Security Clearance</span>
                  <span className="text-slate-200 font-semibold">NATO / EU Accredited Standards</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Engineering Delivery Location</span>
                  <span className="text-slate-200 font-semibold">Tirana, Albania (CET Timezone)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedDeepDive(null)}
                className="min-h-11 sm:min-h-0 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedDeepDive(null);
                  onOpenRfq();
                }}
                className="min-h-11 sm:min-h-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Request Similar Architecture for Your Company
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
