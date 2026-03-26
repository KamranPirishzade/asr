export function sanitizeFileNamePart(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return cleaned || 'recording';
}

export function downloadTextContent(
  content: string,
  fileName: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function formatSrtTimestamp(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  const milliseconds = Math.floor((totalSeconds % 1) * 1000)
    .toString()
    .padStart(3, '0');

  return `${hours}:${minutes}:${seconds},${milliseconds}`;
}

function splitIntoCaptions(transcript: string) {
  return transcript
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function transcriptToEstimatedSrt(transcript: string) {
  const captions = splitIntoCaptions(transcript);
  let start = 0;

  return captions
    .map((caption, index) => {
      const words = caption.split(/\s+/).filter(Boolean).length;
      const duration = Math.max(1.2, words / 2.8);
      const end = start + duration;
      const block = `${index + 1}\n${formatSrtTimestamp(start)} --> ${formatSrtTimestamp(end)}\n${caption}`;
      start = end;
      return block;
    })
    .join('\n\n');
}
