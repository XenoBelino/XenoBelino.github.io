// ai-module.js
const fetchFile = FFmpeg.fetchFile;

// Använd den globala FFmpeg-variabeln från CDN
const ffmpeg = FFmpeg.createFFmpeg({ log: true });

export async function extractAudioFromVideo(file) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  // Skriv filen till FFmpeg:s filsystem
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

  // Kör ffmpeg-kommando för att extrahera ljud
  await ffmpeg.run('-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.mp3');

  // Läs ut den extraherade ljudfilen
  const data = ffmpeg.FS('readFile', 'output.mp3');

  // Returnera som Blob (audio/mpeg)
  return new Blob([data.buffer], { type: 'audio/mpeg' });
}

export async function detectLanguagesFromAudio(audioBlob) {
  // Använd onnxruntime globalt som 'ort'
  // Ladda modellen (se till att den finns på rätt plats)
  const session = await ort.InferenceSession.create('modell.onnx');

  // Exempel på hur du läser data från audioBlob och kör inferens
  const arrayBuffer = await audioBlob.arrayBuffer();
  const inputTensor = new ort.Tensor('float32', new Float32Array(arrayBuffer), [1, arrayBuffer.byteLength]);

  const feeds = { input: inputTensor };
  const results = await session.run(feeds);

  // Returnera språk som array (exempel)
  return results.output.data;
}

export function showLanguageSelectionPopup(languages) {
  // Enkel funktion som visar popup för språkval (dummy)
  alert('Languages detected: ' + languages.join(', '));
}

export async function removeLanguagesFromAudio(audioBlob, languagesToRemove) {
  // Dummy funktion - implementera enligt behov
  console.log('Removing languages:', languagesToRemove);
  return audioBlob;
}

export async function muxAudioWithVideo(videoFile, audioBlob) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
  ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioBlob));

  // Kör ffmpeg för att muxa video + nytt ljud
  await ffmpeg.run('-i', 'input.mp4', '-i', 'audio.mp3', '-c:v', 'copy', '-c:a', 'aac', 'output.mp4');

  const data = ffmpeg.FS('readFile', 'output.mp4');

  return new Blob([data.buffer], { type: 'video/mp4' });
}

export function downloadFinalVideo(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'upgraded-video.mp4';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
