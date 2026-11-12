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

let cacheDataInstrumen = [];
window.tempSekolahData = {};
window.tempIndikatorData = {};

window.addEventListener('DOMContentLoaded', () => {
    muatDaftarSekolah();
    muatDataDropdownDanKomponen();
    muatDaftarIndikator();
});

// ==================== SEKOLAH & LOGO (DENGAN FITUR EDIT) ====================

function simpanSekolah() {
    const namaSekolah = document.getElementById('inputNamaSekolah').value.trim();
    const namaKamad = document.getElementById('inputNamaKamad').value.trim();
    const logoUrl = document.getElementById('inputLogoUrl').value.trim();
    const gasUrl = document.getElementById('inputGasUrl').value.trim();
    const tahun = document.getElementById('inputTahun').value.trim();

    if (!namaSekolah || !gasUrl) {
        alert("Nama Sekolah dan URL GAS wajib diisi!");
        return;
    }

    const sekolahId = namaSekolah.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]/g, '_');
    db.collection("sekolah").doc(sekolahId).set({
        sekolahId: sekolahId,
        namaSekolah: namaSekolah,
        namaKamad: namaKamad,
        logoUrl: logoUrl,
        gasUrl: gasUrl,
        tahun: tahun,
        updatedAt: new Date().toISOString()
    }, { merge: true })
    .then(() => {
        alert("Data sekolah & logo berhasil disimpan!");
        muatDaftarSekolah();
        resetFormSekolah();
    })
    .catch((error) => {
        alert("Gagal menyimpan: " + error.message);
    });
}

