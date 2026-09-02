// Menampilkan Jam Real-time
function updateJam() {
    const sekarang = new Date();
    document.getElementById('jam').innerText = sekarang.toLocaleTimeString('id-ID');
}
setInterval(updateJam, 1000);
updateJam();

// Fungsi Absen
document.getElementById('formAbsen').addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const waktu = new Date().toLocaleTimeString('id-ID');
    
    const li = document.createElement('li');
    li.innerHTML = `<b>${nama}</b> - Absen pada ${waktu}`;
    
    document.getElementById('daftarHadir').appendChild(li);
    document.getElementById('nama').value = '';
});