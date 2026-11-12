import { ArchitecturePreset, CaseStudy, ClientInquiry, TopologyNode } from '../types';

export const ARCHITECTURE_PRESETS: Record<
  ArchitecturePreset,
  {
    name: string;
    subtitle: string;
    client: string;
    description: string;
    primaryHypervisor: string;
    firewall: string;
    nodes: TopologyNode[];
  }
> = {
  akshi: {
    name: 'Sovereign Government Cloud',
    subtitle: 'AKSHI (National Agency for Information Society)',
    client: 'AKSHI Republic of Albania',
    description:
      'High-security sovereign cloud infrastructure powering e-Albania citizen digital services. Built on VMware vSAN enterprise clustering, air-gapped Talos Linux Kubernetes, and redundant pfSense/Cisco perimeter firewalls with automated BGP failover.',
    primaryHypervisor: 'VMware vSphere 8.0 & vSAN Enterprise',
    firewall: 'pfSense HA CARP Pair + Cisco Nexus ASA',
    nodes: [
      {
        id: 'fw-1',
        label: 'pfSense HA CARP #1',
        sublabel: 'Primary Perimeter Gateway',
        category: 'perimeter',
        tier: 1,
        x: 22,
        y: 28,
        status: 'nominal',
        specs: {
          technology: 'pfSense Plus 24.x CARP Failover',
          throughput: '40 Gbps Line-Rate',
          cpu: '8 vCPU (Xeon Platinum)',
          memory: '32 GB ECC DDR5',
          securityRules: '14,820 Stateful L4/L7 Rules',
          details: 'Hardware-accelerated crypto, automated sync via dedicated sync interface, Suricata IPS/IDS active inspection.',
        },
      },
      {
        id: 'fw-2',
        label: 'Cisco Nexus Core',
        sublabel: 'Spine & Layer-3 Boundary',
        category: 'perimeter',
        tier: 1,
        x: 22,
        y: 72,
        status: 'nominal',
        specs: {
          technology: 'Cisco Nexus 9300 Spine-and-Leaf',
          throughput: '100 Gbps Low Latency (<1μs)',
          cpu: 'Dedicated ASIC Pipeline',
          memory: '64 GB High-Speed TCAM',
          securityRules: 'Hardware ACLs & Micro-Segmentation',
          details: 'BGP EVPN VXLAN fabric interconnecting multi-datacenter nodes with automated route dampening.',
        },
      },
      {
        id: 'lb-1',
        label: 'Traefik Proxy v3',
        sublabel: 'Cloud-Native Ingress & Router',
        category: 'lb',
        tier: 2,
        x: 45,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'Traefik Proxy v3 Enterprise',
          throughput: '1.4M Requests/sec (HTTP/2 & HTTP/3)',
          cpu: '8 vCPU (Low-Latency Go Runtime)',
          memory: '16 GB RAM',
          securityRules: 'Automatic Let\'s Encrypt TLS + RateLimit Middleware',
          details: 'Auto-discovers Kubernetes services and Proxmox LXC containers dynamically. Handles automated certificate renewals, path-based routing, and zero-configuration SSL offload.',
        },
      },
      {
        id: 'k8s-1',
        label: 'Talos OS K8s Master',
        sublabel: 'Immutable Sovereign Plane',
        category: 'k8s',
        tier: 3,
        x: 68,
        y: 30,
        status: 'nominal',
        specs: {
          technology: 'Talos Linux 1.8 (Immutable Kernel)',
          throughput: '18,000 API Requests/sec',
          cpu: '12 vCPU Dedicated',
          memory: '32 GB RAM',
          securityRules: 'Air-gapped, zero SSH, mTLS gRPC only',
          details: 'Ephemeral read-only OS without shell or packages. Attack surface reduced by 92% compared to traditional Linux distros.',
        },
      },
      {
        id: 'k8s-2',
        label: 'Talos OS Citizen Workloads',
        sublabel: 'e-Services Microservices',
        category: 'k8s',
        tier: 3,
        x: 68,
        y: 70,
        status: 'nominal',
        specs: {
          technology: 'Kubernetes 1.31 + ArgoCD GitOps',
          throughput: '4,500 RPS per Container Pod',
          cpu: '64 vCPU Auto-Scaling Pool',
          memory: '256 GB RAM',
          securityRules: 'AppArmor + Seccomp strict enforcement',
          details: 'Handles millions of daily citizen requests for identity validation, licensing, and national cadastre queries.',
        },
      },
      {
        id: 'vm-1',
        label: 'VMware vSphere & vSAN',
        sublabel: 'All-NVMe Enterprise Storage',
        category: 'hypervisor',
        tier: 4,
        x: 90,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'VMware ESXi 8.0u3 + vSAN ESA',
          throughput: '1.2M IOPS @ 0.35ms latency',
          cpu: '128 Cores (Dual AMD EPYC 9654)',
          memory: '1.5 TB ECC Registered',
          securityRules: 'VMware Encryption + TPM 2.0 Attestation',
          details: 'Multi-datacenter active-active storage fabric guaranteeing zero data loss with synchronous metro-clustering.',
        },
      },
    ],
  },
  arrsh: {
    name: 'Distributed Telemetry & Edge Grid',
    subtitle: 'ARRSH (Albanian Road Authority)',
    client: 'ARRSH National Infrastructure',
    description:
      'Resilient hyper-converged edge telemetry network tracking national highway sensors, automated tolling, and smart CCTV streams. Engineered with Proxmox VE clustering, Ceph distributed storage, and zero-leak WireGuard tunnels across 48 remote highway nodes.',
    primaryHypervisor: 'Proxmox VE 8.2 Enterprise HA Cluster',
    firewall: 'pfSense Netgate Gateways + WireGuard Mesh',
    nodes: [
      {
        id: 'edge-gw',
        label: 'pfSense Edge Gateway',
        sublabel: 'WireGuard Multi-Point Hub',
        category: 'perimeter',
        tier: 1,
        x: 20,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'pfSense Netgate 6100 HA Pair',
          throughput: '10 Gbps WireGuard VPN Tunnel',
          cpu: '4 Core Intel Atom C3758R',
          memory: '16 GB DDR4',
          securityRules: 'Encrypted site-to-site tunnel policy',
          details: 'Securely aggregates encrypted telemetry from 48 remote edge points across Albanian national road arteries.',
        },
      },
      {
        id: 'pve-haproxy',
        label: 'HAProxy Edge Balancer',
        sublabel: 'L4/L7 Stream Router',
        category: 'lb',
        tier: 2,
        x: 42,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'HAProxy Enterprise 3.0',
          throughput: '1.8M Connections/sec',
          cpu: '8 vCPU Low-Latency Worker',
          memory: '16 GB RAM',
          securityRules: 'Hardware SSL offload & stick-tables',
          details: 'Dispatches high-frequency sensor streams, automated license plate cameras, and toll data to Proxmox LXC container pools.',
        },
      },
      {
        id: 'pve-lxc',
        label: 'Proxmox LXC Containers',
        sublabel: 'Lightweight System Pods',
        category: 'lxc',
        tier: 3,
        x: 68,
        y: 28,
        status: 'nominal',
        specs: {
          technology: 'Proxmox VE Native LXC (Linux Containers)',
          throughput: 'Near-Bare-Metal (>99.5% native IOPS)',
          cpu: 'Shared Host Linux Kernel (Zero VM overhead)',
          memory: '<120 MB RAM per instance',
          securityRules: 'AppArmor + Unprivileged Namespaces',
          details: 'Boots in under 250 milliseconds with zero hypervisor hardware emulation penalty. Used by ARRSH for high-density edge telemetry streaming pods.',
        },
      },
      {
        id: 'pve-ha-1',
        label: 'Proxmox KVM Compute',
        sublabel: 'Heavy Analytics & DB',
        category: 'hypervisor',
        tier: 3,
        x: 68,
        y: 72,
        status: 'nominal',
        specs: {
          technology: 'Proxmox VE 8.2 Cluster (Quorum 3/3)',
          throughput: '25 Gbps Corosync Sync Fabric',
          cpu: '32 Cores (AMD EPYC 7543)',
          memory: '256 GB ECC DDR4',
          securityRules: 'Proxmox Integrated Firewall + ZFS ACLs',
          details: 'Runs heavier stateful workloads, database instances, and automated VM watchdog failover in under 2.8 seconds.',
        },
      },
      {
        id: 'ceph-pool',
        label: 'Ceph Distributed Storage',
        sublabel: 'Object & Block Ring',
        category: 'storage',
        tier: 4,
        x: 90,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'Ceph Reef (3x Replication + NVMe Cache)',
          throughput: '450,000 Write IOPS',
          cpu: '16 Cores Ceph OSD Daemons',
          memory: '128 GB Cache Allocation',
          securityRules: 'End-to-end data encryption at rest (AES-256)',
          details: 'Self-healing distributed object storage holding years of road telemetry data with zero single point of failure.',
        },
      },
    ],
  },
  fintech: {
    name: 'Private Banking & Financial Core',
    subtitle: 'Tier-1 Balkan & International Cross-Border Fintech',
    client: 'FinTech & Banking Consortium',
    description:
      'Mission-critical financial transaction infrastructure engineered to exceed PCI-DSS Level 1 specifications. Deployed with Nutanix AHV active-active multi-datacenter synchronization, micro-segmented Cisco ACI networks, and sub-millisecond ledger reconciliation.',
    primaryHypervisor: 'Nutanix AHV & Prism Pro',
    firewall: 'Cisco Firepower Threat Defense (FTD) + pfSense Audit Zone',
    nodes: [
      {
        id: 'ftd-1',
        label: 'Cisco Firepower FTD',
        sublabel: 'Deep Packet Inspection & IPS',
        category: 'perimeter',
        tier: 1,
        x: 22,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'Cisco Secure Firewall 3100 Series',
          throughput: '34 Gbps NGFW with Threat Defense',
          cpu: 'Multi-Core Security Accelerator',
          memory: '64 GB RAM',
          securityRules: 'Strict PCI-DSS v4.0 Zero-Trust Rules',
          details: 'Deep packet inspection with SSL/TLS 1.3 hardware decryption and AI-driven automated zero-day malware quarantine.',
        },
      },
      {
        id: 'nutanix-1',
        label: 'Nutanix AHV Node Cluster A',
        sublabel: 'Primary Financial Datacenter',
        category: 'hypervisor',
        tier: 2,
        x: 48,
        y: 32,
        status: 'nominal',
        specs: {
          technology: 'Nutanix AHV Enterprise + Flow Micro-segmentation',
          throughput: 'Metro Availability (<0.5ms sync)',
          cpu: '64 Cores Intel Xeon Platinum 8480+',
          memory: '512 GB ECC DDR5',
          securityRules: 'Hardware Security Module (HSM) FIPS 140-2',
          details: 'Hosts core transaction processing VMs with automated micro-segmented isolation between banking channels.',
        },
      },
      {
        id: 'nutanix-2',
        label: 'Nutanix AHV Node Cluster B',
        sublabel: 'Secondary Disaster Recovery Site',
        category: 'hypervisor',
        tier: 2,
        x: 48,
        y: 68,
        status: 'nominal',
        specs: {
          technology: 'Nutanix AHV Active-Active Replication',
          throughput: 'Synchronous Mirroring over Dark Fiber',
          cpu: '64 Cores Intel Xeon Platinum 8480+',
          memory: '512 GB ECC DDR5',
          securityRules: 'Strict Role-Based Access Control (RBAC)',
          details: 'Instant zero-RPO failover capable of processing full banking volume without human intervention.',
        },
      },
      {
        id: 'talos-fin',
        label: 'Talos OS K8s Payment Gateway',
        sublabel: 'ISO 20022 Compliance Pods',
        category: 'k8s',
        tier: 3,
        x: 72,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'Talos Linux + Traefik Proxy mTLS',
          throughput: '25,000 Financial Ops/sec',
          cpu: '32 vCPU Dedicated',
          memory: '128 GB RAM',
          securityRules: 'End-to-end payload signing & envelope encryption',
          details: 'Stateless settlement worker pods handling ACH, SEPA, and SWIFT messaging with immutable auditing.',
        },
      },
      {
        id: 'audit-vault',
        label: 'Immutable Audit Vault',
        sublabel: 'Write-Once-Read-Many (WORM)',
        category: 'storage',
        tier: 4,
        x: 90,
        y: 50,
        status: 'nominal',
        specs: {
          technology: 'Encrypted Object Vault with Legal Hold',
          throughput: 'Sustained 400 MB/s Audit Stream',
          cpu: 'Dedicated Cryptographic Engine',
          memory: '32 GB RAM',
          securityRules: 'Cryptographically sealed ledger logs',
          details: 'Guarantees unalterable financial audit trails required by central bank and international regulatory bodies.',
        },
      },
    ],
  },
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'akshi-sovereign-cloud',
    clientName: 'AKSHI (National Agency for Information Society)',
    clientType: 'Government Sovereign Agency',
    tagline: 'Sovereign National Cloud Architecture & Zero-Trust Modernization',
    summary:
      'Architected and deployed a multi-datacenter sovereign virtualization backend powering e-Albania and critical national digital services for 2.8M citizens.',
    challenge:
      'AKSHI required an uncompromisable sovereign infrastructure capable of withstanding state-sponsored cyber warfare threats, eliminating vendor lock-in, and providing sub-second access to millions of daily citizen requests across 1,200+ government microservices.',
    solution:
      'Integrit engineered a hardened dual-layer architecture combining VMware vSAN enterprise clustering with an air-gapped Talos OS immutable Kubernetes tier. We implemented redundant pfSense HA firewalls and Cisco Nexus spine-leaf networking with Traefik Proxy dynamic ingress and zero-trust microsegmentation.',
    hypervisorStack: 'VMware vSphere 8.0u3, vSAN Enterprise ESA, NSX-T',
    containerStack: 'Talos Linux 1.8 (Immutable), Kubernetes 1.31, Traefik Proxy v3 Ingress',
    securityStack: 'pfSense HA CARP Failover, Cisco ASA/Nexus, Suricata IDS/IPS, Vault',
    metrics: [
      {
        label: 'Uptime SLA',
        value: '99.999%',
        context: 'Zero unmanaged downtime across 36 consecutive months of sovereign operations',
      },
      {
        label: 'Security Posture',
        value: '0 Breaches',
        context: 'Successfully neutralized over 14 million perimeter attack vectors and volumetric DDoS spikes',
      },
      {
        label: 'Hypervisor Efficiency',
        value: '+65%',
        context: 'Consolidation ratio improvement through all-NVMe vSAN flash caching',
      },
      {
        label: 'Citizen Throughput',
        value: '4.2M/day',
        context: 'Secured national digital identity, registry, and cadastre API transactions',
      },
    ],
    testimonial: {
      quote:
        'Integrit brought defense-grade infrastructure discipline to our sovereign cloud. Their deep command over VMware hypervisors, Talos OS container security, and network failover set a new benchmark for national resilience.',
      author: 'Director of Systems Architecture',
      title: 'AKSHI — National Agency for Information Society',
    },
  },
  {
    id: 'arrsh-telemetry-grid',
    clientName: 'ARRSH (Albanian Road Authority)',
    clientType: 'National Infrastructure',
    tagline: 'High-Availability Proxmox VE Edge Telemetry & WireGuard Network',
    summary:
      'Engineered an automated hyper-converged Proxmox VE cluster and distributed WireGuard mesh across 48 remote national highway infrastructure nodes.',
    challenge:
      'ARRSH faced recurring edge outages and excessive licensing fees on legacy appliances for highway telemetry, automated tolling systems, and video analytics spanning hundreds of kilometers of mountainous terrain.',
    solution:
      'Integrit designed a cost-effective, hyper-resilient open enterprise architecture: Proxmox VE 8.2 in high-availability 3-node quorum clusters integrated with Ceph Reef distributed storage, hardened pfSense Netgate appliances, and self-healing WireGuard mesh tunnels.',
    hypervisorStack: 'Proxmox VE 8.2 HA Cluster, Ceph Reef Distributed Storage, ZFS',
    containerStack: 'Proxmox Native LXC Containers (System Telemetry Pods) + Talos Linux',
    securityStack: 'pfSense Netgate Gateways, Traefik Edge Routers, WireGuard Mesh',
    metrics: [
      {
        label: 'Failover Speed',
        value: '< 2.8 sec',
        context: 'Automated Corosync quorum failover with zero manual intervention',
      },
      {
        label: 'Licensing Savings',
        value: '-72%',
        context: 'Direct reduction in annual proprietary hypervisor licensing overhead',
      },
      {
        label: 'LXC Pod Boot Time',
        value: '< 250 ms',
        context: 'Near-instantaneous telemetry collector container restart with shared kernel speed',
      },
      {
        label: 'Distributed Points',
        value: '48 Nodes',
        context: '100% interconnected edge nodes with automated encrypted telemetry backhaul',
      },
    ],
    testimonial: {
      quote:
        'By moving to an open enterprise Proxmox and Ceph cluster managed by Integrit, ARRSH gained superior reliability at a fraction of the cost. Their technical versatility is unmatched.',
      author: 'Head of Telecommunications & Intelligent Transport',
      title: 'ARRSH — Albanian Road Authority',
    },
  },
  {
    id: 'private-fintech-core',
    clientName: 'Tier-1 Banking & FinTech Group',
    clientType: 'Private Enterprise',
    tagline: 'Active-Active Multi-Datacenter Nutanix AHV Cloud & PCI-DSS Core',
    summary:
      'Designed zero-RPO active-active disaster recovery and micro-segmented financial transaction processing for cross-border banking operations.',
    challenge:
      'The client required sub-second ledger reconciliation across two geographically dispersed data centers while complying with stringent PCI-DSS v4.0 and central banking regulations.',
    solution:
      'Deployed Nutanix AHV with Prism Central and Flow Microsegmentation, coupled with Talos Linux payment processing clusters, Traefik mutual TLS proxy, and Cisco Firepower threat defense engines.',
    hypervisorStack: 'Nutanix AHV Enterprise, Prism Pro, Nutanix Flow Micro-segmentation',
    containerStack: 'Talos Linux, Traefik Proxy mTLS, HashiCorp Nomad & Vault',
    securityStack: 'Cisco Firepower 3100 Series, pfSense Audit Perimeter, FIPS 140-2 HSM',
    metrics: [
      {
        label: 'Disaster Recovery RPO',
        value: '0 sec',
        context: 'Zero transaction loss guaranteed via synchronous metro-mirroring',
      },
      {
        label: 'Compliance Score',
        value: '100%',
        context: 'Passed initial PCI-DSS v4.0 and SOC 2 Type II audit with zero findings',
      },
      {
        label: 'Transaction Rate',
        value: '25,000/s',
        context: 'Microservices settlement speed under maximum peak holiday load',
      },
      {
        label: 'Audit Integrity',
        value: 'WORM Vault',
        context: 'Cryptographically sealed unalterable financial transaction ledger',
      },
    ],
  },
];

