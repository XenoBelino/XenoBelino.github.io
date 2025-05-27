import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

const ffmpeg = createFFmpeg({ log: true });
let uploadedFile = null;

// Hantera filval
document.getElementById('file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile = file;
    const video = document.getElementById('video-player');
    const source = document.getElementById('video-source');
    const url = URL.createObjectURL(file);
    source.src = url;
    video.load();
    video.play();
    document.getElementById("file-name").textContent = file.name;
  }
});

// Konvertera till MP4
document.getElementById('convert-btn').addEventListener('click', async () => {
  if (!uploadedFile) {
    alert("No file selected!");
    return;
  }

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputFile = await fetchFile(uploadedFile);
  const inputName = uploadedFile.name;

  ffmpeg.FS('writeFile', inputName, inputFile);
  await ffmpeg.run('-i', inputName, 'output.mp4');

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const url = URL.createObjectURL(videoBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'converted_video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
