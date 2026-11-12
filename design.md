# Integrit — Enterprise Cloud & Cybersecurity Infrastructure Platform
## System Architecture, Design Specification & Engineering Blueprint

This document serves as the complete technical and architectural source of truth for **Integrit** (domain `Integrit`, meaning *Integrity IT*), an elite enterprise IT consulting powerhouse based in Tirana, Albania, specializing in sovereign-grade virtualization, immutable container orchestration, high-availability storage fabrics, and perimeter defense.

---

## 1. Executive Overview & Brand Identity

- **Brand Name**: `Integrit` (Integrity IT)
- **Headquarters**: Tirana Engineering Center, Albania (EU/CET UTC+1)
- **Engineering Roster**: 50+ Senior Infrastructure, Virtualization, Kernel & SecOps Architects
- **Target Audience**: Global mid-market and enterprise leadership (CTOs, CISOs, VP Infrastructure, Head of DevOps)
- **Value Proposition**: Sovereign-grade resilience, 24/7 dedicated operational pods, 40–55% TCO reduction compared to domestic contractor overhead, zero junior staffing.
- **Sovereign Track Record**:
  - **AKSHI (National Agency for Information Society, Albania)**: National sovereign cloud backbone hosting critical e-government services for 2.8M citizens on VMware vSAN, immutable Talos OS Kubernetes clusters, and Traefik Ingress.
  - **ARRSH (Albanian Road Authority)**: Nationwide intelligent transportation & highway telemetry grid built on high-density Proxmox VE HA clusters, Ceph distributed storage, WireGuard zero-trust mesh, and **Proxmox Native LXC (Linux Containers)**.
  - **Tier-1 Financial Banking & FinTech**: Nutanix AHV core with PCI-DSS 4.0 compliant microsegmentation, pfSense CARP HA, and automated disaster recovery cutover.

---

## 2. Design System & Visual Architecture

### 2.1 Color Palette & 60-30-10 Discipline
- **60% Dominant Canvas (Deep Navy & Slate Obsidian)**:
  - Canvas background: `#090D16`
  - Elevated card surfaces: `#0c121e`, `#0b111c`, `#070b14`
  - Borders & Conduits: `rgba(30, 41, 59, 0.8)` (`border-slate-800`), glowing circuit dividers
- **30% Structural & Secondary Tone**:
  - Slate text: `text-slate-100` (headings), `text-slate-300` (body), `text-slate-400` / `text-slate-500` (metadata/subtitles)
  - Midnight panel fills: `bg-slate-900/90`, `bg-slate-950/80`
- **10% Semantic Cyber Accent Lighting**:
  - **Electric Blue (`#2563EB` / `#3B82F6`)**: Primary CTAs, active presets, core conduits, Integrit shield brand mark.
  - **Cyan (`#06B6D4` / `#0891B2`)**: **Traefik Ingress Controller v3** routing nodes, TLS certificates, and Kubernetes conduits.
  - **Emerald Green (`#10B981` / `#059669`)**: **Proxmox Native LXC Containers**, clean legitimate traffic packets, 99.999% SLA indicators, and verified pass states.
  - **Crimson Red (`#EF4444` / `#DC2626`)**: Active DDoS botnet simulation, malicious packet streams, perimeter DROP indicators, and firewall deflection explosions.
  - **Amber Gold (`#F59E0B`)**: Ceph & Nutanix storage nodes, technical challenge callouts, and latency warnings.

### 2.2 Typography
- **Headings & Display**: `Plus Jakarta Sans` / System Sans (`font-display`, `font-bold`, tight letter spacing `-0.025em`)
- **Body & Paragraphs**: `DM Sans` / Inter (`leading-relaxed`, high contrast against dark backdrop)
- **Telemetry, Metrics & Terminal Data**: `JetBrains Mono` / monospace (`font-mono`, `tabular-nums`)

### 2.3 Anti-Slop Rules Enforced
- No pseudo-code comment headings (e.g. `// SECTION`, `/* TITLE */`).
- No generic AI pill badges with colored dots. Clean semantic micro-badges with monospace uppercase tracking.
- Every interactive element has a minimum touch target of **44px × 44px** on mobile.
- Zero horizontal scroll on mobile viewport screens (340px to 640px).

---

## 3. Technology Stack & Key Architectural Choices

### 3.1 Edge Routing: Traefik Ingress Controller v3 (Primary Standard)
- **Why Traefik**: Deployed as the standard ingress and edge routing engine. Traefik Proxy v3 provides dynamic service discovery across Kubernetes and Proxmox LXC containers, native Let's Encrypt automated TLS certificate renewal, rate-limiting middlewares, HTTP/3 QUIC support, and intuitive GitOps `IngressRoute` CRD management.
- **Alternatives evaluated in comparison modal**:
  - **HAProxy Enterprise**: Best for raw Layer-4 connection scale (100k+ concurrent TCP/HTTP connections).
  - **NGINX Enterprise**: Classic high-throughput static caching and reverse proxying.
- *Notice*: Cilium and Envoy are excluded per explicit client requirements to prioritize accessible, battle-tested ingress automation.

### 3.2 Containers: Proxmox Native LXC (Linux Containers)
- **Direct Kernel Execution**: Integrated natively into Proxmox VE (PVE). LXC containers share the host Linux kernel, eliminating hypervisor emulation overhead.
- **Microsecond Cold Boot**: Containers boot in `< 450ms` compared to `22s` for standard KVM virtual machines.
- **Memory Efficiency**: Zero guest OS RAM tax; allows up to **4.2x greater container density** per physical host, critical for edge infrastructure like ARRSH highway telemetry.

