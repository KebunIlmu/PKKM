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

let activeSekolahId = localStorage.getItem('pkkm_active_sekolah_id') || null;
let activeSekolahData = null;
let allIndikatorList = [];
let mapBerkasSekolah = {}; // Menyimpan semua berkas berdasarkan ID dokumen Firestore
let mapNilaiAsesor = {};   // Format key: `${indikatorId}`

// Variabel untuk menyimpan listener agar tidak menumpuk saat ganti sekolah
let unsubIndikator = null;
let unsubBerkas = null;
let unsubNilai = null;

window.addEventListener('DOMContentLoaded', () => {
    if (activeSekolahId) {
        verifikasiDanMuatSekolah(activeSekolahId);
    } else {
        muatDropdownSekolah();
    }
});

function muatDropdownSekolah() {
    const select = document.getElementById('selectPilihSekolah');
    db.collection("sekolah").onSnapshot((snapshot) => {
        if (snapshot.empty) {
            select.innerHTML = `<option value="">Belum ada data sekolah di Firebase</option>`;
            return;
        }
        let html = `<option value="">-- Pilih Sekolah / Madrasah --</option>`;
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `<option value="${doc.id}">${data.namaSekolah} (Tahun ${data.tahun || '2026'})</option>`;
        });
        select.innerHTML = html;
    });
}

function konfirmasiPilihSekolah() {
    const select = document.getElementById('selectPilihSekolah');
    const selectedId = select.value;
    const inputKode = document.getElementById('inputKodeAksesGuru').value.trim();

    if (!selectedId) {
        alert("Silakan pilih sekolah terlebih dahulu!");
        return;
    }
    if (!inputKode) {
        alert("Silakan masukkan kode akses sekolah!");
        return;
    }

    db.collection("sekolah").doc(selectedId).get().then((doc) => {
        if (!doc.exists) {
            alert("Data sekolah tidak ditemukan.");
            return;
        }

        const data = doc.data();
        const kodeDatabase = (data.kodeAkses || '').trim().toUpperCase();
        const kodeInputClean = inputKode.toUpperCase();

        if (kodeDatabase && kodeInputClean !== kodeDatabase) {
            alert("Kode akses salah! Silakan hubungi Admin sekolah.");
            return;
        }

        // Jika kode cocok atau sekolah belum diatur kodenya
        activeSekolahId = doc.id;
        activeSekolahData = data;
        localStorage.setItem('pkkm_active_sekolah_id', doc.id);

        tampilkanHeaderSekolah();
        muatDataFirebaseGuru();
    }).catch((err) => {
        alert("Gagal memverifikasi kode akses: " + err.message);
    });
}

function verifikasiDanMuatSekolah(sekolahId) {
    db.collection("sekolah").doc(sekolahId).get().then((doc) => {
        if (!doc.exists) {
            localStorage.removeItem('pkkm_active_sekolah_id');
            activeSekolahId = null;
            muatDropdownSekolah();
            return;
        }

        activeSekolahId = doc.id;
        activeSekolahData = doc.data();
        localStorage.setItem('pkkm_active_sekolah_id', doc.id);

        tampilkanHeaderSekolah();
        muatDataFirebaseGuru();
    });
}
function bersihkanListener() {
    if (unsubIndikator) { unsubIndikator(); unsubIndikator = null; }
    if (unsubBerkas) { unsubBerkas(); unsubBerkas = null; }
    if (unsubNilai) { unsubNilai(); unsubNilai = null; }
}

function gantiSekolah() {
    if (confirm("Ganti sekolah aktif?")) {
        bersihkanListener();
        localStorage.removeItem('pkkm_active_sekolah_id');
        activeSekolahId = null;
        activeSekolahData = null;
        document.getElementById('sectionInfoSekolah').classList.add('hidden');
        document.getElementById('sectionInstrumenGuru').classList.add('hidden');
        document.getElementById('sectionPilihSekolah').classList.remove('hidden');
        muatDropdownSekolah();
    }
}

