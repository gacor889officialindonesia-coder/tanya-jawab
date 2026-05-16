# Telegram AI Template Bot

Bot Telegram AI untuk bikin template penjualan, caption TikTok/Shopee, broadcast WA/Telegram, script video pendek, CTA, dan hashtag.

## 1. Buat Telegram Bot

Buka BotFather:

```text
https://t.me/BotFather
```

Ketik:

```text
/newbot
```

Simpan token bot sebagai `BOT_TOKEN`.

## 2. Buat Gemini API Key

Buka Google AI Studio:

```text
https://aistudio.google.com/app/apikey
```

Klik Create API Key, lalu simpan sebagai `GEMINI_API_KEY`.

## 3. Upload ke GitHub

Upload semua file ini ke repo GitHub:

```text
index.js
package.json
.gitignore
README.md
```

## 4. Deploy ke Render

- New Web Service
- Connect repo GitHub
- Build Command: `npm install`
- Start Command: `npm start`

## 5. ENV di Render

Isi Environment Variables:

```env
BOT_TOKEN=token_dari_botfather
GEMINI_API_KEY=api_key_dari_google_ai_studio
GEMINI_MODEL=gemini-2.5-flash-lite
```

`GEMINI_MODEL` opsional. Kalau dikosongkan, otomatis pakai `gemini-2.5-flash-lite`.

## 6. UptimeRobot

Buat monitor HTTP(s):

```text
https://nama-app-render-lu.onrender.com/ping
```

Interval 5 menit.

## 7. Cara pakai di Telegram

Contoh:

```text
Bikinin 5 template jualan kaos oversize, gaya santai, target cowok 18-30 tahun
```

```text
Bikin caption TikTok produk fashion, jangan terlalu lebay, ada CTA keranjang kuning
```

```text
Bikin 3 variasi broadcast WA, soft selling, promo beli 3 cuma 100 ribu
```