### 3.3 Perimeter Security: pfSense HA & Cisco Infrastructure
- **pfSense CARP Cluster**: Active-passive redundant firewall pairs with synchronized states (`pfsync`), preventing single points of failure during hardware maintenance.
- **Stateful Packet Inspection (SPI)**: Deflects Layer-3, Layer-4, and Layer-7 HTTP flood botnets.

---

## 4. Real-Time Architecture Simulation Engine (`HeroSimulation.tsx`)

### 4.1 Dual-Viewport Rendering Strategy
To guarantee 100% visibility, readability, and responsiveness across all devices:
1. **Desktop Panoramic Mode (`>= 768px`)**:
   - Horizontal SVG circuit topology with `viewBox="0 0 1000 520"`.
   - Tier 1 (x: 20%, Perimeter Firewalls) -> Tier 2 (x: 44%, Traefik Ingress) -> Tier 3 (x: 68%, Talos K8s / Proxmox LXC) -> Tier 4 (x: 88%, VMware vSAN / Ceph).
   - In-flight packet particles travel horizontally across cubic bezier conduit curves.
2. **Mobile Portrait SOC Board (`< 768px`)**:
   - Specifically engineered for vertical smartphone viewports (`viewBox="0 0 380 620"`).
   - **Zero horizontal scroll**: Fits perfectly on 360px–430px screens.
   - Flow: **Top (Internet Entry)** ➔ **Tier 1 (Firewalls)** ➔ **Tier 2 (Traefik Ingress)** ➔ **Tier 3 (LXC / K8s)** ➔ **Tier 4 (Hypervisors/Ceph)**.
   - Dedicated portrait packet animation loop: Red malicious packets stream down and violently deflect at Tier 1 with an animated `DROP` badge and pulse ring; legitimate emerald green packets proceed through Traefik into the containers and storage fabric.
   - Tap-to-inspect opens a mobile slide-up Bottom Sheet Modal with complete node specifications.

### 4.2 Interactive DDoS Mitigation Engine
- **Toggle State**: `isDdosActive: boolean`
- **When Active**:
  - Ingress traffic packet spawn rate jumps from 160ms to 80ms interval.
  - Threat ratio increases to 65% malicious packets.
  - Telemetry counters spike to `18,500+ pkt/s`.
  - Malicious packets get intercepted at `Tier 1 Firewalls` (`progress >= 0.28` on desktop, `progress >= 0.22` on mobile).
  - Malicious packets vanish into a red deflection explosion: `DROP 40Gbps [ACTIVE]`.
  - Legitimate packets continue uninterrupted to demonstrate zero false-positive rate.

---

## 5. Client Operations Portal & RFP Tracking Dashboard (`ClientDashboard.tsx`)

### 5.1 Architecture & Workflow
- Provides mission-grade transparency for prospective enterprise clients submitting RFPs.
- Tracks 5 project milestones:
  1. *Inquiry Received & NDA Countersignature* (Automated)
  2. *Workload & Network Topology Review* (Next Business Day)
  3. *Isolated PoC Architecture Blueprint* (Within 7 Days)
  4. *Security Audit & Zero-Trust Sign-off* (Within 14 Days)
  5. *Production Staging & Cutover Plan* (Target Schedule)
- Live SLA Metrics: `99.995% uptime`, `15-minute emergency response SLA`, `Zero SOC-2 audit breaches`.
- Real-time search by company, RFP number, or technology stack.
- Status filters: `In Review`, `Technical Assessment`, `PoC Blueprint`, `Hardened Staging`, `Production Cutover`.
- **Mobile Master-Detail Pattern**: Seamlessly toggles between the RFP list and full milestone detail view with smooth back-navigation.

---

## 6. Enterprise Proposal RFP Builder (`RfqContactSection.tsx`)

- Collects enterprise workload requirements:
  - Hypervisor selection: `Proxmox VE`, `VMware vSphere/vSAN`, `Nutanix AHV`.
  - Container engine: `Proxmox Native LXC`, `Talos OS Immutable Kubernetes`, `Standard K8s`.
  - Perimeter defense: `pfSense HA CARP Pair`, `Cisco ASA Firepower`.
  - Estimated nodes: `4-12 Nodes`, `12-30 Nodes`, `30-100+ Enterprise Cluster`.
  - Timeline & custom topology notes.
- Upon submission:
  - Generates a unique tracked RFP identifier (e.g., `RFP-2026-4891`).
  - Automatically prepends the new RFP to the `ClientDashboard` state with active milestones and SLA commitments.
  - Emits a global toast notification and provides a direct button to inspect the inquiry inside the live dashboard.

---

## 7. Instructions for Future AI Models & Engineers

When tasked with modifying or extending this application:
1. **Never Rename the App**: Keep `metadata.json` name as `"Integrit — Enterprise Cloud & Cybersecurity Consulting"`.
2. **Never Re-introduce Cilium or Envoy**: Traefik Proxy v3 is the established ingress standard. HAProxy and NGINX are the supported enterprise alternatives.
3. **Preserve Proxmox Native LXC**: In the ARRSH topology and capability matrices, always maintain Proxmox Native LXC container features.
4. **Maintain Mobile Discipline**:
   - Any modifications to `HeroSimulation.tsx` must maintain the dual-viewport approach (horizontal desktop SVG + vertical portrait mobile SVG).
   - Test that no element causes horizontal body scroll (`overflow-x-hidden` on main container).
   - Keep touch targets >= 44px.
5. **Verification**: Always run `compile_applet` and `lint_applet` together before concluding any turn.
