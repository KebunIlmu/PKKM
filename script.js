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
                no: "2.1", teks: "Menyusun perencanaan madrasah untuk berbagai tingkatan.", indikator: "Mampu mengembangkan RKJM, RKT/RKAM berdasarkan evaluasi 8 SNP", 
                buktiList: [
                    "Dokumen Evaluasi Diri Madrasah (EDM)", 
                    "Dokumen RKJM dan RKT / RKAM 8 SNP"
                ] 
            },
            { 
                no: "", teks: "", indikator: "Mampu merumuskan visi-misi sebagai arah pengembangan program", 
                buktiList: [
                    "Dokumen visi dan misi hasil keputusan bersama", 
                    "Berita acara perumusan visi misi"
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
