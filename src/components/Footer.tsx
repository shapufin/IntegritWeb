'use client';

import React from 'react';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenDashboard: () => void;
  onOpenRfq: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDashboard, onOpenRfq }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#060910] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Integrit
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Integrit delivers high-availability virtualization, immutable Kubernetes, and zero-trust perimeter defense for enterprises. Proven across sovereign government institutions and international banking cores.
            </p>

            <div className="space-y-1 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>HQ: Bulevardi Dëshmorët e Kombit, Tirana, Albania</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>US Liaison: One World Trade Center, New York, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>contact@integrit.al · enterprise-us@integrit.al</span>
              </div>
            </div>
          </div>

          {/* Column 1: Core Technologies */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Core Technologies
            </div>
            <ul className="space-y-2">
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('tech-capabilities')}>
                  VMware vSphere & vSAN
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('tech-capabilities')}>
                  Proxmox VE HA Clusters
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('tech-capabilities')}>
                  Talos Linux Immutable K8s
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('tech-capabilities')}>
                  pfSense HA CARP Failover
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('tech-capabilities')}>
                  Cisco Nexus 9000 Fabrics
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Sovereign Engagements */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Sovereign Track Record
            </div>
            <ul className="space-y-2">
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('sovereign-cases')}>
                  AKSHI Sovereign Cloud
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('sovereign-cases')}>
                  ARRSH Telemetry & Edge Grid
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('sovereign-cases')}>
                  FinTech Nutanix Banking Core
                </span>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('live-simulation')}>
                  Interactive Attack Simulator
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Client Portal */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Client Operations
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-blue-400 hover:text-blue-300 font-medium"
                >
                  Live RFP Tracker & Portal →
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRfq}
                  className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white"
                >
                  Submit Enterprise RFP
                </button>
              </li>
              <li>
                <span className="max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('engineering-advantage')}>
                  TCO Comparison Calculator
                </span>
              </li>
              <li>
                <span className="text-slate-500">ISO 27001 / SOC 2 Type II</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Integrit Consulting Sh.p.k. All rights reserved. Registered in Albania & Authorized for International Enterprise Services.
          </div>
          <div className="flex items-center gap-4">
            <span>Sovereign Security Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Trust Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>24/7 SRE Response</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
