export type ArchitecturePreset = 'akshi' | 'arrsh' | 'fintech';

export type TrafficType = 'normal' | 'ddos';

export type IngressOption = 'traefik' | 'haproxy' | 'nginx';

export interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'perimeter' | 'lb' | 'k8s' | 'lxc' | 'hypervisor' | 'storage';
  tier: number; // 1 to 4
  x: number; // percentage in SVG coordinate space
  y: number; // percentage
  status: 'nominal' | 'mitigating' | 'active' | 'blocked';
  specs: {
    technology: string;
    throughput: string;
    cpu: string;
    memory: string;
    securityRules: string;
    details: string;
  };
}

export interface Packet {
  id: number;
  type: 'legitimate' | 'malicious';
  progress: number; // 0 to 1
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  blockedAtPerimeter?: boolean;
}

export interface CaseStudy {
  id: string;
  clientName: string;
  clientType: 'Government Sovereign Agency' | 'National Infrastructure' | 'Private Enterprise';
  tagline: string;
  summary: string;
  challenge: string;
  solution: string;
  hypervisorStack: string;
  containerStack: string;
  securityStack: string;
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
}

export interface ClientInquiry {
  id: string;
  rfpNumber: string;
  companyName: string;
  location: string;
  primaryService: string;
  status: 'In Review' | 'Technical Assessment' | 'PoC Blueprint' | 'Hardened Staging' | 'Production Cutover';
  submissionDate: string;
  targetCompletion: string;
  slaTarget: string;
  budgetRange: string;
  primaryStack: string[];
  contactName: string;
  contactEmail: string;
  milestones: {
    title: string;
    completed: boolean;
    current?: boolean;
    date: string;
  }[];
}

export interface RfqFormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  companyLocation: string;
  selectedServices: string[];
  hypervisorPreference: string;
  containerRequirement: string;
  firewallRequirement: string;
  estimatedNodes: string;
  timeline: string;
  notes: string;
}
