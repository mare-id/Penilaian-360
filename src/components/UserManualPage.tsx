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

    const isAdminRole = user.role === "Admin BKPSDM";

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
          .formula-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            font-family: 'Consolas', 'Courier New', monospace;
            padding: 10px;
            margin: 8pt 0;
            border-radius: 6px;
            font-size: 10pt;
            color: #0f172a;
            white-space: pre-wrap;
          }
          .example-card {
            background-color: #fdfdfd;
            border: 2px solid #cbd5e1;
            border-radius: 8px;
            padding: 15px;
            margin: 15pt 0;
          }
          .example-header {
            font-weight: bold;
            font-size: 11pt;
            color: #1e3a8a;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
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
          <li><strong>Rekan Sejawat (Peer):</strong> Diajukan oleh ASN bersangkutan minimal sesuai batas ketentuan (misal ${state.period.minPeer} orang) yang merupakan ASN satu unit kerja dengan klasifikasi jabatan yang setara. Usulan ini harus disetujui Atasan Langsung Anda.</li>
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
              <td>Ditentukan admin (${state.period.minPeer} s.d ${state.period.maxPeer} orang)</td>
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

        <h2>2.3 Metode & Rumus Aljabar Perhitungan Skor Perilaku (E-Kinerja)</h2>
        <p>Penghitungan skor perilaku 360-degree feedback pada Sistem Informasi E-Kinerja BKPSDM Kabupaten Dairi dilakukan melalui 3 tahapan matematis berurutan tanpa memasukkan unsur penilaian diri sendiri (Evaluasi Diri bernilai bobot 0% / dikeluarkan dari kalkulasi untuk menjaga objektivitas murni rekan sejawat, bawahan, dan atasan):</p>

        <h3>Tahap A: Perhitungan Rata-rata Skor per Dimensi dari Rater Individu</h3>
        <p>Setiap dimensi perilaku terdiri dari 4 butir pertanyaan kuesioner berskala Likert (1 s.d 5). Rata-rata nilai dimensi dari satu rater dihitung dengan menjumlahkan seluruh skor butir pertanyaan pada dimensi tersebut lalu dibagi dengan 4:</p>
        <div class="formula-box">
Skor_Dimensi_Individu = (Butir_1 + Butir_2 + Butir_3 + Butir_4) / 4
        </div>

        <h3>Tahap B: Perhitungan Rata-rata Agregat Kelompok (Group Mean Index)</h3>
        <p>Bila terdapat lebih dari 1 rater dalam kelompok penilai yang sejenis (misalnya terdapat 3 orang rekan sejawat/peer), diperoleh skor rata-rata agregat kelompok penilai:</p>
        <div class="formula-box">
Skor_Agregat_Kelompok = (Skor_Rater_1 + Skor_Rater_2 + ... + Skor_Rater_n) / n
        </div>

        <h3>Tahap C: Perhitungan Skor Akhir Dimensi Berbobot (Skala 5)</h3>
        <p>Skor akhir per dimensi dihitung sesuai dengan profil tugas dan kepemilikan bawahan langsung pegawainya, menggunakan persentase bobot murni kelompok rater eksternal:</p>
        <div class="formula-box">
// KASUS A: PEGAWAI TANPA BAWAHAN LANGSUNG (Has Subordinates: FALSE)
Skor_Akhir_Dimensi = (Skor_Atasan * Weight_Atasan) + (Skor_Sejawat_Agregat * Weight_Peer)

// KASUS B: PEGAWAI MEMILIKI BAWAHAN LANGSUNG (Has Subordinates: TRUE)
Skor_Akhir_Dimensi = (Skor_Atasan * Weight_Atasan) + (Skor_Sejawat_Agregat * Weight_Peer) + (Skor_Bawahan_Agregat * Weight_Bawahan)
        </div>

        <h3>Tahap D: Konversi Nilai Akhir ke Skala 100</h3>
        <p>Untuk kebutuhan pengisian berkas E-Kinerja resmi, skor indeks perilaku skala 1 s.d 5 dikonversikan ke dalam skala persentase 100:</p>
        <div class="formula-box">
Skor_Akhir_100 = (Skor_Akhir_Dimensi / 5) * 100
        </div>

        <h2>2.4 Pembobotan Penilaian Sesuai Konfigurasi Sistem</h2>
        <p>Sesuai dengan ketentuan regulasi BKPSDM Kabupaten Dairi, parameter pembobotan rater yang saat ini aktif di sistem adalah:</p>

        <h3>1. Pegawai MEMILIKI Bawahan Langsung (Has Subordinates)</h3>
        <ul>
          <li>Bobot Nilai Atasan Langsung: <strong>${state.period.weightsWithSub.Atasan}%</strong></li>
          <li>Bobot Nilai Rekan Sejawat (Peer Average): <strong>${state.period.weightsWithSub.Peer}%</strong></li>
          <li>Bobot Nilai Bawahan Langsung (Sub Average): <strong>${state.period.weightsWithSub.Bawahan || 0}%</strong></li>
          <li>Evaluasi Diri Sendiri (Self): <strong>0% (Dikecualikan / Tidak Mempengaruhi Skor)</strong></li>
        </ul>

        <h3>2. Pegawai TIDAK MEMILIKI Bawahan Langsung (No Subordinates)</h3>
        <ul>
          <li>Bobot Nilai Atasan Langsung: <strong>${state.period.weightsNoSub.Atasan}%</strong></li>
          <li>Bobot Nilai Rekan Sejawat (Peer Average): <strong>${state.period.weightsNoSub.Peer}%</strong></li>
          <li>Evaluasi Diri Sendiri (Self): <strong>0% (Dikecualikan / Tidak Mempengaruhi Skor)</strong></li>
        </ul>

        <h2>2.5 CONTOH KASUS SIMULASI NYATA DENGAN VARIASI BERBEDA</h2>

        <!-- CONTOH 1 -->
        <div class="example-card">
          <div class="example-header">KASUS SIMULASI 1: PNS Pejabat Pelaksana (Tanpa Bawahan Langsung)</div>
          <p><strong>Subjek Pegawai:</strong> Robinson Silalahi, S.E (Penelaah Teknis Kebijakan, Has Subordinates = False)</p>
          <p><strong>Bobot Evaluasi:</strong> Atasan = ${state.period.weightsNoSub.Atasan}%, Rekan Sejawat = ${state.period.weightsNoSub.Peer}% (Evaluasi Diri tidak dimasukkan dalam perhitungan skor)</p>
          <p><strong>Dimensi Pengukuran:</strong> Berorientasi Pelayanan (Merespons kebutuhan layanan dengan cepat dan tepat, Menunjukkan sikap ramah dalam memberikan pelayanan, Memberikan solusi atas kebutuhan atau keluhan pemangku kepentingan, Menindaklanjuti permintaan layanan secara jelas)</p>
          <ul>
            <li>
              <strong>1. Penilaian Atasan Langsung (1 Rater):</strong><br>
              - Butir 1 (Respons Layan) = 5, Butir 2 (Sikap Ramah) = 4, Butir 3 (Pemberian Solusi) = 5, Butir 4 (Follow up) = 4<br>
              <em>Rata-rata Atasan</em> = (5 + 4 + 5 + 4) / 4 = <strong>4.50</strong>
            </li>
            <br>
            <li>
              <strong>2. Penilaian Rekan Sejawat (3 Rater):</strong><br>
              - Rekan Sejawat 1: Memberikan nilai [4, 4, 4, 4] $\rightarrow$ Rerata = 4.00<br>
              - Rekan Sejawat 2: Memberikan nilai [5, 4, 4, 3] $\rightarrow$ Rerata = 4.00<br>
              - Rekan Sejawat 3: Memberikan nilai [4, 5, 4, 5] $\rightarrow$ Rerata = 4.50<br>
              <em>Rerata Kelompok Rekan Sejawat</em> = (4.00 + 4.00 + 4.50) / 3 = 12.50 / 3 = <strong>4.17</strong>
            </li>
          </ul>
          
          <p><strong>Langkah Perhitungan Agregasi Akhir Berbobot (Skala 5 & 100):</strong></p>
          <div class="formula-box">
Skor_Dimensi = (Skor_Atasan * ${state.period.weightsNoSub.Atasan}%) + (Skor_Sejawat * ${state.period.weightsNoSub.Peer}%)
Skor_Dimensi = (4.50 * 0.60) + (4.17 * 0.40)
Skor_Dimensi = 2.70 + 1.668 = 4.368 (Skala 5)

Konversi Skala 100 = (4.368 / 5) * 100 = 87.36 (Dibulatkan menjadi 87)
          </div>
          <p><strong>Hasil Penilaian Akhir Dimensi:</strong> <strong>87.36 (Predikat: BAIK)</strong> karena berada pada interval interval nilai 76 - 89.</p>
        </div>

        <!-- CONTOH 2 -->
        <div class="example-card">
          <div class="example-header">KASUS SIMULASI 2: Pejabat Struktural (Memiliki Bawahan Langsung)</div>
          <p><strong>Subjek Pegawai:</strong> Rikson B Sihombing, S.Psi (Kepala Bidang Pembinaan dan Pengembangan Sumber Daya Manusia, Has Subordinates = True)</p>
          <p><strong>Bobot Evaluasi:</strong> Atasan = ${state.period.weightsWithSub.Atasan}%, Sejawat = ${state.period.weightsWithSub.Peer}%, Bawahan = ${state.period.weightsWithSub.Bawahan || 0}%</p>
          <p><strong>Dimensi Pengukuran:</strong> Akuntabel (Menyelesaikan tugas sesuai tanggung jawab, Jujur dalam melaporkan hasil kerja, Mematuhi aturan dan prosedur kerja, Menggunakan sumber daya organisasi secara bertanggung jawab)</p>
          <ul>
            <li>
              <strong>1. Penilaian Atasan Langsung (Yon Henrik, AP, M.Si - Kepala Badan):</strong><br>
              - Butir 1 (Tanggung Jawab) = 4, Butir 2 (Kejujuran Laporan) = 4, Butir 3 (Aturan Prosedur) = 4, Butir 4 (Sumber Daya) = 4<br>
              <em>Rerata Atasan</em> = (4 + 4 + 4 + 4) / 4 = <strong>4.00</strong>
            </li>
            <br>
            <li>
              <strong>2. Penilaian Rekan Sejawat (2 Rater):</strong><br>
              - Rekan Sejawat 1 (Try Saputra Sinaga, S.STP, M.Si - Kabid Pengadaan, Mutasi dan Informasi): Memberikan nilai [4, 5, 4, 5] $\rightarrow$ Rerata = 4.50<br>
              - Rekan Sejawat 2 (Roy Karya Marco Sinaga, S.IP, M.Si - Sekretaris Badan): Memberikan nilai [3, 4, 3, 4] $\rightarrow$ Rerata = 3.50<br>
              <em>Rerata Kelompok Rekan Sejawat</em> = (4.50 + 3.50) / 2 = <strong>4.00</strong>
            </li>
            <br>
            <li>
              <strong>3. Penilaian Bawahan Langsung (2 Rater):</strong><br>
              - Bawahan 1 (Bobby Johan Purba, S.STP, M.A.P - Penelaah Teknis Kebijakan): Memberikan nilai [5, 4, 5, 4] $\rightarrow$ Rerata = 4.50<br>
              - Bawahan 2 (Melda Heni Indrawati Sagala, S.IP - Penelaah Teknis Kebijakan): Memberikan nilai [4, 4, 4, 5] $\rightarrow$ Rerata = 4.30<br>
              <em>Rerata Kelompok Bawahan Langsung</em> = (4.50 + 4.30) / 2 = <strong>4.40</strong>
            </li>
          </ul>
          
          <p><strong>Langkah Perhitungan Agregasi Akhir Berbobot (Skala 5 & 100):</strong></p>
          <div class="formula-box">
Skor_Dimensi = (Skor_Atasan * ${state.period.weightsWithSub.Atasan}%) + (Skor_Sejawat * ${state.period.weightsWithSub.Peer}%) + (Skor_Bawahan * ${state.period.weightsWithSub.Bawahan || 0}%)
Skor_Dimensi = (4.00 * 0.60) + (4.00 * 0.15) + (4.40 * 0.25)
Skor_Dimensi = 2.40 + 0.60 + 1.10 = 4.10 (Skala 5)

Konversi Skala 100 = (4.10 / 5) * 100 = 82.00
          </div>
          <p><strong>Hasil Penilaian Akhir Dimensi:</strong> <strong>82.00 (Predikat: BAIK)</strong> karena berada pada interval nilai 76 - 89.</p>
        </div>

        <!-- CONTOH 3 -->
        <div class="example-card">
          <div class="example-header">KASUS SIMULASI 3: Jabatan Fungsional/Pelaksana (Tanpa Bawahan, Evaluasi Kurang Memuaskan)</div>
          <p><strong>Subjek Pegawai:</strong> Richad Mika Sinaga, S.Tr.IP (Analis SDM Aparatur, Has Subordinates = False)</p>
          <p><strong>Bobot Evaluasi:</strong> Atasan = ${state.period.weightsNoSub.Atasan}%, Rekan Sejawat = ${state.period.weightsNoSub.Peer}%</p>
          <p><strong>Dimensi Pengukuran:</strong> Adaptif (Terbuka terhadap perubahan, Cepat menyesuaikan diri dengan sistem atau kebijakan baru, Mencari cara kerja yang lebih efektif, Proaktif menghadapi masalah pekerjaan)</p>
          <ul>
            <li>
              <strong>1. Penilaian Atasan Langsung (Rikson B Sihombing, S.Psi - Kepala Bidang Pembinaan dan Pengembangan SDM):</strong><br>
              - Butir 1 (Terbuka Ubah) = 3, Butir 2 (Cepat Sesuai) = 2, Butir 3 (Cara Efektif) = 3, Butir 4 (Proaktif) = 2<br>
              <em>Rerata Atasan</em> = (3 + 2 + 3 + 2) / 4 = <strong>2.50</strong>
            </li>
            <br>
            <li>
              <strong>2. Penilaian Rekan Sejawat (3 Rater):</strong><br>
              - Rekan Sejawat 1 (Hendra Supreddi Simaremare, S.I.P - Analis SDM Aparatur): Rerata rincian = 2.00<br>
              - Rekan Sejawat 2 (Maria Morina Seniwaty Simbolon, S.M - Analis SDM Aparatur): Rerata rincian = 2.50<br>
              - Rekan Sejawat 3 (Musa Sembiring, S.Kom - Analis SDM Aparatur): Rerata rincian = 1.50<br>
              <em>Rerata Kelompok Rekan Sejawat</em> = (2.00 + 2.50 + 1.50) / 3 = <strong>2.00</strong>
            </li>
          </ul>
          
          <p><strong>Langkah Perhitungan Agregasi Akhir Berbobot (Skala 5 & 100):</strong></p>
          <div class="formula-box">
Skor_Dimensi = (Skor_Atasan * ${state.period.weightsNoSub.Atasan}%) + (Skor_Sejawat * ${state.period.weightsNoSub.Peer}%)
Skor_Dimensi = (2.50 * 0.60) + (2.00 * 0.40)
Skor_Dimensi = 1.50 + 0.80 = 2.30 (Skala 5)

Konversi Skala 100 = (2.30 / 5) * 100 = 46.00
          </div>
          <p><strong>Hasil Penilaian Akhir Dimensi:</strong> <strong>46.00 (Predikat: SANGAT KURANG)</strong> karena berada di bawah 51. Pegawai membutuhkan pembinaan intensif atau coaching khusus dari pihak pimpinan unit kerja.</p>
        </div>

        <h2>2.6 Klasifikasi Kategori Penilaian Perilaku (Skala 100 & Skala 5)</h2>
        <p>Nilai agregat akhir kebulatan total yang berkisar antara 0 hingga 100 (dan konversi ekuivalen skala 1.00 s.d 5.00) diklasifikasikan ke dalam predikat capaian kinerja perilaku berikut:</p>
        <table>
          <thead>
            <tr>
              <th>Skor (Skala 100)</th>
              <th>Ekuivalen (Skala 5)</th>
              <th>Predikat Kategori</th>
              <th>Rekomendasi Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>90 - 100</strong></td>
              <td>4.50 - 5.00</td>
              <td>Sangat Baik</td>
              <td>Pertahankan, berikan apresiasi tinggi dan rekomendasi promosi jabatan atau penghargaan khusus.</td>
            </tr>
            <tr class="tr-even">
              <td><strong>76 - 89</strong></td>
              <td>3.80 - 4.49</td>
              <td>Baik</td>
              <td>Standar perilaku terpenuhi dengan sangat optimal, pembinaan dan pengembangan kompetensi terpelihara.</td>
            </tr>
            <tr>
              <td><strong>61 - 75</strong></td>
              <td>3.05 - 3.79</td>
              <td>Butuh Perbaikan</td>
              <td>Perlu bimbingan teknis berkala, pendampingan atau coaching intensif oleh atasan pada aspek lemah.</td>
            </tr>
            <tr class="tr-even">
              <td><strong>51 - 60</strong></td>
              <td>2.55 - 3.04</td>
              <td>Kurang</td>
              <td>Program pendampingan berkelanjutan dari tim penyehatan kinerja, konseling psikologi, dan teguran lisan/tertulis.</td>
            </tr>
            <tr>
              <td><strong>Di bawah 51</strong></td>
              <td>Di bawah 2.55</td>
              <td>Sangat Kurang</td>
              <td>Evaluasi kelayakan posisi jabatan saat ini, pengenaan sanksi disipliner kepegawaian sesuai ketentuan.</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${isAdminRole ? `
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
          <li><strong>Penyimpanan Utama (Primary Local Backup):</strong> Aplikasi menyimpan setiap pemutakhiran data secara transparan di enkripsi LocalStorage browser pengguna (<span class="font-mono">bkpsdm-dairi-360-app-v2</span>). Hal ini memastikan kebal terhadap pemadaman listrik atau konektivitas putus tiba-tiba di daerah.</li>
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
      ` : "" }
      
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
        {user.role === "Admin BKPSDM" && (
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
        )}
        {user.role === "Admin BKPSDM" && (
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
        )}
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
                <h2 className="text-md font-black font-display text-slate-900">Metodologi & Rumus Perhitungan Skor Kinerja Perilaku</h2>
                <p className="text-xs text-slate-500 font-medium">Penjelasan alur aljabar, pembobotan silang kelompok koresponden, dan formula matematika penentuan indeks perilaku ASN BerAKHLAK 360°.</p>
              </div>
            </div>

            <div className="space-y-6 font-display text-xs">
              {/* MATHEMATICAL STEPS */}
              <div className="border-2 border-slate-950 bg-slate-50 rounded-2xl p-4 md:p-5">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <span className="p-1.5 rounded-lg bg-blue-100 border-2 border-slate-950 text-blue-900">1</span>
                  TAHAPAN MATEMATIS PERHITUNGAN SKOR AGREGAT
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] bg-sky-200 text-sky-950 font-black px-2 py-0.5 rounded border border-sky-400">Tahap A</span>
                    <h4 className="font-extrabold text-[#0f172a] text-[11px]">Rata-rata Dimensi per Rater Kepegawaian</h4>
                    <p className="text-slate-600 text-[11px] font-sans">Setiap dimensi memiliki 2 butir kuesioner. Skor dimensi rater individu dihitung:</p>
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded font-mono text-[10.5px] text-indigo-950">
                      Skor_Dimensi = (Butir_1 + Butir_2) / 2
                    </div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] bg-purple-200 text-purple-950 font-black px-2 py-0.5 rounded border border-purple-400">Tahap B</span>
                    <h4 className="font-extrabold text-[#0f172a] text-[11px]">Rerata Indeks Kelompok Kategori Rater</h4>
                    <p className="text-slate-600 text-[11px] font-sans">Bila terdapat (n) rater dalam satu kategori (misal: sejawat), ditarik rata-rata aritmatika:</p>
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded font-mono text-[10.5px] text-indigo-950">
                      Skor_Kategori = (Σ Rerata_Rater_i) / n
                    </div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 space-y-2 md:col-span-2">
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded border border-emerald-400">Tahap C</span>
                    <h4 className="font-extrabold text-[#0f172a] text-[11px]">Perhitungan Agregat Akhir Berbobot per Dimensi</h4>
                    <p className="text-slate-600 text-[11px] font-sans">Mendistribusikan total 100% beban nilai ke rater eksternal secara objektif sesuai validasi kepemilikan bawahan langsung (tidak melibatkan penilaian diri sendiri):</p>
                    <div className="bg-slate-50 border border-slate-300 p-3 rounded font-mono text-[10.5px] text-slate-900 leading-relaxed whitespace-pre-wrap">
{`// KASUS 1: PEGAWAI MEMILIKI BAWAHAN LANGSUNG (Has Subordinates = True)
Skor_Dimensi_Akhir = (SkorAtasan * ${state.period.weightsWithSub.Atasan}%) + (SkorPeer * ${state.period.weightsWithSub.Peer}%) + (SkorBawahan * ${state.period.weightsWithSub.Bawahan || 0}%)

// KASUS 2: PEGAWAI TANPA BAWAHAN LANGSUNG (Has Subordinates = False)
Skor_Dimensi_Akhir = (SkorAtasan * ${state.period.weightsNoSub.Atasan}%) + (SkorPeer * ${state.period.weightsNoSub.Peer}%)`}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 space-y-2 md:col-span-2">
                    <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded border border-amber-400">Tahap D</span>
                    <h4 className="font-extrabold text-[#0f172a] text-[11px]">Indeks Skor Total Akumulatif Pegawai & Konversi Skala 100</h4>
                    <p className="text-slate-600 text-[11px] font-sans">Skor rata-rata ke-7 dimensi perilaku dikonversikan ke skala 100 untuk pengisian hasil E-Kinerja:</p>
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded font-mono text-[10.5px] text-indigo-950">
                      Skor_Total_Gabungan = (Skor_Dimensi_Akhir_Rerata / 5) * 100
                    </div>
                  </div>
                </div>
              </div>

              {/* CARDS GRID FOR CURRENT PARAMETERS */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-slate-950 rounded-xl p-4 bg-blue-50/40 leading-relaxed">
                  <h4 className="font-extrabold text-[#0b1329] mb-2.5 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <span>🏢</span> Parameter Bobot Perhitungan (DENGAN BAWAHAN)
                  </h4>
                  <p className="text-slate-500 mb-3 text-[11px] font-sans">Berlaku bagi pejabat pimpinan eselon, pengawas, kepala unit kerja, atau jabatan fungsional penugasan:</p>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1.5">
                      <span>Nilai Atasan Langsung:</span>
                      <span className="font-black text-blue-900">{state.period.weightsWithSub.Atasan}%</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1.5">
                      <span>Nilai Rekan Sejawat (Peer Average):</span>
                      <span className="font-black text-blue-900">{state.period.weightsWithSub.Peer}%</span>
                    </div>
                    <div className="flex justify-between border-not border-dashed border-slate-305 pb-0.5">
                      <span>Nilai Bawahan Langsung (Sub Average):</span>
                      <span className="font-black text-blue-900">{state.period.weightsWithSub.Bawahan || 0}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic">
                      * Evaluasi Diri (Self) bernilai bobot 0% (tidak dimasukkan dalam kumulatif skor akhir)
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-950 rounded-xl p-4 bg-emerald-50/40 leading-relaxed">
                  <h4 className="font-extrabold text-[#0b1329] mb-2.5 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <span>👤</span> Parameter Bobot Perhitungan (TANPA BAWAHAN)
                  </h4>
                  <p className="text-slate-500 mb-3 text-[11px] font-sans">Berlaku bagi staf pelaksana umum, fungsional ahli pertama/muda, guru non-tugas tambahan, dll:</p>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1.5">
                      <span>Nilai Atasan Langsung:</span>
                      <span className="font-black text-emerald-900">{state.period.weightsNoSub.Atasan}%</span>
                    </div>
                    <div className="flex justify-between pb-1.5">
                      <span>Nilai Rekan Sejawat (Peer Average):</span>
                      <span className="font-black text-emerald-900">{state.period.weightsNoSub.Peer}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic">
                      * Evaluasi Diri (Self) bernilai bobot 0% (tidak dimasukkan dalam kumulatif skor akhir)
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE SIMULATION CASES PANEL */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="p-1.5 rounded-lg bg-yellow-100 border-2 border-slate-950 text-amber-900">2</span>
                  CONTOH KASUS SIMULASI PERHITUNGAN NYATA (VARIASI KHUSUS)
                </h3>

                {/* CASE 1 */}
                <div className="border-2 border-slate-950 rounded-2xl bg-white overflow-hidden shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <div className="bg-sky-600 text-white p-3.5 border-b-2 border-slate-950">
                    <h4 className="font-black text-xs uppercase tracking-wider text-yellow-300">Variasi Kasus A: PNS Pejabat Pelaksana (Tanpa Bawahan)</h4>
                    <p className="text-[11px] text-white/90 font-medium">Contoh: Robinson Silalahi, SE (Penelaah Teknis Kebijakan, Has Subordinates: FALSE)</p>
                  </div>
                  <div className="p-4 space-y-3 font-sans text-[11.5px] leading-relaxed text-slate-705">
                    <p className="font-display font-black text-[#1e293b]">Dimensi Penilaian: <span className="text-sky-700">Berorientasi Pelayanan</span></p>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-sky-800">1. Atasan Langsung (Togap Simanullang - Kasubbag Umum):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Merespons kebutuhan layanan dengan cepat dan tepat = 5</li>
                          <li>Menunjukkan sikap ramah dalam memberikan pelayanan = 4</li>
                          <li>Memberikan solusi atas kebutuhan atau keluhan = 5</li>
                          <li>Menindaklanjuti permintaan layanan secara jelas = 4</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rata-rata Atasan = (5+4+5+4)/4 = 4.50</strong></li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-sky-800">2. Rekan Sejawat (3 Orang):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Rekan 1 (Hendra S): Memberikan nilai [4,4,4,4] $\rightarrow$ Rerata = 4.00</li>
                          <li>Rekan 2 (Maria S): Memberikan nilai [5,4,4,3] $\rightarrow$ Rerata = 4.00</li>
                          <li>Rekan 3 (Minar B): Memberikan nilai [4,5,4,5] $\rightarrow$ Rerata = 4.50</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rerata Kelompok Sejawat = (4.00+4.00+4.50)/3 = 4.17</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 font-mono text-[11px]">
                      <span className="font-black text-sky-950">[LANGKAH MATEMATIKA AGREGAT]:</span><br />
                      Perhitungan Skor Akhir Dimensi = (Atasan * {state.period.weightsNoSub.Atasan}%) + (Peer * {state.period.weightsNoSub.Peer}%)<br />
                      Perhitungan Skor Akhir Dimensi = (4.50 * 0.60) + (4.17 * 0.40) = 2.70 + 1.668 = <strong>4.368</strong><br />
                      Konversi ke Skala 100 = (4.368 / 5) * 100 = <strong>87.36</strong> (Dibulatkan ke 87)
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-500 text-white rounded font-black text-[10px] uppercase border border-slate-950 inline-block">Hasil Kelulusan: BAIK</span>
                      <p className="text-[11px] text-slate-500">Nilai total <strong>87.36</strong> berada dalam interval <strong>76 - 89 (BAIK)</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* CASE 2 */}
                <div className="border-2 border-slate-950 rounded-2xl bg-white overflow-hidden shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <div className="bg-indigo-600 text-white p-3.5 border-b-2 border-slate-950">
                    <h4 className="font-black text-xs uppercase tracking-wider text-yellow-300">Variasi Kasus B: Pejabat Struktural / Pimpinan (Dengan Bawahan)</h4>
                    <p className="text-[11px] text-white/90 font-medium font-sans">Contoh: Rikson B Sihombing, S.Psi (Kepala Bidang Pembinaan dan Pengembangan Sumber Daya Manusia, Has Subordinates: TRUE)</p>
                  </div>
                  <div className="p-4 space-y-3 font-sans text-[11.5px] leading-relaxed text-slate-705">
                    <p className="font-display font-black text-[#1e293b]">Dimensi Penilaian: <span className="text-indigo-700">Akuntabel</span></p>
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-indigo-800">1. Atasan (Yon Henrik, AP, M.Si - Kepala Badan):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Menyelesaikan tugas sesuai tanggung jawab = 4</li>
                          <li>Jujur dalam melaporkan hasil kerja = 4</li>
                          <li>Mematuhi aturan dan prosedur kerja = 4</li>
                          <li>Menggunakan sumber daya secara bertanggung jawab = 4</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rata-rata Atasan = 4.00</strong></li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-indigo-800">2. Sejawat (2 Orang):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Rekan 1 (Try Saputra Sinaga): Memberikan nilai [4,5,4,5] $\rightarrow$ Rerata = 4.50</li>
                          <li>Rekan 2 (Roy Karya Marco Sinaga): Memberikan nilai [3,4,3,4] $\rightarrow$ Rerata = 3.50</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rerata Sejawat = (4.50+3.50)/2 = 4.00</strong></li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-indigo-800">3. Bawahan (2 Orang):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Bawahan 1 (Bobby Johan P): Memberikan nilai [5,4,5,4] $\rightarrow$ Rerata = 4.50</li>
                          <li>Bawahan 2 (Melda Heni S): Memberikan nilai [4,4,4,5] $\rightarrow$ Rerata = 4.30</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rerata Bawahan = (4.50+4.30)/2 = 4.40</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 font-mono text-[11px]">
                      <span className="font-black text-indigo-950">[LANGKAH MATEMATIKA AGREGAT]:</span><br />
                      Perhitungan Skor Akhir = (Atasan * {state.period.weightsWithSub.Atasan}%) + (Peer * {state.period.weightsWithSub.Peer}%) + (Bawahan * {state.period.weightsWithSub.Bawahan}%)<br />
                      Perhitungan Skor Akhir = (4.00 * 0.60) + (4.00 * 0.15) + (4.40 * 0.25) = 2.40 + 0.60 + 1.10 = <strong>4.10</strong><br />
                      Konversi ke Skala 100 = (4.10 / 5) * 100 = <strong>82.00</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-500 text-white rounded font-black text-[10px] uppercase border border-slate-950 inline-block">Hasil Kelulusan: BAIK</span>
                      <p className="text-[11px] text-slate-500">Nilai total <strong>82.00</strong> berada dalam predikat <strong>BAIK (76 - 89)</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* CASE 3 */}
                <div className="border-2 border-slate-950 rounded-2xl bg-white overflow-hidden shadow-[3px_3px_0px_rgba(15,23,42,1)]">
                  <div className="bg-rose-700 text-white p-3.5 border-b-2 border-slate-950">
                    <h4 className="font-black text-xs uppercase tracking-wider text-yellow-300">Variasi Kasus C: Jabatan Fungsional/Pelaksana (Tanpa Bawahan, Rekomendasi Khusus Pembinaan)</h4>
                    <p className="text-[11px] text-white/90 font-medium">Contoh: Richad Mika Sinaga, S.Tr.IP (Analis SDM Aparatur, Has Subordinates: FALSE)</p>
                  </div>
                  <div className="p-4 space-y-3 font-sans text-[11.5px] leading-relaxed text-slate-705">
                    <p className="font-display font-black text-[#1e293b]">Dimensi Penilaian: <span className="text-rose-700">Adaptif</span></p>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-rose-800">1. Atasan (Rikson B Sihombing, S.Psi - Kepala Bidang Pembinaan dan Pengembangan SDM):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Terbuka terhadap perubahan = 3</li>
                          <li>Cepat menyesuaikan diri dengan sistem baru = 2</li>
                          <li>Mencari cara kerja yang lebih efektif = 3</li>
                          <li>Proaktif menghadapi masalah pekerjaan = 2</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rata-rata Atasan = (3+2+3+2)/4 = 2.50</strong></li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                        <strong className="text-rose-800">2. Sejawat (3 Orang):</strong>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600">
                          <li>Rekan 1 (Hendra Supreddi Simaremare, S.I.P): Rerata = 2.00</li>
                          <li>Rekan 2 (Maria Morina Seniwaty Simbolon, S.M): Rerata = 2.50</li>
                          <li>Rekan 3 (Musa Sembiring, S.Kom): Rerata = 1.50</li>
                          <li className="font-mono text-slate-950 list-none mt-1"><strong>Rerata Sejawat = (2.00+2.50+1.50)/3 = 2.00</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 font-mono text-[11px]">
                      <span className="font-black text-rose-950">[LANGKAH MATEMATIKA AGREGAT]:</span><br />
                      Perhitungan Skor Akhir = (Atasan * {state.period.weightsNoSub.Atasan}%) + (Peer * {state.period.weightsNoSub.Peer}%)<br />
                      Perhitungan Skor Akhir = (2.50 * 0.60) + (2.00 * 0.40) = 1.50 + 0.80 = <strong>2.30</strong><br />
                      Konversi ke Skala 100 = (2.30 / 5) * 100 = <strong>46.00</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-red-500 text-white rounded font-black text-[10px] uppercase border border-slate-950 inline-block">Hasil Kelulusan: SANGAT KURANG</span>
                      <p className="text-[11px] text-slate-500">Nilai total <strong>46.00</strong> berada dalam kriteria <strong>SANGAT KURANG (di bawah 51)</strong>. Menandakan perlunya pendampingan.</p>
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
                        <th className="p-2 border">Batas Nilai (Skala 100)</th>
                        <th className="p-2 border">Ekuivalen Skala 5</th>
                        <th className="p-2 border">Predikat Kategori</th>
                        <th className="p-2 border">Status Kepatuhan Audit Perilaku ASN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border font-mono font-bold">90 s.d 100</td>
                        <td className="p-2 border font-mono text-slate-500">4.50 s.d 5.00</td>
                        <td className="p-2 border"><Badge className="bg-emerald-100 text-emerald-800 border-emerald-250">Sangat Baik</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Perilaku ideal rujukan kerja nasional, konsisten dipertahankan.</td>
                      </tr>
                      <tr className="bg-slate-50/55">
                        <td className="p-2 border font-mono font-bold">76 s.d 89</td>
                        <td className="p-2 border font-mono text-slate-500">3.80 s.d 4.49</td>
                        <td className="p-2 border"><Badge className="bg-blue-100 text-blue-800 border-blue-200">Baik</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Terbuka melampaui sasaran dinas dasar, rujukan standar tinggi.</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-mono font-bold">61 s.d 75</td>
                        <td className="p-2 border font-mono text-slate-500">3.05 s.d 3.79</td>
                        <td className="p-2 border"><Badge className="bg-yellow-101 text-yellow-800 border-yellow-200">Butuh Perbaikan</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Perlu bimbingan intermiten, terdapat fluktuasi objektivitas kerja.</td>
                      </tr>
                      <tr className="bg-slate-50/55">
                        <td className="p-2 border font-mono font-bold">51 s.d 60</td>
                        <td className="p-2 border font-mono text-slate-500">2.55 s.d 3.04</td>
                        <td className="p-2 border"><Badge className="bg-orange-101 text-orange-800 border-orange-200">Kurang</Badge></td>
                        <td className="p-2 border font-medium text-slate-600">Teguran tertulis wajib & pendampingan klinis fungsional khusus.</td>
                      </tr>
                      <tr>
                        <td className="p-2 border font-mono font-bold">Di bawah 51</td>
                        <td className="p-2 border font-mono text-slate-500">Di bawah 2.55</td>
                        <td className="p-2 border"><Badge className="bg-red-100 text-red-800 border-red-200">Sangat Kurang</Badge></td>
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

      {activeTab === "admin" && user.role === "Admin BKPSDM" && (
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

      {activeTab === "changelog" && user.role === "Admin BKPSDM" && (
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
          <strong>Bantuan Teknis Lebih Lanjut:</strong> Jika Anda mengalami kesulitan dalam pengusulan rater, perbedaan data NIP pada profil, atau kegagalan sinkronisasi cloud eksternal, Anda dapat berkonsultasi langsung dengan tim IT BKPSDM di Jl. RSU No. 1 Sidikalang atau melalui surel ke <span className="underline font-bold">bkpsdm@dairikab.go.id</span>.
        </div>
      </div>
    </div>
  );
}
