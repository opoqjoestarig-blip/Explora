# EKSPLORA v8.5 — Riwayat Otomatis + Aspirasi Bertujuan

Paket website EKSPLORA berbasis HTML, CSS, dan JavaScript. Versi ini memperbaiki menu gabungan dan menambahkan formulir Create, Read, Update, Delete (CRUD) pada modul pengelolaan utama.

## Akun demo
Semua kata sandi akun demo sama dengan username.

| Peran | Username | Kata sandi |
|---|---|---|
| Siswa | `siswa1` s.d. `siswa5` | sama dengan username |
| Kepala Sekolah | `kepsek` | `kepsek` |
| Wakasek Kesiswaan | `wakasek` | `wakasek` |
| Guru Pembina | `pembina1` s.d. `pembina3` | sama dengan username |
| Operator Sekolah | `operator` | `operator` |
| Orang Tua | `orangtua1` s.d. `orangtua5` | sama dengan username |

## Perubahan menu
- Siswa: halaman Aktivitas Saya menggabungkan pendaftaran, keanggotaan, dan jadwal; Informasi dan Aspirasi menggabungkan pengumuman dan pengiriman aspirasi.
- Kepala Sekolah: 10 halaman menu, dengan akses monitoring/baca sesuai peran.
- Wakasek Kesiswaan: 10 halaman menu dengan pengelolaan operasional.
- Operator Sekolah: halaman Backup dan Pemulihan tidak tersedia.
- Guru Pembina dan Orang Tua tetap memiliki menu sesuai peran.

## CRUD yang tersedia
- Ekstrakurikuler: tambah, baca, edit, buka/tutup pendaftaran, aktifkan/nonaktifkan.
- Akun: Operator dapat menambah, membaca, mengedit, dan menghapus akun tambahan. Akun demo bawaan dilindungi.
- Guru Pembina: kelola data pembina dan penugasan.
- Jadwal/Agenda: tambah, baca, edit, hapus kegiatan.
- Presensi: tambah, baca, edit, hapus catatan kehadiran; siswa hanya melihat presensi miliknya.
- Anggota/Keanggotaan: tambah, baca, edit, hapus data keanggotaan.
- Evaluasi: tambah, baca, edit, hapus evaluasi perkembangan.
- Laporan Kegiatan: tambah, baca, edit, hapus laporan.
- Arahan dan Keputusan: tambah, baca, edit, hapus arahan/keputusan.
- Informasi dan Pengumuman: operator/wakasek dapat membuat, membaca, mengedit, mengarsipkan/menerbitkan, dan menghapus pengumuman.
- Aspirasi: pengirim memilih penerima spesifik (Kepala Sekolah, Wakasek, Guru Pembina tertentu, Operator) atau semua pihak sekolah; penerima dapat membaca, menandai telah dibaca, dan menghapus aspirasi yang masuk ke akunnya.
- Riwayat Kegiatan: kegiatan dari Jadwal dan Agenda otomatis tampil sehari setelah tanggal kegiatan lewat; riwayat menampilkan kehadiran dan tautan dokumentasi bila tersedia.
- Dokumentasi Kegiatan: tambah, baca, edit, hapus.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` dengan browser modern.
3. Masuk menggunakan salah satu akun demo di atas.
4. Uji fitur CRUD dari menu yang sesuai peran. Tombol tambah/edit/hapus tersedia di halaman pengelolaan.

## Penyimpanan dan batasan
Versi ini masih prototipe front-end. Data disimpan pada `localStorage` browser/perangkat, bukan database server. Perubahan tidak otomatis tersinkron antarperangkat dan akun/kata sandi demo tidak aman untuk produksi. Untuk penggunaan sekolah sesungguhnya, diperlukan backend, database bersama, autentikasi, dan pemeriksaan hak akses di server.