export const TECHNICAL_CAPABILITIES = [
  {
    domain: 'Enterprise Virtualization & LXC',
    headline: 'Hyper-Converged Virtualization & Bare-Metal LXC Containers',
    description:
      'Production mastery across the dominant hypervisor and containerization ecosystems. Whether migrating away from rising VMware license fees, running dense Proxmox LXC system containers, or clustering Nutanix AHV fabrics.',
    skills: [
      {
        name: 'Proxmox VE & Native LXC',
        detail: 'Multi-node HA quorum clusters, Ceph integration, ZFS replication, and ultra-lightweight LXC system containers with sub-second boot times and zero hypervisor tax.',
      },
      {
        name: 'VMware vSphere & vSAN',
        detail: 'ESXi 8.0, vCenter, vSAN ESA all-NVMe storage, NSX-T distributed firewalling, and Tanzu Kubernetes Grid.',
      },
      {
        name: 'Nutanix AHV & Prism',
        detail: 'Hyperconverged compute/storage pools, Flow microsegmentation, and active-active multi-datacenter disaster recovery.',
      },
    ],
  },
  {
    domain: 'Immutable Cloud Native & Kubernetes',
    headline: 'Zero-Attack-Surface Container Infrastructure',
    description:
      'We discard vulnerable legacy Linux distributions in favor of purpose-built, API-driven immutable operating systems designed strictly for mission-critical Kubernetes and Traefik edge routing.',
    skills: [
      {
        name: 'Talos OS Linux',
        detail: 'Immutable, read-only root filesystem with zero SSH, zero packages, and 100% declarative gRPC API management.',
      },
      {
        name: 'Traefik Proxy & Ingress Routing',
        detail: 'Dynamic route discovery, automated Let\'s Encrypt TLS certificates, middleware chains, and path-based routing for Kubernetes and Proxmox LXC containers.',
      },
      {
        name: 'Ceph & Rook Storage',
        detail: 'Cloud-native software-defined block and object storage pools with autonomous self-healing and snapshotting.',
      },
    ],
  },
  {
    domain: 'Perimeter Security & Advanced Networking',
    headline: 'Defensive Network Architecture & Zero Trust',
    description:
      'Resilient perimeter defense, stateful packet filtering, and high-throughput inter-datacenter tunneling built to survive sophisticated nation-state attack vectors.',
    skills: [
      {
        name: 'pfSense HA CARP Clusters',
        detail: 'Redundant firewall pairs with automated state table synchronization (pfsync) and instant sub-second failover.',
      },
      {
        name: 'Cisco Spine-and-Leaf',
        detail: 'Nexus 9000/9300 architecture, BGP EVPN VXLAN fabrics, and hardware-accelerated access control lists.',
      },
      {
        name: 'Intrusion Detection (IDS/IPS)',
        detail: 'Suricata and Snort real-time threat inspection with automated IP reputation and DDoS mitigation rulesets.',
      },
    ],
  },
  {
    domain: 'Cloud Optimization & Migration',
    headline: 'FinOps, Hybrid Cloud & Cost Reduction',
    description:
      'We audit and restructure bloated enterprise cloud bills (AWS, Azure, Google Cloud, and On-Premises), delivering sustainable 35% to 55% infrastructure cost reductions.',
    skills: [
      {
        name: 'Multi-Cloud Architecture',
        detail: 'Hybrid interconnects, Direct Connect / ExpressRoute, and disaster recovery replication across cloud and on-premise.',
      },
      {
        name: 'Terraform & OpenTofu',
        detail: '100% Infrastructure-as-Code with automated drift detection, policy-as-code guardrails, and GitOps pipelines.',
      },
      {
        name: '24/7 SecOps & SRE Governance',
        detail: 'Dedicated monitoring pods in Tirana, Albania operating with 24/7 coverage and 15-minute emergency SLA.',
      },
    ],
  },
];

