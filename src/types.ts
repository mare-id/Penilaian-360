export interface Employee {
  id: number;
  nama: string;
  nip: string;
  gol: string;
  jabatan: string;
  jenis: string;
  unit: string;
  atasanId: number | null;
  hasSub: boolean;
  role: string;
  username?: string;
  password?: string;
  email?: string;
  hp?: string;
}

export interface Assignment {
  id: number;
  periodId: number;
  evalueeId: number;
  evaluatorId: number;
  type: string; // "Atasan" | "Peer" | "Bawahan" | "Diri"
  status: string; // "Belum Mulai" | "Selesai" | "Sedang Diisi"
  approved: boolean;
}

export interface Response {
  assignmentId: number;
  scores: Record<string, number>; // Dimension key mapped to average score (1-5)
  comments: string;
  submittedAt: string;
}

export interface Objection {
  id: number;
  periodId: number;
  evalueeId: number;
  type: string;
  reason: string;
  evidence?: string;
  status: string; // "Diajukan" | "Diproses" | "Selesai" | "Ditolak"
  createdAt: string;
  note?: string;
}

export interface PendingRaters {
  id: number;
  evalueeId: number;
  proposedIds: number[];
  status: string; // "Menunggu Verifikasi" | "Disetujui" | "Ditolak"
  submittedAt: string;
  rejectionReason?: string;
}

export interface OrgUnit {
  id: number;
  name: string;
  parentId: number | null;
  type: string;
}

export interface Job {
  id: number;
  name: string;
  type: string; // "JPT Pratama" | "Administrator" | "Pengawas" | "Fungsional" | "Pelaksana"
  defaultUnit: string;
  leadership: boolean;
  description: string;
}

export interface Weights {
  Atasan: number;
  Peer: number;
  Bawahan?: number;
}

export interface Period {
  id: number;
  name: string;
  start: string;
  end: string;
  status: string;
  minPeer: number;
  maxPeer: number;
  maxBawahan?: number;
  enforceMaxBawahan?: boolean;
  autoFillPeers?: boolean;
  randomizePeers?: boolean;
  weightsWithSub: Weights;
  weightsNoSub: Weights;
  type?: "Bulanan" | "Triwulan" | "Custom";
  selectedMonth?: string;
  selectedQuarter?: string;
  selectedYear?: number;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  password?: string;
  role: string;
}

export interface AppState {
  employees: Employee[];
  assignments: Assignment[];
  responses: Response[];
  objections: Objection[];
  pendingRaters: PendingRaters[];
  orgUnits: OrgUnit[];
  jobs: Job[];
  period: Period;
  periods?: Period[];
  admins?: AdminUser[];
}

export interface DemoAccount {
  nip: string;
  password?: string;
  role: string;
  name: string;
  userId: number;
  username?: string;
}
