let transcriber = null;
let Transformers = null;

self.addEventListener('message', async (event) => {
  const { type, audio } = event.data;

  try {
    if (type === 'load') {
      self.postMessage({
        type: 'loading',
        status: 'Loading Transformers.js library...',
      });

      // Import transformers
      Transformers =
        await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');

      const { pipeline, env } = Transformers;

      // Configure environment
      env.allowLocalModels = false;
      env.allowRemoteModels = true;
      env.backends.onnx.wasm.proxy = false;

      // Important: Set the models path
      env.backends.onnx.wasm.wasmPaths =
        'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/';

      self.postMessage({
        type: 'loading',
        status: 'Downloading Whisper model (40MB, ~30 seconds)...',
      });

      // Use the correct model name with quantization
      transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny.en',
        {
          quantized: true, // Use quantized version (smaller, faster)
        }
      );

      self.postMessage({ type: 'ready' });
    } else if (type === 'transcribe') {
      if (!transcriber) {
        throw new Error('Model not loaded yet');
      }

      self.postMessage({ type: 'transcribing' });

      const result = await transcriber(audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: 'english',
        task: 'transcribe',
      });

      self.postMessage({
        type: 'complete',
        text: result.text,
      });
    }
  } catch (error) {
    console.error('Worker error details:', error);
    self.postMessage({
      type: 'error',
      error: error.message || String(error),
    });
  }
});
