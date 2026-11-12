'use client';

import React, { useState } from 'react';
import {
  Users,
  Clock,
  Award,
  Globe2,
  DollarSign,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

interface EngineeringTeamAdvantageProps {
  onOpenRfq: () => void;
}

export const EngineeringTeamAdvantage: React.FC<EngineeringTeamAdvantageProps> = ({ onOpenRfq }) => {
  const [engineersCount, setEngineersCount] = useState<number>(3);
  const [supportTier, setSupportTier] = useState<'standard' | 'mission_critical'>('mission_critical');

  // Realistic annual benchmark math for US tech leadership
  // US Senior Infrastructure/SRE/SecOps architect: ~$225k base + 25% benefits = ~$280k/yr
  // Integrit Dedicated Senior Architect Pod: ~$115k/yr equivalent
  const usAnnualRatePerEngineer = supportTier === 'mission_critical' ? 290000 : 250000;
  const integritAnnualRatePerEngineer = supportTier === 'mission_critical' ? 120000 : 98000;

  const totalUsCost = engineersCount * usAnnualRatePerEngineer;
  const totalIntegritCost = engineersCount * integritAnnualRatePerEngineer;
  const annualSavings = totalUsCost - totalIntegritCost;
  const savingsPercent = Math.round((annualSavings / totalUsCost) * 100);

  return (
    <section id="engineering-advantage" className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-slate-800/80 bg-[#070b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
            <span>50+ Dedicated Infrastructure Architects</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Tirana Engineering Center</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            The Strategic Engineering Advantage for Enterprise Leadership
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our company houses over 50 senior hypervisor engineers, kernel specialists, and network architects. We bridge European defense-grade compliance with seamless 24/7 enterprise operational coverage.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e]/80 p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Global Timezone Alignment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based in CET (UTC+1). Our engineers actively collaborate across international morning and afternoon cycles, ensuring real-time standups, incident triage, and 24/7 emergency response.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121e]/80 p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sovereign & NATO Standards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proven on mission-critical Albanian national security contracts (AKSHI, ARRSH). Every engineer adheres to strict ISO 27001, SOC 2, and air-gapped zero-trust hygiene.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121e]/80 p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Senior-Only Roster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero junior handoffs. Our 50+ staff average 8.8+ years in bare-metal hypervisors (VMware/Proxmox), Linux kernels (Talos OS), and advanced BGP routing fabrics.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121e]/80 p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">40–55% TCO Reduction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive elite-tier architectural execution without the astronomical overhead of domestic contractor agencies or the communication friction of disconnected teams.
            </p>
          </div>
        </div>

        {/* Interactive Cost & ROI Calculator for Enterprise Leadership */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-[#0b111c] p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Calculator Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                  Interactive TCO Comparison Tool
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
                  In-House Enterprise Overhead vs Integrit Dedicated Pod Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Model your annual budget savings comparing typical in-house enterprise staffing overhead against a dedicated Integrit engineering pod in Tirana.
                </p>
              </div>

              {/* Number of Architects Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">
                    Dedicated Senior Infrastructure Architects:
                  </span>
                  <span className="font-mono text-blue-400 font-bold text-base">
                    {engineersCount} {engineersCount === 1 ? 'Architect' : 'Architects'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={engineersCount}
                  onChange={(e) => setEngineersCount(parseInt(e.target.value, 10))}
                  className="w-full max-sm:h-11 accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1 Architect</span>
                  <span>4 Architects Pod</span>
                  <span>8 Full Cluster Squad</span>
                </div>
              </div>

              {/* Support Level Buttons */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">
                  Operational Coverage & SLA Tier:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSupportTier('standard')}
                    className={`min-h-11 sm:min-h-0 px-3 py-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                      supportTier === 'standard'
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 ring-1 ring-blue-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>Standard Architecture</div>
                    <div className="text-[10px] text-slate-500 font-normal">Business Hours Overlap</div>
                  </button>
                  <button
                    onClick={() => setSupportTier('mission_critical')}
                    className={`min-h-11 sm:min-h-0 px-3 py-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                      supportTier === 'mission_critical'
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 ring-1 ring-blue-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>24/7 Mission-Critical SecOps</div>
                    <div className="text-[10px] text-slate-500 font-normal">15-min Emergency SLA</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Metrics Display (6 cols) */}
            <div className="lg:col-span-6 rounded-xl border border-slate-800/90 bg-slate-950/80 p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-mono block">
                    In-House Engineering (Est.)
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-400 line-through tabular-nums mt-1">
                    ${totalUsCost.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 not-line-through">/yr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Includes full-time enterprise staffing & overhead
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-blue-400 uppercase font-mono block">
                    Integrit Dedicated Pod
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums mt-1">
                    ${totalIntegritCost.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">/yr</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    Sovereign-cleared senior engineers
                  </div>
                </div>
              </div>

              {/* Total Savings Highlight */}
              <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/30 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400 block font-semibold">
                    Net Projected Annual Savings
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                    ${annualSavings.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Capital Efficiency</span>
                  <span className="text-lg font-bold font-mono text-white">
                    +{savingsPercent}% Saved
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenRfq}
                  className="min-h-11 sm:min-h-0 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
                >
                  <span>Build Custom Engineering Proposal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