export const INITIAL_CLIENT_INQUIRIES: ClientInquiry[] = [
  {
    id: 'rfp-us-842',
    rfpNumber: 'RFP-2026-0842',
    companyName: 'Apex Financial Data Systems',
    location: 'Charlotte, NC',
    primaryService: 'VMware to Proxmox VE Migration & Ceph Storage',
    status: 'Hardened Staging',
    submissionDate: '2026-10-18',
    targetCompletion: '2026-12-05',
    slaTarget: '99.99% Uptime / 15-min Critical Response',
    budgetRange: '$85,000 — $120,000',
    primaryStack: ['Proxmox VE 8.2', 'Proxmox LXC', 'Ceph Reef NVMe', 'pfSense CARP'],
    contactName: 'Marcus Vance',
    contactEmail: 'm.vance@apexfindata.com',
    milestones: [
      { title: 'Discovery & Hypervisor Workload Audit', completed: true, date: '2026-10-22' },
      { title: 'Isolated PoC Cluster Benchmark in Tirana Lab', completed: true, date: '2026-11-02' },
      { title: 'Zero-Downtime Data Sync & Ceph Ring Config', completed: true, date: '2026-11-08' },
      { title: 'Hardened Staging & Pen-Testing Validation', completed: false, current: true, date: '2026-11-20' },
      { title: 'Final Production Cutover & 24/7 SRE Handoff', completed: false, date: '2026-12-05' },
    ],
  },
  {
    id: 'rfp-us-819',
    rfpNumber: 'RFP-2026-0819',
    companyName: 'Helios Healthcare Cloud Solutions',
    location: 'Austin, TX',
    primaryService: 'Talos OS Kubernetes & Traefik Dynamic Ingress',
    status: 'PoC Blueprint',
    submissionDate: '2026-10-28',
    targetCompletion: '2026-12-18',
    slaTarget: 'HIPAA & SOC 2 Type II Strict Compliance',
    budgetRange: '$110,000 — $160,000',
    primaryStack: ['Talos Linux', 'Traefik Proxy v3', 'pfSense HA', 'HashiCorp Vault'],
    contactName: 'Elena Rostova',
    contactEmail: 'elena.rostova@helioshealth.io',
    milestones: [
      { title: 'HIPAA Threat Model & BGP Network Review', completed: true, date: '2026-11-01' },
      { title: 'Talos Immutable OS Container Blueprint', completed: true, date: '2026-11-06' },
      { title: 'Traefik Dynamic TLS & Microsegmentation PoC', completed: false, current: true, date: '2026-11-15' },
      { title: 'Third-Party Pen-Test & Attestation', completed: false, date: '2026-11-30' },
      { title: 'Multi-Region High Availability Rollout', completed: false, date: '2026-12-18' },
    ],
  },
  {
    id: 'rfp-us-794',
    rfpNumber: 'RFP-2026-0794',
    companyName: 'Vanguard Logistics & Fleet IoT',
    location: 'Chicago, IL',
    primaryService: 'Distributed Edge Gateway & Cisco ASA Hardening',
    status: 'Production Cutover',
    submissionDate: '2026-09-12',
    targetCompletion: '2026-11-14',
    slaTarget: 'Sub-10ms Telemetry Routing / 24/7 Monitoring',
    budgetRange: '$65,000 — $90,000',
    primaryStack: ['Cisco Nexus', 'pfSense Edge', 'WireGuard Mesh', 'Proxmox LXC'],
    contactName: 'David K. Miller',
    contactEmail: 'dmiller@vanguardlogistics.net',
    milestones: [
      { title: 'Edge Telemetry Bandwidth Assessment', completed: true, date: '2026-09-18' },
      { title: 'Hardware Appliance Provisioning & Testing', completed: true, date: '2026-10-04' },
      { title: 'WireGuard Multi-Point Hub Deployment', completed: true, date: '2026-10-22' },
      { title: 'Disaster Recovery Simulation & Validation', completed: true, date: '2026-11-03' },
      { title: 'Production Cutover & Dedicated Support Handoff', completed: false, current: true, date: '2026-11-14' },
    ],
  },
  {
    id: 'rfp-us-855',
    rfpNumber: 'RFP-2026-0855',
    companyName: 'Beacon BioTech Research Core',
    location: 'Boston, MA',
    primaryService: 'High-Performance Ceph Storage & Compute Cluster',
    status: 'Technical Assessment',
    submissionDate: '2026-11-04',
    targetCompletion: '2027-01-15',
    slaTarget: '99.999% Storage Integrity / Petabyte Scale',
    budgetRange: '$140,000 — $195,000',
    primaryStack: ['VMware vSAN', 'Ceph Reef', 'Talos OS', 'Cisco 100G Fabric'],
    contactName: 'Dr. Sarah Chen',
    contactEmail: 'schen@beaconbiotech.org',
    milestones: [
      { title: 'Storage IOPS & Genomic Pipeline Sizing', completed: true, date: '2026-11-07' },
      { title: 'Technical Architecture Assessment Document', completed: false, current: true, date: '2026-11-18' },
      { title: 'Hardware Bill of Materials & Quorum Design', completed: false, date: '2026-11-28' },
      { title: 'Staging Benchmarks & Stress Simulation', completed: false, date: '2026-12-15' },
      { title: 'Final Cluster Deployment & Data Migration', completed: false, date: '2027-01-15' },
    ],
  },
];

