import { DemoAccount, OrgUnit, Job, Employee, Assignment, Response, Objection, PendingRaters, AppState, ActivityLog } from "./types";

export const demoAccounts: DemoAccount[] = [
  { nip: "", username: "admin", password: "Mare123.", role: "Admin BKPSDM", name: "Administrator BKPSDM Utama", userId: 0 },
  { nip: "197310191993111001", password: "admin123", role: "ASN", name: "Yon Henrik, AP, M.Si", userId: 1 },
  { nip: "198803152007011004", password: "admin123", role: "ASN", name: "Roy Karya Marco Sinaga, S.IP, M.Si", userId: 2 },
  { nip: "198005082006041007", password: "admin123", role: "ASN", name: "Rikson B Sihombing, S.Psi", userId: 3 },
  { nip: "199205262014061001", password: "admin123", role: "ASN", name: "Try Saputra Sinaga, S.STP, M.Si", userId: 4 },
  { nip: "197312052006041007", password: "admin123", role: "ASN", name: "Robinson Silalahi, SE", userId: 10 },
  { nip: "199908232021081003", password: "admin123", role: "ASN", name: "Richad Mika Sinaga, S.Tr.IP", userId: 12 },
];

export const orgUnitCatalog: OrgUnit[] = [
  { id: 1, name: "Kepala Badan", parentId: null, type: "Pucuk Pimpinan" },
  { id: 2, name: "Kelompok Jabatan Fungsional", parentId: 1, type: "Kelompok" },
  { id: 3, name: "Sekretariat Badan", parentId: 1, type: "Sekretariat" },
  { id: 4, name: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", parentId: 3, type: "Subbagian" },
  { id: 5, name: "Subbagian Umum Kepegawaian dan Aset", parentId: 3, type: "Subbagian" },
  { id: 6, name: "Bidang Pengadaan, Mutasi dan Informasi", parentId: 1, type: "Bidang" },
  { id: 8, name: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", parentId: 1, type: "Bidang" },
];

export const jobCatalog: Job[] = [
  { id: 1, name: "Kepala Badan", type: "JPT Pratama", defaultUnit: "Kepala Badan", leadership: true, description: "Pimpinan tertinggi BKPSDM." },
  { id: 2, name: "Sekretaris Badan", type: "Administrator", defaultUnit: "Sekretariat Badan", leadership: true, description: "Koordinasi sekretariat, program, keuangan, umum, kepegawaian, dan aset." },
  { id: 3, name: "Kepala Subbagian Perencanaan, Program Pelaporan dan Keuangan", type: "Pengawas", defaultUnit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", leadership: true, description: "Mengelola perencanaan, program, pelaporan, dan keuangan." },
  { id: 4, name: "Kepala Subbagian Umum Kepegawaian dan Aset", type: "Pengawas", defaultUnit: "Subbagian Umum Kepegawaian dan Aset", leadership: true, description: "Mengelola umum, administrasi kepegawaian internal, dan aset." },
  { id: 5, name: "Kepala Bidang Pengadaan, Mutasi dan Informasi", type: "Administrator", defaultUnit: "Bidang Pengadaan, Mutasi dan Informasi", leadership: true, description: "Mengelola pengadaan ASN, mutasi, dan informasi kepegawaian." },
  { id: 6, name: "Kepala Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", type: "Administrator", defaultUnit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", leadership: true, description: "Mengelola pembinaan dan pengembangan SDM aparatur." },
  { id: 7, name: "Analis SDM Aparatur", type: "Fungsional", defaultUnit: "Kelompok Jabatan Fungsional", leadership: false, description: "Jabatan fungsional bidang manajemen ASN.", jenjang: "Ahli Pertama" },
  { id: 8, name: "Pranata Komputer", type: "Fungsional", defaultUnit: "Jabatan Fungsional Bidang Pengadaan, Mutasi dan Informasi", leadership: false, description: "Pengelolaan sistem informasi dan dukungan digital.", jenjang: "Mahir" },
  { id: 9, name: "Pengolah Data and Informasi", type: "Pelaksana", defaultUnit: "Sekretariat Badan", leadership: false, description: "Melaksanakan pengelolaan, verifikasi, dan penyusunan terhadap data dan laporan." },
  { id: 10, name: "Pengadministrasi Kepegawaian", type: "Pelaksana", defaultUnit: "Subbagian Umum Kepegawaian dan Aset", leadership: false, description: "Administrasi surat, dokumen, dan layanan internal kepegawaian." },
  { id: 11, name: "Pranata SDM Aparatur", type: "Fungsional", defaultUnit: "Bidang Pengadaan, Mutasi dan Informasi", leadership: false, description: "JF Manajemen ASN Jenjang Keterampilan", jenjang: "Penyelia" },
  { id: 12, name: "Fasilitator Pemerintahan", type: "Pelaksana", defaultUnit: "Bidang Pengadaan, Mutasi dan Informasi", leadership: false, description: "Mengumpulkan berbagai informasi, keluhan, dan masukan dari masyarakat." },
  { id: 13, name: "Penelaah Teknis Kebijakan", type: "Pelaksana", defaultUnit: "Kepala Badan", leadership: false, description: "Memberikan dukungan teknis dalam penyiapan bahan, pengumpulan data, analisis, dan perumusan rekomendasi " },
  { id: 14, name: "Pengadministrasi Perkantoran", type: "Pelaksana", defaultUnit: "Kepala Badan", leadership: false, description: "Mendukung kelancaran operasional perusahaan dengan mengelola tugas-tugas rutin" }
];

export const initialEmployees: Employee[] = [
  { id: 1, gol: "IV/c", nip: "197310191993111001", nama: "Yon Henrik, AP, M.Si", role: "ASN", unit: "Kepala Badan", jenis: "JPT Pratama", hasSub: true, jabatan: "Kepala Badan", atasanId: null, password: "admin123", username: "197310191993111001" },
  { id: 2, gol: "IV/b", nip: "198803152007011004", nama: "Roy Karya Marco Sinaga, S.IP, M.Si", role: "ASN", unit: "Sekretariat Badan", jenis: "Administrator", hasSub: true, jabatan: "Sekretaris Badan", atasanId: 1, password: "admin123", username: "198803152007011004" },
  { id: 3, gol: "IIV/a", nip: "198005082006041007", nama: "Rikson B Sihombing, S.Psi", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Administrator", hasSub: true, jabatan: "Kepala Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", atasanId: 1, password: "admin123", username: "198005082006041007" },
  { id: 4, gol: "III/d", nip: "199205262014061001", nama: "Try Saputra Sinaga, S.STP, M.Si", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Administrator", hasSub: true, jabatan: "Kepala Bidang Pengadaan, Mutasi dan Informasi", atasanId: 1, password: "admin123", username: "199205262014061001" },
  { id: 5, gol: "III/d", nip: "196903091990031004", nama: "Buha Pasaribu", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 4, password: "admin123", username: "196903091990031004" },
  { id: 6, gol: "III/d", nip: "198511222011012009", nama: "Lindawaty Veronika Malau, SE, MM", role: "ASN", unit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", jenis: "Pengawas", hasSub: true, jabatan: "Kepala Subbagian Perencanaan, Program Pelaporan dan Keuangan", atasanId: 2, password: "admin123", username: "198511222011012009" },
  { id: 7, gol: "III/b", nip: "197901201998031002", nama: "Togap Simanullang", role: "ASN", unit: "Subbagian Umum Kepegawaian dan Aset", jenis: "Pengawas", hasSub: true, jabatan: "Kepala Subbagian Umum Kepegawaian dan Aset", atasanId: 2, password: "admin123", username: "197901201998031002" },
  { id: 8, gol: "III/a", nip: "198307262005021001", nama: "Hendra Supreddi Simaremare, S.I.P", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 3, password: "admin123", username: "198307262005021001" },
  { id: 9, gol: "III/b", nip: "198506232010012027", nama: "Minar Berutu, A.Md", role: "ASN", unit: "Subbagian Umum Kepegawaian dan Aset", jenis: "Pelaksana", hasSub: false, jabatan: "Pengolah Data dan Informasi", atasanId: 7, password: "admin123", username: "198506232010012027" },
  { id: 10, gol: "III/a", nip: "197312052006041007", nama: "Robinson Silalahi, SE", role: "ASN", unit: "Subbagian Umum Kepegawaian dan Aset", jenis: "Pelaksana", hasSub: false, jabatan: "Penelaah Teknis Kebijakan", atasanId: 7, password: "admin123", username: "197312052006041007" },
  { id: 11, gol: "III/b", nip: "198609152011012014", nama: "Maria Morina Seniwaty Simbolon, S.M", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 3, password: "admin123", username: "198609152011012014" },
  { id: 12, gol: "III/b", nip: "199908232021081003", nama: "Richad Mika Sinaga, S.Tr.IP", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 3, password: "admin123", username: "199908232021081003" },
  { id: 13, gol: "III/a", nip: "198508252010012001", nama: "Lestari Yudianti Sinaga, SE", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 4, password: "admin123", username: "198508252010012001" },
  { id: 14, gol: "III/b", nip: "198909292019031014", nama: "Sarden Sihotang, S.Kom", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 4, password: "admin123", username: "198909292019031014" },
  { id: 15, gol: "III/a", nip: "199310132019031009", nama: "Ricky Suhendra Lumbangaol, A.Md", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Fungsional", hasSub: false, jabatan: "Pranata SDM Aparatur", atasanId: 4, password: "admin123", username: "199310132019031009" },
  { id: 16, gol: "III/b", nip: "197405252011012001", nama: "Rumondang Purba, A.Md", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Pelaksana", hasSub: false, jabatan: "Pengolah Data dan Informasi", atasanId: 4, password: "admin123", username: "197405252011012001" },
  { id: 17, gol: "III/c", nip: "198606152006042005", nama: "Melda Heni Indrawati Sagala, S.IP", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Pelaksana", hasSub: false, jabatan: "Penelaah Teknis Kebijakan", atasanId: 3 },
  { id: 18, gol: "III/b", nip: "199611172019081001", nama: "Bobby Johan Purba, S.STP, M.A.P", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Pelaksana", hasSub: false, jabatan: "Penelaah Teknis Kebijakan", atasanId: 3, password: "admin123", username: "199611172019081001" },
  { id: 19, gol: "III/a", nip: "200209222024091001", nama: "Samuel Kevin Sinamo, S.Tr.IP", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Pelaksana", hasSub: false, jabatan: "Fasilitator Pemerintahan", atasanId: 4, password: "admin123", username: "200209222024091001" },
  { id: 20, gol: "V", nip: "198005282025212006", nama: "Sari Nurlailan Br. Pardede", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Pelaksana", hasSub: false, jabatan: "Pengadministrasi Perkantoran", atasanId: 4, password: "admin123", username: "198005282025212006" },
  { id: 21, gol: "V", nip: "198708232025211011", nama: "Ridwan K. Banjarnahor", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Pelaksana", hasSub: false, jabatan: "Pengadministrasi Perkantoran", atasanId: 3, password: "admin123", username: "198708232025211011" },
  { id: 22, gol: "V", nip: "199302242025212010", nama: "Felly Fiyanti Br. Ginting", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Pelaksana", hasSub: false, jabatan: "Pengadministrasi Perkantoran", atasanId: 4, password: "admin123", username: "199302242025212010" },
  { id: 23, gol: "IV/a", nip: "198009092009031004", nama: "Musa Sembiring, S.Kom", role: "ASN", unit: "Bidang Pembinaan dan Pengembangan Sumber Daya Manusia", jenis: "Fungsional", hasSub: false, jabatan: "Analis SDM Aparatur", atasanId: 3, password: "admin123", username: "198009092009031004" },
  { id: 24, gol: "III/a", nip: "199610222019032005", nama: "Menti Nainggolan, S.K.M", role: "ASN", unit: "Subbagian Perencanaan, Program Pelaporan dan Keuangan", jenis: "Pelaksana", hasSub: false, jabatan: "Penelaah Teknis Kebijakan", atasanId: 6, password: "admin123", username: "199610222019032005" },
  { id: 25, gol: "IX", nip: "199504092025212048", nama: "Dina Intisari Sihombing, S.Kom", role: "ASN", unit: "Bidang Pengadaan, Mutasi dan Informasi", jenis: "Fungsional", hasSub: false, jabatan: "Pranata Komputer", atasanId: 4, password: "admin123", username: "199504092025212048" }
];

export const dimensions = [
  {
    key: "pelayanan",
    name: "Berorientasi Pelayanan",
    icon: "🫱🏻‍🫲🏼",
    questions: [
      "Apakah ASN komunikatif dalam memberikan layanan yang tepat dan efektif?",
      "Seberapa proaktif ASN dalam memberikan solusi dan inisiatif untuk meningkatkan kualitas pelayanan?",
      "Apakah ASN menunjukkan sikap ramah, sopan, dan kooperatif dalam berinteraksi dengan Anda dan rekan kerja lainnya?",
      "Apakah ASN selalu berusaha memberikan pelayanan yang terbaik kepada Anda dan rekan kerja lainnya?",
      "Apakah ASN sudah responsif dalam memberikan dukungan dan bantuan ketika Anda menghadapi kesulitan?"
    ]
  },
  {
    key: "akuntabel",
    name: "Akuntabel",
    icon: "⚖️",
    questions: [
      "Apakah ASN bertanggung jawab atas keputusan yang diambil dan konsekuensi yang timbul?",
      "Apakah ASN transparan dalam menjalankan tugas dan menyampaikan informasi?",
      "Apakah Anda merasa ASN transparan dalam penggunaan sumber daya yang ada?",
      "Apakah ASN konsisten dalam memenuhi tenggat waktu yang ditetapkan untuk tugas yang diberikan?",
      "Apakah ASN mematuhi aturan dan prosedur kerja?"
    ]
  },
  {
    key: "kompeten",
    name: "Kompeten",
    icon: "📚",
    questions: [
      "Apakah ASN memiliki pengetahuan dan keterampilan yang memadai untuk menjalankan tugasnya?",
      "Apakah ASN selalu berusaha mengembangkan diri dan meningkatkan kompetensinya?",
      "Apakah ASN mampu menyelesaikan tugas dengan kualitas yang baik?",
      "Apakah ASN kreatif dan inovatif dalam mencari solusi atas masalah yang dihadapi?",
      "Apakah ASN mampu bekerja secara mandiri dan mengambil inisiatif?"
    ]
  },
  {
    key: "harmonis",
    name: "Harmonis",
    icon: "🌿",
    questions: [
      "Apakah ASN mampu bekerja sama dengan baik dalam tim?",
      "Apakah ASN menghargai perbedaan pendapat dan mampu membangun hubungan yang baik dengan rekan kerja?",
      "Apakah ASN mampu menciptakan suasana kerja yang kondusif dan positif?",
      "Apakah ASN mampu menyelesaikan konflik dengan cara yang konstruktif?",
      "Apakah ASN peduli terhadap kesejahteraan rekan kerja dan lingkungan kerja?"
    ]
  },
  {
    key: "loyal",
    name: "Loyal",
    icon: "🛡️",
    questions: [
      "Apakah ASN setia kepada Pancasila, UUD 1945, NKRI, dan Pemerintah?",
      "Apakah ASN menjunjung tinggi nilai-nilai etika dan moral dalam menjalankan tugas?",
      "Apakah ASN menjaga nama baik instansi dan profesi ASN?",
      "Apakah ASN berani menolak tindakan yang melanggar hukum dan etika?",
      "Apakah ASN dapat menjaga kerahasiaan informasi yang seharusnya tidak diungkapkan?"
    ]
  },
  {
    key: "adaptif",
    name: "Adaptif",
    icon: "⚡",
    questions: [
      "Apakah ASN mampu menyesuaikan diri dengan perubahan lingkungan kerja dan teknologi?",
      "Apakah ASN terbuka terhadap ide-ide baru dan mau belajar hal-hal baru?",
      "Apakah ASN mampu bekerja di bawah tekanan dan menghadapi tantangan dengan baik?",
      "Apakah ASN mampu mencari solusi kreatif atas masalah yang belum pernah dihadapi sebelumnya?",
      "Apakah ASN mampu memanfaatkan teknologi untuk meningkatkan kinerja dan efisiensi?"
    ]
  },
  {
    key: "kolaboratif",
    name: "Kolaboratif",
    icon: "🧩",
    questions: [
      "Apakah ASN mampu membangun jaringan kerja yang luas dan efektif?",
      "Apakah ASN mampu bekerja sama dengan pihak eksternal untuk mencapai tujuan bersama?",
      "Apakah ASN mampu berbagi pengetahuan dan pengalaman dengan rekan kerja?",
      "Apakah ASN mampu memberikan kontribusi positif dalam kegiatan kelompok atau pekerjaan yang dilakukan secara bersama sama?",
      "Apakah ASN mampu membangun kepercayaan dan kemitraan dengan pihak lain?"
    ]
  },
  {
    key: "kepemimpinan",
    name: "Kepemimpinan",
    icon: "🎯",
    leadershipOnly: true,
    questions: [
      "Apakah Atasan Memberikan arahan kerja yang jelas kepada bawahan?",
      "Apakah Atasan ini membina bawahan secara adil dan objektif?",
      "Apakah Atasan ini mengambil keputusan dengan pertimbangan yang matang?",
      "Apakah Atasan ini melakukan pengawasan tanpa intimidasi?",
      "Apakah Atasan ini memberikan teladan perilaku kerja yang baik?"
    ]
  }
];

export const initialAssignments: Assignment[] = [
  { id: 325005, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 9, evaluatorId: 7 },
  { id: 325006, type: "Peer", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 9, evaluatorId: 10 },
  { id: 325007, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 18, evaluatorId: 3 },
  { id: 325008, type: "Peer", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 18, evaluatorId: 17 },
  { id: 325009, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 1 },
  { id: 325010, type: "Bawahan", status: "Selesai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 17 },
  { id: 325011, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 18 },
  { id: 325012, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 2, evaluatorId: 1 },
  { id: 325013, type: "Bawahan", status: "Selesai", approved: true, periodId: 2, evalueeId: 2, evaluatorId: 6 },
  { id: 325014, type: "Bawahan", status: "Selesai", approved: true, periodId: 2, evalueeId: 1, evaluatorId: 2 },
  { id: 325015, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 1, evaluatorId: 3 },
  { id: 325016, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 1, evaluatorId: 4 },
  { id: 325017, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 1 },
  { id: 325018, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 6, evaluatorId: 2 },
  { id: 325019, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 2, evaluatorId: 7 },
  { id: 325020, type: "Atasan", status: "Selesai", approved: true, periodId: 2, evalueeId: 7, evaluatorId: 2 },
  { id: 325021, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 7, evaluatorId: 9 },
  { id: 325022, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 7, evaluatorId: 10 },
  { id: 325023, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 10, evaluatorId: 7 },
  { id: 325024, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 13 },
  { id: 325025, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 13, evaluatorId: 4 },
  { id: 325026, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 14 },
  { id: 325027, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 14, evaluatorId: 4 },
  { id: 325028, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 15 },
  { id: 325029, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 15, evaluatorId: 4 },
  { id: 325030, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 16, evaluatorId: 4 },
  { id: 325031, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 17, evaluatorId: 3 },
  { id: 325032, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 23, evaluatorId: 3 },
  { id: 325033, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 5 },
  { id: 325034, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 5, evaluatorId: 4 },
  { id: 325035, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 8 },
  { id: 325036, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 8, evaluatorId: 3 },
  { id: 325037, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 11 },
  { id: 325038, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 11, evaluatorId: 3 },
  { id: 325039, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 3, evaluatorId: 12 },
  { id: 325040, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 12, evaluatorId: 3 },
  { id: 325041, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 4, evaluatorId: 16 },
  { id: 325042, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 19, evaluatorId: 4 },
  { id: 325043, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 20, evaluatorId: 4 },
  { id: 325044, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 21, evaluatorId: 3 },
  { id: 325045, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 22, evaluatorId: 4 },
  { id: 325046, type: "Bawahan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 6, evaluatorId: 24 },
  { id: 325047, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 24, evaluatorId: 6 },
  { id: 325048, type: "Atasan", status: "Belum Mulai", approved: true, periodId: 2, evalueeId: 25, evaluatorId: 4 }
];

export const initialResponses: Response[] = [
  {
    assignmentId: 2,
    scores: { loyal: 4.2, adaptif: 4.4, harmonis: 4, kompeten: 4.4, akuntabel: 4.2, pelayanan: 4, kolaboratif: 4, kepemimpinan: 4.2 },
    comments: "Kolaboratif dan mudah diajak koordinasi.",
    submittedAt: "2026-05-22"
  },
  {
    assignmentId: 4,
    scores: { loyal: 4.1, adaptif: 4.3, harmonis: 3.8999999999999995, kompeten: 4.3, akuntabel: 4.1, pelayanan: 3.8999999999999995, kolaboratif: 3.8999999999999995, kepemimpinan: 4.1 },
    comments: "Perlu meningkatkan dokumentasi tindak lanjut.",
    submittedAt: "2026-05-20"
  },
  {
    assignmentId: 6,
    scores: { loyal: 4.5, adaptif: 4.7, harmonis: 4.3, kompeten: 4.7, akuntabel: 4.5, pelayanan: 4.3, kolaboratif: 4.3, kepemimpinan: 4.5 },
    comments: "Sangat membantu di pekerjaan lintas bidang.",
    submittedAt: "2026-05-22"
  },
  {
    assignmentId: 9,
    scores: { loyal: 3.8, adaptif: 4, harmonis: 3.5999999999999996, kompeten: 4, akuntabel: 3.8, pelayanan: 3.5999999999999996, kolaboratif: 3.5999999999999996, kepemimpinan: 3.8 },
    comments: "Perlu konsistensi dalam ketepatan waktu.",
    submittedAt: "2026-05-19"
  },
  {
    assignmentId: 14,
    scores: { loyal: 4.8, adaptif: 5, harmonis: 4.6, kompeten: 5, akuntabel: 4.8, pelayanan: 4.6, kolaboratif: 4.6, kepemimpinan: 4.8 },
    comments: "Memberi arahan yang detail.",
    submittedAt: "2026-05-24"
  },
  {
    assignmentId: 325005,
    scores: { loyal: 4.4, adaptif: 4.6000000000000005, harmonis: 4.2, kompeten: 4.6000000000000005, akuntabel: 4.4, pelayanan: 4.2, kolaboratif: 4.2, kepemimpinan: 4.4 },
    comments: "Responsif dan mampu menjaga ritme kerja.",
    submittedAt: "2026-05-21"
  },
  {
    assignmentId: 325009,
    scores: { loyal: 4.4, adaptif: 4.6000000000000005, harmonis: 4.2, kompeten: 4.6000000000000005, akuntabel: 4.4, pelayanan: 4.2, kolaboratif: 4.2, kepemimpinan: 4.4 },
    comments: "Arahannya jelas dan tenang dalam mengambil keputusan.",
    submittedAt: "2026-05-21"
  },
  {
    assignmentId: 325010,
    scores: { loyal: 4.1, adaptif: 4.3, harmonis: 3.8999999999999995, kompeten: 4.3, akuntabel: 4.1, pelayanan: 3.8999999999999995, kolaboratif: 3.8999999999999995, kepemimpinan: 4.1 },
    comments: "Pembinaan cukup baik, perlu lebih sering memberi umpan balik.",
    submittedAt: "2026-05-23"
  },
  {
    assignmentId: 325012,
    scores: { loyal: 4.6, adaptif: 4.8, harmonis: 4.3999999999999995, kompeten: 4.8, akuntabel: 4.6, pelayanan: 4.3999999999999995, kolaboratif: 4.3999999999999995, kepemimpinan: 4.6 },
    comments: "Kuat dalam pengembangan kompetensi dan inovasi.",
    submittedAt: "2026-05-24"
  },
  {
    assignmentId: 325013,
    scores: { loyal: 4.7, adaptif: 4.9, harmonis: 4.5, kompeten: 4.9, akuntabel: 4.7, pelayanan: 4.5, kolaboratif: 4.5, kepemimpinan: 4.7 },
    comments: "Konsisten mendukung tim.",
    submittedAt: "2026-05-24"
  },
  {
    assignmentId: 325017,
    scores: { loyal: 5, adaptif: 5, harmonis: 5, kompeten: 5, akuntabel: 5, pelayanan: 5, kolaboratif: 5, kepemimpinan: 5 },
    comments: "",
    submittedAt: "2026-06-02"
  },
  {
    assignmentId: 325014,
    scores: { loyal: 5, adaptif: 5, harmonis: 5, kompeten: 5, akuntabel: 5, pelayanan: 5, kolaboratif: 5, kepemimpinan: 5 },
    comments: "",
    submittedAt: "2026-06-02"
  },
  {
    assignmentId: 325018,
    scores: { loyal: 5, adaptif: 5, harmonis: 5, kompeten: 5, akuntabel: 5, pelayanan: 5, kolaboratif: 5, kepemimpinan: 5 },
    comments: "",
    submittedAt: "2026-06-02"
  },
  {
    assignmentId: 325020,
    scores: { loyal: 5, adaptif: 5, harmonis: 5, kompeten: 5, akuntabel: 5, pelayanan: 5, kolaboratif: 5, kepemimpinan: 5 },
    comments: "",
    submittedAt: "2026-06-02"
  }
];

export const initialObjections: Objection[] = [
  { id: 1, periodId: 1, evalueeId: 14, type: "Evaluator belum menilai", reason: "Jumlah penilai belum lengkap sampai H-2 batas akhir.", status: "Diproses", createdAt: "2026-05-29", note: "Menunggu klarifikasi evaluator." }
];

export const initialPendingRaters: PendingRaters[] = [
  { id: 1, evalueeId: 13, proposedIds: [14, 15], status: "Menunggu Verifikasi", submittedAt: "2026-05-28", rejectionReason: "" },
  { id: 2, evalueeId: 17, proposedIds: [18], status: "Ditolak", submittedAt: "2026-05-29", rejectionReason: "Sistem mendeteksi perubahan jabatan atau unit kerja. Jumlah rater sejawat satu unit tidak lagi memenuhi batas minimum." },
  { id: 3, evalueeId: 15, proposedIds: [13], status: "Ditolak", submittedAt: "2026-05-30", rejectionReason: "Sistem mendeteksi perubahan jabatan atau unit kerja. Jumlah rater sejawat satu unit tidak lagi memenuhi batas minimum." }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "log_1",
    timestamp: "2026-06-08T08:30:15Z",
    username: "admin",
    name: "Administrator BKPSDM Utama",
    role: "Admin BKPSDM",
    action: "Autentikasi",
    details: "Berhasil login ke Dashboard Admin Utama BKPSDM.",
    ipAddress: "10.0.12.45"
  },
  {
    id: "log_2",
    timestamp: "2026-06-08T09:15:22Z",
    username: "admin",
    name: "Administrator BKPSDM Utama",
    role: "Admin BKPSDM",
    action: "Konfigurasi Sistem",
    details: "Mengubah parameter bobot evaluasi perilaku (80% Perilaku, 20% Kepatuhan).",
    ipAddress: "10.0.12.45"
  },
  {
    id: "log_3",
    timestamp: "2026-06-08T10:02:11Z",
    username: "197310191993111001",
    name: "Yon Henrik, AP, M.Si",
    role: "Kepala Badan",
    action: "Autentikasi",
    details: "Berhasil login ke sistem via NIP Kepegawaian.",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log_4",
    timestamp: "2026-06-08T11:45:30Z",
    username: "198803152007011004",
    name: "Roy Karya Marco Sinaga, S.IP, M.Si",
    role: "Atasan Langsung",
    action: "Verifikasi Rater",
    details: "Menyetujui usulan rater rekan sejawat (peer) untuk pegawai Buha Pasaribu.",
    ipAddress: "192.168.1.102"
  },
  {
    id: "log_5",
    timestamp: "2026-06-08T14:22:05Z",
    username: "199908232021081003",
    name: "Richad Mika Sinaga, S.Tr.IP",
    role: "Pegawai ASN",
    action: "Pengisian Kuesioner",
    details: "Menyelesaikan pengisian kuesioner penilaian 360-derajat untuk rekan Hendra Supreddi.",
    ipAddress: "192.168.1.215"
  },
  {
    id: "log_6",
    timestamp: "2026-06-09T01:10:45Z",
    username: "admin",
    name: "Administrator BKPSDM Utama",
    role: "Admin BKPSDM",
    action: "Master Data ASN",
    details: "Menambahkan data ASN baru atas nama 'Dina Intisari Sihombing, S.Kom' (Pranata Komputer).",
    ipAddress: "10.0.12.45"
  },
  {
    id: "log_7",
    timestamp: "2026-06-09T02:45:00Z",
    username: "198005082006041007",
    name: "Rikson B Sihombing, S.Psi",
    role: "Atasan Langsung",
    action: "Ubah Password",
    details: "Mengubah kata sandi akun personal demi faktor keamanan.",
    ipAddress: "192.168.1.110"
  }
];

export const initialState: AppState = {
  employees: initialEmployees,
  assignments: initialAssignments,
  responses: initialResponses,
  objections: initialObjections,
  pendingRaters: initialPendingRaters,
  orgUnits: orgUnitCatalog,
  jobs: jobCatalog,
  activityLogs: initialActivityLogs,
  period: {
    id: 2,
    name: "Periode Triwulan II (April - Juni) 2026",
    start: "2026-04-01",
    end: "2026-06-30",
    deadlineStart: "2026-06-01",
    deadlineEnd: "2026-06-15",
    status: "Aktif",
    minPeer: 1,
    maxPeer: 4,
    maxBawahan: 5,
    enforceMaxBawahan: false,
    disablePeerLimit: false,
    autoFillPeers: true,
    randomizePeers: false,
    weightsWithSub: { Atasan: 60, Peer: 20, Bawahan: 20 },
    weightsNoSub: { Atasan: 60, Peer: 40 }, // BKN/Permenpan latest standard
    weightsCond3: { Atasan: 75, Peer: 0, Bawahan: 25 },
    weightsCond4: { Atasan: 100, Peer: 0, Bawahan: 0 },
    weightsCond5: { Atasan: 0, Peer: 0, Bawahan: 100 },
    type: "Triwulan",
    selectedMonth: "01",
    selectedQuarter: "Q2",
    selectedYear: 2026,
    weightBehavior: 80,
    weightCompliance: 20
  },
  periods: [
    {
      id: 2,
      name: "Periode Triwulan II (April - Juni) 2026",
      start: "2026-04-01",
      end: "2026-06-30",
      deadlineStart: "2026-06-01",
      deadlineEnd: "2026-06-15",
      status: "Aktif",
      minPeer: 1,
      maxPeer: 4,
      maxBawahan: 5,
      enforceMaxBawahan: false,
      disablePeerLimit: false,
      autoFillPeers: true,
      randomizePeers: false,
      weightsWithSub: { Atasan: 60, Peer: 20, Bawahan: 20 },
      weightsNoSub: { Atasan: 60, Peer: 40 },
      weightsCond3: { Atasan: 75, Peer: 0, Bawahan: 25 },
      weightsCond4: { Atasan: 100, Peer: 0, Bawahan: 0 },
      weightsCond5: { Atasan: 0, Peer: 0, Bawahan: 100 },
      type: "Triwulan",
      selectedMonth: "01",
      selectedQuarter: "Q2",
      selectedYear: 2026,
      weightBehavior: 80,
      weightCompliance: 20
    }
  ],
  admins: [
    { id: "admin", username: "admin", name: "Administrator BKPSDM Utama", password: "Mare123.", role: "Admin BKPSDM" }
  ],
  dimensions: dimensions,
  enableSupervisorVerification: true,
  enableRaterManagementMenu: true,
  showPeerRaterNames: true,
};
