const firebaseConfig = {
    apiKey: "AIzaSyAREhPCc4WaFVecQN2_Lu4eoK0oXohZ7Fg",
    authDomain: "ulangansains2025.firebaseapp.com",
    databaseURL: "https://ulangansains2025-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ulangansains2025",
    storageBucket: "ulangansains2025.firebasestorage.app",
    messagingSenderId: "514614164498",
    appId: "1:514614164498:web:324090f888d301e831accb",
    measurementId: "G-Y7027DY382"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let activeSekolahId = localStorage.getItem('pkkm_asesor_sekolah_id') || null;
let activeSekolahData = null;
let allIndikatorList = [];
let mapBerkasSekolah = {};
let mapNilaiAsesor = {};

let unsubIndikator = null;
let unsubBerkas = null;
let unsubNilai = null;

window.addEventListener('DOMContentLoaded', () => {
    if (activeSekolahId) {
        verifikasiDanMuatSekolahAsesor(activeSekolahId);
    } else {
        muatDropdownSekolahAsesor();
    }
});

function muatDropdownSekolahAsesor() {
    const select = document.getElementById('selectPilihSekolahAsesor');
    db.collection("sekolah").onSnapshot((snapshot) => {
        if (snapshot.empty) {
            select.innerHTML = `<option value="">Belum ada data sekolah di Firebase</option>`;
            return;
        }
        let html = `<option value="">-- Pilih Sekolah yang Akan Dinilai --</option>`;
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `<option value="${doc.id}">${data.namaSekolah} (Tahun ${data.tahun || '2026'})</option>`;
        });
        select.innerHTML = html;
    });
}

function konfirmasiPilihSekolahAsesor() {
    const select = document.getElementById('selectPilihSekolahAsesor');
    const selectedId = select.value;
    if (!selectedId) {
        alert("Silakan pilih sekolah terlebih dahulu!");
        return;
    }
    verifikasiDanMuatSekolahAsesor(selectedId);
}

function verifikasiDanMuatSekolahAsesor(sekolahId) {
    db.collection("sekolah").doc(sekolahId).get().then((doc) => {
        if (!doc.exists) {
            localStorage.removeItem('pkkm_asesor_sekolah_id');
            activeSekolahId = null;
            muatDropdownSekolahAsesor();
            return;
        }

        activeSekolahId = doc.id;
        activeSekolahData = doc.data();
        localStorage.setItem('pkkm_asesor_sekolah_id', doc.id);

        tampilkanHeaderAsesor();
        muatDataPenilaianFirebase();
    });
}

function bersihkanListenerAsesor() {
    if (unsubIndikator) { unsubIndikator(); unsubIndikator = null; }
    if (unsubBerkas) { unsubBerkas(); unsubBerkas = null; }
    if (unsubNilai) { unsubNilai(); unsubNilai = null; }
}

function gantiSekolahAsesor() {
    if (confirm("Ganti sekolah penilaian?")) {
        bersihkanListenerAsesor();
        localStorage.removeItem('pkkm_asesor_sekolah_id');
        activeSekolahId = null;
        activeSekolahData = null;
        document.getElementById('sectionInfoSekolahAsesor').classList.add('hidden');
        document.getElementById('sectionLembarPenilaian').classList.add('hidden');
        document.getElementById('sectionPilihSekolahAsesor').classList.remove('hidden');
        muatDropdownSekolahAsesor();
    }
}

function tampilkanHeaderAsesor() {
    document.getElementById('sectionPilihSekolahAsesor').classList.add('hidden');
    document.getElementById('sectionInfoSekolahAsesor').classList.remove('hidden');
    document.getElementById('sectionLembarPenilaian').classList.remove('hidden');

    document.getElementById('infoNamaSekolahAsesor').innerText = activeSekolahData.namaSekolah;
    document.getElementById('infoKamadAsesor').innerText = `Kepala Madrasah: ${activeSekolahData.namaKamad || '-'}`;
    
    document.getElementById('printNamaSekolah').innerText = activeSekolahData.namaSekolah;
    document.getElementById('printNamaKamad').innerText = activeSekolahData.namaKamad || '-';
    document.getElementById('printTahunPenilaian').innerText = activeSekolahData.tahun || '2026';
    document.getElementById('printNamaKamadSign').innerText = activeSekolahData.namaKamad || '( Kepala Madrasah )';

    const logoContainer = document.getElementById('infoLogoAsesor');
    if (activeSekolahData.logoUrl) {
        logoContainer.innerHTML = `<img src="${activeSekolahData.logoUrl}" class="w-12 h-12 object-contain rounded-xl border bg-white p-1">`;
    } else {
        logoContainer.innerHTML = `<div class="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center"><i class="fa-solid fa-school"></i></div>`;
    }
}

