const firebaseConfig = {

  apiKey: "AIzaSyDm1zMNDjd06vsZOddTgho6AXFpxHYOSpM",

  authDomain: "kebun-ilmu.firebaseapp.com",

  projectId: "kebun-ilmu",

  storageBucket: "kebun-ilmu.firebasestorage.app",

  messagingSenderId: "1096325100528",

  appId: "1:1096325100528:web:c7575d081ff17a015c2335",

  measurementId: "G-QBCL39G8G8"

};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

window.addEventListener('DOMContentLoaded', () => {
    muatDaftarSekolah();
});

function simpanSekolah() {
    const namaSekolah = document.getElementById('inputNamaSekolah').value.trim();
    const namaKamad = document.getElementById('inputNamaKamad').value.trim();
    const gasUrl = document.getElementById('inputGasUrl').value.trim();
    const tahun = document.getElementById('inputTahun').value.trim();

    if (!namaSekolah || !gasUrl) {
        alert("Nama Sekolah dan URL GAS wajib diisi!");
        return;
    }

    // Buat ID unik berdasarkan nama sekolah (ubah spasi jadi underscore)
    const sekolahId = namaSekolah.toLowerCase().replace(/\s+/g, '_');

    db.collection("sekolah").doc(sekolahId).set({
        sekolahId: sekolahId,
        namaSekolah: namaSekolah,
        namaKamad: namaKamad,
        gasUrl: gasUrl,
        tahun: tahun,
        createdAt: new Date().toISOString()
    })
    .then(() => {
        alert("Data sekolah berhasil disimpan!");
        muatDaftarSekolah();
        // Reset form
        document.getElementById('inputNamaSekolah').value = '';
        document.getElementById('inputNamaKamad').value = '';
        document.getElementById('inputGasUrl').value = '';
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

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                    <div>
                        <strong class="text-slate-800 text-sm">${data.namaSekolah}</strong>
                        <p class="text-slate-500">Kamad: ${data.namaKamad || '-'} | Tahun: ${data.tahun}</p>
                    </div>
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">Aktif</span>
                </div>
            `;
        });
        container.innerHTML = html;
    });
}
