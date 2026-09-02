// Navigasi Form Login/Register
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

if (toRegister) {
    toRegister.addEventListener('click', (e) => {
        e.preventDefault();
        formLogin.classList.add('hidden');
        formRegister.classList.remove('hidden');
    });
}

if (toLogin) {
    toLogin.addEventListener('click', (e) => {
        e.preventDefault();
        formRegister.classList.add('hidden');
        formLogin.classList.remove('hidden');
    });
}

// Simulasi Simpan Akun di LocalStorage
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('regNama').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        localStorage.setItem('user_' + email, JSON.stringify({ nama, email, password }));
        alert('Pendaftaran berhasil! Silakan login.');
        formRegister.classList.add('hidden');
        formLogin.classList.remove('hidden');
    });
}

// Proses Login
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const userData = JSON.parse(localStorage.getItem('user_' + email));

        if (userData && userData.password === password) {
            localStorage.setItem('sessionUser', userData.nama);
            window.location.href = 'dashboard.html';
        } else {
            alert('Email atau Password salah!');
        }
    });
}

// Logika Halaman Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const sessionUser = localStorage.getItem('sessionUser');
    if (!sessionUser) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userNama').innerText = sessionUser;
    }

    // Update Jam Real-time
    function updateJam() {
        const sekarang = new Date();
        const elJam = document.getElementById('jam');
        if (elJam) elJam.innerText = sekarang.toLocaleTimeString('id-ID');
    }
    setInterval(updateJam, 1000);
    updateJam();

    // Absen Masuk
    const formAbsen = document.getElementById('formAbsen');
    if (formAbsen) {
        formAbsen.addEventListener('submit', (e) => {
            e.preventDefault();
            const waktu = new Date().toLocaleTimeString('id-ID');
            const li = document.createElement('li');
            li.innerHTML = `<b>${sessionUser}</b> - Absen pada ${waktu}`;
            document.getElementById('daftarHadir').appendChild(li);
        });
    }

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('sessionUser');
        window.location.href = 'index.html';
    });
}