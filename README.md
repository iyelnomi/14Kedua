[README.md](https://github.com/user-attachments/files/33415929/README.md)
# 💗 Memori Kita

Website kenangan berbentuk level game. Ada Level 1 sampai 12, dan tiap level
dibuka dengan menyelesaikan game kecil.

- **Level 1:** Game Ular (skor lebih dari 10 untuk membuka)
- **Level 2-12:** segera hadir

## Struktur file

| File         | Isi                                              |
|--------------|--------------------------------------------------|
| `index.html` | Kerangka halaman                                 |
| `style.css`  | Tampilan (tema terang dan gelap)                 |
| `script.js`  | Kenangan, daftar game, logika level, game ular   |

## Cara menjalankan

Buka `index.html` di browser. Tidak perlu install apa pun.

## Cara mengisi kenangan

Buka `script.js`, lalu edit bagian `MEMORIES`.

## Cara menambah game level baru

1. Buat fungsi game baru di `script.js`, mengikuti pola fungsi `snake`.
2. Daftarkan di `GAMES`, misalnya `2: { nama: "Nama Game", target: 10, run: namaFungsi }`.

## Hosting gratis dengan GitHub Pages

Repo → **Settings** → **Pages** → pilih branch `main` dan folder `/ (root)` → **Save**.
