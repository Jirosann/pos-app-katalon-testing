# Mini POS: Mobile Automation Testing dengan Katalon Studio

Aplikasi kasir sederhana berbasis React Native (Expo) yang saya buat sebagai objek pengujian, lalu diuji otomatis di Android menggunakan Katalon Studio. Proyek ini dikerjakan untuk tugas Mobile Application Automation Testing.

## Isi repo

```
app/               source aplikasi (Expo / React Native)
katalon-project/   project Katalon Studio (MiniPOS-Katalon)
docs/              dokumentasi test case dan hasil pengujian
screenshots/       bukti pelaksanaan pengujian
```

## Aplikasi

Fitur: login, daftar produk, keranjang (tambah, ubah qty, hapus), checkout dengan perhitungan kembalian, dan riwayat transaksi. Data disimpan di state aplikasi, jadi tidak ada backend dan riwayat kosong setiap aplikasi dibuka ulang.

Akun uji: username `kasir`, password `123456`.

Setiap elemen punya `testID` (jadi `resource-id` di Android), misalnya `input_username`, `btn_login`, `btn_checkout`. Locator di Katalon memakai atribut ini supaya tidak bergantung pada teks yang tampil.

### Menjalankan aplikasi

```bash
cd app
npm install
npx expo start
```

### Membuat APK untuk Katalon

Katalon butuh APK, Expo Go tidak bisa dipakai.

```bash
cd app
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Unduh APK hasil build lalu simpan di luar repo.

## Pengujian

Lingkungan:

- Katalon Studio 11.6.0
- Appium 2.19.0 dengan driver UiAutomator2 4.2.9
- Emulator Pixel 6, Android 14 (API 34)

Test case ada di `katalon-project/MiniPOS-Katalon/Test Cases`, dikelompokkan dalam test suite `TS_MiniPOS_Regression`:

| ID | Skenario | Hasil |
|----|----------|-------|
| TC01 | Login dengan kredensial valid | Pass |
| TC02 | Login dengan password salah | Pass |
| TC03 | Tambah satu produk ke keranjang | Pass |
| TC04 | Total dua produk | Pass |
| TC05 | Ubah qty dan cek subtotal | Pass |
| TC06 | Checkout dengan uang kurang | Pass |
| TC07 | Checkout dengan uang cukup, kembalian, dan riwayat | Pass |

Tiap test case punya assertion (`verifyElementExist`, `verifyElementText`, `verifyElementNotExist`). Run terakhir: 7 passed, 0 failed, durasi sekitar 4 menit. Detail langkah, analisis, dan kendala yang ditemui ada di folder `docs`.

### Menjalankan test

1. Nyalakan emulator dan pastikan `adb devices` menampilkan device.
2. Di Katalon, buka `katalon-project/MiniPOS-Katalon`.
3. Atur Appium directory di Preferences, Katalon, Mobile. Gunakan Appium 2.
4. Skrip test memanggil `Mobile.startApplication` dengan path APK `C:\Users\ASUS\Project\pos-app.apk`. Ubah path ini sesuai lokasi APK di komputer Anda.
5. Pilih Android dan device emulator, lalu jalankan `TS_MiniPOS_Regression`.

