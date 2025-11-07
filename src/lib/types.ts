// src/lib/types.ts (DUMMY DATA)

export interface Project {
  projectId: number;
  name: string;
  location: string;
  co2Amount: number; // Ton CO2
  pricePerTon: number; // ETH Price Placeholder
  isForSale: boolean;
  imageHash: string;
  type: 'Reforestasi' | 'Mangrove' | 'Energi Terbarukan';
}

export interface Certificate {
  type: 'Proyek' | 'Pensiun';
  certId: string;
  projectId: number;
  projectName: string;
  issuedTo: string;
  date: string;
  co2Amount: number;
  verifier: string;
  txHash: string;
}

export interface UserAsset {
  balance: number;
  tokenId: number;
}

// Data Dummy
export const DUMMY_PROJECTS: Project[] = [
  { projectId: 1, name: "Mangrove Delta Kalimantan", location: "Kalimantan Barat", co2Amount: 5000, pricePerTon: 0.001, isForSale: true, imageHash: 'mangrove.png', type: 'Mangrove' },
  { projectId: 2, name: "Reboisasi Hutan Sumatra", location: "Sumatra Utara", co2Amount: 2500, pricePerTon: 0.0015, isForSale: true, imageHash: 'sumatra.png', type: 'Reforestasi' },
  { projectId: 3, name: "Solar Panel Komunitas", location: "Jawa Tengah", co2Amount: 1000, pricePerTon: 0.0008, isForSale: false, imageHash: 'solar.png', type: 'Energi Terbarukan' },
];

export const DUMMY_USER_TOKENS: UserAsset[] = [
    { balance: 1250, tokenId: 1 },
    { balance: 350, tokenId: 2 },
];

export const DUMMY_CERTIFICATES: Certificate[] = [
    { type: 'Pensiun', certId: 'CF-R-001', projectId: 1, projectName: 'Mangrove Delta Kalimantan', issuedTo: 'PT. Polutif', date: '2025-11-01', co2Amount: 3750, verifier: '0x5B3...ddC4', txHash: '0xabc123...', },
    { type: 'Proyek', certId: 'CF-P-002', projectId: 2, projectName: 'Reboisasi Hutan Sumatra', issuedTo: 'NGO A', date: '2025-10-15', co2Amount: 2500, verifier: '0x5B3...ddC4', txHash: '0xdef456...', },
];