function tampilkanHeaderSekolah() {
    document.getElementById('sectionPilihSekolah').classList.add('hidden');
    document.getElementById('sectionInfoSekolah').classList.remove('hidden');
    document.getElementById('sectionInstrumenGuru').classList.remove('hidden');

    document.getElementById('infoNamaSekolah').innerText = activeSekolahData.namaSekolah;
    document.getElementById('infoKamad').innerText = `Kepala Madrasah: ${activeSekolahData.namaKamad || '-'}`;
    
    const logoContainer = document.getElementById('infoLogoContainer');
    if (activeSekolahData.logoUrl) {
        logoContainer.innerHTML = `<img src="${activeSekolahData.logoUrl}" class="w-12 h-12 object-contain rounded-xl border bg-white p-1">`;
    } else {
        logoContainer.innerHTML = `<div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center"><i class="fa-solid fa-school"></i></div>`;
    }
}

function muatDataFirebaseGuru() {
    const container = document.getElementById('containerIndikatorGuru');
    container.innerHTML = `<p class="text-xs text-slate-500 italic text-center py-8"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyinkronkan data real-time dari Firebase...</p>`;

    bersihkanListener();

    // 1. Real-time Listener Master Instrumen
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

        const filterSelect = document.getElementById('filterInstrumenGuru');
        const currentFilter = filterSelect.value;
        let optHtml = `<option value="ALL">Semua Instrumen</option>`;
        setInstrumen.forEach(ins => {
            optHtml += `<option value="${ins}">${ins}</option>`;
        });
        filterSelect.innerHTML = optHtml;
        if (currentFilter) filterSelect.value = currentFilter;

        renderDaftarIndikator();
    }, (error) => {
        container.innerHTML = `<p class="text-xs text-red-500 italic text-center py-8">Gagal memuat instrumen: ${error.message}</p>`;
    });

    // 2. Real-time Listener Berkas Unggahan Guru (Multi-file per dokumen ID unik)
    unsubBerkas = db.collection("sekolah").doc(activeSekolahId).collection("berkas_guru")
        .onSnapshot((snapBerkas) => {
            mapBerkasSekolah = {};
            snapBerkas.forEach(doc => {
                mapBerkasSekolah[doc.id] = { id: doc.id, ...doc.data() };
            });
            renderDaftarIndikator();
        });

    // 3. Real-time Listener Nilai & Catatan dari Asesor
    unsubNilai = db.collection("sekolah").doc(activeSekolahId).collection("penilaian_asesor")
        .onSnapshot((snapNilai) => {
            mapNilaiAsesor = {};
            snapNilai.forEach(doc => {
                mapNilaiAsesor[doc.id] = doc.data();
            });
            renderDaftarIndikator();
        });
}

