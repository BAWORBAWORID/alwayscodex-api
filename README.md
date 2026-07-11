# alwayscodex-api

Official Node.js & ES Module (ESM) SDK for **AlwaysCodex REST API** (`https://api.alwayscodex.my.id`).  
A lightweight, zero-dependency, universal JavaScript client supporting AI models, downloaders, image tools, canvas generators, CORS proxy, binary media (image/audio/video) downloads, real-time SSE streaming (Agent API), and file uploads.

---

## 📦 Installation

```bash
npm install alwayscodex-api
```

---

## 🚀 Cara Import & Penggunaan (`ESM` & `CJS`)

Modul ini mendukung dua gaya pemanggilan: **langsung lewat instance default (`codex.ai...`)** atau **membuat instance baru sebagai fungsi (`const api = codex({ apiKey: '...' })`)**.  
Proses sinkronisasi endpoint dari `/openapi.json` **sudah tertanam otomatis di dalam `client.js`**, sehingga Anda **TIDAK PERLU LAGI** menuliskan `await codex.syncPromise;`!

### 1. ES Modules (`import`) — `.mjs` atau `type: module`
```javascript
import codex from "alwayscodex-api";

// 1. Membuat instance baru lewat pemanggilan fungsi codex()
const api = codex(); // Bisa juga custom API Key: codex({ apiKey: 'YOUR_KEY' })

async function run() {
  // Panggilan langsung tanpa perlu await syncPromise!
  const ai = await codex.ai.deepseek('Halo DeepSeek dari ESM');
  console.log(ai);

  // Atau lewat instance api()
  const gpt = await api.ai.gpt4({ text: 'Siapa penemu lampu?' });
  console.log(gpt);
}
run();
```

### 2. CommonJS (`require`) — `.cjs` atau Node.js standar
```javascript
const codex = require("alwayscodex-api");

const api = codex();

async function run() {
  // Langsung panggil AI / Downloader kapan saja
  const ai = await codex.ai.deepseek('Halo DeepSeek dari CJS');
  console.log(ai);

  const tt = await api.downloader.tiktok('https://vt.tiktok.com/xxxx');
  console.log(tt);
}
run();
```

---

## 🔑 Cara Pemakaian: Tanpa API Key vs Dengan API Key

Modul ini sangat fleksibel dan dapat digunakan baik untuk endpoint gratis biasa maupun endpoint premium/admin yang memerlukan otorisasi **API Key**:

### 1. Tanpa API Key (`No API Key` — untuk Endpoint Umum / Gratis)
Anda dapat langsung memanggil kategori & aksi apapun tanpa perlu setup otorisasi:
```javascript
import codex from "alwayscodex-api";

async function testFree() {
  // Langsung panggil AI, Downloader, atau Maker gratis
  const ai = await codex.ai.deepseek("Halo, siapa presiden pertama Indonesia?");
  console.log("✔ Respons AI:", ai);

  const tiktok = await codex.downloader.tiktok("https://vt.tiktok.com/ZSjRk1D8X/");
  console.log("✔ Video TikTok URL:", tiktok.result?.video);
}
testFree();
```

### 2. Dengan API Key (`With API Key` — untuk Endpoint Premium / Admin)
Untuk endpoint premium seperti **`am.bulk`**, **`imagehd.super_resolution`**, **`payment.pakasir`**, atau manajemen admin, cukup passing parameter `apiKey` saat menginisialisasi `codex(...)`:
```javascript
import codex from "alwayscodex-api";

// Inisialisasi dengan API Key Premium / Admin Anda (kosongkan atau ganti dengan key Anda)
const api = codex({ apiKey: "YOUR_API_KEY" });

async function testPremium() {
  // 1. Memanggil AlightMotion Bulk Email Generator (Premium)
  const bulk = await api.am.bulk(1); // Atau api.am.bulk({ count: 1 })
  console.log("✔ Email AM:", bulk.result.email);
  console.log("✔ Link Inbox:", bulk.result.inboxUrl);

  // 2. Memanggil Super Resolution Image HD Upscaler (Premium)
  const hdBuffer = await api.imagehd.super_resolution("https://cdn.yupra.my.id/yp/7ihn1v2f.jpg");
  console.log("✔ Ukuran Gambar HD:", hdBuffer.length, "bytes");
}
testPremium();
```

---

## 🎨 4 Gaya Pemanggilan Fleksibel (`v1.0.2+`)

SDK dilengkapi dengan **Smart Name Normalizer**. Anda bebas menuliskan nama action dalam **4 gaya berbeda** dan semuanya otomatis terhubung ke endpoint yang tepat (`No more SyntaxError`!):

