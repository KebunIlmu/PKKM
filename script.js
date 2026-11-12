// Data Instrumen PKKM dengan Bukti Otentik yang Dipecah per Poin (1, 2, 3, dst.)
const instrumenData = [
    {
        komponen: "1. USAHA PENGEMBANGAN MADRASAH",
        items: [
            { 
                no: "1.1", teks: "Mengembangkan madrasah sesuai dengan kebutuhan.", indikator: "Mampu mengembangkan struktur organisasi yang sesuai dengan kebutuhan program", 
                buktiList: [
                    "Bagan / struktur organisasi", 
                    "Notulen rapat penyusunan struktur organisasi", 
                    "Dokumen sosialisasi", 
                    "Daftar hadir kegiatan"
                ] 
            },
            { 
                no: "", teks: "", indikator: "Mampu menempatkan personalia yang sesuai dengan kebutuhan", 
                buktiList: [
                    "Dokumen penetapan / pengesahan susunan organisasi madrasah", 
                    "Rincian tugas setiap personil (SOP Personalia)"
                ] 
            },
            { 
                no: "", teks: "", indikator: "Mampu mengembangkan pedoman dan prosedur kerja organisasi madrasah", 
                buktiList: [
                    "Dokumen SOP / Pedoman prosedur kerja madrasah"
                ] 
            },
            { 
                no: "1.2", teks: "Mengelola perubahan dan pengembangan madrasah menuju organisasi pembelajar yang efektif.", indikator: "Mampu mengembangkan program baru untuk meningkatkan pencapaian target yang lebih tinggi", 
                buktiList: [
                    "Visi dan Misi madrasah", 
                    "Data prestasi madrasah", 
                    "Data hasil Ujian Madrasah 2 tahun terakhir", 
                    "Data Alumni"
                ] 
            },
            { 
                no: "", teks: "", indikator: "Mampu dan terampil dalam membangun tim kerja yang efektif", 
                buktiList: [
                    "Bagan / struktur organisasi tim kerja", 
                    "SK Pembagian Tugas", 
                    "Program KKG / MGMP & Laporannya"
                ] 
            }
        ]
    },
    {
    komponen: "2. PELAKSANAAN TUGAS MANAJERIAL",
    items: [
        {
            no: "2.1",
            teks: "Menyusun perencanaan madrasah untuk berbagai tingkatan perencanaan.",
            indikator: "Mampu menyusun Rencana Kerja Jangka Menengah (RKJM) 4 tahun, Rencana Kerja Tahunan (RKT) yang dinyatakan dalam Rencana Kegiatan dan Anggaran Madrasah (RKAM)",
            buktiList: [
                "Dokumen RKJM (4 tahun)",
                "Dokumen RKT",
                "Dokumen RKAM / RAPBM"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu menyusun pedoman/panduan yang diperlukan dalam penyelenggaraan madrasah",
            buktiList: [
                "Pedoman / panduan penyusunan kurikulum",
                "KTSP / Kurikulum Madrasah",
                "Kalender Pendidikan",
                "Pedoman / panduan akademik",
                "Struktur organisasi madrasah",
                "Pembagian tugas guru dan tenaga kependidikan",
                "Peraturan akademik",
                "Tata tertib madrasah",
                "Kode etik madrasah",
                "Biaya operasional madrasah"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu menyusun rencana kerja madrasah yang berdampak pada peningkatan kualitas pembelajaran",
            buktiList: [
                "Program kerja madrasah",
                "Rencana pengembangan madrasah"
            ]
        },
        {
            no: "2.2",
            teks: "Memimpin madrasah dalam rangka pendayagunaan sumber daya madrasah secara optimal.",
            indikator: "Mampu memimpin guru dan tenaga kependidikan dalam rangka pendayagunaan sumber daya madrasah secara optimal",
            buktiList: [
                "SK Pembagian tugas guru",
                "SK Pembagian tugas tenaga kependidikan",
                "Dokumen penugasan lain yang relevan"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu memimpin guru dan tenaga kependidikan dalam rangka pendayagunaan sumber daya manusia secara optimal",
            buktiList: [
                "Dokumen pelaksanaan kegiatan peningkatan kompetensi guru dan tenaga kependidikan (diklat, workshop, MGMP/KKG, dll)",
                "Daftar hadir kegiatan",
                "Sertifikat / laporan kegiatan"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu memimpin seluruh warga madrasah dalam rangka pendayagunaan sumber daya lainnya secara optimal",
            buktiList: [
                "Dokumen pengelolaan aset/inventaris madrasah",
                "Dokumen pemanfaatan sarana dan prasarana untuk kegiatan pembelajaran dan ekstrakurikuler"
            ]
        },
        {
            no: "2.3",
            teks: "Menciptakan budaya dan iklim madrasah yang kondusif dan inovatif bagi pembelajaran.",
            indikator: "Mampu menciptakan budaya dan iklim madrasah yang kondusif dan inovatif bagi proses pembelajaran",
            buktiList: [
                "Suasana lingkungan madrasah yang bersih, indah, rapi, dan nyaman",
                "Dokumen kegiatan inovasi pembelajaran atau program keunggulan madrasah"
            ]
        },
        {
            no: "2.4",
            teks: "Mengelola guru dan tenaga kependidikan dalam rangka pengembangan potensi manusia.",
            indikator: "Mampu menyusun program pembinaan guru dan tenaga kependidikan",
            buktiList: [
                "Program pembinaan guru dan tenaga kependidikan",
                "Jadwal pelaksanaan pembinaan"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu melaksanakan program pembinaan guru dan tenaga kependidikan",
            buktiList: [
                "Dokumen pelaksanaan pembinaan (notulen, daftar hadir, foto kegiatan)",
                "Laporan hasil pembinaan"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu melaksanakan penilaian kinerja guru dan tenaga kependidikan",
            buktiList: [
                "Instrumen Penilaian Kinerja Guru (PKG)",
                "Instrumen Penilaian Kinerja Tenaga Kependidikan",
                "Hasil penilaian kinerja"
            ]
        },
        {
            no: "2.5",
            teks: "Mengelola sarana dan prasarana madrasah dalam rangka pembelajaran yang optimal.",
            indikator: "Mampu mengelola sarana dan prasarana madrasah untuk kepentingan pembelajaran",
            buktiList: [
                "Buku inventaris sarana dan prasarana",
                "Kartu inventaris barang (KIB)",
                "Buku pemeliharaan sarana dan prasarana"
            ]
        },
        {
            no: "2.6",
            teks: "Mengelola hubungan madrasah dengan masyarakat dalam rangka pencarian dukungan ide, sumber belajar, dan pembiayaan.",
            indikator: "Mampu melibatkan masyarakat dalam pengelolaan madrasah",
            buktiList: [
                "Dokumen pembentukan Komite Madrasah",
                "Program kerja Komite Madrasah",
                "Dokumen rapat/pertemuan dengan Komite Madrasah dan masyarakat"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengembangkan kerjasama dengan lembaga lain yang relevan",
            buktiList: [
                "Dokumen kerja sama / MoU dengan instansi terkait (puskesmas, kepolisian, dunia usaha, ponpes, dll)",
                "Laporan kegiatan kerja sama"
            ]
        },
        {
            no: "2.7",
            teks: "Mengelola pengumpulan dan penggunaan data untuk penyusunan perencanaan dan pelaporan.",
            indikator: "Mampu mengumpulkan data dan informasi untuk perencanaan madrasah",
            buktiList: [
                "Data Emis madrasah",
                "Data Dapodik / Simpatika",
                "Data profil madrasah"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengolah data dan informasi untuk perencanaan program madrasah",
            buktiList: [
                "Dokumen analisis data dan informasi madrasah",
                "Laporan evaluasi diri madrasah (EDM)"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu menyusun laporan pelaksanaan program madrasah secara berkala",
            buktiList: [
                "Laporan tahunan madrasah",
                "Laporan semester",
                "Laporan pelaksanaan program kerja"
            ]
        },
        {
            no: "2.8",
            teks: "Mengelola keuangan madrasah sesuai dengan prinsip pengelolaan yang akuntabel, transparan, dan efisien.",
            indikator: "Mampu menyusun perencanaan keuangan madrasah yang transparan dan akuntabel",
            buktiList: [
                "Dokumen RKAM / RAPBM",
                "Sumber pendanaan madrasah (BOS, infak, komite, dll)"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengelola keuangan madrasah sesuai dengan perencanaan yang telah ditetapkan",
            buktiList: [
                "Buku kas umum",
                "Buku pembantu kas",
                "Buku bank",
                "Bukti-bukti pengeluaran (kwitansi, nota)"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu membuat laporan pertanggungjawaban keuangan madrasah secara akuntabel dan transparan",
            buktiList: [
                "Laporan penggunaan dana BOS",
                "Laporan keuangan berkala (bulanan/tahunan)",
                "Dokumen pemeriksaan keuangan / audit internal / eksternal"
            ]
        },
        {
            no: "2.9",
            teks: "Mengelola ketatausahaan madrasah dalam mendukung pencapaian tujuan madrasah.",
            indikator: "Mampu mengelola administrasi surat menyurat madrasah",
            buktiList: [
                "Buku agenda surat masuk",
                "Buku agenda surat keluar",
                "Arsip surat"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengelola administrasi kesiswaan",
            buktiList: [
                "Buku induk siswa",
                "Buku klaper",
                "Absensi siswa",
                "Mutasi siswa"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengelola administrasi kepegawaian",
            buktiList: [
                "Buku induk pegawai",
                "File kepegawaian / DUK",
                "Absensi guru dan tenaga kependidikan"
            ]
        },
        {
            no: "2.10",
            teks: "Mengelola unit layanan khusus madrasah dalam mendukung kegiatan pembelajaran dan kesiswaan.",
            indikator: "Mampu mengelola perpustakaan madrasah",
            buktiList: [
                "Buku induk perpustakaan",
                "Buku kunjungan perpustakaan",
                "Buku peminjaman buku",
                "Program kerja perpustakaan"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengelola laboratorium madrasah (IPA/Komputer/Bahasa)",
            buktiList: [
                "Jadwal penggunaan laboratorium",
                "Daftar inventaris alat dan bahan laboratorium",
                "Buku pemeliharaan laboratorium"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengelola unit layanan khusus lainnya (UKS, bimbingan konseling, koperasi, dll)",
            buktiList: [
                "Program kerja UKS / BK / Koperasi",
                "Catatan pelayanan UKS / BK",
                "Laporan kegiatan unit layanan khusus"
            ]
        },
        {
            no: "2.11",
            teks: "Mengelola sistem informasi madrasah dalam mendukung penyampaian informasi dan promosi.",
            indikator: "Mampu mengembangkan dan mengelola sistem informasi madrasah berbasis TIK",
            buktiList: [
                "Website resmi madrasah",
                "Media sosial resmi madrasah",
                "Pamflet / brosur profil madrasah"
            ]
        }
    ]
},
    {
    komponen: "3. PENGEMBANGAN KEWIRAUSAHAAN",
    items: [
        {
            no: "3.1",
            teks: "Menciptakan inovasi yang bermanfaat dan tepat bagi pengembangan madrasah",
            indikator: "Memahami dan menghayati arti dan tujuan perubahan (inovasi) madrasah",
            buktiList: [
                "Adanya bukti perubahan madrasah yang lebih baik dari tahun ke tahun[cite: 3]",
                "Melalui studi dokumen: program pengembangan kewirausahaan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Menggunakan metode, teknik dan proses perubahan madrasah",
            buktiList: [
                "Adanya bukti strategi dalam perubahan madrasah yang lebih baik[cite: 3]",
                "Melalui obsevasi: (1) pemanfaatan hasil inovasi dan kreatifitas; (2) membudayakan hasil inovasi dan kreatifitas; dan (3) pengembangan pembudayaan inovasi dan kreatifitas[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Menumbuhkan iklim yang mendorong kebebasan berfikir untuk menciptakan kreativitas dan inovasi",
            buktiList: [
                "Adanya bukti iklim yang mendorong kebebasan berpikir kreatif dan inovatif[cite: 3]",
                "Melalui observasi dan studi dokumen: (1) data Jenis usaha produktif yang dimiki; dan (2) program pengelolaan dan pendayagunaan hasil usaha[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mendorong warga madrasah untuk melakukan prakarsa/keberanian moral untuk melakukan hal-hal baru",
            buktiList: [
                "Adanya bukti warga madrasah yang memiliki keberanian untuk melakukan hal - hal baru[cite: 3]",
                "Melalui observasi dan studi dokumen: (1) data Jenis usaha produktif yang dimiki; (2) program pengelolaan dan pendayagunaan hasil usaha[cite: 3]"
            ]
        },
        {
            no: "3.2",
            teks: "Bekerja keras untuk mencapai keberhasilan madrasah sebagai organisasi pembelajaran yang efektif",
            indikator: "Mampu bertindak kratif dan inovatif dalam melaksanakan pekerjaan melalui cara berfikir dan cara bertindak",
            buktiList: [
                "Adanya bukti kegiatan kratif dan inovatif dalam melaksanakan pekerjaan melalui cara berfikir dan cara bertindak[cite: 3]",
                "Melalui observasi dan studi dokumen: (1) RPP yang memuat rencana pembelajaran untuk menumbuhkan keterampilan berpikir dan bertindak kreatif, produktif, kritis, mandiri, kolaboratif, dan komunikatif; (2) hasil kerja dan karya siswa; dan (3) foto foto aktifitas pembelajaran siswa siswa[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu pemberdayakan potensi madrasah secara optimal kedalam berbagai kegiatan-kegiatan produktif yang menguntungkan madrasah",
            buktiList: [
                "Adanya bukti kegiatan pemberdayaann potensi madrasah secara optimal kedalam berbagai kegiatan-kegiatan produktif yang menguntungkan madrasah[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) Rencana Pengembangan Madrasah (RPM); (2) dokumen penanganan permasalahan/ kasus; (3) dokumen hasil kegiatan sekolah; (4) dokumen hasil kegiatan; dan (5) pengembangan madrasah[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu membubuhkan jiwa kewirausahaan (kreatif, inovatif dan produktif) di kalangan warga madrasah",
            buktiList: [
                "Adanya bukti kegiatan yang membubuhkan jiwa kewirausahaan (kreatif, inovatif dan produktif) di kalangan warga madrasah[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) Rencana Pengembangan Madrasah (RPM); (2) dokumen penanganan permasalahan/ kasus; (3) dokumen hasil kegiatan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mencatat ide-ide baru, kemudian mengembangkannya",
            buktiList: [
                "Adanya bukti kegiatan mencatat ide-ide baru, kemudian mengembangkannya[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: Rencana Pengembangan Madrasah (RPM)[cite: 3]"
            ]
        },
        {
            no: "3.3",
            teks: "Memiliki motivasi yang kuat untuk sukses dalam melaksanakan tugas pokok dan fungsinya sebagai pemimpin madrasah",
            indikator: "Bersedia belajar dari orang lain",
            buktiList: [
                "Adanya bukti kemauan belajar dari orang lain[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) forum komunikasi dengan lembaga pendidikan lain dan orang tua siswa per tingkat kelas/kelas/ angkatan; dan (2) foto foto kegiatan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Ingin selalu melakukan yang terbaik",
            buktiList: [
                "Adanya bukti keinginan selalu melakukan yang terbaik[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) dokumen/foto Pelaksanaan kegiatan; (2) keikut sertaan dalam lomba lomba pembelajaran/ pendidikan maupun manajmen; dan (3) prestasi dalam lomba guru, tenaga kependidikan dan kepala madrasah[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Menciptakan perubahan yang kuat",
            buktiList: [
                "Adanya bukti keinginan untuk melakkukan perubahan yang kuat[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) program inovasi madrasah atau Rencana Pengenbanagan Madrasah (RPM); dan (2) laporan target yang sudah dicapai[cite: 3]"
            ]
        },
        {
            no: "3.4",
            teks: "Pantang menyerah dan selalu mencari solusi terbaik dalam menghadapi kendala yang dihadapi madrasah",
            indikator: "Mampu melibatkan tokoh agama, masyarakat dan pemerintah dalam memecahkan masalah kelembagaan",
            buktiList: [
                "Adanya bukti kegiatan yang melibatkan tokoh agama, masyarakat dan pemerintah dalam memecahkan masalah kelembagaan[cite: 3]",
                "Melalui observasi, wawancara, dan studi dokumen: (1) MoU dengan pihak lain; (2) sister school; dan (3) kemitraan dengan sekolah lain[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu bersikap obyektif/tidak memihak dalam mengatasi konflik internal madrasah",
            buktiList: [
                "Adanya bukti kegiatan yang menunjukkan sikap obyektif/tidak memihak dalam mengatasi konflik internal madrasah[cite: 3]",
                "Dokumen kegiatan dan foto[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu bersikap simpatik/tenggang rasa terhadap orang lain",
            buktiList: [
                "Adanya bukti sikap simpatik/tenggang rasa terhadap orang lain[cite: 3]",
                "Melalui studi dokumen kegiatan dan foto[cite: 3]"
            ]
        },
        {
            no: "3.5",
            teks: "Memiliki naluri kewirausahaan dalam mengelola kegiatan produksi/jasa madrasah sebagai sumber pembelajaran peserta didik",
            indikator: "Mampu merencanakan kegiatan produksi /jasa sesuai dengan potensi madrasah",
            buktiList: [
                "Dokumen perencanaan kegiatan produksi sesuai potensi madrasah[cite: 3]",
                "Melalui studi dokumen: laporan yang memuat pelaksanaan dan hasil Program Pengembangan Unit Produksi Kewirausahaan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu membina kegiatan produksi /jasa sesuai dengan prinsip-prinsip pengelolaan yang profesional dan akuntabel",
            buktiList: [
                "Adanya dokumen pembinaan kegiatan produksi /jasa sesuai dengan prinsip-prinsip pengelolaan yang profesional dan akuntabel[cite: 3]",
                "Melalui studi dokumen: laporan memuat pelaksanaan dan hasil Program Pengembangan Unit Produksi Kewirausahaan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu melaksanakan pengawasan kegiatan produksi/jasa dan menyusun laporan",
            buktiList: [
                "Adanya dokumen pelaksanakan pengawasan kegiatan produksi/jasa dan menyusun laporan[cite: 3]",
                "Melalui wawancara dan studi dokumen: (1) laporan hasil Evaluasi Program Pengembangan Kewirausahaan, yang memuat hasil evaluasi; (2) Program Pengembangan Jiwa Kewirausahaan; dan (3) Program Pengembangan Unit Produksi Kewirausahaan[cite: 3]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengembangkan kegiatan produksi/jasa dan pemasarannya",
            buktiList: [
                "Adanya dokumen pengembangan kegiatan produksi/jasa dan pemasarannya[cite: 3]",
                "Melalui wawancara dan studi dokumen: (1) laporan Hasil Evaluasi Program Pengembangan Kewirausahaan, yang memuat hasil evaluasi; (2) Program Pengembangan Jiwa Kewirausahaan; dan (3) Program Pengembangan Unit Produksi Kewirausahaan[cite: 3]"
            ]
        }
    ]
},
    {
    komponen: "4. SUPERVISI KEPADA GURU DAN TENAGA KEPENDIDIKAN",
    items: [
        {
            no: "4.1",
            teks: "Menyusun program supervisi akademik dalam rangka peningkatan profesionalisme guru",
            indikator: "Mengidentifikasi masalah yang guru hadapi dalam pelaksanaan pembelajaran.",
            buktiList: [
                "Terdapat rumusan masalah yang Kepala Madrasah peroleh dari pemantauan perencanaan, pelaksanaan, dan penilaian pembelajaran.[cite: 4]",
                "Melalui studi dokumen: (1) program pengawasan pembelajaran(supervisi pembelajaran) (2) jadwal pelaksanaan supervisi; dan (3) SK tim supervisor.[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu merumuskan tujuan yang dilengkapi dengan target pencapaian yang terukur.",
            buktiList: [
                "Terdapat rumusan tujuan supervisi yang dilengkapi dengan target pencapaian yang terukur.[cite: 4]",
                "Melalui studi dokumen: (1) Program pengawasan pembelajaran/ supervisi pembelajaran; dan (2) jadwal pelaksanaan supervisi.[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mampu mengembangkan instrumen supervisi.",
            buktiList: [
                "Instrumen yang digunakan relevan dengan target indikator pecapaian tujuan madrasah.[cite: 4]",
                "Melalui studi dokumen: instrumen supervisi pembelajaran[cite: 4]"
            ]
        },
        {
            no: "4.2",
            teks: "Melaksanakan supervisi akademik terhadap guru dengan menggunakan pendekatan dan teknik supervisi yang tepat.",
            indikator: "Mengadakan pertemuan awal untuk menjaring data rencana pembelajaran dan menetapkan fokus kegiatan supervisi.",
            buktiList: [
                "Terdapat data hasil pertemuan awal seperti; masalah, tujuan, fokus utama supervisi, dan instrumen yang disepakati[cite: 4]",
                "Melalui Wawancara dan studi dokumen: program pengawasan pembelajaran/ supervisi pembelajaran[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Melaksanakan kegiatan pemantauan pembelajaran dan membuat catatan yang objektif dan selektif sebagai bahan pemecahan masalah supervisi.",
            buktiList: [
                "Dokumen hasil observasi pembelajaran, lengkap, objektif dan selektif serta relevan dengan masalah yang menjadi fokus supervisi.[cite: 4]",
                "Melalui Wawancara dan studi dokumen: (1) instrumen supervisi pembelajaran; dan (2) dokumen laporan hasil supervisi pembelajaran.[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Melakukan pertemuan refleksi, menganalisis catatan hasil observasi, dan menyimpulkan hasil observasi",
            buktiList: [
                "Dokumen catatan pelaksanaan kegiatan, melaksanakan refleksi, himpunan data hasil superivisi, analisis data, penafsiran, penilaian keunggulan dan kelemahan, serta rekomendasi perbaikan.[cite: 4]",
                "Melalui wawancara dan studi dokumen: analisis hasil supervisi pembelajaran[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Bersama guru menyusun rekomendasi tindaklanjut perbaikan dalam bentuk kegiatan analisis butir soal, remedial, dan pengayaan.",
            buktiList: [
                "Data tindak lanjut pelaksanaan supervisi penilaian, bukti analisis butir soal, kegiatan remedial dan pengayaan.[cite: 4]",
                "Melalui wawancara dan studi dokumen: (1) dokumen hasil analisis dan tindak lanjut supervisi pembelajaran; dan (2) program kegiatan workshop/diklat untuk guru.[cite: 4]"
            ]
        },
        {
            no: "4.3",
            teks: "Menilai dan menindaklanjuti kegiatan supervisi akademik dalam rangka peningkatan profesionalisme guru.",
            indikator: "Memfasilitasi guru dalam merencanakan tindak lanjut perbaikan sistem penilaian hasil belajar.",
            buktiList: [
                "Terdapat bukti tindak lanjut perbaikan sistem penilaian hasil belajar[cite: 4]",
                "Melalui wawancara dan studi dokumen: program pengawasan pembelajaran/ supervisi pembelajaran[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Mengecek ulang keterlaksanaan rekomendasi oleh guru",
            buktiList: [
                "dokumen rekomendasi perbaikan sistem penilaian hasil belajar secara berkala.[cite: 4]",
                "Melalui wawancara dan studi dokumen: (1) instrumen supervisi pembelajaran; dan (2) dokumen laporan hasil supervisi pembelajaran.[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Melaksanakan pembinaan dan pengembangan guru sebagai tindaklanjut kegiatan supervisi.",
            buktiList: [
                "Terdapat bukti, berupa laporan tindak lanjut hasil supervisi sebagai dasar pelaksanaan pembinaan guru.[cite: 4]",
                "Melalui wawancara dan studi dokumen: analisis hasil supervisi pembelajaran[cite: 4]"
            ]
        },
        {
            no: "",
            teks: "",
            indikator: "Menggunakan data hasil supervisi untuk pemetaan ketercapaian progam sebagai dasar perbaikan siklus berikutnya..",
            buktiList: [
                "Hasil supervisi keterlaksanaan dan ketercapaian program sebagai bahan penilaian kinerja dan pemetaan profil madrasah sebagai dasar perencanaan siklus berikutnya.[cite: 4]",
                "Melalui wawancara dan studi dokumen: (1) dokumen hasil analisis dan tindak lanjut supervisi pembelajaran; dan (2) program kegiatan workshop/diklat untuk guru.[cite: 4]"
            ]
        }
    ]
}

];

window.addEventListener('DOMContentLoaded', () => {
    const savedUrl = localStorage.getItem('gas_url') || '';
    document.getElementById('gasUrlInput').value = savedUrl;
    renderInstrumen();
});

function saveGasUrl() {
    const url = document.getElementById('gasUrlInput').value.trim();
    localStorage.setItem('gas_url', url);
    alert("URL Google Apps Script berhasil disimpan!");
}

function renderInstrumen() {
    const container = document.getElementById('instrumenContainer');
    let html = '';

    instrumenData.forEach((comp, cIndex) => {
        html += `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div class="bg-slate-800 text-white px-6 py-4 font-bold text-sm tracking-wide">
                    ${comp.komponen}
                </div>
                <div class="divide-y divide-slate-100">
        `;

        comp.items.forEach((item, iIndex) => {
            html += `
                <div class="p-6 hover:bg-slate-50/50 transition space-y-4">
                    <div class="flex items-start gap-3">
                        ${item.no ? `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg mt-0.5">${item.no}</span>` : '<span class="w-8"></span>'}
                        <div>
                            ${item.teks ? `<h3 class="text-sm font-semibold text-slate-800 mb-1">${item.teks}</h3>` : ''}
                            <p class="text-xs text-slate-700"><strong class="text-slate-900">Indikator:</strong> ${item.indikator}</p>
                        </div>
                    </div>

                    <!-- Daftar Bukti Otentik Dipecah Satu per Satu -->
                    <div class="pl-0 sm:pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
            `;

            item.buktiList.forEach((buktiItem, bIndex) => {
                const uniqueId = `item_${cIndex}_${iIndex}_${bIndex}`;
                html += `
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div class="flex items-start justify-between gap-2">
                            <span class="text-xs font-bold text-slate-700"><i class="fa-solid fa-file-lines text-emerald-600 mr-1.5"></i> (${bIndex + 1}) ${buktiItem}</span>
                        </div>
                        <input type="file" id="file_${uniqueId}" class="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-lg bg-white">
                        
                        <button onclick="uploadFile('${uniqueId}')" id="btn_${uniqueId}" class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow transition flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-cloud-arrow-up"></i> Unggah File
                        </button>

                        <div id="status_${uniqueId}" class="hidden text-xs font-medium"></div>
                    </div>
                `;
            });

            html += `</div></div>`;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

function uploadFile(uniqueId) {
    const fileInput = document.getElementById(`file_${uniqueId}`);
    const btn = document.getElementById(`btn_${uniqueId}`);
    const statusDiv = document.getElementById(`status_${uniqueId}`);
    const gasUrl = localStorage.getItem('gas_url') || '';

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file terlebih dahulu untuk poin ini!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Mengunggah...`;
    statusDiv.className = "text-xs font-medium text-blue-600";
    statusDiv.innerHTML = "Mengirim file ke Google Drive...";
    statusDiv.classList.remove('hidden');

    reader.onload = function () {
        const base64Data = reader.result.split(',')[1];
        const payload = {
            filename: file.name,
            mimeType: file.type,
            base64: base64Data
        };

        if (!gasUrl || gasUrl.includes("MASUKKAN")) {
            setTimeout(() => {
                statusDiv.className = "text-xs font-bold text-emerald-600 flex items-center gap-1";
                statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> ✅ Terupload (Simulasi: ${file.name})`;
                btn.disabled = false;
                btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Unggah File`;
            }, 1000);
            return;
        }

        fetch(gasUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        })
        .then(() => {
            statusDiv.className = "text-xs font-bold text-emerald-600 flex items-center gap-1";
            statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> ✅ Terupload (${file.name})`;
        })
        .catch(error => {
            statusDiv.className = "text-xs font-medium text-rose-600";
            statusDiv.innerHTML = "Gagal mengunggah: " + error;
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Unggah File`;
        });
    };

    reader.readAsDataURL(file);
}
