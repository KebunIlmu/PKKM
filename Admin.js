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