```javascript
import codex from "alwayscodex-api";

async function testSyntax() {
  // 1. Gaya Langsung (Direct Category call)
  const res1 = await codex.imagehd("https://cdn.yupra.my.id/yp/7ihn1v2f.jpg");

  // 2. Gaya Underscore (snake_case)
  const res2 = await codex.imagehd.super_resolution("https://cdn.yupra.my.id/yp/7ihn1v2f.jpg");

  // 3. Gaya CamelCase (superResolution / fakeNotif)
  const res3 = await codex.maker.fakeNotif({ name: "Codex", message: "Hello!" });

  // 4. Gaya Bracket Notation (dengan Spasi atau Hyphen)
  const res4 = await codex.maker["fake notif"]({ name: "Codex", message: "Hello!" });
  const res5 = await codex.maker["fake-notif-wa"]({ name: "Codex", message: "Hello!" });
}
```

---

## 📦 Handling Respons: JSON vs Image vs Video/Audio

Modul `alwayscodex-api` memiliki **detektor `Content-Type` cerdas di balik layar**. Anda tidak perlu pusing membedakan cara mengambil `res.json()` atau `res.arrayBuffer()`, karena SDK akan otomatis mengembalikan format data yang tepat:

### 1. Contoh Respons JSON (`Object / Array`)
Jika endpoint mengembalikan data teks / JSON (seperti AI, Downloader, Search, Tools):
```javascript
const res = await codex.ai.gpt4("Apa ibukota Jepang?");
/* Respons JSON Otomatis:
{
  "statusCode": 200,
  "result": "Ibukota Jepang adalah Tokyo."
}
*/
console.log(res.result);
```

### 2. Contoh Respons Gambar / Image (`Buffer JPG / PNG / WEBP`)
Jika endpoint menghasilkan gambar (seperti **Canvas**, **Maker**, **Image HD**, **Anime**), SDK langsung mengembalikan **Node.js `Buffer`** yang bisa langsung disimpan ke file atau dikirim ke Bot Telegram/WhatsApp:
```javascript
import fs from "fs";
import codex from "alwayscodex-api";

async function saveImage() {
  // Mengambil gambar meme dari Canvas / Maker
  const imageBuffer = await codex.maker.fakenotif({
    name: "Bot WhatsApp",
    message: "Halo, jangan lupa makan ya 💕"
  });

  // Karena responsnya adalah Buffer, kita bisa langsung save atau kirim!
  fs.writeFileSync("fakenotif.jpg", imageBuffer);
  console.log("✔ Gambar berhasil disimpan, ukuran:", imageBuffer.length, "bytes");
}
saveImage();
```

### 3. Contoh Respons Video & Audio (`Buffer MP4 / MP3 / WAV`)
Jika endpoint mengembalikan media audio atau video secara langsung (seperti **Wink HD Video**, **TTS / Sound Engine**, **Media Downloader Buffer**):
```javascript
import fs from "fs";
import codex from "alwayscodex-api";

async function saveMedia() {
  // Contoh menerima respons binary Video MP4 / Audio MP3
  const mediaBuffer = await codex.hdvidio["wink-hd-video"]({
    url: "https://example.com/sample.mp4"
  });

  if (Buffer.isBuffer(mediaBuffer)) {
    fs.writeFileSync("output_video.mp4", mediaBuffer);
    console.log("✔ Video MP4 berhasil disimpan berukuran:", (mediaBuffer.length / 1024 / 1024).toFixed(2), "MB");
  }
}
saveMedia();
```

---

## ⚡ Shortcut Methods (`GET`, `POST`, `OPTIONS`, `UPLOAD`)

```javascript
import codex from 'alwayscodex-api';

// 1. GET Request
const getRes = await codex.get('/api/ai/gpt4', { teks: 'Halo via GET' });

// 2. POST Request (JSON / Body)
const postRes = await codex.post('/api/tools/password-generator', { length: 16 });

// 3. OPTIONS Request (CORS / Preflight Check)
const optRes = await codex.options('/api/tools/proxy', { url: 'https://example.com' });

// 4. Upload File langsung dari Path lokal / Buffer / Blob (POST multipart/form-data)
const uploadRes = await codex.upload('./gambar.png', { exp: 10, unit: 'menit' });
console.log('URL Download:', uploadRes.result.url);
```

---

## 🌐 Fitur Proxy & Startup Auto-Load dari `/openapi.json`

### 1. Mengakses Website via CORS Proxy
```javascript
const proxy = await codex.tools.proxy('https://ipinfo.io/json');
console.log('IP Terdeteksi:', proxy.ip);
```

### 2. Startup Auto-Load & Smart Parameter Mapping
Saat modul di-load, SDK otomatis memuat spesifikasi lengkap dari `/openapi.json`. Seluruh **296+ endpoint** langsung dapat dipanggil dengan mudah:
```javascript
codex.<kategori>.<action>(params)
```

Semua parameter otomatis diselaraskan (baik string maupun `{ text: "..." }`) sesuai skema resmi dari OpenAPI!

---

## 📄 License
MIT © AlwaysCodex
