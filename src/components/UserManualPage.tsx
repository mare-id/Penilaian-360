import React, { useState } from "react";
import { 
  HelpCircle, 
  BookOpen, 
  Download, 
  Key, 
  User, 
  Users, 
  ShieldAlert, 
  Sliders, 
  Network, 
  GitBranch, 
  FileText, 
  ClipboardCheck, 
  Database,
  Terminal,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";
import { AppState, DemoAccount } from "../types";
import { Badge, Card, Button } from "./UIComponents";

export function UserManualPage({ state, user, toast }: { state: AppState; user: DemoAccount; toast: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<string>("user");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // HTML to DOC Word Document Export Flow
  const handleDownloadDoc = () => {
    toast("Menyusun panduan lengkap E-Kinerja 360 dalam format Word... 📄");

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Panduan E-Kinerja 360 BKPSDM Kabupaten Dairi</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 8.5in 11in;
            margin: 1.0in 1.0in 1.0in 1.0in;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1e293b;
          }
          .cover {
            text-align: center;
            padding-top: 100px;
            page-break-after: always;
          }
          .logo-box {
            margin-bottom: 30px;
            font-size: 24pt;
            font-weight: bold;
            color: #1e3a8a;
          }
          .title {
            font-family: 'Georgia', serif;
            font-size: 26pt;
            font-weight: bold;
            color: #0f172a;
            margin: 40px 0 20px 0;
            line-height: 1.2;
          }
          .subtitle {
            font-size: 14pt;
            color: #475569;
            margin-bottom: 120px;
            font-weight: bold;
          }
          .meta-info {
            font-size: 10pt;
            color: #64748b;
            border-top: 2px solid #cbd5e1;
            padding-top: 20px;
            margin-top: 100px;
          }
          h1 {
            font-family: 'Georgia', serif;
            color: #1e3a8a;
            font-size: 20pt;
            margin-top: 30pt;
            margin-bottom: 12pt;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 6px;
            page-break-after: avoid;
          }
          h2 {
            font-family: 'Calibri', sans-serif;
            color: #0f172a;
            font-size: 14pt;
            margin-top: 20pt;
            margin-bottom: 8pt;
            page-break-after: avoid;
          }
          h3 {
            font-family: 'Calibri', sans-serif;
            color: #2563eb;
            font-size: 12pt;
            margin-top: 12pt;
            margin-bottom: 6pt;
            page-break-after: avoid;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 14pt 0;
          }
          th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: bold;
            padding: 8px 12px;
            border: 1px solid #64748b;
            font-size: 10pt;
            text-align: left;
          }
          td {
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            font-size: 10pt;
            vertical-align: top;
          }
          .tr-even {
            background-color: #f8fafc;
          }
          .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 12px 16px;
            margin: 12pt 0;
            border-radius: 4px;
          }
          .warn-box {
            background-color: #fffbeb;
            border-left: 4px solid #d97706;
            padding: 12px 16px;
            margin: 12pt 0;
            border-radius: 4px;
          }
          .danger-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 12px 16px;
            margin: 12pt 0;
            border-radius: 4px;
          }
          ol, ul {
            margin-top: 0;
            margin-bottom: 10pt;
            padding-left: 20pt;
          }
          li {
            margin-bottom: 4pt;
          }
          .font-mono {
            font-family: 'Consolas', 'Courier New', monospace;
            background-color: #f1f5f9;
            padding: 1px 4px;
            font-size: 9.5pt;
          }
          .center {
            text-align: center;
          }
          .page-break {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
    `;

    const bodyContent = `
      <!-- HALAMAN SAMPUL -->
      <div class="cover">
        <div class="logo-box">🏢 BKPSDM DAIRI</div>
        <div class="title">PANDUAN PENGGUNAAN & DOKUMENTASI SISTEM<br>E-KINERJA PENILAIAN PERILAKU 360° ASN</div>
        <div class="subtitle">Manual Operasional Lengkap Untuk Pegawai ASN dan Administrator Sistem</div>
        
        <div class="meta-info">
          <p><strong>Diterbitkan Oleh:</strong> Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM) Kabupaten Dairi</p>
          <p><strong>Sasar Sistem:</strong> Perilaku Core Values BerAKHLAK (Aparatur Sipil Negara)</p>
          <p><strong>Versi Dokumen:</strong> 2.4.2 PREMIUM NAVY EDITION</p>
          <p><strong>Tanggal Cetak:</strong> ${todayStr}</p>
        </div>
      </div>

      <!-- KATA PENGANTAR -->
      <div class="page-break">
        <h1>KATA PENGANTAR</h1>
        <p>Puji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas tersusunnya <strong>Buku Panduan Penggunaan Aplikasi E-Kinerja Penilaian Perilaku 360° ASN</strong>.</p>
        <p>Aplikasi ini dikembangkan untuk mereformasi tata cara pengukuran kinerja perilaku pegawai sesuai konsep Core Values ASN BerAKHLAK (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif) dengan metode umpan balik 360 derajat secara transparan, anonim, terukur, dan aman.</p>
        <p>Dengan adanya panduan komprehensif ini, diharapkan seluruh ASN di lingkungan Kabupaten Dairi dapat memahami dan memanfaatkan aplikasi ini dengan optimal. Akhir kata, BKPSDM senantiasa berupaya menyempurnakan sistem ini guna mewujudkan meritokrasi dan profesionalisme ASN.</p>
        <p style="margin-top: 40px; text-align: right;"><strong>Hormat Kami,</strong></p>
        <p style="text-align: right;"><strong>BKPSDM Kabupaten Dairi</strong></p>
      </div>

      <!-- BAB I -->
      <div class="page-break">
        <h1>BAB I: PENGENALAN FITUR & PETUNJUK USER ASN</h1>
        
        <h2>1.1 Pengenalan Fitur Utama Aplikasi</h2>
        <p>Aplikasi E-Kinerja 360° memiliki beberapa fitur modular yang disesuaikan dengan posisi kedudukan pegawai (ASN biasa vs ASN Atasan Langsung/Kepala Unit):</p>
        <ul>
          <li><strong>Dashboard Utama:</strong> Memuat rangkuman interaktif real-time mengenai periode penilaian, profil, status rater, kelengkapan pengisian, ringkasan skor radar chart, hingga analisis anomali personal.</li>
          <li><strong>Profil ASN:</strong> Menu melihat dan memperbarui identitas pribadi (Nama, NIP, Golongan, Jabatan, Unit Kerja, status memiliki bawahan, dsb).</li>
          <li><strong>Manajemen Evaluator (Rater Proposal):</strong> Fitur mandiri pegawai mengajukan rater (rekan sejawat) untuk disetujui atasan langsung guna menjaga independensi pengisian.</li>
          <li><strong>Verifikasi Atasan:</strong> Fitur khusus bagi atasan langsung untuk meninjau, menyetujui, maupun menolak pengusulan rater rekan sejawat yang diajukan bawahannya.</li>
          <li><strong>Kuesioner Penilaian:</strong> Halaman interaktif untuk melakukan input penilaian secara anonim terhadap target penilaian (Atasan, Rekan, Bawahan, atau Evaluasi Diri).</li>
          <li><strong>Laporan Indeks Penilaian 360:</strong> Memetakan rekap skor per dimensi BerAKHLAK lengkap dengan diagram/card, analisis kelebihan-kelemahan (bento layout), saran pembinaan fungsional, s.d pengisian form sengketa keberatan langsung.</li>
        </ul>

        <div class="info-box">
          <strong>💡 PRINSIP UTAMA SISTEM:</strong> Penilaian sejawat dan bawahan bersifat <strong>anonim mutlak</strong>. Sistem hanya menyimpan skor agregasi dan melarang keras penayangan detail identitas pemberi nilai demi objektivitas penilaian perilaku kerja.
        </div>

        <h2>1.2 Panduan Cara Login ke Aplikasi</h2>
        <p>Guna mengakses sistem, ikuti petunjuk berikut:</p>
        <ol>
          <li>Akses alamat URL aplikasi pada penjelajah web Anda.</li>
          <li>Pada formulir <strong>"Masuk Otoritas"</strong>, isikan NIP Lengkap Anda (18 digit tanpa spasi) atau Username Anda.</li>
          <li>Ketik kata sandi Anda. Default bawaan sistem bagi akun pertama kali adalah <span class="font-mono">admin123</span>.</li>
          <li>Bagi keperluan pengujian mandiri cepat, Anda dapat menggunakan tombol <strong>"Akses Cepat"</strong> di bawah form dengan mengklik salah satu nama ASN atau Admin BKPSDM terdaftar.</li>
          <li>Klik <strong>"Mulai Otorisasi Masuk"</strong>.</li>
        </ol>

        <h2>1.3 Cara Melakukan Update Data Profil</h2>
        <p>Kesuaian data jabatan dan unit kerja sangat mempengaruhi alur data rater, untuk mengubahnya:</p>
        <ol>
          <li>Masuk ke menu utama <strong>"Profil ASN"</strong> melalui bilah menu samping.</li>
          <li>Periksa identitas Anda. Tekan tombol <strong>"Perbarui Profil Saya"</strong>.</li>
          <li>Isikan elemen data yang berubah mulai dari Nama, NIP, Golongan/Ruang, Jabatan, Unit Kerja, Alamat Email, Nomor Handphone.</li>
          <li>Pastikan kotak centang <strong>"Memiliki Bawahan Langsung (Has Subordinates)"</strong> diatur dengan benar. Jika Anda adalah atasan, centang kotak tersebut agar bawahan langsung Anda dapat mendaftarkan Anda sebagai Atasan Evaluator.</li>
          <li>Klik tombol <strong>"Simpan Perubahan Profil"</strong>. Data Anda seketika diperbarui oleh sistem.</li>
        </ol>

        <h2>1.4 Panduan Pengusulan & Penilaian Koresponden (Atasan, Sejawat, Bawahan)</h2>
        <h3>A. Alur Manajemen Rater (Evaluator)</h3>
        <p>Sistem ini membutuhkan kombinasi rater 360 derajat untuk menghasilkan penilaian objektif:</p>
        <ul>
          <li><strong>Atasan Langsung:</strong> Ditentukan secara otomatis dan mandatory berdasarkan data struktural atasan di profil.</li>
          <li><strong>Diri Sendiri (Self):</strong> Wajib diisi oleh ASN bersangkutan secara mandiri.</li>
          <li><strong>Rekan Sejawat (Peer):</strong> Diajukan oleh ASN bersangkutan minimal sesuai batas ketentuan (misal {minPeer} orang) yang merupakan ASN satu unit kerja dengan klasifikasi jabatan yang setara. Usulan ini harus disetujui Atasan Langsung Anda.</li>
          <li><strong>Bawahan Langsung:</strong> Jika ASN menjabat posisi berpimpinan pangkat struktural (hasSub = true), bawahannya secara otomatis didaftarkan oleh sistem sebagai penilai wajib.</li>
        </ul>

        <h3>B. Tata Cara Melakukan Penilaian</h3>
        <ol>
          <li>Masuk ke bilah menu <strong>"Kuesioner Penilaian"</strong>.</li>
          <li>Di halaman ini, sistem membagi target penilaian ke dalam 4 Tab: Atasan, Rekan Sejawat, Bawahan, dan Diri Sendiri.</li>
          <li>Pilih salah satu target pegawai yang berstatus <strong>"Belum Mulai"</strong>, lalu klik tombol <strong>"Isi Penilaian"</strong>.</li>
          <li>Anda akan dihadapkan pada kuesioner dengan 14 butir pertanyaan penilaian perilaku yang mewakili 7 dimensi Core Values BerAKHLAK (masing-masing 2 kuesioner):
            <ul>
              <li><strong>Berorientasi Pelayanan:</strong> Memahami kebutuhan masyarakat / bersikap ramah.</li>
              <li><strong>Akuntabel:</strong> Melaksanakan tugas jujur / menggunakan aset negara bertanggungjawab.</li>
              <li><strong>Kompeten:</strong> Meningkatkan diri / membantu orang lain belajar.</li>
              <li><strong>Harmonis:</strong> Menghargai perbedaan / membangun lingkungan kondusif.</li>
              <li><strong>Loyal:</strong> Memegang rahasia / menjaga nama baik korps.</li>
              <li><strong>Adaptif:</strong> Cepat menyesuaikan diri / terus berinovasi.</li>
              <li><strong>Kolaboratif:</strong> Terbuka bekerja sama / memberi kesempatan pihak lain.</li>
            </ul>
          </li>
          <li>Pilih jawaban skala Likert berpangkat dari <strong>Skala 1 (Sangat Jarang/Buruk)</strong> s.d <strong>Skala 5 (Sangat Sering/Sempurna)</strong>.</li>
          <li>Tulis masukan konstruktif (opsional) pada kotak komentar di bagian paling bawah.</li>
          <li>Klik <strong>"Kirim Kuesioner Penilaian"</strong>.</li>
        </ol>
      </div>

      <!-- BAB II -->
      <div class="page-break">
        <h1>BAB II: METODE PENILAIAN & PENGHITUNGAN SKOR DETAIL</h1>

        <h2>2.1 Konsep Dasar 360-Degree Feedback</h2>
        <p>Metode 360 derajat mengeliminasi bias evaluasi searah dengan mencampurkan sudut pandang dari berbagai lini korelasi kerja. Sumber rater terdiri dari:</p>
        <table>
          <thead>
            <tr>
              <th>Tipe Rater</th>
              <th>Keterangan Objektif</th>
              <th>Prasyarat Minimal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Atasan Langsung</strong></td>
              <td>Verifikator pengawasan, evaluasi instruksi struktural harian.</td>
              <td>1 Koresponden (Wajib)</td>
            </tr>
            <tr class="tr-even">
              <td><strong>Rekan Sejawat (Peer)</strong></td>
              <td>Kamera harian interaksi kerja, budaya kolaborasi se-level.</td>
              <td>Ditentukan admin ({state.period.minPeer} s.d {state.period.maxPeer} orang)</td>
            </tr>
            <tr>
              <td><strong>Bawahan Langsung</strong></td>
              <td>Pengukur kepemimpinan, instruksi arah kerja, delegasi tugas.</td>
              <td>Semua yang terdaftar struktural</td>
            </tr>
            <tr class="tr-even">
              <td><strong>Mandiri (Self)</strong></td>
              <td>Refleksi diri & validasi kecenderungan bias pribadi.</td>
              <td>1 Koresponden (Wajib)</td>
            </tr>
          </tbody>
        </table>

        <h2>2.2 Skala Likert Kuesioner</h2>
        <p>Masing-masing butir dinilai berdasarkan skala frekuensi perilaku nyata:</p>
        <ul>
          <li><strong>Skor 5: Sangat Sering (Sempurna)</strong> - Mempraktekkan tanpa cela.</li>
          <li><strong>Skor 4: Sering (Baik)</strong> - Konsisten mempraktekkan pada sebagian besar kasus.</li>
          <li><strong>Skor 3: Kadang-kadang / Cukup</strong> - Perilaku dipraktekkan sesekali.</li>
          <li><strong>Skor 2: Jarang / Kurang</strong> - Jarang menunjukkan perilaku, perlu pembinaan khusus.</li>
          <li><strong>Skor 1: Sangat Jarang / Sangat Kurang</strong> - Hampir tidak pernah berperilaku positif.</li>
        </ul>

        <h2>2.3 Formula & Perhitungan Skor Rata-rata per Dimensi</h2>
        <p>Terdapat dua butir pertanyaan untuk tiap dimensi BerAKHLAK. Skor rater tertentu untuk satu dimensi dihitung dengan rata-rata aritmatika sederhana:</p>
        <p style="text-align: center; font-weight: bold; font-family: Courier New;">
          Skor Dimensi Rater = (Butir_1 + Butir_2) / 2
        </p>
        <p>Selanjutnya, jika terdapat beberapa rater pada kategori kelompok rater yang sama (misal terdapat 3 Rekan Sejawat yang mengisi), maka dicari rata-rata agregat dari ke-3 rekan tersebut:</p>
        <p style="text-align: center; font-weight: bold; font-family: Courier New;">
          Skor Kategori Sejawat = (Rata-rata Peer1 + Rata-rata Peer2 + Rata-rata Peer3) / 3
        </p>

        <h2>2.4 Pembobotan Penilaian Akhir (Skor Agregat)</h2>
        <p>Penilaian akhir membedakan beban kontribusi tiap kelompok rater berdasarkan kepemilikan bawahan langsung:</p>

        <h3>Kasus A: Pegawai yang MEMILIKI Bawahan Langsung (Has Subordinates)</h3>
        <p>Skor agregasi dihitung menggunakan bobot persentase standar berikut:</p>
        <ul>
          <li>Bobot Nilai Atasan Langsung: <strong>${state.period.weightsWithSub.Atasan}%</strong></li>
          <li>Bobot Nilai Rekan Sejawat (Peer): <strong>${state.period.weightsWithSub.Peer}%</strong></li>
          <li>Bobot Nilai Bawahan Langsung: <strong>${state.period.weightsWithSub.Bawahan || 0}%</strong></li>
          <li>Bobot Evaluasi Diri Sendiri (Self): <strong>${100 - state.period.weightsWithSub.Atasan - state.period.weightsWithSub.Peer - (state.period.weightsWithSub.Bawahan || 0)}%</strong></li>
        </ul>
        <p style="font-size: 10pt; font-style: italic;">
          Rumus: Skor Akhir = (SkorAtasan * ${state.period.weightsWithSub.Atasan}%) + (SkorPeer * ${state.period.weightsWithSub.Peer}%) + (SkorBawahan * ${state.period.weightsWithSub.Bawahan || 0}%) + (SkorSelf * ${100 - state.period.weightsWithSub.Atasan - state.period.weightsWithSub.Peer - (state.period.weightsWithSub.Bawahan || 0)}%)
        </p>

        <h3>Kasus B: Pegawai yang TIDAK MEMILIKI Bawahan Langsung (No Subordinates)</h3>
        <p>Skor agregasi otomatis diredistribusikan tanpa unsur bobot bawahan:</p>
        <ul>
          <li>Bobot Nilai Atasan Langsung: <strong>${state.period.weightsNoSub.Atasan}%</strong></li>
          <li>Bobot Nilai Rekan Sejawat (Peer): <strong>${state.period.weightsNoSub.Peer}%</strong></li>
          <li>Bobot Evaluasi Diri Sendiri (Self): <strong>${100 - state.period.weightsNoSub.Atasan - state.period.weightsNoSub.Peer}%</strong></li>
        </ul>
        <p style="font-size: 10pt; font-style: italic;">
          Rumus: Skor Akhir = (SkorAtasan * ${state.period.weightsNoSub.Atasan}%) + (SkorPeer * ${state.period.weightsNoSub.Peer}%) + (SkorSelf * ${100 - state.period.weightsNoSub.Atasan - state.period.weightsNoSub.Peer}%)
        </p>

        <h2>2.5 Klasifikasi Kategori Penilaian Perilaku</h2>
        <p>Nilai agregat akhir yang berkisar antara 1.00 hingga 5.00 dikelompokkan ke dalam kategori predikat capaian kinerja perilaku:</p>
        <table>
          <thead>
            <tr>
              <th>Interval Skor</th>
              <th>Predikat Kategori</th>
              <th>Rekomendasi Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>4.51 - 5.00</strong></td>
              <td>Sangat Baik</td>
              <td>Pertahankan, berikan apresiasi tinggi d.s.t promosi jabatan.</td>
            </tr>
            <tr class="tr-even">
              <td><strong>3.51 - 4.50</strong></td>
              <td>Baik</td>
              <td>Standar kinerja terpenuhi dengan optimal, pembinaan berkelanjutan.</td>
            </tr>
            <tr>
              <td><strong>2.51 - 3.50</strong></td>
              <td>Cukup</td>
              <td>Perlu bimbingan teknis intermiten pada beberapa aspek lemah.</td>
            </tr>
            <tr class="tr-even">
              <td><strong>1.51 - 2.50</strong></td>
              <td>Kurang</td>
              <td>Masuk program pendampingan intensif & teguran administratif.</td>
            </tr>
            <tr>
              <td><strong>1.00 - 1.50</strong></td>
              <td>Sangat Kurang</td>
              <td>Evaluasi kelayakan posisi jabatan / penjatuhan sanksi dispilin.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- BAB III -->
      <div class="page-break">
        <h1>BAB III: PANDUAN ADMINISTRATOR & TOPOLOGI SISTEM</h1>

        <h2>3.1 Panduan Manajemen Pengaturan & Manajemen Periode</h2>
        <p>Bagi Administrator Sistem (Admin BKPSDM), halaman <strong>"Setelan Sistem"</strong> merupakan kontrol pusat aplikasi:</p>
        <ul>
          <li><strong>Membuat Periode Penilaian Baru:</strong> Masukkan nama periode, rentang waktu mulai s.d selesai, ubah detail parameter rater (Min Peer, Max Peer, Max Bawahan struktural). Gunakan opsi pencarian periode bulanan/triwulan instan.</li>
          <li><strong>Kustomisasi Bobot Penilaian:</strong> Atur persentase bobot dengan maupun tanpa bawahan langsung pada kolom isian numerik yang disediakan. Pastikan total penjumlahan bobot = 100%.</li>
          <li><strong>Aktivasi Periode Global:</strong> Anda dapat mengaktifkan salah satu periode historis yang tersimpan agar seluruh antarmuka pengisian kuesioner dan ekspor dinonjolkan pada rentang periode sasaran tersebut secara nasional.</li>
        </ul>

        <h2>3.2 Topologi Jaringan & Alur Sinkronisasi Data</h2>
        <p>Sistem E-Kinerja 360 dirancang tangguh dengan infrastruktur server-side terproksi & lokal hybrid storage:</p>
        
        <h3>A. Topologi Logis Aplikasi</h3>
        <p>Alur arsitektur perangkat lunak berjalan sebagai berikut:</p>
        <p><strong>[Client Browser] &lt;== HTTPS / Secure WebSockets (Port 3000) ==&gt; [Nginx Reverse Proxy] &lt;==&gt; [Vite / Express Server Service] &lt;==&gt; [Supabase Postgres Real-time Data Store / Client API Engine]</strong></p>
        
        <h3>B. Alur Sinkronisasi</h3>
        <ol>
          <li><strong>Penyimpanan Utama (Primary Local Backup):</strong> Aplikasi menyimpan setiap pemutakhiran data secara transparan di enkripsi LocalStorage browser pengguna (<span class="font-mono">bkpsdm-dairi-360-app-v1</span>). Hal ini memastikan kebal terhadap pemadaman listrik atau konektivitas putus tiba-tiba di daerah.</li>
          <li><strong>Sinkronisasi Awan (Cloud Sync):</strong> Jika mode Cloud Supabase diaktifkan, aplikasi akan melakukan sinkronisasi otomatis menggunakan metode <strong>1-second Debounce Delay</strong>. Setiap ketukan atau pengisian kuesioner akan dijadwalkan secara aman ke Server Postgres Cloud guna mencegah kehilangan data.</li>
        </ol>

        <h2>3.3 Konfigurasi Jaringan & Koneksi Supabase Cloud</h2>
        <p>Bagi mengaktifkan penyimpanan cadangan cloud eksternal, lakukan konfigurasi berikut pada Menu Setelan:</p>
        <ol>
          <li>Dapatkan kredensial proyek Supabase Anda (URL Proyek dan Anon Key).</li>
          <li>Tempelkan ke dalam kolom <strong>"Supabase Endpoint URL"</strong> dan <strong>"Supabase API Anon Key"</strong>.</li>
          <li>Tentukan nama tabel penyimpanan target (standar: <span class="font-mono">bkpsdm_360_state</span>).</li>
          <li>Aktifkan saklar toggle <strong>"Metode Sinkronisasi Cloud"</strong> ke posisi aktif.</li>
          <li>Sistem secara dinamis akan membuat tabel (jika belum ada) dan mengaktifkan integrasi. Jalankan skrip Rujukan SQL yang disediakan di dasbor ke SQL Editor Supabase guna menjamin aturan akses tabel yang selaras.</li>
        </ol>
      </div>

      <!-- BAB IV -->
      <div class="page-break">
        <h1>BAB IV: LOG VERSI & CATATAN PERUBAHAN</h1>

        <h2>4.1 Tabel Riwayat Versi (Changelog)</h2>
        <p>Perjalanan penyempurnaan sistem E-Kinerja 360 dapat diaudit pada riwayat rilis berikut:</p>
        <table>
          <thead>
            <tr>
              <th>Nomor Versi</th>
              <th>Tanggal Rilis</th>
              <th>Inisiator Perubahan</th>
              <th>Status Rilis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>v2.4.2 Navy</strong></td>
              <td>02 Juni 2026</td>
              <td>Tim Teknis BKPSDM Dairi</td>
              <td>Stabil (Produksi)</td>
            </tr>
            <tr class="tr-even">
              <td><strong>v2.3.0</strong></td>
              <td>28 April 2026</td>
              <td>Pusat Pengembangan Sistem</td>
              <td>Arsip</td>
            </tr>
            <tr>
              <td><strong>v2.0.0</strong></td>
              <td>05 Maret 2026</td>
              <td>Tim Internal BKPSDM</td>
              <td>Arsip</td>
            </tr>
            <tr class="tr-even">
              <td><strong>v1.0.0</strong></td>
              <td>20 Januari 2026</td>
              <td>Inisiasi Tim IT Kabupaten</td>
              <td>Arsip</td>
            </tr>
          </tbody>
        </table>

        <h2>4.2 Detail Tambahan Fitur Serta Peningkatan Terbaru (v2.4.2)</h2>
        <ul>
          <li><strong>Tambahan Filter Saringan Periode:</strong> Antarmuka rekap eksekutif admin kini dilengkapi dropdown dinamis guna memfilter, merekap, menganalisis, serta mencetak laporan per masing-masing periode kustom harian, bulanan, maupun per triwulan.</li>
          <li><strong>Ekspor Laporan Multiformat:</strong> Penyaluran data komprehensif ke format CSV, lembar kerja Microsoft Excel berformat (.xls), serta pencetakan lembar resmi berkop surat dinas PDF.</li>
          <li><strong>Detektor Flag Anomali Otomatis (Audit):</strong> Analisis real-time anomali penilaian (penilaian terlalu seragam / bias rater tinggi) untuk menyaring data bias koresponden secara dini.</li>
          <li><strong>Manajemen Multi-Periode Dinamis:</strong> Menu penciptaan periode baru tanpa menindih database lama, lengkap dengan penyalinan profil rater instan guna menunjang pengujian berulang.</li>
        </ul>
      </div>
      
      <p style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 8.5pt;">Dokumentasi ini dibuat secara digital dan dilindungi Hak Cipta BKPSDM Kabupaten Dairi © 2026</p>
    </body>
    </html>
    `;

    const fileContent = header + bodyContent;
    const blob = new Blob(['\ufeff' + fileContent], {
      type: "application/msword;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Panduan_Penggunaan_E-Kinerja_360_BKPSDM_Dairi_v2.4.2.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Dokumen Panduan (.docx / .doc) berhasil diunduh! 💚");
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION WITH HERO CARD */}
      <Card className="bg-blue-950 text-white border-2 border-slate-950 relative overflow-hidden">
        {/* Subtle geometric neon elements or styles */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <HelpCircle className="w-48 h-48 scroll-smooth" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border-2 border-slate-950 bg-yellow-300 text-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]">
              Pusat Pengetahuan & Bantuan 💎
            </span>
            <h1 className="text-2xl font-black font-display text-white" style={{ color: "#ffffff !important" }}>
              Dokumentasi & Panduan E-Kinerja 360
            </h1>
            <p className="text-xs text-blue-200 max-w-2xl font-bold leading-relaxed">
              Panduan operasional lengkap, penjelasan detail metodologi perhitungan skor indeks perilaku, konfigurasi server database administrator, s.d catatan rekayasa rilis ter-update.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              id="btn-download-manual"
              onClick={handleDownloadDoc}
              className="bg-yellow-300 hover:bg-yellow-400 text-slate-950 font-black text-xs py-3 px-5 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Unduh Panduan (.DOCX)
            </Button>
          </div>
        </div>
      </Card>

      {/* THREE TABS NAV */}
      <div className="flex flex-wrap gap-2.5 font-display select-none">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none ${
            activeTab === "user"
              ? "bg-cyan-300 text-slate-950 border-slate-950"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <User className="w-4 h-4 stroke-[2.5]" />
          Panduan ASN
        </button>
        <button
          onClick={() => setActiveTab("methodology")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none ${
            activeTab === "methodology"
              ? "bg-cyan-300 text-slate-950 border-slate-950"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 stroke-[2.5]" />
          Metode & Rumus Skor
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none ${
            activeTab === "admin"
              ? "bg-cyan-300 text-slate-950 border-slate-950"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Sliders className="w-4 h-4 stroke-[2.5]" />
          Panduan Admin & Jaringan
        </button>
        <button
          onClick={() => setActiveTab("changelog")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none ${
            activeTab === "changelog"
              ? "bg-cyan-300 text-slate-950 border-slate-950"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <GitBranch className="w-4 h-4 stroke-[2.5]" />
          Log Versi Sistem
        </button>
      </div>

      {/* CONTENT ACCORDING TO TABS */}
      {activeTab === "user" && (
        <div className="space-y-4">
          <Card>
            <div className="border-b pb-3 mb-4 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-blue-100 border-2 border-slate-950 text-blue-900">
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <h2 className="text-md font-black font-display text-slate-900">Petunjuk Penggunaan Otoritas Pegawai ASN</h2>
                <p className="text-xs text-slate-500 font-medium">Langkah demi langkah mendaftar, mengusulkan evaluator (rater), hingga menyempurnakan isi kuesioner.</p>
              </div>
            </div>

            {/* ACCORDION ITEMS */}
            <div className="space-y-3 font-display text-xs">
              <div className="border-2 border-slate-950 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 transition">
                <button
                  onClick={() => toggleSection("login")}
                  className="w-full flex items-center justify-between p-4 font-black text-slate-950 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-sky-600 stroke-[2.5]" />
                    1. Prosedur Autentikasi dan Cara Login Sistem
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === "login" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "login" && (
                  <div className="p-4 bg-white border-t-2 border-slate-950 leading-relaxed space-y-2 text-slate-700 font-medium font-sans">
                    <p>Aplikasi ini mengadopsi single-point-access login berdasarkan basis data terpadu NIP Kepegawaian.</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Ketik <strong>NIP 18-Digit</strong> pada inputan form (Contoh: <code className="bg-slate-100 px-1 font-mono rounded">199001012010...</code>).</li>
                      <li>Masukkan kata sandi bawaan instansi default (<code className="bg-slate-100 px-1 font-mono font-bold rounded">admin123</code>). Atasan dan Admin berhak menggantinya kapan saja melalui menu Ganti Kata Sandi.</li>
                      <li>Di atas form login, telah disediakan widget <strong>Login Cepat ASN</strong>, Anda tinggal mengetik nama target uji coba (misal: <em>Dewi Lestari</em>, <em>Samsul</em>, <em>Kepala Badan</em>) lalu mengkliknya untuk seketika login tanpa sandi demi menghemat waktu pendemoan.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="border-2 border-slate-950 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 transition">
                <button
                  onClick={() => toggleSection("profile")}
                  className="w-full flex items-center justify-between p-4 font-black text-slate-950 text-left"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    2. Cara Melakukan Update Data Profil Mandiri
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === "profile" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "profile" && (
                  <div className="p-4 bg-white border-t-2 border-slate-950 leading-relaxed space-y-2 text-slate-700 font-medium font-sans">
                    <p>Keselarasan jabatan dan kepemilikan bawahan mempengaruhi jenis rater korespondensi. Cara mengubahnya:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Klik menu <strong>Profil ASN</strong>, amati parameter Anda yang aktif saat ini.</li>
                      <li>Tekan tombol <strong>Perbarui Profil</strong> berwarna biru solid.</li>
                      <li>Perbarui Nama Lengkap, Jabatan, Golongan, Unit Kerja, dsb.</li>
                      <li><strong>PENTING:</strong> Aktifkan tanda centang <em>"Memiliki Bawahan Langsung"</em> jika Anda berperan selaku pejabat eselon/fungsional pimpinan unit agar bawahan Anda dapat mengevaluasi Anda secara otomatis.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="border-2 border-slate-950 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 transition">
                <button
                  onClick={() => toggleSection("raters")}
                  className="w-full flex items-center justify-between p-4 font-black text-slate-950 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                    3. Alur Pengusulan & Verifikasi Rater 360° (Evaluator)
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === "raters" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "raters" && (
                  <div className="p-4 bg-white border-t-2 border-slate-950 leading-relaxed space-y-2 text-slate-700 font-medium font-sans">
                    <div className="bg-amber-50 rounded-xl p-3 border-2 border-amber-950 mb-3 text-amber-950 flex gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 stroke-[2.5]" />
                      <strong>Independensi Rater:</strong> Rekan Sejawat diajukan oleh Anda sendiri namun wajib disetujui (diverifikasi) atasan langsung di halaman atasan. Selaku atasan, jika tidak setuju maka rekan tersebut ditolak dan wajib diajukan pengganti demi kepatuhan kriteria.
                    </div>
                    <p className="font-extrabold text-slate-900 border-b pb-1 font-display uppercase tracking-wider text-[10px]">Alur Pengusulan Rater Rekan Sejawat (Peer):</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Buka menu <strong>Manajemen Evaluator</strong>. Sistem mengidentifikasi rekan-rekan ASN satu unit kerja yang berjabatan setingkat.</li>
                      <li>Klik nama-nama rekan sasaran yang ingin dijadikan penilai, pastikan jumlah minimal terpenuhi (Contoh: minimal 3 sejawat).</li>
                      <li>Klik <strong>Kirim Usulan Evaluator</strong>. Sembari menunggu diuji Atasan, statusnya berupa "Menunggu Verifikasi".</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="border-2 border-slate-950 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100/50 transition">
                <button
                  onClick={() => toggleSection("assessment")}
                  className="w-full flex items-center justify-between p-4 font-black text-slate-950 text-left"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                    4. Tata Cara Pengisian Kuesioner BerAKHLAK
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === "assessment" ? "rotate-180" : ""}`} />
                </button>
                {expandedSection === "assessment" && (
                  <div className="p-4 bg-white border-t-2 border-slate-950 leading-relaxed space-y-2 text-slate-700 font-medium font-sans">
                    <p>Setelah pengusulan disetujui oleh atasan (atau otomatis mandiri), Anda siap melakukan penilaian perilaku:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Buka menu <strong>Kuesioner Penilaian</strong>. Amati pembagian list: Diri Sendiri, Atasan, Sejawat, dan Bawahan (jika ada).</li>
                      <li>Target penilai yang belum diisi memiliki tanda tombol merah <strong>Isi Penilaian</strong>. Klik tombol tersebut.</li>
                      <li>Isikan jawaban sejujur mungkin (Sangat Jarang s.d Sangat Sering) untuk 14 butir implementasi dimensi perilaku ditiap klaster BerAKHLAK.</li>
                      <li>Tulis ulasan konstruktif pada kolom masukan komentar perbaikan, lalu tekan <strong>Kirim Kuesioner Penilaian</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "methodology" && (
        <div className="space-y-4">
          <Card>
            <div className="border-b pb-3 mb-4 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-emerald-100 border-2 border-slate-950 text-emerald-900">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <h2 className="text-md font-black font-display text-slate-900">Metodologi & Perhitungan Formula Skor Kinerja</h2>
                <p className="text-xs text-slate-500 font-medium">Rincian formula pembobotan ganda, pembagian rater, serta klasifikasi predikat kelulusan berdasarkan standar regulasi.</p>
              </div>
            </div>

            <div className="space-y-4 font-display text-xs">
              {/* CARDS GRID FOR FORMULA */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-slate-950 rounded-xl p-4 bg-blue-50/50 leading-relaxed">
                  <h4 className="font-extrabold text-[#0b1329] mb-2 uppercase tracking-wide flex items-center gap-1">
                    <span>⚡</span> 1. Kasus Pegawai BERBAWAHAN LANGSUNG
                  </h4>
                  <p className="text-slate-600 mb-3 text-[11px] font-sans">Beban persentase pembobotan jika pegawai menduduki eselon / pimpinan tim yang memiliki bawahan terdaftar:</p>
                  
                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between border-b border-dashed pb-1">
                      <span>Atasan Langsung (Mandatory):</span>
                      <span className="font-black text-blue-800">{state.period.weightsWithSub.Atasan}%</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed pb-1">
                      <span>Rekan Sejawat (Peer-Average):</span>
                      <span className="font-black text-blue-800">{state.period.weightsWithSub.Peer}%</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed pb-1">
                      <span>Bawahan Langsung (Sub-Average):</span>
                      <span className="font-black text-blue-800">{state.period.weightsWithSub.Bawahan || 0}%</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Evaluasi Mandiri (Self):</span>
                      <span className="font-black text-blue-800">
                        {100 - state.period.weightsWithSub.Atasan - state.period.weightsWithSub.Peer - (state.period.weightsWithSub.Bawahan || 0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-950 rounded-xl p-4 bg-emerald-50/50 leading-relaxed">
                  <h4 className="font-extrabold text-[#0b1329] mb-2 uppercase tracking-wide flex items-center gap-1">
                    <span>⚡</span> 2. Kasus Pegawai TANPA BAWAHAN LANGSUNG
                  </h4>
                  <p className="text-slate-600 mb-3 text-[11px] font-sans">Beban persentase diredistribusikan tanpa menyangkut unsur bawahan bagi ASN staf fungsional / pelaksana umum:</p>
                  
                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between border-b border-dashed pb-1">
                      <span>Atasan Langsung (Mandatory):</span>
                      <span className="font-black text-emerald-800">{state.period.weightsNoSub.Atasan}%</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed pb-1">
                      <span>Rekan Sejawat (Peer-Average):</span>
                      <span className="font-black text-emerald-800">{state.period.weightsNoSub.Peer}%</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Evaluasi Mandiri (Self):</span>
                      <span className="font-black text-emerald-800">
                        {100 - state.period.weightsNoSub.Atasan - state.period.weightsNoSub.Peer}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILED RATED SCALE BRACKETS */}
              <div className="border-2 border-slate-950 rounded-xl p-4 bg-white">
                <h3 className="font-black text-slate-950 mb-3 uppercase tracking-wide text-xs">Klasifikasi Predikat Hasil & Kategori Capaian Perilaku</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-display uppercase tracking-wide">
                        <th className="p-2 border">Batas Nilai Min - Maks</th>
                        <th className="p-2 border">Predikat Kategori</th>
                        <th className="p-2 border">Status Kepatuhan Audit Perilaku ASN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-mono font-bold">4.51 s.d 5.00</td>
                        <td className="p-2 border"><Badge className="bg-emerald-400 text-[#000]">Sangat Baik</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Perilaku ideal rujukan kerja nasional, konsisten dipertahankan.</td>
                      </tr>
                      <tr className="bg-slate-50/55">
                        <td className="p-2 border font-mono font-bold">3.51 s.d 4.50</td>
                        <td className="p-2 border"><Badge className="bg-blue-300 text-[#000]">Baik</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Terbuka melampaui sasaran dinas dasar, rujukan standar tinggi.</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-mono font-bold">2.51 s.d 3.50</td>
                        <td className="p-2 border"><Badge className="bg-amber-300 text-[#000]">Cukup</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Perlu bimbingan intermiten, terdapat fluktuasi objektivitas kerja.</td>
                      </tr>
                      <tr className="bg-slate-50/55">
                        <td className="p-2 border font-mono font-bold">1.51 s.d 2.50</td>
                        <td className="p-2 border"><Badge className="bg-rose-400 text-[#000]">Kurang</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Teguran tertulis wajib & pendampingan klinit fungsional khusus.</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-mono font-bold">1.00 s.d 1.50</td>
                        <td className="p-2 border"><Badge className="bg-red-600 text-white">Sangat Kurang</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Memicu sanksi disiplinitas berat, peninjauan jabatan kepegawaian.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "admin" && (
        <div className="space-y-4">
          <Card>
            <div className="border-b pb-3 mb-4 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-indigo-100 border-2 border-slate-950 text-indigo-900">
                <Sliders className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <h2 className="text-md font-black font-display text-slate-900">Panduan Administrator & Arsitektur Jaringan</h2>
                <p className="text-xs text-slate-500 font-medium">Petunjuk pengaturan dasbor, customisasi filter target penilaian, skema alur data, serta penataan Supabase Cloud integrasi.</p>
              </div>
            </div>

            <div className="space-y-4 font-display text-xs">
              {/* TOPOLOGY DESCRIPTION */}
              <div className="border-2 border-slate-950 rounded-xl p-4 bg-slate-900 text-slate-100">
                <h3 className="font-extrabold text-white mb-3 uppercase tracking-wide flex items-center gap-1.5" style={{ color: "#ffffff !important" }}>
                  <Network className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                  A. Topologi Logis & Alur Jaringan Data
                </h3>
                
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10.5px] leading-relaxed text-emerald-400">
                  <div className="flex flex-wrap items-center gap-1 justify-center">
                    <span>[Client Browser Web]</span>
                    <span>=== HTTPS / WSS ===&gt;</span>
                    <span>[Nginx Proxy Ingress]</span>
                    <span>== Port 3000 ==&gt;</span>
                    <span>[Vite dev/Express Build Server]</span>
                    <span>== REST/API ==&gt;</span>
                    <span>[Supabase Postgres DB]</span>
                  </div>
                </div>

                <div className="mt-3 leading-relaxed text-slate-300 space-y-2 text-[11px] font-sans">
                  <p>Alur transfer data sistem dijamin aman dengan 3 kriteria perlindungan:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Reverse Proxy Port Integration:</strong> Port ingress luar eksklusif terikat pada Port <strong>3000</strong>. Nginx memfilter d.s.t menyalurkan permintaan ke engine Express server-side secara langsung.</li>
                    <li><strong>Decoupled Double Storage:</strong> Perubahan data disimpan seketika di <code className="bg-slate-850 px-1 text-slate-200">LocalStorage</code> di peramban, lalu didebounce 1-detik menuju API Supabase Cloud guna menjamin bebas hambatan di wilayah minim sinyal.</li>
                    <li><strong>Aturan Keamanan Row-Level Security (RLS) Supabase:</strong> Skrip SQL penyediaan tabel menyertakan otorisasi ketat guna memproteksi data agar tidak dapat dirusak oleh pihak non-autentikasi luar.</li>
                  </ul>
                </div>
              </div>

              {/* SUPABASE CONNECTION SETTINGS */}
              <div className="border-2 border-slate-950 rounded-xl p-4 bg-white">
                <h3 className="font-black text-slate-950 mb-2 uppercase tracking-wide text-xs flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                  B. Tata Cara Integrasi Koneksi Supabase Cloud
                </h3>
                <p className="font-sans text-slate-600 mb-3 leading-relaxed text-[11px]">Guna melakukan integrasi serverless DB, admin diwajibkan menyetel kolom setelan sebagai berikut:</p>
                
                <ol className="list-decimal pl-5 space-y-2 leading-relaxed font-sans text-slate-700">
                  <li>Buat akun proyek di situs <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Supabase</a>.</li>
                  <li>Dapatkan link Endpoint URL proyek dari Dasbor Supabase (Contoh: <code className="bg-slate-100 font-mono py-0.5 px-1.5 rounded">https://xyzqwe.supabase.co</code>). Tempelkan ke inputan <strong>Supabase Endpoint URL</strong> di Setelan.</li>
                  <li>Ambil Kunci API Anonim (<code className="bg-slate-100 font-mono py-0.5 px-1.5 rounded">eyJhbGc...</code>). Isikan ke kolom <strong>Supabase API Anon Key</strong>.</li>
                  <li>Tentukan Target Nama Tabel yang sah (Standar: <code className="bg-slate-100 font-mono py-0.5 px-1.5 rounded">bkpsdm_360_state</code>).</li>
                  <li>Klik tombol <strong>"Simpan Konfigurasi"</strong> lalu klik <strong>"Uji Koneksi Database"</strong> guna mendapat status tervalidasi.</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "changelog" && (
        <div className="space-y-4">
          <Card>
            <div className="border-b pb-3 mb-4 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-pink-100 border-2 border-slate-950 text-pink-900">
                <GitBranch className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <h2 className="text-md font-black font-display text-slate-900">Catatan Ringkasan Versi & Changelog Sistem</h2>
                <p className="text-xs text-slate-500 font-medium">Transparansi perkembangan fitur, penambalan keamanan, s.d peningkatan fungsional terbaru dari waktu ke waktu.</p>
              </div>
            </div>

            <div className="space-y-4 font-display text-xs">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-display uppercase tracking-wide">
                    <th className="p-2.5 border">No. Versi</th>
                    <th className="p-2.5 border">Tanggal Perubahan</th>
                    <th className="p-2.5 border">Tipe Rilis</th>
                    <th className="p-2.5 border">Rincian Perubahan Penting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50/20">
                    <td className="p-2.5 border font-mono font-black text-blue-900">v2.4.2 Navy</td>
                    <td className="p-2.5 border font-semibold">02 Juni 2026</td>
                    <td className="p-2.5 border"><span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-950 px-2 py-0.5 text-[9px] rounded font-black uppercase">STABIL</span></td>
                    <td className="p-2.5 border font-medium text-slate-700 leading-relaxed">
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Implementasi <strong>Saringan Dropdown Periode Dinamis</strong> pada modul analisis laporan eksekutif dan ekspor cetakan sesuai penentuan sasaran target.</li>
                        <li>Optimalisasi pencetakan dokumen PDF dinamis dengan Kop Dinas BKPSDM Kabupaten Dairi, Sidikalang yang rapi & berformat legalitas formal.</li>
                        <li>Pengayaan lembar ekspor unduhan CSV serta spreadsheet Excel berformat (.xls) interaktif.</li>
                        <li><strong>Dapur Panduan Pengguna Interaktif:</strong> Penayangan modul bantuan online s.d skema konversi berkas manual dalam format Word (.docx) siap unduh langsung.</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-mono font-bold text-slate-500">v2.3.0</td>
                    <td className="p-2.5 border text-slate-500">28 April 2026</td>
                    <td className="p-2.5 border"><span className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 text-[9px] rounded font-bold uppercase">ARSIP</span></td>
                    <td className="p-2.5 border font-medium text-slate-500 leading-relaxed">
                      Inisiasi modul <strong>Deteksi Flag Anomali</strong> (bias rater seragam / klik membabi - buta) dilengkapi rekomendasi otomatis bimbingan fungsional, dan sinkronisasi awan didebounce 1-detik.
                    </td>
                  </tr>
                  <tr className="bg-slate-50/25 text-slate-500">
                    <td className="p-2.5 border font-mono font-bold">v2.0.0</td>
                    <td className="p-2.5 border">05 Maret 2026</td>
                    <td className="p-2.5 border"><span className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 text-[9px] rounded font-bold">ARSIP</span></td>
                    <td className="p-2.5 border font-medium leading-relaxed">
                      Transformasi antarmuka ke gaya <strong>Neo-Brutalist Navy Style v2</strong>, penataan visual card dengan bayangan outline tebal, serta penambahan menu Master data ASN, Unit Kerja, dan Jabatan.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border font-mono font-bold text-slate-500">v1.0.0</td>
                    <td className="p-2.5 border text-slate-500">20 Januari 2026</td>
                    <td className="p-2.5 border"><span className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 text-[9px] rounded font-bold">ARSIP</span></td>
                    <td className="p-2.5 border font-medium text-slate-500 leading-relaxed">
                      Peluncuran fundamental modul login pegawai, kuesioner penilaian 14-instrumen BerAKHLAK dasar, s.d saringan perbandingan sub-radar diagram.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* FOOTER ADVICE CARD */}
      <div className="rounded-2xl bg-amber-50 border-2 border-slate-950 p-4 leading-relaxed font-sans text-xs text-amber-950 flex gap-3">
        <Info className="w-5 h-5 shrink-0 stroke-[2.5] text-amber-700" />
        <div>
          <strong>Bantuan Teknis Lebih Lanjut:</strong> Jika Anda mengalami kesulitan dalam pengusulan rater, perbedaan data NIP pada profil, atau kegagalan sinkronisasi cloud eksternal, Anda dapat berkonsultasi langsung dengan tim IT BKPSDM di Jl. Sisingamangaraja No. 3 Sidikalang atau melalui surel ke <span className="underline font-bold">bkpsdm@dairikab.go.id</span>.
        </div>
      </div>
    </div>
  );
}
