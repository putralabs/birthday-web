# Screenshots

Diambil otomatis dari alur asli app dalam mode `?as=birthday`
(viewport desktop 1280×800).

| File | Halaman |
| ---- | ------- |
| `00-countdown.png` | Opening countdown (`?as=before`, sebelum hari H) |
| `01-opening.png` | Opening ulang tahun |
| `02-envelope.png` | Amplop digital tertutup |
| `03-envelope-open.png` | Amplop terbuka + surat |
| `04-room.png` | Birthday room |
| `05-room-wishes.png` | Toples harapan |
| `06-room-gift.png` | Hadiah terbuka |
| `07-cake.png` | Kue + lilin menyala |
| `07b-cake-out.png` | Kue, semua lilin padam |
| `08-celebration.png` | Pesan selebrasi (confetti + fireworks) |
| `09-letter.png` | Surat pribadi |
| `10-memories.png` | Galeri kenangan |
| `11-final.png` | Layar akhir |

## Regenerate

Butuh browser Chromium sekali saja (pakai Playwright, di luar repo
biar `package.json` tetap bersih):

```bash
# 1. dari folder repo
npm run build

# 2. di folder temp terpisah
npm init -y
npm i playwright@1.63.0
npx playwright install --only-shell chromium

# 3. jalankan dev server repo (mode ?as=birthday cuma jalan di dev)
npx vite --port 5173 --strictPort   # dari folder repo

# 4. jalankan skrip shot (lihat riwayat commit untuk versi terakhir)
SHOT_OUT="<repo>/screenshots" SHOT_BASE="http://localhost:5173" node shot.js
```

> Catatan: `?as=birthday` hanya berlaku di `vite dev`, bukan di
> `vite preview` / production build.
