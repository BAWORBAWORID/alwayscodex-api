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

## ⚡ Real-Time Streaming (`SSE`) & Agent API (`/v1/chat/completions`)

Modul ini memiliki dukungan penuh terhadap **Server-Sent Events (`text/event-stream`)** dan **Agent API** (`/v1/models` & `/v1/chat/completions`). Anda bisa menerima teks chunk demi chunk secara *real-time*.

### 1. Menggunakan `codex.stream()` (AsyncGenerator)
```javascript
const codex = require('alwayscodex-api');
const api = codex({ apiKey: 'YOUR_API_KEY' });

async function chatStream() {
  const stream = api.stream('/v1/chat/completions', {
    model: 'cutad-agent',
    messages: [{ role: 'user', content: 'Buatkan puisi pendek.' }],
    stream: true
  });

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
Jika sebuah endpoint mengembalikan data biner (seperti gambar **JPG/PNG/WEBP**, audio **MP3/WAV**, video **MP4**, atau file **ZIP/PDF**), SDK langsung mengembalikan object **Node.js `Buffer`** siap pakai!

```javascript
const fs = require('fs');
const codex = require('alwayscodex-api');

async function generateAndSave() {
  const imageBuffer = await codex.canvas.brat('Hello AlwaysCodex');
  fs.writeFileSync('output_brat.png', imageBuffer);
  console.log('✔ Gambar berhasil disimpan sebagai output_brat.png');
}
generateAndSave();
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
MIT © BAWORBAWORID
