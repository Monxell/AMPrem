document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('activationForm');
    const emailInput = document.getElementById('email');
    const linkInput = document.getElementById('link');
    const submitBtn = document.getElementById('submitBtn');
    const statusNotif = document.getElementById('statusNotif');

    // Fungsi verifikasi sesuai API yang Anda minta
    async function verifyLink(email, link) {
        // Set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        statusNotif.className = 'status-message msg-loading';
        statusNotif.textContent = 'Menghubungkan ke server...';

        try {
            // POST request ke API Anda
            const response = await axios.post('https://alight.quietxhub.my.id/api/verify', {
                email: email,
                link: link
            });

            // Handle respons sukses
            statusNotif.className = 'status-message msg-success';
            statusNotif.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${response.data.message || 'Aktivasi berhasil diproses!'}`;
            
            // Opsional: Kosongkan form jika berhasil
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            // Handle pesan error
            statusNotif.className = 'status-message msg-error';
            
            if (error.response && error.response.data && error.response.data.message) {
                statusNotif.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal: ${error.response.data.message}`;
            } else {
                statusNotif.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Terjadi kesalahan jaringan atau API tidak merespons.`;
            }
        } finally {
            // Kembalikan tombol ke keadaan semula
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Aktivasi Sekarang';
        }
    }

    // Tangkap aksi submit form
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
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