function muatDaftarSekolah() {
    const container = document.getElementById('listSekolah');
    db.collection("sekolah").get().then((querySnapshot) => {
        let html = '';
        if (querySnapshot.empty) {
            container.innerHTML = `<p class="text-xs text-slate-500 italic">Belum ada sekolah yang terdaftar.</p>`;
            return;
        }

        window.tempSekolahData = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            window.tempSekolahData[doc.id] = data;

            const imgLogo = data.logoUrl 
                ? `<img src="${data.logoUrl}" alt="Logo" class="w-10 h-10 object-contain rounded-xl border bg-white p-1">`
                : `<div class="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500"><i class="fa-solid fa-school"></i></div>`;

            html += `
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                    <div class="flex items-center gap-3">
                        ${imgLogo}
                        <div>
                            <strong class="text-slate-800 text-sm">${data.namaSekolah}</strong>
                            <p class="text-slate-500">Kamad: ${data.namaKamad || '-'} | Tahun: ${data.tahun}</p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button onclick="muatFormEditSekolahById('${doc.id.replace(/'/g, "\\'")}')" class="text-blue-500 hover:text-blue-700 px-2 py-1" title="Edit Sekolah"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="hapusSekolah('${doc.id.replace(/'/g, "\\'")}')" class="text-red-500 hover:text-red-700 px-2 py-1" title="Hapus Sekolah"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    });
}

function muatFormEditSekolahById(id) {
    const data = window.tempSekolahData && window.tempSekolahData[id];
    if (!data) return;

    document.getElementById('inputNamaSekolah').value = data.namaSekolah || '';
    document.getElementById('inputNamaKamad').value = data.namaKamad || '';
    document.getElementById('inputLogoUrl').value = data.logoUrl || '';
    document.getElementById('inputTahun').value = data.tahun || '2026';
    document.getElementById('inputGasUrl').value = data.gasUrl || '';

    document.getElementById('labelModeEditSekolah').classList.remove('hidden');
    document.getElementById('btnBatalEditSekolah').classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormSekolah() {
    document.getElementById('inputNamaSekolah').value = '';
    document.getElementById('inputNamaKamad').value = '';
    document.getElementById('inputLogoUrl').value = '';
    document.getElementById('inputTahun').value = '2026';
    document.getElementById('inputGasUrl').value = '';

    document.getElementById('labelModeEditSekolah').classList.add('hidden');
    document.getElementById('btnBatalEditSekolah').classList.add('hidden');
}

function hapusSekolah(id) {
    if (confirm("Yakin ingin menghapus sekolah ini?")) {
        db.collection("sekolah").doc(id).delete().then(() => {
            muatDaftarSekolah();
        });
    }
}

// ==================== SINKRONISASI INSTRUMEN, TUGAS UTAMA & KOMPONEN ====================

function muatDataDropdownDanKomponen() {
    const selectInstrumen = document.getElementById('selectInstrumen');
    const selectTugas = document.getElementById('selectTugasUtama');
    const selectKomponen = document.getElementById('selectNoKomponen');

    db.collection("instrumen_pkkm").get().then((snapshot) => {
        cacheDataInstrumen = [];
        const setInstrumen = new Set();
        const mapTugasKeKomponen = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            cacheDataInstrumen.push(data);
            if (data.instrumen) {
                setInstrumen.add(data.instrumen);
            }
            if (data.tugasUtama) {
                mapTugasKeKomponen[data.tugasUtama] = data.noKomponen;
            }
        });

        // Opsi Instrumen
        let optionsInstrumen = `<option value="">-- Pilih Instrumen / Kategori PKKM --</option>`;
        setInstrumen.forEach(ins => {
            optionsInstrumen += `<option value="${ins}">${ins}</option>`;
        });
        optionsInstrumen += `<option value="CUSTOM">+ Ketik Instrumen Baru</option>`;
        selectInstrumen.innerHTML = optionsInstrumen;

        // Opsi Tugas Utama
        let optionsTugas = `<option value="">-- Pilih Tugas Utama yang Sudah Ada --</option>`;
        Object.keys(mapTugasKeKomponen).forEach(tugas => {
            optionsTugas += `<option value="${tugas}">${tugas}</option>`;
        });
        optionsTugas += `<option value="CUSTOM">+ Ketik Tugas Utama Baru</option>`;
        selectTugas.innerHTML = optionsTugas;

        // Opsi No Komponen
        const setKomponen = new Set(cacheDataInstrumen.map(d => d.noKomponen).filter(Boolean));
        let optionsKomponen = `<option value="">-- Pilih No --</option>`;
        setKomponen.forEach(komp => {
            optionsKomponen += `<option value="${komp}">${komp}</option>`;
        });
        optionsKomponen += `<option value="CUSTOM">+ Baru</option>`;
        selectKomponen.innerHTML = optionsKomponen;
    });
}

function pilihInstrumen(val) {
    const inputInstrumenBaru = document.getElementById('inputInstrumenBaru');
    if (val === 'CUSTOM') {
        inputInstrumenBaru.classList.remove('hidden');
        inputInstrumenBaru.value = '';
        inputInstrumenBaru.focus();
    } else {
        inputInstrumenBaru.classList.add('hidden');
        inputInstrumenBaru.value = val;
    }
}

// (Fungsi pilihTugasUtama, simpanIndikator, dll disesuaikan di bawah)

function pilihTugasUtama(val) {
    const inputTugasBaru = document.getElementById('inputTugasUtamaBaru');
    const inputNoKomponen = document.getElementById('inputNoKomponen');
    const selectNoKomponen = document.getElementById('selectNoKomponen');

    if (val === 'CUSTOM') {
        inputTugasBaru.classList.remove('hidden');
        inputTugasBaru.value = '';
        inputTugasBaru.focus();
        inputNoKomponen.value = '';
        selectNoKomponen.value = '';
    } else {
        inputTugasBaru.classList.add('hidden');
        inputTugasBaru.value = val;

        const found = cacheDataInstrumen.find(d => d.tugasUtama === val);
        if (found && found.noKomponen) {
            inputNoKomponen.value = found.noKomponen;
            selectNoKomponen.value = found.noKomponen;
        }
    }
}

function cekKomponenLainnya(val) {
    const inputNoKomponen = document.getElementById('inputNoKomponen');
    if (val === 'CUSTOM') {
        inputNoKomponen.value = '';
        inputNoKomponen.focus();
    } else {
        inputNoKomponen.value = val;
    }
}

// ==================== MULTI BUKTI OTENTIK ====================

function tambahBarisBukti(nilai = '') {
    const container = document.getElementById('containerBukti');
    const jumlahBaris = container.getElementsByClassName('input-bukti-row').length + 1;
    
    const div = document.createElement('div');
    div.className = "flex gap-2 items-center input-bukti-row";
    div.innerHTML = `
        <span class="text-xs font-bold text-slate-400 w-5 text-center">${jumlahBaris}.</span>
        <input type="text" value="${nilai}" placeholder="Contoh: Notulen rapat / Daftar hadir" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 input-bukti-item">
        <button type="button" onclick="hapusBarisBukti(this)" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
    `;
    container.appendChild(div);
}

function hapusBarisBukti(btn) {
    const row = btn.closest('.input-bukti-row');
    const container = document.getElementById('containerBukti');
    if (container.getElementsByClassName('input-bukti-row').length > 1) {
        row.remove();
        perbaruiNomorUrutBukti();
    } else {
        alert("Minimal harus ada 1 kolom bukti otentik!");
    }
}

function perbaruiNomorUrutBukti() {
    const rows = document.querySelectorAll('.input-bukti-row');
    rows.forEach((row, index) => {
        row.querySelector('span').innerText = `${index + 1}.`;
    });
}

// ==================== SIMPAN & MUAT INDIKATOR ====================

function simpanIndikator() {
    let instrumen = document.getElementById('selectInstrumen').value;
    if (instrumen === 'CUSTOM' || !instrumen) {
        instrumen = document.getElementById('inputInstrumenBaru').value.trim();
    }

    const noKomponen = document.getElementById('inputNoKomponen').value.trim();
    const noIndikator = document.getElementById('inputNoIndikator').value.trim() || '1';
    
    let tugasUtama = document.getElementById('selectTugasUtama').value;
    if (tugasUtama === 'CUSTOM' || !tugasUtama) {
        tugasUtama = document.getElementById('inputTugasUtamaBaru').value.trim();
    }

    const indikatorKerja = document.getElementById('inputIndikatorKerja').value.trim();
    const dataKinerja = document.getElementById('inputDataKinerja').value.trim();

    const inputBuktiElements = document.querySelectorAll('.input-bukti-item');
    const listBuktiOtentik = [];
    inputBuktiElements.forEach(el => {
        if (el.value.trim() !== '') {
            listBuktiOtentik.push(el.value.trim());
        }
    });

    if (!noKomponen || !tugasUtama || !indikatorKerja) {
        alert("Nomor Komponen, Tugas Utama, dan Indikator Kerja wajib diisi!");
        return;
    }

    const indikatorId = `item_${noKomponen}_${noIndikator}`.replace(/\./g, '_');

    db.collection("instrumen_pkkm").doc(indikatorId).set({
        instrumen: instrumen,
        noKomponen: noKomponen,
        noIndikator: noIndikator,
        tugasUtama: tugasUtama,
        indikatorKerja: indikatorKerja,
        dataKinerja: dataKinerja,
        buktiOtentik: listBuktiOtentik,
        updatedAt: new Date().toISOString()
    }, { merge: true })
    .then(() => {
        alert("Indikator & Bukti Otentik berhasil disimpan!");
        muatDaftarIndikator();
        muatDataDropdownDanKomponen();
        resetFormIndikator();
    })
    .catch((error) => {
        alert("Gagal menyimpan indikator: " + error.message);
    });
}

function muatDaftarIndikator() {
    const container = document.getElementById('listIndikator');
    db.collection("instrumen_pkkm").orderBy("noKomponen").get().then((querySnapshot) => {
        let html = '';
        if (querySnapshot.empty) {
            container.innerHTML = `<p class="text-xs text-slate-500 italic">Belum ada instrumen indikator yang dimasukkan.</p>`;
            return;
        }

        window.tempIndikatorData = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            window.tempIndikatorData[doc.id] = data;
            
            let buktiHtml = '-';
            if (Array.isArray(data.buktiOtentik) && data.buktiOtentik.length > 0) {
                buktiHtml = '<ol class="list-decimal list-inside space-y-0.5 text-slate-600">';
                data.buktiOtentik.forEach(b => {
                    buktiHtml += `<li>${b}</li>`;
                });
                buktiHtml += '</ol>';
            } else if (typeof data.buktiOtentik === 'string') {
                buktiHtml = data.buktiOtentik;
            }

            const safeId = doc.id.replace(/'/g, "\\'");

            html += `
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div class="flex justify-between items-start">
                        <div class="flex gap-1.5 items-center flex-wrap">
                            <!-- Badge Nama Instrumen -->
                            <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]"><i class="fa-solid fa-layer-group mr-1"></i> ${data.instrumen || 'Tanpa Instrumen'}</span>
                            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">No: ${data.noKomponen} (Indikator ${data.noIndikator || '-'})</span>
                        </div>
                        <div class="flex gap-1">
                            <button onclick="muatFormEditIndikator('${safeId}')" class="text-blue-500 hover:text-blue-700 px-2 py-1" title="Edit Indikator"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="hapusIndikator('${safeId}')" class="text-red-500 hover:text-red-700 px-2 py-1" title="Hapus Indikator"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800">Tugas Utama: ${data.tugasUtama}</p>
                        <p class="text-slate-600 mt-1"><strong>Indikator Kerja:</strong> ${data.indikatorKerja}</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-slate-500">
                        <div><strong>Data Diharapkan:</strong><br><span class="text-slate-700">${data.dataKinerja || '-'}</span></div>
                        <div><strong>Bukti Otentik:</strong><br>${buktiHtml}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }).catch(err => {
        db.collection("instrumen_pkkm").get().then((snapshot) => {
            let html = '';
            window.tempIndikatorData = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                window.tempIndikatorData[doc.id] = data;
                const safeId = doc.id.replace(/'/g, "\\'");
                html += `
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div class="flex justify-between items-start">
                            <div class="flex gap-1.5 items-center flex-wrap">
                                <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]"><i class="fa-solid fa-layer-group mr-1"></i> ${data.instrumen || 'Tanpa Instrumen'}</span>
                                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">No: ${data.noKomponen}</span>
                            </div>
                            <div class="flex gap-1">
                                <button onclick="muatFormEditIndikator('${safeId}')" class="text-blue-500 hover:text-blue-700 px-2 py-1" title="Edit Indikator"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button onclick="hapusIndikator('${safeId}')" class="text-red-500 hover:text-red-700 px-2 py-1" title="Hapus Indikator"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                        <p class="font-bold text-slate-800">${data.tugasUtama}</p>
                        <p class="text-slate-600"><strong>Indikator:</strong> ${data.indikatorKerja}</p>
                    </div>
                `;
            });
            container.innerHTML = html || `<p class="text-xs text-slate-500 italic">Belum ada indikator.</p>`;
        });
    });
}

