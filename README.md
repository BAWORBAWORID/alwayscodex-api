# alwayscodex-api

Official Node.js & ES Module (ESM) SDK for **AlwaysCodex REST API** (`https://api.alwayscodex.my.id`).  
A lightweight, zero-dependency, universal JavaScript client supporting AI models, downloaders, image tools, canvas generators, CORS proxy, binary media (image/audio/video) downloads, real-time SSE streaming (Agent API), and file uploads.

---

## 📦 Installation

```bash
# Install directly via Git/GitHub
npm install github:BAWORBAWORID/alwayscodex-api

# Or install via npm (once published)
npm install alwayscodex-api
```

---

## 🚀 Cara Import & Penggunaan

Modul ini mendukung dua format standar Node.js secara otomatis: **CommonJS (`CJS`)** dan **ES Modules (`ESM`)**.

### 1. CommonJS (`require`) — Untuk proyek Node.js biasa (`.cjs` atau tanpa `type: module`)
```javascript
// Bisa dengan destructuring ataupun langsung:
const { codex } = require('alwayscodex-api');
// atau: const codex = require('alwayscodex-api');

async function run() {
  await codex.syncPromise;

  // 1. Memanggil AI (Mendukung input string atau object { text: '...' })
  const ai = await codex.ai.deepseek('Halo DeepSeek');
  console.log(ai);

  // 2. Memanggil Downloader
  const tt = await codex.downloader.tiktok('https://vt.tiktok.com/xxxx');
  console.log(tt);
}
run();
```

### 2. ES Modules (`import`) — Untuk proyek modern (`.mjs` atau `type: module`)
```javascript
// Bisa dengan named import ataupun default import:
import { codex } from 'alwayscodex-api';
// atau: import codex from 'alwayscodex-api';

async function run() {
  await codex.syncPromise;

  // Panggilan langsung dengan instance default
  const gpt = await codex.ai.gpt4({ text: 'Siapa penemu lampu?' });
  console.log(gpt);
}
run();
```

---

## ⚡ Real-Time Streaming (`SSE`) & Agent API (`/v1/chat/completions`)

Modul ini memiliki dukungan penuh terhadap **Server-Sent Events (`text/event-stream`)** dan **Agent API** (`/v1/models` & `/v1/chat/completions`). Anda bisa menerima teks chunk demi chunk secara *real-time* tanpa harus menunggu seluruh respons selesai.

### 1. Menggunakan `codex.stream()` (AsyncGenerator)
```javascript
const { AlwaysCodex } = require('alwayscodex-api');
const codex = new AlwaysCodex({ apiKey: 'YOUR_API_KEY' });

async function chatStream() {
  const stream = codex.stream('/v1/chat/completions', {
    model: 'cutad-agent',
    messages: [{ role: 'user', content: 'Buatkan puisi pendek.' }],
    stream: true
  });

  // Iterasi chunk secara real-time:
  for await (const chunk of stream) {
    if (chunk.choices?.[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}
chatStream();
```

### 2. Menggunakan Callback `onChunk`
```javascript
await codex.agent.chatCompletions({
  model: 'cutad-agent',
  messages: [{ role: 'user', content: 'Halo' }],
  stream: true
}, {
  onChunk: (chunk) => {
    process.stdout.write(chunk.choices?.[0]?.delta?.content || '');
  }
});
```

---

## 🖼️ Penanganan Respons Binary (Gambar/Audio/Video/File)

Modul `alwayscodex-api` dilengkapi dengan detektor `Content-Type` otomatis.  
Jika sebuah endpoint mengembalikan data biner (seperti gambar **JPG/PNG/WEBP**, audio **MP3/WAV**, video **MP4**, atau file **ZIP/PDF**), SDK tidak akan mengubahnya menjadi string berantakan, melainkan **langsung mengembalikan object `Buffer` (di Node.js) atau `ArrayBuffer` (di Browser)**!

### Contoh Mengunduh & Menyimpan Gambar Canvas/Image HD:
```javascript
const fs = require('fs');
const codex = require('alwayscodex-api');

async function generateAndSave() {
  await codex.syncPromise;

  const imageBuffer = await codex.canvas.brat('Hello AlwaysCodex');
  fs.writeFileSync('output_brat.png', imageBuffer);
  console.log('✔ Gambar berhasil disimpan sebagai output_brat.png');
}
generateAndSave();
```

---

## ⚡ Shortcut Methods (`GET`, `POST`, `OPTIONS`, `UPLOAD`)

Modul ini menyediakan *shortcut method* untuk segala jenis HTTP Verb dan pengunggahan file:

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
// Akses web langsung melalui server proxy (Belanda/Jerman):
const proxy = await codex.tools.proxy('https://ipinfo.io/json');
console.log('IP Terdeteksi:', proxy.ip);
```

### 2. Startup Auto-Load Semua Endpoint (`/openapi.json`)
Saat modul pertama kali di-import atau saat `new AlwaysCodex()` dibuat, SDK otomatis memuat spesifikasi lengkap dari `GET https://api.alwayscodex.my.id/openapi.json`.  
Seluruh **296+ endpoint** dan **25+ kategori** langsung didaftarkan menjadi method konkret secara otomatis pada object `codex`:
```javascript
codex.<kategori>.<action>(params)
```

---

## 📄 License
MIT © BAWORBAWORID
