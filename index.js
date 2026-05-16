import express from "express";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN?.trim();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";
const KNOWLEDGE_URL = (process.env.KNOWLEDGE_URL || "").trim();

if (!BOT_TOKEN || !OPENROUTER_API_KEY) {
  console.error("❌ ENV belum lengkap. Isi BOT_TOKEN dan OPENROUTER_API_KEY di Render.");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const ai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.get("/", (req, res) => {
  res.send("Bot AI template jualan aktif ✅");
});

app.get("/ping", (req, res) => {
  console.log(`[${new Date().toLocaleString("id-ID")}] Ping dari UptimeRobot`);
  res.send("pong");
});

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("📩 UPDATE MASUK:", JSON.stringify(req.body));
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

async function ambilKnowledgeDariLink() {
  if (!KNOWLEDGE_URL) return "";

  try {
    const { data } = await axios.get(KNOWLEDGE_URL, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    $("script, style, nav, footer, header").remove();

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 7000);

    return text;
  } catch (err) {
    console.error("❌ Error Gemini/Telegram:", err?.message || err);

    await bot.sendMessage(
      chatId,
      "❌ Gemini quota habis bro. Coba ganti GEMINI_API_KEY di Render atau aktifkan billing Google Cloud."
    );
  }

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Halo bosku 😎\n\nGua bisa bantu bikin:\n✅ Template jualan\n✅ Caption TikTok/Shopee\n✅ Script video pendek\n✅ Hashtag\n✅ Soft selling / hard selling\n✅ Versi broadcast WA/Telegram\n\nContoh perintah:\nBikinin 5 template jualan kaos oversize, gaya santai, target cowok 18-30 tahun\n\nAtau:\nBikin caption TikTok produk fashion, jangan terlalu lebay, ada CTA keranjang kuning`
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text || text.startsWith("/start")) return;

  try {
    await bot.sendMessage(chatId, "✍️ Lagi gua bikinin bro...");

    const knowledge = await ambilKnowledgeDariLink();    
    const prompt = `
Kamu adalah AI copywriter Telegram Indonesia.
Gunakan knowledge berikut jika relevan:
${knowledge}

Tugas utama:
- Membantu user membuat template promosi dan penjualan yang menarik.
- Bisa membuat caption TikTok, caption Shopee, broadcast WhatsApp, broadcast Telegram, script video pendek, headline, CTA, dan hashtag.
- Jawab dengan bahasa Indonesia santai, natural, dan mudah dipakai.
- Hasil harus bervariasi, tidak kaku, dan tidak terasa copy-paste.
- Gunakan emoji seperlunya.
- Format harus rapi dan mudah dicopy.
- Kalau user minta beberapa variasi, buat variasi yang benar-benar beda gaya.
- Jangan terlalu panjang kecuali user meminta detail.

Catatan keamanan:
- Jangan mengaku sebagai manusia asli.
- Jangan meminta data sensitif seperti password, OTP, PIN, atau rekening.
- Kalau promosi berhubungan dengan hal berisiko, tetap gunakan bahasa promosi umum tanpa klaim palsu berlebihan.

Request user:
${text}
`;

  model: OPENROUTER_MODEL,
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const hasil =
  response.choices?.[0]?.message?.content ||
  "Maaf bro, hasil kosong.";

    await bot.sendMessage(chatId, hasil, {
      disable_web_page_preview: true,
    });
   } catch (err) {
    console.error("❌ Error Gemini/Telegram:", err?.message || err);
    await bot.sendMessage(chatId, `❌ Error asli:\n${err?.message || "Unknown error"}`);
  }
});

function keepAliveLog() {
  console.log(`[${new Date().toLocaleString("id-ID")}] 🤖 Bot AI masih hidup`);
}

app.listen(PORT, async () => {
  console.log(`✅ Server jalan di port ${PORT}`);
  console.log("✅ OpenRouter aktif");

  const url = "https://tanya-jawab.onrender.com/webhook";

  await bot.deleteWebHook({ drop_pending_updates: true });
  await bot.setWebHook(url);

  console.log(`✅ Webhook aktif: ${url}`);

  keepAliveLog();

  setInterval(() => {
    keepAliveLog();
  }, 3 * 60 * 60 * 1000);
});
