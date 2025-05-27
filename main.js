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
// Lägg till denna funktion i main.js

async function startUpgradeProcess(resolution) {
  document.getElementById("upgrade-options").style.display = "none";
  document.getElementById("progress-bar").style.display = "block";
  document.getElementById("progress-text").style.display = "block";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    document.getElementById("progress-bar-filled").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `${progress}% of 100% to complete upgrade`;
  }, 100);

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputName = uploadedFile.name;
  const inputFile = await fetchFile(uploadedFile);
  ffmpeg.FS('writeFile', inputName, inputFile);

  let width, height;
  switch (resolution) {
    case '480p': width = 854; height = 480; break;
    case '720p': width = 1280; height = 720; break;
    case '1080p': width = 1920; height = 1080; break;
    case '1440p': width = 2560; height = 1440; break;
    case '2160p': width = 3840; height = 2160; break;
    default: width = 1280; height = 720;
  }

  const outputName = `output_${resolution}.mp4`;
  await ffmpeg.run('-i', inputName, '-vf', `scale=${width}:${height}`, outputName);

  const data = ffmpeg.FS('readFile', outputName);
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const url = URL.createObjectURL(videoBlob);

  clearInterval(interval);
  document.getElementById("progress-bar").style.display = "none";
  document.getElementById("progress-text").style.display = "none";
  document.getElementById("progress-bar-filled").style.width = "0%";

  const downloadBtn = document.getElementById("download-btn");
  downloadBtn.style.display = "inline-block";
  downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `upgraded_${uploadedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    downloadBtn.style.display = "none";
  };
}
window.startUpgradeProcess = startUpgradeProcess;
window.onUpgradeClick = onUpgradeClick;
window.acceptTerms = acceptTerms;
window.denyTerms = denyTerms;
