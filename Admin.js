// --- KONFIGURASI FIREBASE ---
// (Sesuaikan konfigurasi di bawah ini dengan project Firebase Anda)
const firebaseConfig = {
    apiKey: "MASUKKAN_API_KEY_ANDA",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Jalankan saat halaman admin selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
    muatPengaturanAdmin();
});

// Fungsi untuk menyimpan pengaturan dari Panel Admin ke Firebase Firestore
function simpanPengaturanAdmin() {
    const gasUrl = document.getElementById('adminGasUrl').value.trim();
    const namaMadrasah = document.getElementById('adminNamaMadrasah').value.trim();
    const namaKamad = document.getElementById('adminNamaKamad').value.trim();
    const tahunPenilaian = document.getElementById('adminTahun').value.trim();

    if (!gasUrl || !namaMadrasah) {
        alert("URL Google Apps Script dan Nama Madrasah wajib diisi!");
        return;
    }

    db.collection("pengaturan").doc("identitas").set({
        gasUrl: gasUrl,
        namaMadrasah: namaMadrasah,
        namaKamad: namaKamad,
        tahunPenilaian: tahunPenilaian
    })
    .then(() => {
        alert("Konfigurasi identitas & URL GAS berhasil disimpan ke database!");
    })
    .catch((error) => {
        alert("Gagal menyimpan konfigurasi: " + error.message);
    });
}

// Fungsi untuk mengambil data pengaturan yang sudah tersimpan di Firebase
function muatPengaturanAdmin() {
    db.collection("pengaturan").doc("identitas").get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('adminGasUrl').value = data.gasUrl || '';
            document.getElementById('adminNamaMadrasah').value = data.namaMadrasah || '';
            document.getElementById('adminNamaKamad').value = data.namaKamad || '';
            document.getElementById('adminTahun').value = data.tahunPenilaian || '2026';
        }
    }).catch((error) => {
        console.error("Gagal memuat pengaturan: ", error);
    });
}