function renderDaftarIndikator() {
    if (allIndikatorList.length === 0) return;

    const container = document.getElementById('containerIndikatorGuru');
    const filterInstrumen = document.getElementById('filterInstrumenGuru').value;
    const filterStatus = document.getElementById('filterStatusGuru') ? document.getElementById('filterStatusGuru').value : 'ALL';

    let totalPoinBukti = 0;
    let totalPoinTerunggah = 0;

    allIndikatorList.forEach(item => {
        const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
            ? item.buktiOtentik 
            : [item.buktiOtentik || 'Dokumen Pendukung'];
        
        listBukti.forEach((_, idx) => {
            totalPoinBukti++;
            const adaBerkas = Object.values(mapBerkasSekolah).some(b => b.indikatorId === item.id && b.buktiIndex === idx && b.fileUrl);
            if (adaBerkas) {
                totalPoinTerunggah++;
            }
        });
    });

    document.getElementById('badgeProgresUpload').innerText = `Poin Terunggah: ${totalPoinTerunggah} / ${totalPoinBukti}`;

    const filteredList = allIndikatorList.filter(item => {
        const matchInstrumen = (filterInstrumen === 'ALL') || (item.instrumen === filterInstrumen);
        if (!matchInstrumen) return false;

        if (filterStatus === 'PENDING') {
            const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
                ? item.buktiOtentik 
                : [item.buktiOtentik || 'Dokumen Pendukung'];
            const adaYangKosong = listBukti.some((_, idx) => {
                const adaBerkas = Object.values(mapBerkasSekolah).some(b => b.indikatorId === item.id && b.buktiIndex === idx && b.fileUrl);
                return !adaBerkas;
            });
            return adaYangKosong;
        }
        return true;
    });

    if (filteredList.length === 0) {
        container.innerHTML = `<div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 italic">Tidak ada indikator yang sesuai filter.</div>`;
        return;
    }

    let html = '';
    filteredList.forEach(item => {
        const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
            ? item.buktiOtentik 
            : [item.buktiOtentik || 'Dokumen Pendukung'];

        const nilaiAsesor = mapNilaiAsesor[item.id] || null;

        let rincianBuktiHtml = '';
        listBukti.forEach((teksBukti, idx) => {
            const listBerkasPoin = Object.values(mapBerkasSekolah).filter(b => b.indikatorId === item.id && b.buktiIndex === idx);

            let daftarFileHtml = '';
            if (listBerkasPoin.length > 0) {
                listBerkasPoin.forEach((berkas) => {
                    const tanggal = berkas.uploadedAt ? new Date(berkas.uploadedAt).toLocaleDateString('id-ID') : '';
                    const isLink = berkas.tipe === 'link';
                    daftarFileHtml += `
                        <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center gap-2 mt-1.5">
                            <div>
                                <p class="text-[11px] text-emerald-900 font-semibold">
                                    <i class="fa-solid ${isLink ? 'fa-link' : 'fa-file-circle-check'} mr-1 text-emerald-600"></i> 
                                    <a href="${berkas.fileUrl}" target="_blank" class="underline hover:text-emerald-900">${berkas.fileName}</a> 
                                    <span class="text-slate-400 text-[10px]">(${tanggal})</span>
                                </p>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <a href="${berkas.fileUrl}" target="_blank" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg shadow-sm"><i class="fa-solid fa-eye mr-1"></i> Lihat</a>
                                <button onclick="hapusBerkasItem('${berkas.id}')" class="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded-lg shadow-sm"><i class="fa-solid fa-trash"></i> Hapus</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                daftarFileHtml = `<p class="text-[11px] text-slate-400 italic mt-1">Belum ada file/tautan diunggah untuk poin ini.</p>`;
            }

            rincianBuktiHtml += `
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div>
                        <span class="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded uppercase">Poin Bukti ${idx + 1}</span>
                        <p class="text-xs font-bold text-slate-800 mt-1">${teksBukti}</p>
                    </div>

                    <div class="space-y-1">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Berkas Terunggah (${listBerkasPoin.length}):</p>
                        ${daftarFileHtml}
                    </div>

                    <div class="pt-2 border-t border-slate-200 space-y-2">
                        <div class="flex gap-2 border-b pb-2">
                            <button onclick="gantiTabForm('${item.id}', ${idx}, 'file')" id="tabFile_${item.id}_${idx}" class="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white transition"><i class="fa-solid fa-upload mr-1"></i> Tambah File</button>
                            <button onclick="gantiTabForm('${item.id}', ${idx}, 'link')" id="tabLink_${item.id}_${idx}" class="px-3 py-1 text-[11px] font-bold rounded-lg bg-slate-200 text-slate-700 transition"><i class="fa-solid fa-link mr-1"></i> Tambah Tautan (Link)</button>
                        </div>

                        <div id="kontenFile_${item.id}_${idx}" class="space-y-2">
                            <div class="flex flex-col md:flex-row items-center gap-2">
                                <input type="file" id="fileInput_${item.id}_${idx}" class="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer">
                                <button onclick="prosesUploadPoinMulti('${item.id}', ${idx})" class="w-full md:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow transition shrink-0">
                                    <i class="fa-solid fa-plus mr-1"></i> Upload & Tambah
                                </button>
                            </div>
                            <div id="loading_${item.id}_${idx}" class="text-[11px] text-blue-600 font-semibold hidden">
                                <i class="fa-solid fa-spinner fa-spin mr-1"></i> Mengunggah berkas ke Drive...
                            </div>
                        </div>

                        <div id="kontenLink_${item.id}_${idx}" class="space-y-2 hidden">
                            <div class="flex flex-col md:flex-row items-center gap-2">
                                <input type="text" id="linkInput_${item.id}_${idx}" placeholder="Tempel URL (Google Drive, Docs, YouTube, dll)" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white">
                                <button onclick="prosesSimpanLinkMulti('${item.id}', ${idx})" class="w-full md:w-auto px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition shrink-0">
                                    <i class="fa-solid fa-plus mr-1"></i> Simpan Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        let badgePenilaianHtml = '';
        if (nilaiAsesor && (nilaiAsesor.skor || nilaiAsesor.catatan)) {
            badgePenilaianHtml = `
                <div class="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div class="text-[11px] text-blue-900">
                        <span class="font-bold"><i class="fa-solid fa-clipboard-check text-blue-600 mr-1"></i> Feedback Asesor:</span>
                        <span>${nilaiAsesor.catatan ? `"${nilaiAsesor.catatan}"` : 'Tidak ada catatan.'}</span>
                    </div>
                    ${nilaiAsesor.skor ? `<span class="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-[11px] shrink-0">Skor: ${nilaiAsesor.skor} / 4</span>` : ''}
                </div>
            `;
        }

        html += `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3 text-xs">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5">
                        <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-md text-[10px]">${item.instrumen || 'Instrumen PKKM'}</span>
                        <span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md text-[10px]">Komponen ${item.noKomponen} • Indikator ${item.noIndikator || '1'}</span>
                    </div>
                    <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync
                    </span>
                </div>
                <div>
                    <p class="font-bold text-slate-800 text-sm">${item.tugasUtama}</p>
                    <p class="text-slate-600 mt-1"><strong>Indikator Kerja:</strong> ${item.indikatorKerja}</p>
                    ${badgePenilaianHtml}
                </div>
                <div class="pt-2 border-t border-slate-100 space-y-2.5">
                    <label class="block font-bold text-slate-700"><i class="fa-solid fa-folder-open text-emerald-600 mr-1"></i> Bukti Otentik (Bisa Unggah Banyak File / Tautan Link):</label>
                    <div class="space-y-2">
                        ${rincianBuktiHtml}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function gantiTabForm(indikatorId, idx, mode) {
    const tabFile = document.getElementById(`tabFile_${indikatorId}_${idx}`);
    const tabLink = document.getElementById(`tabLink_${indikatorId}_${idx}`);
    const kontenFile = document.getElementById(`kontenFile_${indikatorId}_${idx}`);
    const kontenLink = document.getElementById(`kontenLink_${indikatorId}_${idx}`);

    if (mode === 'file') {
        tabFile.className = "px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white transition";
        tabLink.className = "px-3 py-1 text-[11px] font-bold rounded-lg bg-slate-200 text-slate-700 transition";
        kontenFile.classList.remove('hidden');
        kontenLink.classList.add('hidden');
    } else {
        tabLink.className = "px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white transition";
        tabFile.className = "px-3 py-1 text-[11px] font-bold rounded-lg bg-slate-200 text-slate-700 transition";
        kontenLink.classList.remove('hidden');
        kontenFile.classList.add('hidden');
    }
}

async function prosesUploadPoinMulti(indikatorId, idx) {
    const fileInput = document.getElementById(`fileInput_${indikatorId}_${idx}`);
    const loadingDiv = document.getElementById(`loading_${indikatorId}_${idx}`);

    if (!fileInput || fileInput.files.length === 0) {
        alert("Silakan pilih file terlebih dahulu!");
        return;
    }

    const gasUrl = activeSekolahData ? activeSekolahData.gasUrl : null;
    if (!gasUrl) {
        alert("URL Web App Google Apps Script (GAS) sekolah belum diatur oleh Admin!");
        return;
    }

    const file = fileInput.files[0];
    if (file.size > 15 * 1024 * 1024) {
        alert("Ukuran file maksimal 15 MB.");
        return;
    }

    if (loadingDiv) loadingDiv.classList.remove('hidden');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function() {
        const base64Data = reader.result.split(',')[1];
        const payload = {
            action: "uploadFile",
            sekolahId: activeSekolahId,
            namaSekolah: activeSekolahData.namaSekolah,
            indikatorId: indikatorId,
            buktiIndex: idx,
            fileName: `${indikatorId}_b${idx + 1}_${Date.now()}_${file.name}`,
            originalName: file.name,
            mimeType: file.type,
            fileData: base64Data
        };

        try {
            const response = await fetch(gasUrl, { method: "POST", body: JSON.stringify(payload) });
            let driveFileUrl = "#";
            let driveFileId = "";
            if (response.ok) {
                const resJson = await response.json();
                if (resJson.fileUrl) driveFileUrl = resJson.fileUrl;
                if (resJson.fileId) driveFileId = resJson.fileId;
            }
            await simpanBerkasBaruKeFirebase(indikatorId, idx, file.name, driveFileUrl, driveFileId, 'file');
        } catch (err) {
            try {
                await fetch(gasUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
                await simpanBerkasBaruKeFirebase(indikatorId, idx, file.name, "#", "", 'file');
            } catch (fallbackErr) {
                alert("Gagal mengunggah: " + fallbackErr.message);
                if (loadingDiv) loadingDiv.classList.add('hidden');
            }
        }
    };
}

async function prosesSimpanLinkMulti(indikatorId, idx) {
    const linkInput = document.getElementById(`linkInput_${indikatorId}_${idx}`);
    const urlValue = linkInput ? linkInput.value.trim() : '';

    if (!urlValue || (!urlValue.startsWith('http://') && !urlValue.startsWith('https://'))) {
        alert("Masukkan tautan/URL yang valid (diawali http:// atau https://)");
        return;
    }

    let namaTautan = "Tautan Eksternal";
    try {
        const parsedUrl = new URL(urlValue);
        namaTautan = `Link (${parsedUrl.hostname})`;
    } catch (e) {
        namaTautan = "Tautan Dokumen";
    }

    await simpanBerkasBaruKeFirebase(indikatorId, idx, namaTautan, urlValue, null, 'link');
    linkInput.value = '';
}

async function simpanBerkasBaruKeFirebase(indikatorId, idx, fileName, fileUrl, driveFileId, tipe) {
    const colRef = db.collection("sekolah").doc(activeSekolahId).collection("berkas_guru");
    await colRef.add({
        indikatorId: indikatorId,
        buktiIndex: idx,
        fileName: fileName,
        fileUrl: fileUrl,
        driveFileId: driveFileId || null,
        tipe: tipe || 'file',
        uploadedAt: new Date().toISOString()
    });
}

async function hapusBerkasItem(berkasId) {
    if (!confirm("Hapus berkas/tautan ini?")) return;
    const berkasLama = mapBerkasSekolah[berkasId];
    const gasUrl = activeSekolahData ? activeSekolahData.gasUrl : null;

    try {
        if (gasUrl && berkasLama && berkasLama.driveFileId && berkasLama.tipe !== 'link') {
            fetch(gasUrl, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "deleteFile", fileId: berkasLama.driveFileId })
            }).catch(() => {});
        }
        await db.collection("sekolah").doc(activeSekolahId).collection("berkas_guru").doc(berkasId).delete();
    } catch (err) {
        alert("Gagal menghapus: " + err.message);
    }
}