export interface IngressTechnology {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  throughput: string;
  latency: string;
  keyStrengths: string[];
}

export const INGRESS_ALTERNATIVES: IngressTechnology[] = [
  {
    id: 'traefik',
    name: 'Traefik Proxy v3 (Selected Primary)',
    category: 'Cloud-Native Ingress, Dynamic Router & Edge Gateway',
    description:
      'The modern, practical, and highly maintainable edge router built in Go. Excels at automated dynamic service discovery (Kubernetes IngressRoute, Proxmox LXC, Docker, Consul), native automatic Let\'s Encrypt SSL certificates, and middleware chains.',
    bestFor:
      'Production Kubernetes clusters, Proxmox LXC containers, microservice routing, automated TLS certificate lifecycles, and rapid developer velocity.',
    throughput: '1.4M+ Requests/sec (HTTP/2 & HTTP/3)',
    latency: '0.22 ms',
    keyStrengths: [
      '100% automated Let\'s Encrypt ACME TLS certificate provisioning and renewal',
      'Dynamic configuration without restarts or dropped connections',
      'Intuitive middleware pipeline (RateLimit, ForwardAuth, BasicAuth, Headers, Retries)',
      'Native multi-provider discovery (Kubernetes CRDs, Docker, Proxmox LXC API)',
    ],
  },
  {
    id: 'haproxy',
    name: 'HAProxy Enterprise',
    category: 'Enterprise L4/L7 Reverse Proxy & Load Balancer',
    description:
      'The world-recognized gold standard for ultra-reliable high-availability load balancing. Known for microsecond latency, deterministic memory footprint, and native sync with pfSense/pfsync.',
    bestFor:
      'High-availability enterprise backends, bare-metal clusters, stateful TCP/HTTP sessions, and pfSense/Proxmox integrations.',
    throughput: '2.5M+ Requests/sec line-rate',
    latency: '0.12 ms',
    keyStrengths: [
      'Zero-downtime hot reloads without dropping connections',
      'Advanced stick-tables for real-time DDoS rate limiting & IP reputation',
      'Extremely lean C codebase with zero garbage collection pauses',
      'Native seamless pairing with pfSense CARP redundant firewalls',
    ],
  },
  {
    id: 'nginx',
    name: 'NGINX Enterprise / NGINX Ingress',
    category: 'Universal Reverse Proxy, API Gateway & Web Server',
    description:
      'The most widely deployed reverse proxy and web server globally. Excels at HTTP/2 & HTTP/3 termination, static asset caching, API authentication, and flexible Lua/JavaScript dynamic routing.',
    bestFor:
      'API gateways, public web traffic termination, microservice edge routing, and traditional enterprise DMZs.',
    throughput: '1.2M+ Requests/sec',
    latency: '0.35 ms',
    keyStrengths: [
      'Universal enterprise familiarity across global devops teams',
      'Rich module ecosystem (OpenResty, Lua, Wasm, ModSecurity WAF)',
      'High-performance SSL/TLS hardware offloading and caching',
      'Native Kubernetes NGINX Ingress Controller support',
    ],
  },
];

