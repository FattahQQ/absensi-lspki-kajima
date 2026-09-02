// Cek Sesi Login saat halaman Dashboard dibuka
if (window.location.pathname.includes('dashboard.html')) {
    const sessionUser = localStorage.getItem('sessionUser');
    
    // Jika belum login, tendang kembali ke halaman Login
    if (!sessionUser) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userNama').innerText = sessionUser;
    }

    // Jam Real-time
    function updateJam() {
        const sekarang = new Date();
        const elJam = document.getElementById('jam');
        if (elJam) elJam.innerText = sekarang.toLocaleTimeString('id-ID');
    }
    setInterval(updateJam, 1000);
    updateJam();

    // Fungsi Menampilkan Notifikasi Visual Toast
    function tampilNotifikasi(pesan, tipe) {
        const elNotif = document.getElementById('notifikasi');
        elNotif.innerText = pesan;
        elNotif.style.display = 'block';
        
        if (tipe === 'sukses') {
            elNotif.style.backgroundColor = '#e6f4ea';
            elNotif.style.color = '#137333';
            elNotif.style.border = '1px solid #ceedd5';
        } else {
            elNotif.style.backgroundColor = '#fce8e6';
            elNotif.style.color = '#c5221f';
            elNotif.style.border = '1px solid #fad2cf';
        }

        setTimeout(() => {
            elNotif.style.display = 'none';
        }, 3000);
    }

    // Tampilkan Riwayat Absen dari LocalStorage
    function muatRiwayatAbsen() {
        const daftarHadir = document.getElementById('daftarHadir');
        daftarHadir.innerHTML = '';
        const dataAbsen = JSON.parse(localStorage.getItem('riwayat_' + sessionUser)) || [];
        
        if (dataAbsen.length === 0) {
            daftarHadir.innerHTML = '<li style="border-left: 4px solid #6c757d; color: #6c757d;">Belum ada riwayat absensi.</li>';
            return;
        }

        dataAbsen.forEach(item => {
            const li = document.createElement('li');
            const warnaBadge = item.status === 'Terlambat' ? '#d93025' : '#34a853';
            
            li.innerHTML = `
                <div>
                    <b>[${item.tipe}]</b> <small>${item.tanggal} - ${item.waktu}</small>
                </div>
                <span style="color: ${warnaBadge}; font-weight: bold; font-size: 12px;">${item.status}</span>
            `;
            daftarHadir.appendChild(li);
        });
    }

    // Fungsi Catat Absen dengan Validasi Jam
    function catatAbsen(tipe) {
        const sekarang = new Date();
        const tanggal = sekarang.toLocaleDateString('id-ID');
        const waktu = sekarang.toLocaleTimeString('id-ID');
        const jamSekarang = sekarang.getHours();

        let status = 'Selesai';
        if (tipe === 'MASUK') {
            // Batas jam masuk adalah 08:00
            status = jamSekarang >= 8 ? 'Terlambat' : 'Tepat Waktu';
        }

        const dataAbsen = JSON.parse(localStorage.getItem('riwayat_' + sessionUser)) || [];
        dataAbsen.unshift({ tipe, tanggal, waktu, status }); // Tambah ke paling atas
        
        localStorage.setItem('riwayat_' + sessionUser, JSON.stringify(dataAbsen));
        muatRiwayatAbsen();

        tampilNotifikasi(`Berhasil Absen ${tipe}! Status: ${status}`, 'sukses');
    }

    // Export CSV
    function exportKeCSV() {
        const dataAbsen = JSON.parse(localStorage.getItem('riwayat_' + sessionUser)) || [];

        if (dataAbsen.length === 0) {
            tampilNotifikasi('Belum ada data riwayat absensi untuk di-export!', 'error');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,Tipe,Tanggal,Waktu,Status\n";

        dataAbsen.forEach(row => {
            csvContent += `${row.tipe},${row.tanggal},${row.waktu},${row.status}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rekap_Absensi_${sessionUser}.csv`);
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);

        tampilNotifikasi('Berhasil mengunduh rekap absensi!', 'sukses');
    }

    // Reset Riwayat
    function resetRiwayat() {
        if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat absensi?')) {
            localStorage.removeItem('riwayat_' + sessionUser);
            muatRiwayatAbsen();
            tampilNotifikasi('Riwayat absensi berhasil dibersihkan.', 'sukses');
        }
    }

    // Event Listener
    document.getElementById('btnMasuk').addEventListener('click', () => catatAbsen('MASUK'));
    document.getElementById('btnKeluar').addEventListener('click', () => catatAbsen('KELUAR'));
    document.getElementById('btnExport').addEventListener('click', exportKeCSV);
    document.getElementById('btnReset').addEventListener('click', resetRiwayat);

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('sessionUser');
        window.location.href = 'index.html';
    });

    // Muat riwayat awal
    muatRiwayatAbsen();
}
