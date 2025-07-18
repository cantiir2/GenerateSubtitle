# ✨ GenerateSubtitle

[![Vue.js](https://img.shields.io/badge/Vue-2.7.14-green.svg)](https://vuejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-blue.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-latest-blue.svg)](https://www.npmjs.com/)


> Generate Subtitle MKV with AI. This project uses Vue.js for the frontend and Express.js for the backend to generate subtitles for MKV videos using AI.

## ✨ Fitur Utama

* **Antarmuka Pengguna yang Ramah:**  Aplikasi web yang dirancang dengan Vue.js menyediakan antarmuka yang mudah digunakan untuk pengguna mengunggah video dan menghasilkan subtitle.
* **Pemrosesan Video:**  Integrasi dengan pustaka pemrosesan video memungkinkan aplikasi untuk memproses berkas video MKV.
* **Generasi Subtitle AI:**  Aplikasi ini memanfaatkan API AI (OpenAI, berdasarkan dependensi yang teridentifikasi) untuk menghasilkan teks subtitle dari audio video.
* **Parser Subtitle SRT:**  Menerjemahkan output AI mentah ke dalam format subtitle SRT yang standar industri.
* **Manajemen Status Aplikasi (Pinia):**  Menggunakan Pinia untuk manajemen state aplikasi yang efisien, terutama untuk alur kerja generasi subtitle.
* **Pengujian Unit (Vitest):**  Termasuk serangkaian pengujian unit untuk memastikan kualitas kode dan fungsionalitas.
* **Backend Service (Express.js):** Menangani pengolahan berkas, komunikasi dengan AI API, dan hal-hal backend lainnya.


## 🛠️ Tumpukan Teknologi

| Kategori         | Teknologi      | Catatan                                          |
|-----------------|-----------------|-------------------------------------------------|
| Frontend         | Vue.js          | Framework JavaScript untuk antarmuka pengguna       |
| Frontend         | TypeScript      | Bahasa pemrograman untuk mengetikkan frontend      |
| Frontend         | Pinia           | Library manajemen state                               |
| Backend          | Express.js      | Framework Node.js untuk server                 |
| Backend          | Node.js         | Runtime JavaScript untuk server                     |
| Pemrosesan Video | ffmpeg.js       | Library untuk manipulasi video                    |
| AI               | OpenAI          | API untuk generasi teks dari audio                  |
| Pengujian        | Vitest          | Framework pengujian unit                             |
| Manajemen Paket  | npm             | Manajer paket Node.js                               |
| Lain-lain       | Axios            | Library HTTP client untuk permintaan API             |
| Lain-lain       | SRT Parser      | Untuk menangani berkas subtitle SRT               |
| Lain-lain        | Multer          | Library untuk mengelola unggahan berkas di backend    |
| Lain-lain        | CORS            | Untuk menangani permintaan cross-origin              |


## 🏛️ Tinjauan Arsitektur

Aplikasi ini mengikuti arsitektur client-server.  Frontend (Vue.js) berinteraksi dengan backend (Express.js) yang memproses video dan berkomunikasi dengan API AI untuk menghasilkan subtitle.  Backend bertanggung jawab atas pemrosesan berkas,  sementara frontend menangani presentasi dan interaksi pengguna.  Penggunaan Pinia memastikan state aplikasi terkelola dengan baik di sisi frontend.


## 🚀 Memulai

1. Kloning repositori:
   ```bash
   git clone https://github.com/cantiir2/GenerateSubtitle.git
   ```
2. Navigasi ke direktori proyek:
   ```bash
   cd GenerateSubtitle
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```


## 📂 Struktur File

```
/
├── .env.backup
├── .gitignore
├── README.md
├── backend             // Direktori untuk kode backend (Express.js)
│   ├── package.json
│   └── server.js
├── env.d.ts            // Definisi tipe lingkungan
├── index.html          // File HTML utama untuk Vue.js
├── package.json        // File dependensi utama proyek
├── postcss.config.js   // Konfigurasi PostCSS
├── public              // Direktori untuk aset statis (favicon)
│   └── favicon.ico
├── src                 // Direktori kode sumber frontend (Vue.js)
│   ├── App.vue         // Komponen utama aplikasi
│   ├── assets          // Aset seperti CSS dan gambar
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components      // Komponen Vue.js
│   │   ├── HelloWorld.vue
│   │   ├── SubtitleGenerator.vue  // Komponen utama untuk generasi subtitle
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   ├── __tests__     // Direktori pengujian
│   │   │   └── HelloWorld.spec.ts
│   │   └── icons         // Icon Vue.js
│   ├── main.ts         // File entri aplikasi Vue.js
│   ├── router          // Rute Vue Router
│   │   └── index.ts
│   ├── stores          // Store Pinia
│   │   ├── counter.ts
│   │   └── subtitle.ts // Store untuk status generasi subtitle
│   └── views           // View Vue.js
│       ├── AboutView.vue
│       └── HomeView.vue
├── tailwind.config.js  // Konfigurasi Tailwind CSS
├── tsconfig.app.json  // Konfigurasi TypeScript untuk aplikasi
├── tsconfig.json      // Konfigurasi TypeScript utama
├── tsconfig.node.json // Konfigurasi TypeScript untuk backend Node.js
├── tsconfig.vitest.json // Konfigurasi TypeScript untuk Vitest
├── vite.config.ts     // Konfigurasi Vite
└── vitest.config.ts   // Konfigurasi Vitest
```

