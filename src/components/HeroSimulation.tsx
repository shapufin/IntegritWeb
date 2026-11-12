'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  Server,
  Layers,
  Cpu,
  Flame,
  ArrowRight,
  HardDrive,
  Network,
  Activity,
  CheckCircle2,
  XCircle,
  Info,
  Box,
  Sliders,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  ARCHITECTURE_PRESETS,
  INGRESS_ALTERNATIVES,
  LXC_VS_VM_COMPARISON,
  IngressTechnology,
} from '../data/mockData';
import { ArchitecturePreset, Packet, TopologyNode } from '../types';

interface HeroSimulationProps {
  onOpenRfq: () => void;
  onExploreCaseStudies: () => void;
}

export const HeroSimulation: React.FC<HeroSimulationProps> = ({
  onOpenRfq,
  onExploreCaseStudies,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ArchitecturePreset>('akshi');
  const [isDdosActive, setIsDdosActive] = useState<boolean>(false);
  const [trafficRate, setTrafficRate] = useState<'normal' | 'high'>('normal');
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);

  // User-selectable Ingress/Load Balancer technology
  const [selectedIngressId, setSelectedIngressId] = useState<string>('traefik');
  const [showIngressModal, setShowIngressModal] = useState<boolean>(false);
  const [showLxcModal, setShowLxcModal] = useState<boolean>(false);

  // Live telemetry counters
  const [telemetry, setTelemetry] = useState({
    inspected: 148920,
    passed: 146310,
    blocked: 2610,
    currentRate: 3420,
    latency: 1.18,
    threatLevel: 'Nominal',
  });

  // Seed initial packets so simulation animates immediately upon load
  const [packets, setPackets] = useState<Packet[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      type: i === 2 ? 'malicious' : 'legitimate',
      progress: ((i + 1) * 0.09),
      startX: 4,
      startY: 22 + (i * 6) % 50,
      targetX: 20,
      targetY: i % 2 === 0 ? 35 : 65,
      blockedAtPerimeter: false,
    }))
  );

  const packetIdRef = useRef(10);
  const animationFrameRef = useRef<number | null>(null);

  const presetData = ARCHITECTURE_PRESETS[selectedPreset];
  const activeIngressTech = useMemo(
    () => INGRESS_ALTERNATIVES.find((i) => i.id === selectedIngressId) || INGRESS_ALTERNATIVES[0],
    [selectedIngressId]
  );

  // Dynamically inject the active Ingress details onto the LB node in the current preset
  const computedNodes: TopologyNode[] = useMemo(() => {
    return presetData.nodes.map((node) => {
      if (node.category === 'lb') {
        return {
          ...node,
          label: activeIngressTech.name,
          sublabel:
            activeIngressTech.category.split(' ')[0] +
            ' ' +
            activeIngressTech.category.split(' ')[1],
          specs: {
            technology: activeIngressTech.name,
            throughput: activeIngressTech.throughput,
            cpu: '8 vCPU Worker Thread Pool',
            memory: '16 GB High-Speed RAM',
            securityRules: activeIngressTech.keyStrengths[1],
            details: `${activeIngressTech.description} — Best for: ${activeIngressTech.bestFor}`,
          },
        };
      }
      return node;
    });
  }, [presetData, activeIngressTech]);

  // Keep a ref to computedNodes so setInterval does not re-instantiate and cancel every frame
  const computedNodesRef = useRef(computedNodes);
  useEffect(() => {
    computedNodesRef.current = computedNodes;
  }, [computedNodes]);

  // Spawn packets periodically
  useEffect(() => {
    const intervalMs = trafficRate === 'high' ? 80 : 160;

    const timer = setInterval(() => {
      packetIdRef.current += 1;
      const isMalicious = isDdosActive ? Math.random() > 0.35 : Math.random() > 0.94;

      // Ingress starts from random Y on the left edge (X: 2 to 6)
      const startY = 20 + Math.random() * 60;

      // Targets: Tier 1 nodes (Perimeter Firewalls)
      const currentNodes = computedNodesRef.current;
      const tier1Nodes = currentNodes.filter((n) => n.tier === 1);
      const targetNode =
        tier1Nodes[Math.floor(Math.random() * tier1Nodes.length)] || currentNodes[0];

      const newPacket: Packet = {
        id: packetIdRef.current,
        type: isMalicious ? 'malicious' : 'legitimate',
        progress: 0,
        startX: 4,
        startY: startY,
        targetX: targetNode.x,
        targetY: targetNode.y,
        blockedAtPerimeter: false,
      };

      setPackets((prev) => [...prev.slice(-35), newPacket]);

      // Increment telemetry
      setTelemetry((prev) => {
        const increment = isDdosActive ? 18 : 6;
        const newBlocked = isMalicious ? prev.blocked + 1 : prev.blocked;
        const newPassed = !isMalicious ? prev.passed + 1 : prev.passed;
        const currentRate = isDdosActive
          ? 18500 + Math.floor(Math.random() * 3200)
          : 3400 + Math.floor(Math.random() * 400);
        const latency = isDdosActive ? 2.45 : parseFloat(activeIngressTech.latency);
        const threatLevel = isDdosActive ? 'Elevated Attack Mitigated' : 'Nominal Perimeter';

        return {
          inspected: prev.inspected + increment,
          passed: newPassed,
          blocked: newBlocked,
          currentRate,
          latency,
          threatLevel,
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isDdosActive, trafficRate, selectedPreset, activeIngressTech]);

  // Animation loop for packet flight
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const rawDelta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Clamp delta to prevent sudden particle jumps on tab focus/unfocus
      const delta = Math.min(rawDelta, 0.05);

      const speed = trafficRate === 'high' ? 0.55 : 0.38;

      setPackets((prev) =>
        prev
          .map((p) => ({
            ...p,
            progress: p.progress + delta * speed,
          }))
          .filter((p) => p.progress <= 1.05)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [trafficRate]);

  return (
    <section id="live-simulation" className="relative w-full pt-10 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background radial gradient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-900/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Trust kicker without pill boxes */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span className="text-blue-400 font-semibold">Tirana Engineering Center</span>
            <span aria-hidden="true">·</span>
            <span>Serving Global Enterprises</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">50+ Senior Architects</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] font-display">
            Mission-Critical Cloud & Defense Infrastructure For Enterprises
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Proven at sovereign scale for national institutions including{' '}
            <strong className="text-white font-medium">AKSHI</strong> (National Sovereign Cloud) and{' '}
            <strong className="text-white font-medium">ARRSH</strong> (National Edge Transport). We engineer
            hardened VMware, Proxmox with native <strong className="text-emerald-400">LXC Containers</strong>, and immutable Talos Kubernetes architectures with 24/7 pfSense & Cisco perimeter defense.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRfq}
              className="min-h-11 sm:min-h-0 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Schedule Architecture Audit</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onExploreCaseStudies}
              className="min-h-11 sm:min-h-0 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white"
            >
              <span>Inspect Sovereign Case Studies</span>
            </button>
          </div>
        </div>

        {/* Real-time Interactive Architecture Sandbox */}
        <div className="mt-12 rounded-2xl border border-slate-800/90 bg-[#0c121e]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Simulation Header Bar & Controls */}
          <div className="border-b border-slate-800 bg-[#090d16]/90 px-4 py-3.5 sm:px-6">
            {/* Top Row: Presets + Mobile Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Architecture Preset Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800/80 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedPreset('akshi');
                    setSelectedNode(null);
                  }}
                  className={`min-h-11 sm:min-h-0 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                    selectedPreset === 'akshi'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  AKSHI Sovereign Cloud (VMware)
                </button>
                <button
                  onClick={() => {
                    setSelectedPreset('arrsh');
                    setSelectedNode(null);
                  }}
                  className={`min-h-11 sm:min-h-0 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                    selectedPreset === 'arrsh'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  ARRSH Edge Grid (Proxmox + LXC)
                </button>
                <button
                  onClick={() => {
                    setSelectedPreset('fintech');
                    setSelectedNode(null);
                  }}
                  className={`min-h-11 sm:min-h-0 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                    selectedPreset === 'fintech'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  Private Banking Core (Nutanix)
                </button>
              </div>

              {/* Desktop Threat & Balancer Controls */}
              <div className="hidden md:flex flex-wrap items-center gap-3">
                {/* Ingress Selector */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 hidden xl:inline">Load Balancer:</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setSelectedIngressId('traefik')}
                      className={`min-h-11 sm:min-h-0 px-2.5 py-1 rounded text-xs transition-colors ${
                        selectedIngressId === 'traefik'
                          ? 'bg-cyan-600 text-white font-medium shadow-sm ring-1 ring-cyan-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Traefik Proxy v3 Cloud-Native Ingress Controller"
                    >
                      Traefik Ingress
                    </button>
                    <button
                      onClick={() => setSelectedIngressId('haproxy')}
                      className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs transition-colors ${
                        selectedIngressId === 'haproxy'
                          ? 'bg-blue-600 text-white font-medium shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="HAProxy Enterprise L4/L7 Load Balancer"
                    >
                      HAProxy
                    </button>
                    <button
                      onClick={() => setSelectedIngressId('nginx')}
                      className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs transition-colors ${
                        selectedIngressId === 'nginx'
                          ? 'bg-blue-600 text-white font-medium shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="NGINX Enterprise / Ingress Controller"
                    >
                      NGINX
                    </button>
                  </div>
                </div>

                {/* Compare Tech Buttons */}
                <button
                  onClick={() => setShowIngressModal(true)}
                  className="min-h-11 sm:min-h-0 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs text-blue-300 hover:bg-slate-800 flex items-center gap-1 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Compare Balancers</span>
                </button>

                <button
                  onClick={() => setShowLxcModal(true)}
                  className="min-h-11 sm:min-h-0 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-300 hover:bg-emerald-900/30 flex items-center gap-1 transition-colors"
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>Proxmox LXC vs VMs</span>
                </button>

                {/* Traffic Rate */}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <button
                    onClick={() => setTrafficRate('normal')}
                    className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs font-mono transition-colors ${
                      trafficRate === 'normal'
                        ? 'bg-slate-800 text-blue-400 font-semibold border border-blue-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    10Gbps
                  </button>
                  <button
                    onClick={() => setTrafficRate('high')}
                    className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs font-mono transition-colors ${
                      trafficRate === 'high'
                        ? 'bg-slate-800 text-blue-400 font-semibold border border-blue-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    100Gbps
                  </button>
                </div>

                {/* DDoS Attack Toggle Button */}
                <button
                  onClick={() => setIsDdosActive(!isDdosActive)}
                  className={`min-h-11 sm:min-h-0 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isDdosActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse'
                      : 'border border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-900/30'
                  }`}
                >
                  {isDdosActive ? (
                    <>
                      <ShieldAlert className="h-3.5 w-3.5 text-white" />
                      <span>Mitigating Active Attack</span>
                    </>
                  ) : (
                    <>
                      <Flame className="h-3.5 w-3.5 text-red-400" />
                      <span>Simulate Layer-7 Attack</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile-dedicated action control card (< md screens) */}
            <div className="mt-3 flex flex-col gap-2.5 md:hidden pt-2.5 border-t border-slate-800">
              {/* DDoS Toggle Full Width on Mobile */}
              <button
                onClick={() => setIsDdosActive(!isDdosActive)}
                className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold transition-all min-h-[46px] ${
                  isDdosActive
                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/40 ring-2 ring-red-400/60 animate-pulse'
                    : 'border border-red-500/60 bg-red-950/30 text-red-300 hover:bg-red-900/40'
                }`}
              >
                {isDdosActive ? (
                  <>
                    <ShieldAlert className="h-4 w-4 text-white" />
                    <span>🚨 DDoS Attack Mitigated (Perimeter Drop Active)</span>
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4 text-red-400" />
                    <span>⚡ Simulate Layer-7 Botnet Flood</span>
                  </>
                )}
              </button>

              {/* Ingress Selector on Mobile */}
              <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">Ingress Router:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedIngressId('traefik')}
                    className={`min-h-11 sm:min-h-0 px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedIngressId === 'traefik'
                        ? 'bg-cyan-600 text-white font-semibold ring-1 ring-cyan-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Traefik v3
                  </button>
                  <button
                    onClick={() => setSelectedIngressId('haproxy')}
                    className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs transition-colors ${
                      selectedIngressId === 'haproxy'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HAProxy
                  </button>
                  <button
                    onClick={() => setSelectedIngressId('nginx')}
                    className={`min-h-11 sm:min-h-0 px-2 py-1 rounded text-xs transition-colors ${
                      selectedIngressId === 'nginx'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    NGINX
                  </button>
                </div>
              </div>

              {/* Compare Buttons on Mobile */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setShowIngressModal(true)}
                  className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-blue-300 flex items-center justify-center gap-1.5 hover:bg-slate-800 text-xs min-h-11 sm:min-h-[40px]"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Compare Balancers</span>
                </button>
                <button
                  onClick={() => setShowLxcModal(true)}
                  className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 flex items-center justify-center gap-1.5 hover:bg-emerald-900/30 text-xs min-h-11 sm:min-h-[40px]"
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>Proxmox LXC vs VMs</span>
                </button>
              </div>
            </div>

            {/* Context Sub-row */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 truncate">
                <span className="text-white font-medium">{presetData.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{presetData.primaryHypervisor}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Ingress: {activeIngressTech.name}</span>
              </div>
              <div className="font-mono text-slate-400 text-[11px]">
                Tap any node on diagram to inspect telemetry
              </div>
            </div>
          </div>

          {/* =========================================================================
              MOBILE ENTERPRISE TOPOLOGY BOARD (100% Responsive, Zero Horizontal Scroll,
              Live Animated SVG Conduits & Real-Time Defense Particles)
             ========================================================================= */}
          <div className="block md:hidden relative w-full h-[640px] bg-[#070b12] overflow-hidden select-none border-t border-slate-800">
            {/* Cyber grid background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* SVG Conduit Paths & Flying Particle Lights */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="mBusNormal" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="mBusAttack" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#EF4444" stopOpacity="0.9" />
                  <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                </linearGradient>
                <filter id="mGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Conduits: Internet (50, 4) -> Tier 1 Firewalls (26, 17) & (74, 17) */}
              <path
                d="M 50 5 C 50 11, 26 11, 26 17"
                fill="none"
                stroke={isDdosActive ? 'url(#mBusAttack)' : 'url(#mBusNormal)'}
                strokeWidth={isDdosActive ? '1.4' : '0.9'}
                strokeDasharray={isDdosActive ? '2 1.5' : 'none'}
              />
              <path
                d="M 50 5 C 50 11, 74 11, 74 17"
                fill="none"
                stroke={isDdosActive ? 'url(#mBusAttack)' : 'url(#mBusNormal)'}
                strokeWidth={isDdosActive ? '1.4' : '0.9'}
                strokeDasharray={isDdosActive ? '2 1.5' : 'none'}
              />

              {/* Conduits: Tier 1 Firewalls (26, 26) & (74, 26) -> Tier 2 Traefik (50, 40) */}
              <path
                d="M 26 26 C 26 34, 50 34, 50 40"
                fill="none"
                stroke="rgba(6, 182, 212, 0.45)"
                strokeWidth="0.9"
              />
              <path
                d="M 74 26 C 74 34, 50 34, 50 40"
                fill="none"
                stroke="rgba(6, 182, 212, 0.45)"
                strokeWidth="0.9"
              />

              {/* Conduits: Tier 2 Traefik (50, 50) -> Tier 3 Workloads (26, 62) & (74, 62) */}
              <path
                d="M 50 50 C 50 56, 26 56, 26 62"
                fill="none"
                stroke="rgba(16, 185, 129, 0.45)"
                strokeWidth="0.9"
              />
              <path
                d="M 50 50 C 50 56, 74 56, 74 62"
                fill="none"
                stroke="rgba(16, 185, 129, 0.45)"
                strokeWidth="0.9"
              />

              {/* Conduits: Tier 3 Workloads (26, 72) & (74, 72) -> Tier 4 Storage (26, 84) & (74, 84) */}
              <path
                d="M 26 72 L 26 84"
                fill="none"
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="0.9"
              />
              <path
                d="M 74 72 L 74 84"
                fill="none"
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="0.9"
              />

              {/* Live Animated Traffic Packets on Mobile */}
              {packets.map((packet) => {
                const isLeft = packet.id % 2 === 0;
                const fwX = isLeft ? 26 : 74;
                const p = packet.progress;

                let curX = 50;
                let curY = 4;
                let isBlocked = false;

                if (packet.type === 'malicious' && isDdosActive) {
                  // Attacks are stopped at Tier 1 Firewall (y: 18)
                  const pRatio = Math.min(p / 0.22, 1);
                  curX = 50 + (fwX - 50) * pRatio;
                  curY = 4 + (18 - 4) * pRatio;
                  if (p >= 0.20) {
                    isBlocked = true;
                  }
                } else {
                  // Legitimate packet flows down through all 4 tiers
                  if (p <= 0.22) {
                    const pRatio = p / 0.22;
                    curX = 50 + (fwX - 50) * pRatio;
                    curY = 4 + (18 - 4) * pRatio;
                  } else if (p <= 0.46) {
                    const pRatio = (p - 0.22) / 0.24;
                    curX = fwX + (50 - fwX) * pRatio;
                    curY = 26 + (40 - 26) * pRatio;
                  } else if (p <= 0.72) {
                    const pRatio = (p - 0.46) / 0.26;
                    curX = 50 + (fwX - 50) * pRatio;
                    curY = 50 + (62 - 50) * pRatio;
                  } else {
                    const pRatio = (p - 0.72) / 0.28;
                    curX = fwX;
                    curY = 72 + (84 - 72) * pRatio;
                  }
                }

                if (isBlocked) {
                  return (
                    <g key={`m-${packet.id}`}>
                      <circle cx={curX} cy={curY} r="3" fill="none" stroke="#EF4444" strokeWidth="0.7" opacity="0.9" />
                      <circle cx={curX} cy={curY} r="1.3" fill="#EF4444" />
                    </g>
                  );
                }

                return (
                  <circle
                    key={`m-${packet.id}`}
                    cx={curX}
                    cy={curY}
                    r={packet.type === 'malicious' ? 1.5 : 1.3}
                    fill={packet.type === 'malicious' ? '#EF4444' : '#10B981'}
                    filter="url(#mGlow)"
                  />
                );
              })}
            </svg>

            {/* Top: Internet / Botnet Traffic Source Banner */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[1.5%] z-10 w-fit">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono shadow-md backdrop-blur-md transition-all ${
                  isDdosActive
                    ? 'border-red-500/70 bg-red-950/60 text-red-300 animate-pulse'
                    : 'border-slate-800 bg-slate-900/90 text-slate-300'
                }`}
              >
                <Network className={`h-3.5 w-3.5 ${isDdosActive ? 'text-red-400' : 'text-blue-400'}`} />
                <span className="font-semibold">
                  {isDdosActive ? 'Layer-7 SYN Flood Attack' : 'Global Ingress / TLS 1.3'}
                </span>
                <span className="text-slate-400">
                  {isDdosActive ? '4.8M SYN/s' : '0.4ms'}
                </span>
              </div>
            </div>

            {/* Tier 1: Dual Perimeter Firewalls */}
            {computedNodes
              .filter((n) => n.tier === 1)
              .map((node, idx) => {
                const isLeft = idx === 0;
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: isLeft ? '3%' : 'auto',
                      right: isLeft ? 'auto' : '3%',
                      top: '11%',
                      width: '45.5%',
                    }}
                    className={`absolute z-20 rounded-xl border p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-400 bg-slate-900/95 ring-2 ring-blue-500/50 shadow-xl'
                        : isDdosActive
                        ? 'border-red-500/70 bg-slate-900/95 shadow-md shadow-red-500/20'
                        : 'border-slate-800 bg-[#0e1626]/90 hover:border-slate-700'
                    }`}
                  >
                    {isDdosActive && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-4 items-center justify-center rounded-full bg-red-600 px-1 text-[8px] font-bold text-white shadow animate-pulse">
                        DROP
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 border ${
                        isDdosActive ? 'bg-red-900/40 border-red-500 text-red-400' : 'bg-blue-950 border-blue-500/40 text-blue-400'
                      }`}>
                        <Shield className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate leading-tight">
                          {node.label}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate leading-tight">
                          {node.sublabel}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono pt-1 border-t border-slate-800/80">
                      <span className="text-blue-400">{node.specs.technology.split(' ')[0]}</span>
                      <span className={isDdosActive ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {isDdosActive ? '40 Gbps DROP' : '0.4ms'}
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Tier 2: Ingress Controller (Traefik Proxy v3 Centerpiece) */}
            {computedNodes
              .filter((n) => n.tier === 2)
              .map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: '6%',
                      right: '6%',
                      top: '32.5%',
                    }}
                    className={`absolute z-20 rounded-xl border p-2.5 sm:p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900/95 ring-2 ring-cyan-500/50 shadow-xl'
                        : 'border-cyan-500/60 bg-[#071922]/95 hover:border-cyan-400 shadow-lg shadow-cyan-950/40'
                    }`}
                  >
                    <div className="absolute -top-2 -right-1.5 flex items-center gap-1 rounded bg-cyan-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow ring-1 ring-cyan-400/50">
                      TRAEFIK INGRESS
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
                        <Network className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate leading-tight">
                          {node.label}
                        </div>
                        <div className="text-[10px] text-slate-300 truncate leading-tight">
                          v3 Cloud-Native Router · TLS 1.3 Auto Let's Encrypt
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                          {node.specs.throughput}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">0.3ms latency</span>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Tier 3: Compute & Container Workloads */}
            {computedNodes
              .filter((n) => n.tier === 3)
              .map((node, idx) => {
                const isLeft = idx === 0;
                const isSelected = selectedNode?.id === node.id;
                const isLxc = node.category === 'lxc';
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: isLeft ? '3%' : 'auto',
                      right: isLeft ? 'auto' : '3%',
                      top: '54%',
                      width: '45.5%',
                    }}
                    className={`absolute z-20 rounded-xl border p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-slate-900/95 ring-2 ring-emerald-500/50 shadow-xl'
                        : isLxc
                        ? 'border-emerald-500/50 bg-[#0a1815]/95 hover:border-emerald-400 shadow-md'
                        : 'border-slate-800 bg-[#0e1626]/90 hover:border-slate-700'
                    }`}
                  >
                    {isLxc && (
                      <div className="absolute -top-1.5 -right-1.5 flex items-center rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-bold text-white shadow">
                        LXC
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 border ${
                        isLxc ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400' : 'bg-slate-800 border-slate-700 text-blue-400'
                      }`}>
                        {isLxc ? <Box className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate leading-tight">
                          {node.label}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate leading-tight">
                          {node.sublabel}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono pt-1 border-t border-slate-800/80">
                      <span className="text-emerald-400">{isLxc ? 'Proxmox LXC' : 'Talos K8s'}</span>
                      <span className="text-slate-300">{node.specs.cpu.split(' ')[0]} vCPU</span>
                    </div>
                  </div>
                );
              })}

            {/* Tier 4: Enterprise Hypervisor & Clustered Storage */}
            {computedNodes
              .filter((n) => n.tier === 4)
              .map((node, idx) => {
                const isLeft = idx === 0;
                const isSelected = selectedNode?.id === node.id;
                const isStorage = node.category === 'storage';
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: isLeft ? '3%' : 'auto',
                      right: isLeft ? 'auto' : '3%',
                      top: '76%',
                      width: '45.5%',
                    }}
                    className={`absolute z-20 rounded-xl border p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-400 bg-slate-900/95 ring-2 ring-indigo-500/50 shadow-xl'
                        : 'border-slate-800 bg-[#0e1626]/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-md bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
                        {isStorage ? <HardDrive className="h-3.5 w-3.5" /> : <Server className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate leading-tight">
                          {node.label}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate leading-tight">
                          {node.sublabel}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono pt-1 border-t border-slate-800/80">
                      <span className="text-indigo-400 truncate mr-1">{node.specs.technology.split(' ')[0]}</span>
                      <span className="text-emerald-400">99.999% HA</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* === INTERACTIVE DESKTOP TOPOLOGY CANVAS (Visible exclusively on >= md screens) === */}
          <div className="hidden md:block relative w-full select-none bg-[#070b12]">
            <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[530px] p-4 sm:p-6 overflow-hidden">
              {/* Grid Pattern Background */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }}
              />

              {/* SVG Connecting Buses and Circuits */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="busGradientNormal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="busGradientAttack" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                    <stop offset="30%" stopColor="#EF4444" stopOpacity="0.5" />
                    <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ingress Attack Vector Lines from outside (X=4% to Firewall nodes) */}
                {computedNodes
                  .filter((n) => n.tier === 1)
                  .map((fwNode) => (
                    <path
                      key={`ingress-to-${fwNode.id}`}
                      d={`M 4 50 C 12 50, 15 ${fwNode.y}, ${fwNode.x} ${fwNode.y}`}
                      fill="none"
                      stroke={isDdosActive ? 'url(#busGradientAttack)' : 'url(#busGradientNormal)'}
                      strokeWidth="2.5"
                      strokeDasharray={isDdosActive ? '4 3' : 'none'}
                    />
                  ))}

                {/* Intra-Tier Interconnections */}
                {computedNodes.map((sourceNode) => {
                  const nextTierNodes = computedNodes.filter(
                    (target) => target.tier === sourceNode.tier + 1
                  );
                  return nextTierNodes.map((targetNode) => (
                    <path
                      key={`${sourceNode.id}->${targetNode.id}`}
                      d={`M ${sourceNode.x} ${sourceNode.y} C ${
                        (sourceNode.x + targetNode.x) / 2
                      } ${sourceNode.y}, ${(sourceNode.x + targetNode.x) / 2} ${
                        targetNode.y
                      }, ${targetNode.x} ${targetNode.y}`}
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.28)"
                      strokeWidth="2"
                    />
                  ));
                })}

                {/* In-Flight Packet Particles */}
                {packets.map((packet) => {
                  const isBlocked =
                    packet.type === 'malicious' && isDdosActive && packet.progress >= 0.28;

                  const curX =
                    packet.startX +
                    (packet.targetX - packet.startX) *
                      Math.min(packet.progress / (packet.type === 'malicious' ? 0.28 : 1), 1);
                  const curY =
                    packet.startY +
                    (packet.targetY - packet.startY) *
                      Math.min(packet.progress / (packet.type === 'malicious' ? 0.28 : 1), 1);

                  if (isBlocked) {
                    return (
                      <g key={packet.id}>
                        <circle cx={`${curX}%`} cy={`${curY}%`} r="8" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.85" />
                        <circle cx={`${curX}%`} cy={`${curY}%`} r="3" fill="#EF4444" />
                      </g>
                    );
                  }

                  return (
                    <g key={packet.id}>
                      <circle
                        cx={`${curX}%`}
                        cy={`${curY}%`}
                        r={packet.type === 'malicious' ? 4 : 3.5}
                        fill={packet.type === 'malicious' ? '#EF4444' : '#10B981'}
                        filter="url(#glow)"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Left Edge: Global Traffic & External Threats Tag */}
              <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
                <div
                  className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
                    isDdosActive
                      ? 'border-red-500/60 bg-red-950/40 text-red-300'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="relative">
                    <Network className="h-5 w-5 text-blue-400" />
                    {isDdosActive && (
                      <Flame className="absolute -top-2 -right-2 h-4 w-4 text-red-500 animate-bounce" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide">
                    {isDdosActive ? 'Botnet Flood' : 'Ingress Traffic'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {isDdosActive ? '4.8M SYN/sec' : 'TLS 1.3 / Enterprise Users'}
                  </span>
                </div>
              </div>

              {/* Topology Nodes Rendered at their X/Y Coordinates */}
              {computedNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isFirewall = node.category === 'perimeter';

                const renderNodeIcon = () => {
                  switch (node.category) {
                    case 'perimeter':
                      return <Shield className="h-4 w-4 text-blue-400" />;
                    case 'lb':
                      return <Network className="h-4 w-4 text-cyan-400" />;
                    case 'k8s':
                      return <Cpu className="h-4 w-4 text-cyan-400" />;
                    case 'lxc':
                      return <Box className="h-4 w-4 text-emerald-400" />;
                    case 'hypervisor':
                      return <Server className="h-4 w-4 text-indigo-400" />;
                    case 'storage':
                      return <HardDrive className="h-4 w-4 text-amber-400" />;
                  }
                };

                return (
                  <div
                    key={node.id}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedNode(node)}
                    className={`absolute z-20 cursor-pointer rounded-xl border p-2.5 sm:p-3 transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-blue-400 bg-slate-900/95 ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/20 scale-105'
                        : isFirewall && isDdosActive
                        ? 'border-red-500/70 bg-slate-900/90 shadow-lg shadow-red-500/20'
                        : node.category === 'lb'
                        ? 'border-cyan-500/60 bg-[#071922]/95 hover:border-cyan-400 hover:bg-slate-900/90 shadow-lg shadow-cyan-950/40'
                        : node.category === 'lxc'
                        ? 'border-emerald-500/40 bg-[#0a1815]/90 hover:border-emerald-400 hover:bg-slate-900/90 shadow-md'
                        : 'border-slate-800 bg-[#0e1626]/90 hover:border-slate-700 hover:bg-slate-900/90 shadow-md'
                    }`}
                  >
                    {/* Active Firewall Shield effect when DDoS is active */}
                    {isFirewall && isDdosActive && (
                      <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-md animate-pulse">
                        DROP
                      </div>
                    )}

                    {/* Dedicated Traefik Ingress Controller highlight badge */}
                    {node.category === 'lb' && (
                      <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded bg-cyan-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow ring-1 ring-cyan-400/50">
                        TRAEFIK
                      </div>
                    )}

                    {/* Special LXC highlight badge */}
                    {node.category === 'lxc' && (
                      <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded bg-emerald-600/90 px-1.5 py-0.2 text-[9px] font-bold text-white shadow">
                        LXC
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        node.category === 'lb'
                          ? 'bg-cyan-950/70 border-cyan-500/50'
                          : node.category === 'lxc'
                          ? 'bg-emerald-950/60 border-emerald-500/40'
                          : 'bg-slate-800/80 border-slate-700/60'
                      }`}>
                        {renderNodeIcon()}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-white whitespace-nowrap leading-tight">
                          {node.label}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap leading-tight">
                          {node.sublabel}
                        </span>
                      </div>
                    </div>

                    {/* Micro metric bar */}
                    <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <span className={node.category === 'lb' ? 'text-cyan-400 font-semibold' : 'text-blue-400'}>
                        {node.specs.technology.split(' ')[0]}
                      </span>
                      <span className="tabular-nums text-emerald-400">
                        {isFirewall && isDdosActive ? '40 Gbps [ACTIVE]' : '0.4ms'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Desktop Node Details Drawer / Popover (Hidden on mobile, mobile uses bottom sheet) */}
              {selectedNode && (
                <div className="hidden md:block absolute right-4 bottom-4 max-w-sm rounded-xl border border-blue-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md z-30 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {selectedNode.label}
                      </h4>
                      <p className="text-xs text-blue-400 font-mono">{selectedNode.specs.technology}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(null);
                      }}
                      className="max-sm:inline-flex max-sm:min-h-11 max-sm:min-w-11 max-sm:items-center max-sm:justify-center text-slate-400 hover:text-white p-1"
                      aria-label="Close inspector"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Throughput</div>
                      <div className="text-slate-200 font-semibold">{selectedNode.specs.throughput}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Compute</div>
                      <div className="text-slate-200 font-semibold">{selectedNode.specs.cpu}</div>
                    </div>
                    <div className="col-span-2 bg-slate-900/80 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500">Security Rule Engine</div>
                      <div className="text-emerald-400 font-semibold">{selectedNode.specs.securityRules}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.specs.details}</p>
                </div>
              )}
            </div>
          </div>

          {/* === MOBILE BOTTOM SHEET INSPECTOR (< md screens) === */}
          {selectedNode && (
            <div className="fixed inset-0 z-50 md:hidden flex items-end">
              {/* Dimmed backdrop */}
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
                onClick={() => setSelectedNode(null)}
              />

              {/* Sheet container */}
              <div className="relative w-full rounded-t-2xl border-t border-blue-500/50 bg-[#0c121e] p-5 shadow-2xl backdrop-blur-xl z-10 space-y-3.5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                        {selectedNode.category.toUpperCase()} NODE
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">Tier 0{selectedNode.tier}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1 leading-tight">
                      {selectedNode.label}
                    </h3>
                    <p className="text-xs text-blue-400 font-mono">{selectedNode.specs.technology}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 min-h-11 min-w-11 sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center text-sm"
                    aria-label="Close inspector"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">Throughput</div>
                    <div className="text-slate-200 font-semibold">{selectedNode.specs.throughput}</div>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">Compute</div>
                    <div className="text-slate-200 font-semibold">{selectedNode.specs.cpu}</div>
                  </div>
                  <div className="col-span-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">Security Rule Engine</div>
                    <div className="text-emerald-400 font-semibold">{selectedNode.specs.securityRules}</div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedNode.specs.details}
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-500 min-h-[44px]"
                  >
                    Close Telemetry Inspector
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Dashboard Footer Bar */}
          <div className="border-t border-slate-800 bg-[#090d16] px-4 py-3 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Packets Inspected</span>
                <span className="text-slate-200 font-semibold tabular-nums text-sm">
                  {telemetry.inspected.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Passed (Legitimate)</span>
                <span className="text-emerald-400 font-semibold tabular-nums text-sm">
                  {telemetry.passed.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Threats Neutralized</span>
                <span
                  className={`font-semibold tabular-nums text-sm ${
                    isDdosActive ? 'text-red-400' : 'text-slate-300'
                  }`}
                >
                  {telemetry.blocked.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Ingress Rate</span>
                <span className="text-blue-400 font-semibold tabular-nums text-sm">
                  {telemetry.currentRate.toLocaleString()} pkt/s
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Transit Latency</span>
                <span className="text-slate-200 font-semibold tabular-nums text-sm">
                  {telemetry.latency} ms
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Perimeter State</span>
                <span
                  className={`font-semibold text-xs inline-flex items-center gap-1 ${
                    isDdosActive ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isDdosActive ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  {isDdosActive ? 'Drop Mitigation' : 'Nominal Core'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingress & Load Balancer Comparison Modal */}
      {showIngressModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowIngressModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0c121e] p-6 sm:p-8 shadow-2xl text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase">
                  <span>Enterprise Ingress & Load Balancing Architecture</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Load Balancer Alternatives & Tradeoffs
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Why Traefik Proxy v3 is our primary cloud-native ingress, and which high-availability alternatives Integrit deploys across enterprise networks:
                </p>
              </div>
              <button
                onClick={() => setShowIngressModal(false)}
                className="max-sm:inline-flex max-sm:min-h-11 max-sm:min-w-11 max-sm:items-center max-sm:justify-center text-slate-400 hover:text-white text-lg p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Ingress Grid Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INGRESS_ALTERNATIVES.map((tech) => {
                const isCurrent = selectedIngressId === tech.id;
                return (
                  <div
                    key={tech.id}
                    className={`rounded-xl border p-5 space-y-3 transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-slate-900/90 ring-1 ring-blue-500/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-blue-400">{tech.category}</div>
                        <h4 className="text-base font-bold text-white mt-0.5">{tech.name}</h4>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedIngressId(tech.id);
                          setShowIngressModal(false);
                        }}
                        className={`min-h-11 sm:min-h-0 text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isCurrent ? 'Active in Demo' : 'Select'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{tech.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1 border-y border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Peak Throughput</span>
                        <span className="text-white font-semibold">{tech.throughput}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Packet Latency</span>
                        <span className="text-emerald-400 font-semibold">{tech.latency}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Architectural Strengths:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {tech.keyStrengths.map((strength, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5">
                            <span className="text-blue-400">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1">
                      <strong className="text-slate-300">Best for:</strong> {tech.bestFor}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowIngressModal(false)}
                className="min-h-11 sm:min-h-0 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Close Comparison
              </button>
              <button
                onClick={() => {
                  setShowIngressModal(false);
                  onOpenRfq();
                }}
                className="min-h-11 sm:min-h-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Consult on Your Load Balancing Architecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proxmox Native LXC vs KVM vs K8s Modal */}
      {showLxcModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowLxcModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0c121e] p-6 sm:p-8 shadow-2xl text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                  <span>Proxmox VE Virtualization Architecture</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {LXC_VS_VM_COMPARISON.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {LXC_VS_VM_COMPARISON.description}
                </p>
              </div>
              <button
                onClick={() => setShowLxcModal(false)}
                className="max-sm:inline-flex max-sm:min-h-11 max-sm:min-w-11 max-sm:items-center max-sm:justify-center text-slate-400 hover:text-white text-lg p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Why LXC Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/70">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Architecture Metric</th>
                      <th className="p-3.5 text-emerald-400 font-semibold">Proxmox LXC Containers</th>
                      <th className="p-3.5 text-blue-400">KVM Full Virtual Machines</th>
                      <th className="p-3.5 text-cyan-400">Kubernetes Pods (Talos)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {LXC_VS_VM_COMPARISON.aspects.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3.5 font-medium text-white whitespace-nowrap">
                          {row.metric}
                        </td>
                        <td className="p-3.5 text-emerald-300 font-medium bg-emerald-950/15">
                          {row.lxc}
                        </td>
                        <td className="p-3.5 text-slate-300">{row.kvm}</td>
                        <td className="p-3.5 text-slate-400">{row.k8s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key takeaway note */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1 text-xs text-slate-300">
              <span className="font-bold text-white block">
                How Integrit Implements LXC for Clients like ARRSH:
              </span>
              <p className="leading-relaxed">
                Rather than spinning up heavy full virtual machines for highway sensor telemetry and camera stream parsers, we deploy high-density <strong>Proxmox native LXC containers</strong>. Each container boots in under 250 milliseconds, consumes only ~60MB RAM, and accesses NVMe storage at 99.8% bare-metal IOPS—allowing a single Proxmox cluster to run hundreds of isolated telemetry services with zero hypervisor licensing costs.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowLxcModal(false)}
                className="min-h-11 sm:min-h-0 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowLxcModal(false);
                  onOpenRfq();
                }}
                className="min-h-11 sm:min-h-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Incorporate Proxmox & LXC in Your RFP
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
