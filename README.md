AI Voice Transcriber (ASR)
A high-performance, privacy-focused audio transcription web application that runs Machine Learning models directly in the browser. No audio data ever leaves your device.

🚀 Key Features
On-Device AI: Utilizes Whisper-tiny via Transformers.js for real-time transcription.

Privacy First: Zero server-side processing; all audio remains local.

Multi-threaded Performance: Dedicated Web Workers handle heavy ML computation to keep the UI buttery smooth.

Dynamic UI: A responsive, collapsible sidebar with real-time transcription status and audio previews.

🛠️ Tech Stack
Framework: Next.js 15+ (App Router)

AI Library: Transformers.js (Hugging Face)

State Management: React Hooks (useMemo, useCallback, useRef)

Styling: Tailwind CSS & Lucide Icons

Audio: Web Audio API (AudioContext, MediaRecorder)

🏗️ Technical Challenges & Solutions
1. The "Main Thread" Bottleneck
Challenge: Running a Machine Learning model is CPU-intensive. Running it on the main thread would freeze the UI, preventing the user from interacting with buttons.
Solution: Offloaded the model execution to a Web Worker. Used postMessage for asynchronous communication between the UI and the AI "Brain."

2. Stereo to Mono Audio Processing
Challenge: The Whisper model requires mono audio at a specific sample rate (16kHz), but browser microphones often record in stereo at 44.1kHz or 48kHz.
Solution: Implemented a custom audio processing pipeline using AudioContext to downsample and merge audio channels into a Float32Array before sending it to the model.