function muatFormEditIndikator(id) {
    const data = window.tempIndikatorData && window.tempIndikatorData[id];
    if (!data) return;

    // Cek Instrumen
    const selectInstrumen = document.getElementById('selectInstrumen');
    let instrumenExists = false;
    for (let opt of selectInstrumen.options) {
        if (opt.value === data.instrumen) {
            instrumenExists = true;
            break;
        }
    }
    if (instrumenExists) {
        selectInstrumen.value = data.instrumen;
        pilihInstrumen(data.instrumen);
    } else {
        selectInstrumen.value = 'CUSTOM';
        pilihInstrumen('CUSTOM');
        document.getElementById('inputInstrumenBaru').value = data.instrumen || '';
    }

    // Cek Tugas Utama
    const selectTugas = document.getElementById('selectTugasUtama');
    let optionExists = false;
    for (let opt of selectTugas.options) {
        if (opt.value === data.tugasUtama) {
            optionExists = true;
            break;
        }
    }

    if (optionExists) {
        selectTugas.value = data.tugasUtama;
        pilihTugasUtama(data.tugasUtama);
    } else {
        selectTugas.value = 'CUSTOM';
        pilihTugasUtama('CUSTOM');
        document.getElementById('inputTugasUtamaBaru').value = data.tugasUtama || '';
    }

    document.getElementById('selectNoKomponen').value = data.noKomponen || 'CUSTOM';
    document.getElementById('inputNoKomponen').value = data.noKomponen || '';
    document.getElementById('inputNoIndikator').value = data.noIndikator || '';
    document.getElementById('inputIndikatorKerja').value = data.indikatorKerja || '';
    document.getElementById('inputDataKinerja').value = data.dataKinerja || '';

    // Render ulang baris bukti otentik
    const container = document.getElementById('containerBukti');
    container.innerHTML = '';
    if (Array.isArray(data.buktiOtentik) && data.buktiOtentik.length > 0) {
        data.buktiOtentik.forEach(b => {
            tambahBarisBukti(b);
        });
    } else {
        tambahBarisBukti('');
    }

    document.getElementById('labelModeEditIndikator').classList.remove('hidden');
    document.getElementById('btnBatalEditIndikator').classList.remove('hidden');

    window.scrollTo({ top: 400, behavior: 'smooth' });
}

