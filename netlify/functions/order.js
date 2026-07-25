exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'POST' },
      body: JSON.stringify({ message: 'Faqat POST so‘rovi qabul qilinadi.' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'So‘rov ma’lumotlari noto‘g‘ri formatda.' })
    };
  }

  const { name, phone, region, quantity } = payload;

  if (!name || !phone || !region || !quantity) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Majburiy maydonlarni to‘ldiring.' })
    };
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Miqdor 1 dan 20 gacha bo‘lishi kerak.' })
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Telegram sozlamalari kiritilmagan.' })
    };
  }

  const clean = (value, max = 120) =>
    String(value).replace(/[<>]/g, '').trim().slice(0, max);

  const text = [
    '🧴 YANGI KOSMETIK MAHSULOT BUYURTMASI',
    '',
    '📦 Mahsulot: Vitis Vinifera kosmetik uzum urug‘i moyi, 30 ml',
    `👤 Ism: ${clean(name, 80)}`,
    `📞 Telefon: ${clean(phone, 30)}`,
    `📍 Hudud: ${clean(region, 100)}`,
    `🔢 Miqdor: ${qty} dona`,
    '',
    `🕒 Sana: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`
  ].join('\n');

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true
        })
      }
    );

    const telegramBody = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || telegramBody.ok === false) {
      throw new Error('Telegram xabari yuborilmadi');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        message: 'Buyurtmani Telegramga yuborishda xatolik yuz berdi.'
      })
    };
  }
};