function muatDataPenilaianFirebase() {
    const tbody = document.getElementById('tabelBodyPenilaian');
    tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500 italic"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyinkronkan data real-time dari Firebase...</td></tr>`;

    bersihkanListenerAsesor();

    // 1. Real-time Listener Instrumen PKKM
    unsubIndikator = db.collection("instrumen_pkkm").onSnapshot((snapIndikator) => {
        allIndikatorList = [];
        const setInstrumen = new Set();

        snapIndikator.forEach(doc => {
            const data = doc.data();
            allIndikatorList.push({ id: doc.id, ...data });
            if (data.instrumen) setInstrumen.add(data.instrumen);
        });

        allIndikatorList.sort((a, b) => {
            const kompA = String(a.noKomponen || '');
            const kompB = String(b.noKomponen || '');
            if (kompA !== kompB) return kompA.localeCompare(kompB, undefined, { numeric: true });
            return String(a.noIndikator || '').localeCompare(String(b.noIndikator || ''), undefined, { numeric: true });
        });

        const filterSelect = document.getElementById('filterInstrumenAsesor');
        const currentFilter = filterSelect.value;
        let optHtml = `<option value="ALL">Semua Instrumen</option>`;
        setInstrumen.forEach(ins => {
            optHtml += `<option value="${ins}">${ins}</option>`;
        });
        filterSelect.innerHTML = optHtml;
        if (currentFilter) filterSelect.value = currentFilter;

        renderTabelPenilaian();
        kalkulasiRekapNilai();
    }, (error) => {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-red-500 italic">Gagal memuat data: ${error.message}</td></tr>`;
    });

    // 2. Real-time Listener Berkas Unggahan Guru (Multi-file per dokumen ID unik)
    unsubBerkas = db.collection("sekolah").doc(activeSekolahId).collection("berkas_guru")
        .onSnapshot((snapBerkas) => {
            mapBerkasSekolah = {};
            snapBerkas.forEach(doc => {
                mapBerkasSekolah[doc.id] = { id: doc.id, ...doc.data() };
            });
            renderTabelPenilaian();
        });

    // 3. Real-time Listener Skor & Catatan Asesor
    unsubNilai = db.collection("sekolah").doc(activeSekolahId).collection("penilaian_asesor")
        .onSnapshot((snapNilai) => {
            mapNilaiAsesor = {};
            snapNilai.forEach(doc => {
                mapNilaiAsesor[doc.id] = doc.data();
            });
            renderTabelPenilaian();
            kalkulasiRekapNilai();
        });
}

