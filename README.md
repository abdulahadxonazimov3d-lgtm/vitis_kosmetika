# Vitis Vinifera — kosmetika uchun sayt (Netlify)

Sayt dizayni va tarkibi o‘zgartirilmagan. Telegram buyurtma funksiyasi GitHub → Netlify uchun moslashtirilgan.

## GitHub orqali Netlify’ga joylash

1. Ushbu papkadagi barcha fayllarni GitHub repository’ning asosiy qismiga yuklang.
2. Netlify’da **Add new project → Import an existing project** ni tanlang.
3. GitHub repository’ni ulang.
4. Build sozlamalari avtomatik ravishda `netlify.toml` faylidan olinadi:
   - Build command: bo‘sh
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Netlify’da **Site configuration → Environment variables** bo‘limiga quyidagilarni kiriting:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
6. Environment variable kiritilgandan keyin **Trigger deploy → Deploy site** orqali qayta deploy qiling.

## Muhim fayllar

- `index.html` — sayt sahifasi
- `styles.css` — dizayn
- `script.js` — mobil menyu va Netlify funksiyasiga buyurtma yuborish
- `netlify/functions/order.js` — Telegram botga buyurtma yuboruvchi Netlify Function
- `netlify.toml` — Netlify deploy sozlamalari
- `assets/product-cosmetic.png` — mahsulot rasmi
- `assets/vitis-logo.png` — logotip

## Ijtimoiy tarmoqlar

`index.html` ichidagi `USERNAME` yozilgan Instagram, Telegram, YouTube va Facebook havolalarini haqiqiy sahifa manzillari bilan almashtiring.
