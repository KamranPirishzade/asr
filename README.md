# 🎙️ AI-Powered Offline Transcriber (ASR)

A sophisticated, privacy-focused Automatic Speech Recognition (ASR) application built with **Next.js 15**. This app performs high-fidelity audio transcription directly in the browser using Machine Learning, ensuring that your voice data never leaves your computer.



---

## ✨ Key Features

- **On-Device Machine Learning**: Utilizes Hugging Face's `Whisper-tiny.en` model via **Transformers.js**.
- **Privacy-Centric**: Audio is processed locally. No API keys, no servers, and no data tracking.
- **Multithreaded Architecture**: Uses **Web Workers** to handle heavy ML computation, keeping the UI responsive at 60fps.
- **Advanced Audio Processing**: Real-time decoding and conversion of stereo mic input to mono 16kHz PCM data.
- **Modern UI/UX**: Built with Tailwind CSS, featuring a collapsible sidebar, real-time loading progress, and audio previews.

---

## 🛠️ Technical Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React, TypeScript |
| **AI/ML** | Transformers.js, Whisper (OpenAI) |
| **State** | Custom Hooks, Context API |
| **Styling** | Tailwind CSS, Lucide Icons, Shadcn UI |
| **Threading** | Web Workers |
| **Audio** | Web Audio API (AudioContext, MediaRecorder) |

---

## 🏗️ Engineering Deep Dive

### 1. High-Performance Background Processing
Running AI models in a browser can easily "freeze" the website. I implemented a **Web Worker** architecture to isolate the Transformers.js runtime. 



By using a `postMessage` communication bridge, the main thread stays dedicated to the UI, while the background thread handles the heavy math required for speech-to-text.

### 2. Digital Signal Processing (DSP)
Whisper models require audio in a specific format (1channel, 16,000Hz). I built a processing pipeline that:
1. Captures raw audio via `MediaRecorder`.
2. Decodes the `ArrayBuffer` into an `AudioBuffer`.
3. Merges Stereo channels into Mono using a mathematical mean of the waveforms.
4. Normalizes the data into a `Float32Array` for the AI model.

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/yourusername/asr-transcriber.git](https://github.com/yourusername/asr-transcriber.git)