function resetFormIndikator() {
    document.getElementById('selectInstrumen').value = '';
    document.getElementById('inputInstrumenBaru').value = '';
    document.getElementById('inputInstrumenBaru').classList.add('hidden');
    document.getElementById('selectTugasUtama').value = '';
    document.getElementById('inputTugasUtamaBaru').value = '';
    document.getElementById('inputTugasUtamaBaru').classList.add('hidden');
    document.getElementById('selectNoKomponen').value = '';
    document.getElementById('inputNoKomponen').value = '';
    document.getElementById('inputNoIndikator').value = '';
    document.getElementById('inputIndikatorKerja').value = '';
    document.getElementById('inputDataKinerja').value = '';

    document.getElementById('containerBukti').innerHTML = `
        <div class="flex gap-2 items-center input-bukti-row">
            <span class="text-xs font-bold text-slate-400 w-5 text-center">1.</span>
            <input type="text" placeholder="Contoh: Bagan / struktur organisasi madrasah" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 input-bukti-item">
            <button type="button" onclick="hapusBarisBukti(this)" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    document.getElementById('labelModeEditIndikator').classList.add('hidden');
    document.getElementById('btnBatalEditIndikator').classList.add('hidden');
}

function hapusIndikator(id) {
    if (confirm("Hapus indikator ini dari instrumen?")) {
        db.collection("instrumen_pkkm").doc(id).delete().then(() => {
            muatDaftarIndikator();
            muatDataDropdownDanKomponen();
        });
    }
}