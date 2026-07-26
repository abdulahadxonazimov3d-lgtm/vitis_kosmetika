exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const messages = {
    uz: {
      method: "Faqat POST so‘rovi qabul qilinadi.",
      invalid: "So‘rov ma’lumotlari noto‘g‘ri formatda.",
      required: "Majburiy maydonlarni to‘ldiring.",
      quantity: "Miqdor 1 dan 20 gacha bo‘lishi kerak.",
      config: "Telegram sozlamalari kiritilmagan.",
      send: "Buyurtmani Telegramga yuborishda xatolik yuz berdi."
    },
    ru: {
      method: "Разрешён только POST-запрос.",
      invalid: "Данные запроса имеют неверный формат.",
      required: "Заполните обязательные поля.",
      quantity: "Количество должно быть от 1 до 20.",
      config: "Настройки Telegram не указаны.",
      send: "Не удалось отправить заказ в Telegram."
    },
    en: {
      method: "Only POST requests are allowed.",
      invalid: "The request data is invalid.",
      required: "Please complete all required fields.",
      quantity: "Quantity must be between 1 and 20.",
      config: "Telegram settings are missing.",
      send: "The order could not be sent to Telegram."
    }
  };

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ message: messages.uz.invalid }) };
  }

  const lang = ["uz", "ru", "en"].includes(payload.lang) ? payload.lang : "uz";
  const m = messages[lang];

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: "POST" },
      body: JSON.stringify({ message: m.method })
    };
  }

  const { name, phone, region, quantity } = payload;
  if (!name || !phone || !region || !quantity) {
    return { statusCode: 400, headers, body: JSON.stringify({ message: m.required }) };
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    return { statusCode: 400, headers, body: JSON.stringify({ message: m.quantity }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: m.config }) };
  }

  const clean = (value, max = 120) =>
    String(value).replace(/[<>]/g, "").trim().slice(0, max);

  const labels = {
    uz: { title: "🧴 YANGI KOSMETIK MAHSULOT BUYURTMASI", product: "Mahsulot", name: "Ism", phone: "Telefon", region: "Hudud", qty: "Miqdor", unit: "dona", date: "Sana" },
    ru: { title: "🧴 НОВЫЙ ЗАКАЗ КОСМЕТИЧЕСКОГО ПРОДУКТА", product: "Продукт", name: "Имя", phone: "Телефон", region: "Регион", qty: "Количество", unit: "шт.", date: "Дата" },
    en: { title: "🧴 NEW COSMETIC PRODUCT ORDER", product: "Product", name: "Name", phone: "Phone", region: "Region", qty: "Quantity", unit: "pcs", date: "Date" }
  }[lang];

  const locale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-GB" : "uz-UZ";
  const text = [
    labels.title,
    "",
    `📦 ${labels.product}: Vitis Vinifera cosmetic grape seed oil, 30 ml`,
    `👤 ${labels.name}: ${clean(name, 80)}`,
    `📞 ${labels.phone}: ${clean(phone, 30)}`,
    `📍 ${labels.region}: ${clean(region, 100)}`,
    `🔢 ${labels.qty}: ${qty} ${labels.unit}`,
    "",
    `🕒 ${labels.date}: ${new Date().toLocaleString(locale, { timeZone: "Asia/Tashkent" })}`
  ].join("\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });

    const telegramBody = await telegramResponse.json().catch(() => ({}));
    if (!telegramResponse.ok || telegramBody.ok === false) {
      throw new Error("Telegram send failed");
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 502, headers, body: JSON.stringify({ message: m.send }) };
  }
};
