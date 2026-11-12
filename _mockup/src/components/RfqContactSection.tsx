import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Shield,
  Building,
  Mail,
  User,
  Phone,
  Clock,
  ArrowRight,
  Server,
  Cpu,
  Lock,
} from 'lucide-react';
import { ClientInquiry, RfqFormData } from '../types';

interface RfqContactSectionProps {
  onInquiryCreated: (inquiry: ClientInquiry) => void;
  onViewInDashboard: () => void;
}

export const RfqContactSection: React.FC<RfqContactSectionProps> = ({
  onInquiryCreated,
  onViewInDashboard,
}) => {
  const [formData, setFormData] = useState<RfqFormData>({
    fullName: '',
    workEmail: '',
    companyName: '',
    companyLocation: '',
    selectedServices: ['VMware to Proxmox Migration'],
    hypervisorPreference: 'Proxmox VE (Cost Reduction)',
    containerRequirement: 'Talos OS Kubernetes (Immutable)',
    firewallRequirement: 'pfSense HA CARP Pair',
    estimatedNodes: '12-30 Nodes',
    timeline: 'Within 30-60 Days',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRfp, setSubmittedRfp] = useState<ClientInquiry | null>(null);

  const availableServices = [
    'VMware to Proxmox Migration',
    'Talos OS Immutable Kubernetes',
    'pfSense HA & Cisco Nexus Firewalling',
    'Ceph Distributed Storage Ring',
    'Cloud Cost Optimization (FinOps)',
    '24/7 SRE & SecOps Dedicated Pod',
  ];

  const toggleService = (svc: string) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(svc);
      if (exists) {
        if (prev.selectedServices.length === 1) return prev; // keep at least 1
        return { ...prev, selectedServices: prev.selectedServices.filter((s) => s !== svc) };
      }
      return { ...prev, selectedServices: [...prev.selectedServices, svc] };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.workEmail.trim()) {
      errs.workEmail = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      errs.workEmail = 'Enter a valid corporate email address';
    }
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.companyLocation.trim()) errs.companyLocation = 'Location/State is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate real RFP object
    const rfpNum = `RFP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const newInquiry: ClientInquiry = {
      id: `rfp-${Date.now()}`,
      rfpNumber: rfpNum,
      companyName: formData.companyName,
      location: formData.companyLocation,
      primaryService: formData.selectedServices.join(', '),
      status: 'In Review',
      submissionDate: today,
      targetCompletion: '2026-12-30',
      slaTarget: '99.99% Availability / 15-min SLA',
      budgetRange: '$75,000 — $120,000 (Nearshore Tier)',
      primaryStack: [
        formData.hypervisorPreference.split(' ')[0],
        formData.containerRequirement.split(' ')[0],
        formData.firewallRequirement.split(' ')[0],
      ],
      contactName: formData.fullName,
      contactEmail: formData.workEmail,
      milestones: [
        { title: 'Inquiry Received & NDA Countersignature', completed: true, date: today },
        { title: 'Workload & Network Topology Review', completed: false, current: true, date: 'Next Business Day' },
        { title: 'Isolated PoC Architecture Blueprint', completed: false, date: 'Within 7 Days' },
        { title: 'Security Audit & Zero-Trust Sign-off', completed: false, date: 'Within 14 Days' },
        { title: 'Production Staging & Cutover Plan', completed: false, date: 'Target Schedule' },
      ],
    };

    onInquiryCreated(newInquiry);
    setSubmittedRfp(newInquiry);
  };

  return (
    <section id="rfp-contact" className="relative w-full py-16 sm:py-20 lg:py-28 border-t border-slate-800 bg-[#070b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
            <span>Seamless Enterprise Engagement</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Direct Engineering Access</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Request an Enterprise Architecture RFP & Feasibility Audit
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect directly with our senior infrastructure architects in Tirana. Submit your technical scope below to generate a tracked RFP and receive a comprehensive architecture estimate within 24 business hours.
          </p>
        </div>

        {/* Content Box */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-[#0b111c] p-6 sm:p-8 lg:p-10 shadow-2xl">
          {submittedRfp ? (
            /* Confirmation State */
            <div className="max-w-2xl mx-auto text-center space-y-5 py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Proposal Inquiry Successfully Tracked
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 font-display">
                  {submittedRfp.rfpNumber} Generated
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your inquiry for{' '}
                  <strong className="text-white">{formData.companyName}</strong> has been routed to our Lead Solutions Architect.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracked Scope:</span>
                  <span className="text-slate-200">{formData.selectedServices.join(' · ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="text-blue-400">{formData.workEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Step:</span>
                  <span className="text-emerald-400">Topology Review & NDA dispatch (within 24h)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={onViewInDashboard}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
                >
                  View Inquiry in Client Operations Portal
                </button>
                <button
                  onClick={() => setSubmittedRfp(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Submit Another Scope
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Scope Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  1. Select Target Infrastructure Services (Multi-select)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {availableServices.map((svc) => {
                    const isSelected = formData.selectedServices.includes(svc);
                    return (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => toggleService(svc)}
                        className={`p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/40'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{svc}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Parameters */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  2. Architecture & Technical Environment Preferences
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono">Hypervisor Environment</label>
                    <select
                      value={formData.hypervisorPreference}
                      onChange={(e) => setFormData({ ...formData, hypervisorPreference: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>Proxmox VE (Cost Reduction)</option>
                      <option>VMware vSphere & vSAN</option>
                      <option>Nutanix AHV Enterprise</option>
                      <option>Hybrid Multi-Hypervisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono">Container Platform</label>
                    <select
                      value={formData.containerRequirement}
                      onChange={(e) => setFormData({ ...formData, containerRequirement: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>Talos OS Kubernetes (Immutable)</option>
                      <option>Standard K8s / ArgoCD GitOps</option>
                      <option>VMware Tanzu Grid</option>
                      <option>Bare-Metal Linux VMs only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-mono">Perimeter Security & Firewall</label>
                    <select
                      value={formData.firewallRequirement}
                      onChange={(e) => setFormData({ ...formData, firewallRequirement: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>pfSense HA CARP Pair</option>
                      <option>Cisco Nexus / Firepower ASA</option>
                      <option>Fortinet FortiGate</option>
                      <option>Zero-Trust WireGuard Mesh</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Corporate Contact Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  3. Executive & Technical Contact Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full rounded-lg border bg-slate-900 px-3 py-2 text-white placeholder-slate-600 focus:outline-none ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Corporate Work Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. m.vance@company.com"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className={`w-full rounded-lg border bg-slate-900 px-3 py-2 text-white placeholder-slate-600 focus:outline-none ${
                        errors.workEmail ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    {errors.workEmail && <p className="text-red-400 text-[11px] mt-1">{errors.workEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Financial Systems"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={`w-full rounded-lg border bg-slate-900 px-3 py-2 text-white placeholder-slate-600 focus:outline-none ${
                        errors.companyName ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    {errors.companyName && <p className="text-red-400 text-[11px] mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Company Headquarters / Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY or Austin, TX"
                      value={formData.companyLocation}
                      onChange={(e) => setFormData({ ...formData, companyLocation: e.target.value })}
                      className={`w-full rounded-lg border bg-slate-900 px-3 py-2 text-white placeholder-slate-600 focus:outline-none ${
                        errors.companyLocation ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    {errors.companyLocation && <p className="text-red-400 text-[11px] mt-1">{errors.companyLocation}</p>}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-slate-400 mb-1 text-xs">
                    Project Scope Details / Current Pain Points (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide context on cluster sizes, legacy licensing pain points, or specific compliance milestones..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Strict NDA executed prior to any workload assessment. Zero data retention risk.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer"
                >
                  <span>Submit RFP & Generate Architecture Ticket</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