export const LXC_VS_VM_COMPARISON = {
  title: 'Proxmox Native LXC (Linux Containers) vs. KVM Virtual Machines vs. Kubernetes',
  description:
    'Why Integrit implements LXC containers on Proxmox VE for lightweight enterprise workloads and edge telemetry:',
  aspects: [
    {
      metric: 'Kernel Architecture',
      lxc: 'Shares Host Linux Kernel (Namespaces & cgroups)',
      kvm: 'Full Hardware Emulation (Separate QEMU Kernel)',
      k8s: 'Container runtime (Containerd/CRI-O) on OS node',
      advantage: 'LXC eliminates kernel duplication and hardware virtualization overhead.',
    },
    {
      metric: 'Boot Time',
      lxc: '< 250 milliseconds',
      kvm: '15 to 45 seconds (Full BIOS/UEFI boot)',
      k8s: '1 to 5 seconds per pod',
      advantage: 'LXC containers launch virtually instantaneously.',
    },
    {
      metric: 'Memory Footprint',
      lxc: '15MB - 80MB baseline RAM',
      kvm: '1GB - 4GB baseline per VM (OS overhead)',
      k8s: 'Varies with container image',
      advantage: 'Run 10x more LXC instances per physical Proxmox host.',
    },
    {
      metric: 'Raw I/O & Compute Performance',
      lxc: '99.8% of Bare-Metal Speed',
      kvm: '92% - 96% (VirtIO driver abstraction)',
      k8s: '95% - 98% (CNI dependent)',
      advantage: 'Direct access to NVMe storage and CPU cycles with zero emulation penalty.',
    },
    {
      metric: 'Security Isolation',
      lxc: 'Unprivileged containers + AppArmor/Seccomp',
      kvm: 'Hardware ring-0 boundary / Intel VT-x / AMD-V',
      k8s: 'Pod security standards & network policies',
      advantage: 'KVM for untrusted multi-tenant code; LXC for trusted high-density infrastructure microservices.',
    },
  ],
};
