document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('activationForm');
    const emailInput = document.getElementById('email');
    const linkInput = document.getElementById('link');
    const sendLinkBtn = document.getElementById('sendLinkBtn');
    const submitBtn = document.getElementById('submitBtn');
    const statusNotif = document.getElementById('statusNotif');

    // 1. Fungsi Kirim Link Login Email AM
    async function sendLoginLink(email) {
        if (!email) {
            statusNotif.className = 'status-message msg-error';
            statusNotif.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Masukkan email terlebih dahulu.';
            return;
        }

        sendLinkBtn.disabled = true;
        sendLinkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
        statusNotif.className = 'status-message msg-loading';
        statusNotif.textContent = 'Mengirim link login ke email...';

        try {
            // Ubah endpoint jika API kirim link Anda menggunakan URL berbeda (contoh: /api/send)
            const response = await axios.post('https://alight.quietxhub.my.id/api/send', {
                email: email
            });

            statusNotif.className = 'status-message msg-success';
            statusNotif.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${response.data.message || 'Link login berhasil dikirim! Silakan periksa inbox/spam email Anda.'}`;
        } catch (error) {
            console.error('Error saat kirim link:', error);
            statusNotif.className = 'status-message msg-error';

            if (error.response && error.response.data && error.response.data.message) {
                statusNotif.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal: ${error.response.data.message}`;
            } else {
                statusNotif.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Gagal mengirim link. Periksa kembali email Anda.`;
            }
        } finally {
            sendLinkBtn.disabled = false;
            sendLinkBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Link Login Email';
        }
    }

    // 2. Fungsi Verifikasi Aktivasi
    async function verifyLink(email, link) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        statusNotif.className = 'status-message msg-loading';
        statusNotif.textContent = 'Menghubungkan ke server...';

        try {
            const response = await axios.post('https://alight.quietxhub.my.id/api/verify', {
                email: email,
                link: link
            });

            statusNotif.className = 'status-message msg-success';
            statusNotif.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${response.data.message || 'Aktivasi berhasil diproses!'}`;
            form.reset();
        } catch (error) {
            console.error('Error verifikasi:', error);
            statusNotif.className = 'status-message msg-error';
            
            if (error.response && error.response.data && error.response.data.message) {
                statusNotif.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal: ${error.response.data.message}`;
            } else {
                statusNotif.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Terjadi kesalahan jaringan atau API tidak merespons.`;
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Aktivasi Sekarang';
        }
    }

    // Event Listener Klik Tombol "Kirim Link Login Email"
    sendLinkBtn.addEventListener('click', () => {
        const emailValue = emailInput.value.trim();
        sendLoginLink(emailValue);
    });

    // Event Listener Submit Form "Aktivasi Sekarang"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = emailInput.value.trim();
        const linkValue = linkInput.value.trim();

        if (emailValue && linkValue) {
            verifyLink(emailValue, linkValue);
        } else {
            statusNotif.className = 'status-message msg-error';
            statusNotif.textContent = 'Harap isi semua kolom dengan benar.';
        }
    });
});
