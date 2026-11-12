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
let mapBerkasSekolah = {}; // Format key: `${indikatorId}_${buktiIndex}`

window.addEventListener('DOMContentLoaded', () => {
    if (activeSekolahId) {
        verifikasiDanMuatSekolah(activeSekolahId);
    } else {
        muatDropdownSekolah();
    }
});

function muatDropdownSekolah() {
    const select = document.getElementById('selectPilihSekolah');
    db.collection("sekolah").get().then((snapshot) => {
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
    if (!selectedId) {
        alert("Silakan pilih sekolah terlebih dahulu!");
        return;
    }
    verifikasiDanMuatSekolah(selectedId);
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

function gantiSekolah() {
    if (confirm("Ganti sekolah aktif?")) {
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

async function muatDataFirebaseGuru() {
    const container = document.getElementById('containerIndikatorGuru');
    container.innerHTML = `<p class="text-xs text-slate-500 italic text-center py-8"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Menyinkronkan data dari Firebase...</p>`;

    try {
        const snapIndikator = await db.collection("instrumen_pkkm").get();
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
        let optHtml = `<option value="ALL">Semua Instrumen</option>`;
        setInstrumen.forEach(ins => {
            optHtml += `<option value="${ins}">${ins}</option>`;
        });
        filterSelect.innerHTML = optHtml;

        // Ambil semua berkas upload berdasarkan sub-koleksi
        const snapBerkas = await db.collection("sekolah").doc(activeSekolahId).collection("berkas_guru").get();
        mapBerkasSekolah = {};
        snapBerkas.forEach(doc => {
            mapBerkasSekolah[doc.id] = doc.data(); // id di sini adalah `${indikatorId}_${buktiIndex}`
        });

        renderDaftarIndikator();
    } catch (error) {
        container.innerHTML = `<p class="text-xs text-red-500 italic text-center py-8">Gagal memuat data: ${error.message}</p>`;
    }
}

function renderDaftarIndikator() {
    const container = document.getElementById('containerIndikatorGuru');
    const filterInstrumen = document.getElementById('filterInstrumenGuru').value;

    let totalPoinBukti = 0;
    let totalPoinTerunggah = 0;

    allIndikatorList.forEach(item => {
        const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
            ? item.buktiOtentik 
            : [item.buktiOtentik || 'Dokumen Pendukung'];
        
        listBukti.forEach((_, idx) => {
            totalPoinBukti++;
            const docKey = `${item.id}_${idx}`;
            if (mapBerkasSekolah[docKey] && mapBerkasSekolah[docKey].fileUrl) {
                totalPoinTerunggah++;
            }
        });
    });

    document.getElementById('badgeProgresUpload').innerText = `Poin Terunggah: ${totalPoinTerunggah} / ${totalPoinBukti}`;

    const filteredList = allIndikatorList.filter(item => {
        return (filterInstrumen === 'ALL') || (item.instrumen === filterInstrumen);
    });

    if (filteredList.length === 0) {
        container.innerHTML = `<div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 italic">Tidak ada indikator.</div>`;
        return;
    }

    let html = '';
    filteredList.forEach(item => {
        const listBukti = Array.isArray(item.buktiOtentik) && item.buktiOtentik.length > 0 
            ? item.buktiOtentik 
            : [item.buktiOtentik || 'Dokumen Pendukung'];

        let rincianBuktiHtml = '';
        listBukti.forEach((teksBukti, idx) => {
            const docKey = `${item.id}_${idx}`;
            const berkas = mapBerkasSekolah[docKey] || null;

            if (berkas && berkas.fileUrl) {
                const tanggal = berkas.uploadedAt ? new Date(berkas.uploadedAt).toLocaleDateString('id-ID') : '';
                rincianBuktiHtml += `
                    <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <span class="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded uppercase">Poin Bukti ${idx + 1}</span>
                                <p class="text-xs font-bold text-slate-700 mt-1">${teksBukti}</p>
                                <p class="text-[11px] text-emerald-700 mt-0.5"><i class="fa-solid fa-file-circle-check mr-1"></i> ${berkas.fileName} (${tanggal})</p>
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <a href="${berkas.fileUrl}" target="_blank" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg shadow-sm"><i class="fa-solid fa-eye mr-1"></i> Lihat</a>
                                <button onclick="tampilkanFormGantiPoin('${item.id}', ${idx})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded-lg shadow-sm">Ganti</button>
                                <button onclick="hapusBerkasPoin('${item.id}', ${idx})" class="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded-lg shadow-sm"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <div id="formGanti_${item.id}_${idx}" class="hidden pt-2 border-t border-emerald-200 space-y-2">
                            <input type="file" id="fileInput_${item.id}_${idx}" class="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-amber-600 file:text-white">
                            <div class="flex justify-end gap-1">
                                <button onclick="batalGantiPoin('${item.id}', ${idx})" class="px-2 py-1 bg-slate-200 text-slate-700 text-[11px] rounded-lg">Batal</button>
                                <button onclick="prosesUploadPoin('${item.id}', ${idx})" class="px-3 py-1 bg-amber-600 text-white text-[11px] font-semibold rounded-lg">Simpan Pengganti</button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                rincianBuktiHtml += `
                    <div class="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                        <div>
                            <span class="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded uppercase">Poin Bukti ${idx + 1}</span>
                            <p class="text-xs font-bold text-slate-700 mt-1">${teksBukti}</p>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-2 pt-1">
                            <input type="file" id="fileInput_${item.id}_${idx}" class="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer">
                            <button onclick="prosesUploadPoin('${item.id}', ${idx})" id="btnUpload_${item.id}_${idx}" class="w-full md:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow transition shrink-0">
                                <i class="fa-solid fa-upload mr-1"></i> Upload Poin Ini
                            </button>
                        </div>
                        <div id="loading_${item.id}_${idx}" class="text-[11px] text-blue-600 font-semibold hidden">
                            <i class="fa-solid fa-spinner fa-spin mr-1"></i> Mengunggah ke Drive...
                        </div>
                    </div>
                `;
            }
        });

        html += `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3 text-xs">
                <div class="flex items-center gap-1.5">
                    <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-md text-[10px]">${item.instrumen || 'Instrumen PKKM'}</span>
                    <span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md text-[10px]">Komponen ${item.noKomponen} • Indikator ${item.noIndikator || '1'}</span>
                </div>
                <div>
                    <p class="font-bold text-slate-800 text-sm">${item.tugasUtama}</p>
                    <p class="text-slate-600 mt-1"><strong>Indikator Kerja:</strong> ${item.indikatorKerja}</p>
                </div>
                <div class="pt-2 border-t border-slate-100 space-y-2.5">
                    <label class="block font-bold text-slate-700"><i class="fa-solid fa-folder-open text-emerald-600 mr-1"></i> Unggah Bukti Otentik (Per Poin):</label>
                    <div class="space-y-2">
                        ${rincianBuktiHtml}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function tampilkanFormGantiPoin(indikatorId, idx) {
    document.getElementById(`formGanti_${indikatorId}_${idx}`).classList.remove('hidden');
}

function batalGantiPoin(indikatorId, idx) {
    document.getElementById(`formGanti_${indikatorId}_${idx}`).classList.add('hidden');
}

function prosesUploadPoin(indikatorId, idx) {
    const fileInput = document.getElementById(`fileInput_${indikatorId}_${idx}`);
    const loadingDiv = document.getElementById(`loading_${indikatorId}_${idx}`);

    if (!fileInput || fileInput.files.length === 0) {
        alert("Silakan pilih file untuk poin bukti ini terlebih dahulu!");
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
        const docKey = `${indikatorId}_${idx}`;

        const payload = {
            action: "uploadFile",
            sekolahId: activeSekolahId,
            namaSekolah: activeSekolahData.namaSekolah,
            indikatorId: indikatorId,
            buktiIndex: idx,
            fileName: `${indikatorId}_bukti${idx + 1}_${file.name}`,
            originalName: file.name,
            mimeType: file.type,
            fileData: base64Data
        };

        try {
            const response = await fetch(gasUrl, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            let driveFileUrl = "#";
            let driveFileId = "";

            if (response.ok) {
                const resJson = await response.json();
                if (resJson.fileUrl) driveFileUrl = resJson.fileUrl;
                if (resJson.fileId) driveFileId = resJson.fileId;
            }

            await simpanKeFirebase(docKey, file.name, driveFileUrl, driveFileId);
        } catch (err) {
            try {
                await fetch(gasUrl, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(payload)
                });
                await simpanKeFirebase(docKey, file.name, "#", "");
            } catch (fallbackErr) {
                alert("Gagal mengunggah: " + fallbackErr.message);
                if (loadingDiv) loadingDiv.classList.add('hidden');
            }
        }
    };
}

async function simpanKeFirebase(docKey, fileName, fileUrl, driveFileId) {
    const dataBerkas = {
        docKey: docKey,
        fileName: fileName,
        fileUrl: fileUrl,
        driveFileId: driveFileId || null,
        uploadedAt: new Date().toISOString()
    };

    await db.collection("sekolah")
        .doc(activeSekolahId)
        .collection("berkas_guru")
        .doc(docKey)
        .set(dataBerkas, { merge: true });

    mapBerkasSekolah[docKey] = dataBerkas;
    alert("Bukti otentik berhasil diunggah!");
    renderDaftarIndikator();
}

async function hapusBerkasPoin(indikatorId, idx) {
    if (!confirm("Hapus berkas bukti poin ini?")) return;

    const docKey = `${indikatorId}_${idx}`;
    const berkasLama = mapBerkasSekolah[docKey];
    const gasUrl = activeSekolahData ? activeSekolahData.gasUrl : null;

    try {
        if (gasUrl && berkasLama && berkasLama.driveFileId) {
            fetch(gasUrl, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "deleteFile", fileId: berkasLama.driveFileId })
            }).catch(() => {});
        }

        await db.collection("sekolah")
            .doc(activeSekolahId)
            .collection("berkas_guru")
            .doc(docKey)
            .delete();

        delete mapBerkasSekolah[docKey];
        alert("Berkas berhasil dihapus.");
        renderDaftarIndikator();
    } catch (err) {
        alert("Gagal menghapus: " + err.message);
    }
}