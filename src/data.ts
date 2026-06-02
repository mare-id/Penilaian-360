import { DemoAccount, OrgUnit, Job, Employee, Assignment, Response, Objection, PendingRaters, AppState, AdminUser } from "./types";

export const demoAccounts: DemoAccount[] = [
  { nip: "", username: "admin", password: "admin123", role: "Admin BKPSDM", name: "Administrator BKPSDM", userId: 0 },
  { nip: "196906031990091001", password: "admin123", role: "ASN", name: "Drs. Junihardi David Ricardo Siregar, MM", userId: 1 },
  { nip: "198803152007011004", password: "admin123", role: "ASN", name: "Roy Karya Marco Sinaga, S.IP, M.Si", userId: 2 },
  { nip: "199908232021081003", password: "admin123", role: "ASN", name: "Richad Mika Sinaga, S.Tr.IP", userId: 12 },
  { nip: "198508252010012001", password: "admin123", role: "ASN", name: "Lestari Yudianti Sinaga, SE", userId: 13 },
  { nip: "198506232010012027", password: "admin123", role: "ASN", name: "Minar Berutu, A.Md", userId: 9 },
];

export const orgUnitCatalog: OrgUnit[] = [
  { id: 1, name: "Kepala Badan", parentId: null, type: "Pucuk Pimpinan" },
  { id: 2, name: "Kelompok Jabatan Fungsional", parentId: 1, type: "Kelompok" },
  { id: 3, name: "Sekretariat Badan", parentId: 1, type: "Sekretariat" },
  { id: 4, name: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", parentId: 3, type: "Subbagian" },
  { id: 5, name: "Subbagian Umum Kepegawaian dan Aset", parentId: 3, type: "Subbagian" },
  { id: 6, name: "Bidang Pengadaan, Mutasi dan Informasi", parentId: 1, type: "Bidang" },
  { id: 7, name: "Jabatan Fungsional Bidang Pengadaan, Mutasi dan Informasi", parentId: 6, type: "Kelompok Jabatan Fungsional" },
  { id: 8, name: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", parentId: 1, type: "Bidang" },
  { id: 9, name: "Jabatan Fungsional Bidang Pembinaan dan Pengembangan SDM", parentId: 8, type: "Kelompok Jabatan Fungsional" },
];

export const jobCatalog: Job[] = [
  { id: 1, name: "Kepala Badan", type: "JPT Pratama", defaultUnit: "Kepala Badan", leadership: true, description: "Pimpinan tertinggi BKPSDM." },
  { id: 2, name: "Sekretaris Badan", type: "Administrator", defaultUnit: "Sekretariat Badan", leadership: true, description: "Koordinasi sekretariat, program, keuangan, umum, kepegawaian, dan aset." },
  { id: 3, name: "Kepala Subbagian Perencanaan, Program Pelaporan dan Keuangan", type: "Pengawas", defaultUnit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", leadership: true, description: "Mengelola perencanaan, program, pelaporan, dan keuangan." },
  { id: 4, name: "Kepala Subbagian Umum Kepegawaian dan Aset", type: "Pengawas", defaultUnit: "Subbagian Umum Kepegawaian dan Aset", leadership: true, description: "Mengelola umum, administrasi kepegawaian internal, dan aset." },
  { id: 5, name: "Kepala Bidang Pengadaan, Mutasi dan Informasi", type: "Administrator", defaultUnit: "Bidang Pengadaan, Mutasi dan Informasi", leadership: true, description: "Mengelola pengadaan ASN, mutasi, dan informasi kepegawaian." },
  { id: 6, name: "Kepala Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", type: "Administrator", defaultUnit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", leadership: true, description: "Mengelola pembinaan dan pengembangan SDM aparatur." },
  { id: 7, name: "Analis SDM Aparatur", type: "Fungsional", defaultUnit: "Kelompok Jabatan Fungsional", leadership: false, description: "Jabatan fungsional bidang manajemen ASN." },
  { id: 8, name: "Pranata Komputer", type: "Fungsional", defaultUnit: "Jabatan Fungsional Bidang Pengadaan, Mutasi dan Informasi", leadership: false, description: "Pengelolaan sistem informasi dan dukungan digital." },
  { id: 9, name: "Pengelola Data Kepegawaian", type: "Pelaksana", defaultUnit: "Bidang Pengadaan, Mutasi dan Informasi", leadership: false, description: "Pengelolaan data administrasi kepegawaian." },
  { id: 10, name: "Pengadministrasi Kepegawaian", type: "Pelaksana", defaultUnit: "Subbagian Umum Kepegawaian dan Aset", leadership: false, description: "Administrasi surat, dokumen, dan layanan internal kepegawaian." },
];

export const initialEmployees: Employee[] = [
  { id: 1, nama: "Drs. Junihardi David Ricardo Siregar, MM", nip: "196906031990091001", gol: "IV/c", jabatan: "Kepala Badan", jenis: "JPT Pratama", unit: "Kepala Badan", atasanId: null, hasSub: true, role: "ASN" },
  { id: 2, nama: "Roy Karya Marco Sinaga, S.IP, M.Si", nip: "198803152007011004", gol: "IV/a", jabatan: "Sekretaris Baden", jenis: "Administrator", unit: "Sekretariat Badan", atasanId: 1, hasSub: true, role: "ASN" },
  { id: 3, nama: "Angelius Henry Sigalingging, SE, M.AP", nip: "198204132008051001", gol: "III/d", jabatan: "Kabid Pembinaan dan Pengembangan SDM", jenis: "Administrator", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 1, hasSub: true, role: "ASN" },
  { id: 4, nama: "Try Saputra Sinaga, S.STP, M.Si", nip: "199205262014061001", gol: "III/d", jabatan: "Kabid Pengadaan, Mutasi dan Informasi", jenis: "Administrator", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 1, hasSub: true, role: "ASN" },
  { id: 5, nama: "Buha Pasaribu", nip: "196903091990031004", gol: "III/d", jabatan: "Analis SDM Aparatur Ahli Muda", jenis: "Fungsional", unit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", atasanId: 6, hasSub: false, role: "ASN" },
  { id: 6, nama: "Lindawaty Veronika Malau, SE, MM", nip: "198511222011012009", gol: "III/c", jabatan: "Kasubbag Perencanaan, Program Pelaporan dan Keuangan", jenis: "Pengawas", unit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", atasanId: 2, hasSub: true, role: "ASN" },
  { id: 7, nama: "Togap Simanullang", nip: "197901201998031002", gol: "III/d", jabatan: "Kasubbag Umum, Kepegawaian dan Aset", jenis: "Pengawas", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 2, hasSub: true, role: "ASN" },
  { id: 8, nama: "Hendra Supreddi Simaremare, S.I.P", nip: "198307262005021001", gol: "III/c", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
  { id: 9, nama: "Minar Berutu, A.Md", nip: "198506232010012027", gol: "III/b", jabatan: "Penata Layanan Operasional", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
  { id: 10, nama: "Robinson Silalahi, SE", nip: "197312052006041007", gol: "III/c", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
  { id: 11, nama: "Maria Morina Seniwaty Simbolon, S.M", nip: "198609152011012014", gol: "III/b", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
  { id: 12, nama: "Richad Mika Sinaga, S.Tr.IP", nip: "199908232021081003", gol: "III/a", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 4, hasSub: false, role: "ASN" },
  { id: 13, nama: "Lestari Yudianti Sinaga, SE", nip: "198508252010012001", gol: "III/b", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 4, hasSub: false, role: "ASN" },
  { id: 14, nama: "Sarden Sihotang, S.Kom", nip: "198909292019031014", gol: "III/a", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 4, hasSub: false, role: "ASN" },
  { id: 15, nama: "Ricky Suhendra Lumbangaol, A.Md", nip: "199310132019031009", gol: "III/a", jabatan: "Pengolah Data dan Informasi", jenis: "Pelaksana", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 4, hasSub: false, role: "ASN" },
  { id: 16, nama: "Rumondang Purba, A.Md", nip: "197405252011012001", gol: "III/b", jabatan: "Pengolah Data dan Informasi", jenis: "Pelaksana", unit: "Bidang Pengadaan, Mutasi dan Informasi", atasanId: 4, hasSub: false, role: "ASN" },
  { id: 17, nama: "Melda Heni Indrawati Sagala, S.IP", nip: "198606152006042005", gol: "III/c", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 3, hasSub: false, role: "ASN" },
  { id: 18, nama: "Bobby Johan Purba, S.STP, M.A.P", nip: "199611172019081001", gol: "III/a", jabatan: "Penelaah Teknis Kebijakan", jenis: "Pelaksana", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 3, hasSub: false, role: "ASN" },
  { id: 19, nama: "Samuel Kevin Sinamo, S.Tr.IP", nip: "200209222024091001", gol: "III/a", jabatan: "Fasilitator Pemerintahan", jenis: "Pelaksana", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 3, hasSub: false, role: "ASN" },
  { id: 20, nama: "Sari Nurlailan Br. Pardede", nip: "198005282025212006", gol: "III/a", jabatan: "Pengadministrasi Perkantoran", jenis: "Pelaksana", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 3, hasSub: false, role: "ASN" },
  { id: 21, nama: "Ridwan K. Banjarnahor", nip: "198708232025211011", gol: "III/a", jabatan: "Pengadministrasi Perkantoran", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
  { id: 22, nama: "Felly Fiyanti Br. Ginting", nip: "199302242025212010", gol: "III/a", jabatan: "Pengadministrasi Perkantoran", jenis: "Pelaksana", unit: "Subbagian Umum Kepegawaian dan Aset", atasanId: 7, hasSub: false, role: "ASN" },
];

export const dimensions = [
  { key: "pelayanan", name: "Berorientasi Pelayanan", icon: "🫱🏻‍🫲🏼", questions: ["Merespons kebutuhan layanan dengan cepat dan tepat.", "Menunjukkan sikap ramah dalam memberikan pelayanan.", "Memberikan solusi atas kebutuhan atau keluhan pemangku kepentingan.", "Menindaklanjuti permintaan layanan secara jelas."] },
  { key: "akuntabel", name: "Akuntabel", icon: "⚖️", questions: ["Menyelesaikan tugas sesuai tanggung jawab.", "Jujur dalam melaporkan hasil kerja.", "Mematuhi aturan dan prosedur kerja.", "Menggunakan sumber daya organisasi secara bertanggung jawab."] },
  { key: "kompeten", name: "Kompeten", icon: "📚", questions: ["Berusaha meningkatkan kemampuan diri.", "Menyelesaikan pekerjaan dengan kualitas terbaik.", "Membantu rekan kerja memahami tugas.", "Terbuka terhadap masukan untuk perbaikan kinerja."] },
  { key: "harmonis", name: "Harmonis", icon: "🌿", questions: ["Menghargai perbedaan pendapat.", "Menjaga hubungan kerja yang kondusif.", "Tidak menciptakan konflik yang merugikan tim.", "Mendukung suasana kerja yang saling menghormati."] },
  { key: "loyal", name: "Loyal", icon: "🛡️", questions: ["Menjaga nama baik instansi.", "Menjaga kerahasiaan data dan informasi jabatan.", "Mendukung kebijakan organisasi.", "Menunjukkan dedikasi terhadap tugas kedinasan."] },
  { key: "adaptif", name: "Adaptif", icon: "⚡", questions: ["Terbuka terhadap perubahan.", "Cepat menyesuaikan diri dengan sistem atau kebijakan baru.", "Mencari cara kerja yang lebih efektif.", "Proaktif menghadapi masalah pekerjaan."] },
  { key: "kolaboratif", name: "Kolaboratif", icon: "🧩", questions: ["Bersedia bekerja sama lintas bidang.", "Berbagi informasi yang dibutuhkan tim.", "Mendukung pencapaian tujuan bersama.", "Menghargai kontribusi orang lain."] },
  { key: "kepemimpinan", name: "Kepemimpinan", icon: "🎯", leadershipOnly: true, questions: ["Memberikan arahan kerja yang jelas kepada bawahan.", "Membina bawahan secara adil dan objektif.", "Mengambil keputusan dengan pertimbangan yang matang.", "Melakukan pengawasan tanpa intimidasi.", "Memberikan teladan perilaku kerja yang baik."] },
];

export const initialAssignments: Assignment[] = [
  // Evaluee Minar Berutu (ID: 9)
  { id: 1, periodId: 1, evalueeId: 9, evaluatorId: 7, type: "Atasan", status: "Selesai", approved: true },
  { id: 2, periodId: 1, evalueeId: 9, evaluatorId: 8, type: "Peer", status: "Selesai", approved: true },
  { id: 3, periodId: 1, evalueeId: 9, evaluatorId: 10, type: "Peer", status: "Belum Mulai", approved: true },

  // Evaluee Richad Mika Sinaga (ID: 12)
  { id: 4, periodId: 1, evalueeId: 12, evaluatorId: 4, type: "Atasan", status: "Selesai", approved: true },
  { id: 5, periodId: 1, evalueeId: 12, evaluatorId: 13, type: "Peer", status: "Belum Mulai", approved: true },
  { id: 6, periodId: 1, evalueeId: 12, evaluatorId: 14, type: "Peer", status: "Selesai", approved: true },

  // Evaluee Bobby Johan Purba (ID: 18)
  { id: 7, periodId: 1, evalueeId: 18, evaluatorId: 3, type: "Atasan", status: "Belum Mulai", approved: true },
  { id: 8, periodId: 1, evalueeId: 18, evaluatorId: 17, type: "Peer", status: "Belum Mulai", approved: true },
  { id: 9, periodId: 1, evalueeId: 18, evaluatorId: 19, type: "Peer", status: "Selesai", approved: true },

  // Evaluee Angelius Henry Sigalingging (Kabid, ID: 3)
  { id: 10, periodId: 1, evalueeId: 3, evaluatorId: 1, type: "Atasan", status: "Selesai", approved: true },
  { id: 11, periodId: 1, evalueeId: 3, evaluatorId: 17, type: "Bawahan", status: "Selesai", approved: true },
  { id: 12, periodId: 1, evalueeId: 3, evaluatorId: 18, type: "Bawahan", status: "Belum Mulai", approved: true },

  // Evaluee Roy Karya Marco Sinaga (Sekretaris, ID: 2)
  { id: 13, periodId: 1, evalueeId: 2, evaluatorId: 1, type: "Atasan", status: "Selesai", approved: true },
  { id: 14, periodId: 1, evalueeId: 2, evaluatorId: 5, type: "Bawahan", status: "Selesai", approved: true },
  { id: 15, periodId: 1, evalueeId: 2, evaluatorId: 6, type: "Bawahan", status: "Selesai", approved: true },
];

function scorePack(base = 4) {
  const pack: Record<string, number> = {};
  dimensions.forEach((d, i) => {
    pack[d.key] = Math.max(3, Math.min(5, base + ((i % 3) - 1) * 0.2));
  });
  return pack;
}

export const initialResponses: Response[] = [
  { assignmentId: 1, scores: scorePack(4.4), comments: "Responsif dan mampu menjaga ritme kerja.", submittedAt: "2026-05-21" },
  { assignmentId: 2, scores: scorePack(4.2), comments: "Kolaboratif dan mudah diajak koordinasi.", submittedAt: "2026-05-22" },
  { assignmentId: 4, scores: scorePack(4.1), comments: "Perlu meningkatkan dokumentasi tindak lanjut.", submittedAt: "2026-05-20" },
  { assignmentId: 6, scores: scorePack(4.5), comments: "Sangat membantu di pekerjaan lintas bidang.", submittedAt: "2026-05-22" },
  { assignmentId: 9, scores: scorePack(3.8), comments: "Perlu konsistensi dalam ketepatan waktu.", submittedAt: "2026-05-19" },
  { assignmentId: 10, scores: scorePack(4.4), comments: "Arahannya jelas dan tenang dalam mengambil keputusan.", submittedAt: "2026-05-21" },
  { assignmentId: 11, scores: scorePack(4.1), comments: "Pembinaan cukup baik, perlu lebih sering memberi umpan balik.", submittedAt: "2026-05-23" },
  { assignmentId: 13, scores: scorePack(4.6), comments: "Kuat dalam pengembangan kompetensi dan inovasi.", submittedAt: "2026-05-24" },
  { assignmentId: 14, scores: scorePack(4.8), comments: "Memberi arahan yang detail.", submittedAt: "2026-05-24" },
  { assignmentId: 15, scores: scorePack(4.7), comments: "Konsisten mendukung tim.", submittedAt: "2026-05-24" },
];

export const initialObjections: Objection[] = [
  { id: 1, periodId: 1, evalueeId: 14, type: "Evaluator belum menilai", reason: "Jumlah penilai belum lengkap sampai H-2 batas akhir.", status: "Diproses", createdAt: "2026-05-29", note: "Menunggu klarifikasi evaluator." },
];

export const initialPendingRaters: PendingRaters[] = [
  { id: 1, evalueeId: 13, proposedIds: [14, 15], status: "Menunggu Verifikasi", submittedAt: "2026-05-28", rejectionReason: "" },
  { id: 2, evalueeId: 17, proposedIds: [18, 19], status: "Menunggu Verifikasi", submittedAt: "2026-05-29", rejectionReason: "" },
  { id: 3, evalueeId: 15, proposedIds: [12, 13], status: "Menunggu Verifikasi", submittedAt: "2026-05-30", rejectionReason: "" },
];

export const initialState: AppState = {
  employees: initialEmployees,
  assignments: initialAssignments,
  responses: initialResponses,
  objections: initialObjections,
  pendingRaters: initialPendingRaters,
  orgUnits: orgUnitCatalog,
  jobs: jobCatalog,
  period: {
    id: 1,
    name: "Periode Penilaian Perilaku 2026",
    start: "2026-05-01",
    end: "2026-06-15",
    status: "Aktif",
    minPeer: 2,
    maxPeer: 4,
    maxBawahan: 5,
    weightsWithSub: { Atasan: 60, Peer: 15, Bawahan: 25 },
    weightsNoSub: { Atasan: 60, Peer: 40 },
    type: "Custom",
  },
  periods: [
    {
      id: 1,
      name: "Periode Penilaian Perilaku 2026",
      start: "2026-05-01",
      end: "2026-06-15",
      status: "Aktif",
      minPeer: 2,
      maxPeer: 4,
      maxBawahan: 5,
      weightsWithSub: { Atasan: 60, Peer: 15, Bawahan: 25 },
      weightsNoSub: { Atasan: 60, Peer: 40 },
      type: "Custom"
    },
    {
      id: 2,
      name: "Periode Bulanan Mei 2026",
      start: "2026-05-01",
      end: "2026-05-31",
      status: "Final",
      minPeer: 2,
      maxPeer: 4,
      maxBawahan: 5,
      weightsWithSub: { Atasan: 60, Peer: 15, Bawahan: 25 },
      weightsNoSub: { Atasan: 60, Peer: 40 },
      type: "Bulanan",
      selectedMonth: "05",
      selectedYear: 2026
    },
    {
      id: 3,
      name: "Periode Triwulan I 2026",
      start: "2026-01-01",
      end: "2026-03-31",
      status: "Final",
      minPeer: 2,
      maxPeer: 4,
      maxBawahan: 5,
      weightsWithSub: { Atasan: 60, Peer: 15, Bawahan: 25 },
      weightsNoSub: { Atasan: 60, Peer: 40 },
      type: "Triwulan",
      selectedQuarter: "Q1",
      selectedYear: 2026
    }
  ],
  admins: [
    { id: "admin", username: "admin", name: "Administrator BKPSDM Utama", password: "admin123", role: "Admin BKPSDM" }
  ],
};
