import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
let activeJobId = 0;

class PipelineFactory {
  static task = null;
  static model = null;
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const message = event.data || {};

  if (message.type !== 'transcribe') {
    return;
  }

  const jobId = typeof message.jobId === 'number' ? message.jobId : Date.now();
  activeJobId = jobId;

  const transcript = await transcribe(message.audio, jobId);
  if (transcript === null || activeJobId !== jobId) {
    return;
  }

  self.postMessage({
    status: 'complete',
    task: 'automatic-speech-recognition',
    output: transcript,
    jobId,
  });
});

class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
  static task = 'automatic-speech-recognition';
  static model = 'Xenova/whisper-tiny.en';
}

const transcribe = async (audio, jobId) => {
  const p = AutomaticSpeechRecognitionPipelineFactory;
  let transcriber = await p.getInstance((data) =>
    self.postMessage({ ...data, jobId })
  );

  self.postMessage({
    status: 'ready',
    task: 'automatic-speech-recognition',
    jobId,
  });

  let options = {
    chunk_length_s: 30, // adjust chunk size in seconds as needed
    stride_length_s: 5, // adjust overlap between chunks as needed
  };

  let output = await transcriber(audio, options).catch((error) => {
    self.postMessage({
      status: 'error',
      task: 'automatic-speech-recognition',
      output: error,
      jobId,
    });
    return null;
  });

  return output;
};
