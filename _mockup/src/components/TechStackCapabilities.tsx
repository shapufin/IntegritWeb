import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Shield,
  Layers,
  ArrowRight,
  Terminal,
  Check,
  Radio,
  FileCode,
} from 'lucide-react';
import { TECHNICAL_CAPABILITIES } from '../data/mockData';

interface TechStackCapabilitiesProps {
  onOpenRfq: () => void;
}

export const TechStackCapabilities: React.FC<TechStackCapabilitiesProps> = ({ onOpenRfq }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const activeCategory = TECHNICAL_CAPABILITIES[activeTab];

  return (
    <section id="tech-capabilities" className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-slate-800/80 bg-[#090d16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
            <span>Specialized Engineering Domains</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Hardened Enterprise Stacks</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Deep Technical Command Across Hypervisors, Immutable OS & Networks
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We do not rely on standard out-of-the-box configurations. Integrit deploys tuned, high-throughput kernel parameters, custom eBPF filters, and resilient multi-hypervisor clusters designed for extreme stability.
          </p>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TECHNICAL_CAPABILITIES.map((cat, idx) => {
            const isSelected = idx === activeTab;
            const getIcon = () => {
              switch (idx) {
                case 0:
                  return <Server className="h-4 w-4" />;
                case 1:
                  return <Cpu className="h-4 w-4" />;
                case 2:
                  return <Shield className="h-4 w-4" />;
                case 3:
                  return <Layers className="h-4 w-4" />;
                default:
                  return <Server className="h-4 w-4" />;
              }
            };

            return (
              <button
                key={cat.domain}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-slate-900/95 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'border-slate-800 bg-[#0c121e]/70 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {getIcon()}
                </div>
                <span className="mt-3 text-sm font-bold text-white leading-tight">
                  {cat.domain}
                </span>
                <span className="mt-1 text-xs text-slate-400 line-clamp-1">
                  {cat.headline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Domain Expanded View */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0b111c] p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                  Engineering Scope 0{activeTab + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-display">
                  {activeCategory.headline}
                </h3>
              </div>
              <button
                onClick={onOpenRfq}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 w-fit"
              >
                <span>Request Scope Consultation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              {activeCategory.description}
            </p>

            {/* Skill Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {activeCategory.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {skill.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Technical Verification Highlights */}
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Terminal className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Need a VMware-to-Proxmox Migration or Talos K8s Hardening?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Our architects benchmark and deploy proof-of-concept clusters in isolated staging environments before touching production workloads.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRfq}
                className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
              >
                Book Technical Discovery Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
