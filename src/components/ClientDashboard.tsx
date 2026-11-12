'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Calendar,
  Building,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ClientInquiry } from '../types';

interface ClientDashboardProps {
  inquiries: ClientInquiry[];
  onOpenNewRfq: () => void;
  onBackToShowcase: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  inquiries,
  onOpenNewRfq,
  onBackToShowcase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(inquiries[0]?.id || '');
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.primaryService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.rfpNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeInquiry =
    inquiries.find((inq) => inq.id === selectedInquiryId) || filteredInquiries[0] || inquiries[0];

  const getStatusBadge = (status: ClientInquiry['status']) => {
    switch (status) {
      case 'Production Cutover':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Hardened Staging':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'PoC Blueprint':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'Technical Assessment':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'In Review':
        return 'text-slate-300 bg-slate-800 border-slate-700';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
            <span>Integrit Operations & Project Governance</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Enterprise Client Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
            Client Inquiry & RFP Status Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time milestone visibility, technical assessment scopes, and SLA commitments for all active client engagements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToShowcase}
            className="min-h-11 sm:min-h-0 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ← Back to Architecture
          </button>
          <button
            onClick={onOpenNewRfq}
            className="min-h-11 sm:min-h-0 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Submit New RFP / Inquiry</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4 space-y-1">
          <span className="text-[11px] uppercase font-mono text-slate-400">Active Pipeline</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {inquiries.length} Inquiries
          </div>
          <span className="text-[11px] text-blue-400">100% On Schedule</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4 space-y-1">
          <span className="text-[11px] uppercase font-mono text-slate-400">SLA Performance</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            99.995%
          </div>
          <span className="text-[11px] text-slate-400">15-min Critical Response</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4 space-y-1">
          <span className="text-[11px] uppercase font-mono text-slate-400">Active Architects</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            50+ Engineers
          </div>
          <span className="text-[11px] text-slate-400">Tirana Engineering Center</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4 space-y-1">
          <span className="text-[11px] uppercase font-mono text-slate-400">Compliance Audits</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            Zero Breaches
          </div>
          <span className="text-[11px] text-emerald-400">SOC 2 & ISO 27001</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search inquiries by company, RFP#, or stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-11 sm:min-h-0 w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {['all', 'In Review', 'Technical Assessment', 'PoC Blueprint', 'Hardened Staging', 'Production Cutover'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`min-h-11 sm:min-h-0 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible only on < lg screens) */}
      <div className="flex lg:hidden items-center justify-between p-1 bg-slate-900/90 rounded-lg border border-slate-800">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 min-h-11 sm:min-h-0 py-2 text-xs font-semibold rounded-md transition-all ${
            mobileTab === 'list'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tracked Inquiries ({filteredInquiries.length})
        </button>
        <button
          onClick={() => setMobileTab('detail')}
          className={`flex-1 min-h-11 sm:min-h-0 py-2 text-xs font-semibold rounded-md transition-all ${
            mobileTab === 'detail'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active RFP Milestones
        </button>
      </div>

      {/* Main Grid: Left Column Inquiries List (5 cols), Right Column Detail & Milestones (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inquiries List (5 cols) */}
        <div className={`lg:col-span-5 space-y-3 ${mobileTab === 'list' ? 'block' : 'hidden lg:block'}`}>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Tracked Engagements ({filteredInquiries.length})</span>
            <span className="lg:hidden text-[10px] text-blue-400 font-mono">Tap inquiry for details</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredInquiries.map((inq) => {
              const isSelected = activeInquiry?.id === inq.id;
              const completedMilestones = inq.milestones.filter((m) => m.completed).length;
              const totalMilestones = inq.milestones.length;

              return (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiryId(inq.id);
                    setMobileTab('detail');
                  }}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-slate-900/95 ring-1 ring-blue-500/30 shadow-lg'
                      : 'border-slate-800/80 bg-[#0c121e]/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {inq.rfpNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">{inq.location}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{inq.companyName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold border px-2 py-0.5 rounded whitespace-nowrap ${getStatusBadge(
                        inq.status
                      )}`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 line-clamp-1">{inq.primaryService}</p>

                  {/* Milestone Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Milestones Completed</span>
                      <span className="text-slate-200">
                        {completedMilestones} / {totalMilestones}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(completedMilestones / totalMilestones) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInquiries.length === 0 && (
              <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 p-6">
                <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400 mt-2">No matching inquiries found.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-3 max-sm:inline-flex max-sm:min-h-11 max-sm:items-center text-xs text-blue-400 hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Inquiry Detail & Milestones View (7 cols) */}
        {activeInquiry && (
          <div className={`lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0b111c] p-5 sm:p-8 space-y-6 shadow-xl ${mobileTab === 'detail' ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Back to List Button */}
            <div className="lg:hidden pb-1 border-b border-slate-800/80">
              <button
                onClick={() => setMobileTab('list')}
                className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-xs font-semibold text-blue-400 hover:text-blue-300 py-1"
              >
                ← Back to Inquiries List ({filteredInquiries.length})
              </button>
            </div>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-blue-400 font-bold">{activeInquiry.rfpNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>Submitted {activeInquiry.submissionDate}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
                  {activeInquiry.companyName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {activeInquiry.primaryService}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span
                  className={`text-xs font-semibold border px-2.5 py-1 rounded ${getStatusBadge(
                    activeInquiry.status
                  )}`}
                >
                  {activeInquiry.status}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Target Cutover: {activeInquiry.targetCompletion}
                </span>
              </div>
            </div>

            {/* Scope & Metrics Quick Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Service SLA Target</span>
                <span className="text-emerald-400 font-semibold">{activeInquiry.slaTarget}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Project Budget</span>
                <span className="text-slate-200 font-semibold">{activeInquiry.budgetRange}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Lead Contact</span>
                <span className="text-slate-200 font-semibold truncate block">
                  {activeInquiry.contactName}
                </span>
              </div>
            </div>

            {/* Primary Stack Badges */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">Target Infrastructure Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {activeInquiry.primaryStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded px-2.5 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestone Timeline Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>Technical Milestones & Delivery Schedule</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  Tirana Architecture Sprint
                </span>
              </div>

              <div className="space-y-2.5">
                {activeInquiry.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      m.completed
                        ? 'border-emerald-500/30 bg-emerald-950/15 text-slate-200'
                        : m.current
                        ? 'border-blue-500/40 bg-blue-950/20 text-white ring-1 ring-blue-500/20'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <div className="mt-0.5">
                      {m.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : m.current ? (
                        <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className={m.completed ? 'text-white' : m.current ? 'text-blue-300 font-semibold' : 'text-slate-400'}>
                          Step {idx + 1}: {m.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{m.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Sign-Off Note */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Have Questions on This Architecture Spec?
                </span>
                <span className="text-xs text-slate-400">
                  Assigned Lead Architect is standing by for technical synchronizations.
                </span>
              </div>
              <button
                onClick={onOpenNewRfq}
                className="min-h-11 sm:min-h-0 shrink-0 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Inquire on Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