function renderTabelPenilaian() {
    if (allIndikatorList.length === 0) return;

    // Simpan fokus textarea aktif agar tidak hilang saat update real-time dari perangkat lain
    const activeEl = document.activeElement;
    const activeTextareaId = (activeEl && activeEl.tagName === 'TEXTAREA') ? activeEl.id : null;
    const activeTextareaVal = activeTextareaId ? activeEl.value : null;
    const activeCursorPos = activeTextareaId ? activeEl.selectionStart : null;

    const tbody = document.getElementById('tabelBodyPenilaian');
    const filterInstrumen = document.getElementById('filterInstrumenAsesor').value;

    const filteredList = allIndikatorList.filter(item => {
        return (filterInstrumen === 'ALL') || (item.instrumen === filterInstrumen);
    });

    if (filteredList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500 italic">Tidak ada indikator penilaian.</td></tr>`;
        return;
    }

    let html = '';
    filteredList.forEach((item, index) => {
        const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
            ? item.buktiOtentik 
            : [item.buktiOtentik || 'Dokumen Pendukung'];

        const dataNilai = mapNilaiAsesor[item.id] || { skor: null, catatan: '' };

        let buktiCellHtml = '<div class="space-y-2">';
        listBukti.forEach((teksBukti, idx) => {
            // Ambil SEMUA berkas yang diunggah guru untuk indikator & indeks bukti ini
            const listBerkasPoin = Object.values(mapBerkasSekolah).filter(b => b.indikatorId === item.id && b.buktiIndex === idx);

            let listFileButtons = '';
            if (listBerkasPoin.length > 0) {
                listBerkasPoin.forEach((berkas) => {
                    const safeUrl = (berkas.fileUrl || '#').replace(/'/g, "\\'");
                    const safeName = (berkas.fileName || `Bukti ${idx + 1}`).replace(/'/g, "\\'");
                    const isLink = berkas.tipe === 'link';

                    // Desain warna-warni dan ikon pembeda untuk Asesor
                    const badgeBg = isLink ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900';
                    const iconType = isLink ? 'fa-link text-indigo-600' : 'fa-file-lines text-emerald-600';
                    const btnColor = isLink ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700';

                    listFileButtons += `
                        <div class="flex items-center justify-between gap-2 p-1.5 ${badgeBg} border rounded-lg mt-1.5 shadow-2xs">
                            <div class="flex items-center gap-1.5 min-w-0">
                                <i class="fa-solid ${iconType} text-xs shrink-0"></i>
                                <span class="text-[10px] font-semibold truncate" title="${berkas.fileName}">${berkas.fileName}</span>
                            </div>
                            <button type="button" onclick="bukaModalBukti('${safeUrl}', '${safeName}')" class="px-2 py-1 ${btnColor} text-white text-[10px] font-bold rounded-md shadow-2xs inline-flex items-center gap-1 no-print shrink-0 transition">
                                <i class="fa-solid ${isLink ? 'fa-external-link-alt' : 'fa-eye'} text-[9px]"></i> ${isLink ? 'Buka Link' : 'Lihat'}
                            </button>
                        </div>
                    `;
                });
            } else {
                listFileButtons = `<div class="p-1.5 bg-amber-50/50 border border-amber-200/60 rounded-lg text-center"><span class="text-[10px] text-amber-700 italic no-print"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Belum ada berkas</span></div>`;
            }

            buktiCellHtml += `
                <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 print:bg-transparent print:border-none print:p-0">
                    <p class="text-[11px] text-slate-800 font-bold">${idx + 1}. ${teksBukti}</p>
                    <div class="space-y-1">${listFileButtons}</div>
                </div>
            `;
        });
        buktiCellHtml += '</div>';

        let skorButtonsHtml = '<div class="flex gap-1 justify-center">';
        for (let skor = 1; skor <= 4; skor++) {
            const isSelected = dataNilai.skor === skor;
            const btnClass = isSelected 
                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow ring-1 ring-blue-300 print:bg-black print:text-white print:border-black' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 print:bg-white print:text-black print:border-black';

            skorButtonsHtml += `
                <button type="button" onclick="pilihSkorNilai('${item.id}', ${skor})" class="w-7 h-7 text-xs rounded-lg border transition ${btnClass}" title="Pilih Skor ${skor}">
                    ${skor}
                </button>
            `;
        }
        skorButtonsHtml += '</div>';

        html += `
            <tr class="hover:bg-slate-50/80 transition break-inside-avoid">
                <td class="p-2.5 border-r border-slate-200 print:border-black text-center font-bold text-slate-600 align-top">
                    ${item.noKomponen}.${item.noIndikator || (index + 1)}
                </td>
                <td class="p-2.5 border-r border-slate-200 print:border-black align-top space-y-1">
                    <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[9px] uppercase no-print">${item.instrumen || 'PKKM'}</span>
                    <p class="font-bold text-slate-900">${item.tugasUtama}</p>
                    <p class="text-slate-700 text-[11px]"><strong>Indikator Kerja:</strong> ${item.indikatorKerja}</p>
                </td>
                <td class="p-2.5 border-r border-slate-200 print:border-black align-top">
                    ${buktiCellHtml}
                </td>
                <td class="p-2.5 border-r border-slate-200 print:border-black text-center align-top space-y-1">
                    ${skorButtonsHtml}
                    <p class="text-[10px] font-bold ${dataNilai.skor ? 'text-emerald-600 print:text-black' : 'text-slate-400 print:text-slate-500'}">
                        ${dataNilai.skor ? `Skor: ${dataNilai.skor}` : '-'}
                    </p>
                </td>
                <td class="p-2.5 align-top">
                    <textarea id="catatan_${item.id}" rows="3" onchange="simpanCatatanAsesor('${item.id}')" placeholder="Catatan..." class="w-full px-2 py-1 text-xs border border-slate-200 print:border-black rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 print:bg-transparent">${dataNilai.catatan || ''}</textarea>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // Kembalikan fokus & posisi kursor jika asesor sedang mengetik
    if (activeTextareaId) {
        const restoredEl = document.getElementById(activeTextareaId);
        if (restoredEl) {
            restoredEl.value = activeTextareaVal;
            restoredEl.focus();
            if (activeCursorPos !== null) {
                restoredEl.setSelectionRange(activeCursorPos, activeCursorPos);
            }
        }
    }
}

// ==================== FUNGSI MODAL PRATINJAU ====================

function bukaModalBukti(fileUrl, fileName) {
    const modal = document.getElementById('modalPratinjauBukti');
    const iframe = document.getElementById('iframePratinjau');
    const title = document.getElementById('modalTitle');
    const btnTab = document.getElementById('btnBukaTabBaru');

    title.innerText = `Pratinjau: ${fileName}`;
    btnTab.href = fileUrl;

    const isYouTube = fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be');

    if (isYouTube) {
        let embedYtUrl = fileUrl;
        if (fileUrl.includes('watch?v=')) {
            const videoId = fileUrl.split('watch?v=')[1].split('&')[0];
            embedYtUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (fileUrl.includes('youtu.be/')) {
            const videoId = fileUrl.split('youtu.be/')[1].split('?')[0];
            embedYtUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        iframe.src = embedYtUrl;
    } else {
        let embedUrl = fileUrl;
        if (fileUrl.includes('drive.google.com') && fileUrl.includes('/view')) {
            embedUrl = fileUrl.replace('/view?usp=drivesdk', '/preview').replace('/view', '/preview');
        }
        iframe.src = embedUrl;
    }

    modal.classList.remove('hidden');
}

function tutupModalBukti() {
    const modal = document.getElementById('modalPratinjauBukti');
    const iframe = document.getElementById('iframePratinjau');
    
    iframe.src = ''; 
    modal.classList.add('hidden');
}

async function pilihSkorNilai(indikatorId, skor) {
    if (!mapNilaiAsesor[indikatorId]) {
        mapNilaiAsesor[indikatorId] = { catatan: '' };
    }
    mapNilaiAsesor[indikatorId].skor = skor;

    const catatanVal = document.getElementById(`catatan_${indikatorId}`).value;
    mapNilaiAsesor[indikatorId].catatan = catatanVal;

    await db.collection("sekolah")
        .doc(activeSekolahId)
        .collection("penilaian_asesor")
        .doc(indikatorId)
        .set({
            indikatorId: indikatorId,
            skor: skor,
            catatan: catatanVal,
            updatedAt: new Date().toISOString()
        }, { merge: true });
}

async function simpanCatatanAsesor(indikatorId) {
    const catatanVal = document.getElementById(`catatan_${indikatorId}`).value;
    if (!mapNilaiAsesor[indikatorId]) {
        mapNilaiAsesor[indikatorId] = { skor: null };
    }
    mapNilaiAsesor[indikatorId].catatan = catatanVal;

    await db.collection("sekolah")
        .doc(activeSekolahId)
        .collection("penilaian_asesor")
        .doc(indikatorId)
        .set({
            catatan: catatanVal,
            updatedAt: new Date().toISOString()
        }, { merge: true });
}

function kalkulasiRekapNilai() {
    const totalIndikator = allIndikatorList.length;
    let dinilaiCount = 0;
    let jumlahSkor = 0;

    allIndikatorList.forEach(item => {
        const nilai = mapNilaiAsesor[item.id];
        if (nilai && nilai.skor) {
            dinilaiCount++;
            jumlahSkor += Number(nilai.skor);
        }
    });

    const rataRata = dinilaiCount > 0 ? (jumlahSkor / dinilaiCount) : 0;

    let predikat = '-';
    if (dinilaiCount > 0) {
        if (rataRata >= 3.5) predikat = 'Amat Baik (A)';
        else if (rataRata >= 2.8) predikat = 'Baik (B)';
        else if (rataRata >= 2.0) predikat = 'Cukup (C)';
        else predikat = 'Kurang (D)';
    }

    document.getElementById('badgeStatusPenilaian').innerText = `Indikator Dinilai: ${dinilaiCount} / ${totalIndikator}`;
    document.getElementById('calcTotalDinilai').innerText = `${dinilaiCount} / ${totalIndikator}`;
    document.getElementById('calcJumlahSkor').innerText = jumlahSkor;
    document.getElementById('calcRataRata').innerText = rataRata.toFixed(2);
    document.getElementById('calcPredikat').innerText = predikat;
}
