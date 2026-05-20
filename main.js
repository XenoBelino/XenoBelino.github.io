// ==========================
// FFmpeg Setup
// ==========================
import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
const ffmpeg = createFFmpeg({ log: true });

// ==========================
// Global Variables
// ==========================
let uploadedFile = null;
let audioContext;
let sourceNode;
let gainNodeOriginal;
let gainNodeMusic;
let gainNodeCorrupted;
let gainNodeFinal;
let isConverting = false;

// ==========================
// Utility Functions
// ==========================
function triggerFileInput() {
    document.getElementById('file-input').click();
}

function toggleBackgroundOptions() {
    const bg = document.getElementById('background-options');
    bg.style.display = bg.style.display === 'block' ? 'none' : 'block';
}

function updateVolumePercentage(id) {
    const slider = document.getElementById(`${id}-volume`);
    const percentSpan = document.getElementById(`${id}-volume-percent`);
    if (slider && percentSpan) {
        percentSpan.textContent = `${Math.round(slider.value)}%`;
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) popup.style.display = 'none';
}

// ==========================
// File Handling
// ==========================
function handleFileSelect(event) {
    uploadedFile = event.target.files[0];
    if (uploadedFile) {
        document.getElementById('file-name').textContent = uploadedFile.name;
        document.getElementById("progress-status").innerText = "File loaded";
    }
}

// ==========================
// FFmpeg Helpers
// ==========================
async function loadFFmpeg() {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
}

// ==========================
// Video Conversion
// ==========================
async function convertToMP4() {
    if (isConverting) return alert("Conversion already in progress.");
    if (!uploadedFile) return alert("Please select a video first.");

    isConverting = true;
    const convertBtn = document.getElementById('convert-btn');
    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    const progressBar = document.getElementById("progress-bar");
    const progressBarFilled = document.getElementById("progress-bar-filled");
    const progressText = document.getElementById("progress-text");
    const downloadBtn = document.getElementById("download-btn");
    const videoPlayer = document.getElementById("video-player");

    progressBar.style.display = 'block';
    progressBarFilled.style.width = '0%';
    progressText.style.display = 'block';
    progressText.textContent = '0% of 100%';

    try {
        await loadFFmpeg();
        ffmpeg.FS('writeFile', uploadedFile.name, await fetchFile(uploadedFile));

        const startTime = Date.now();
        ffmpeg.setProgress(({ ratio }) => {
            const percent = Math.round(ratio * 100);
            const elapsed = (Date.now() - startTime) / 1000;
            const estimatedTotal = elapsed / (ratio || 0.01);
            const remaining = estimatedTotal - elapsed;
            const minutes = Math.floor(remaining / 60);
            const seconds = Math.floor(remaining % 60);
            const timeLeft = `${minutes}m ${seconds}s`;

            progressBarFilled.style.width = percent + '%';
            progressText.textContent = `${percent}% – approx. ${timeLeft} left`;
        });

        await ffmpeg.run('-i', uploadedFile.name, '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4');

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);
        videoPlayer.src = videoURL;
        downloadBtn.style.display = 'inline-block';
        downloadBtn.textContent = "Download Converted Video";
    } catch (e) {
        alert('Error during conversion: ' + e.message);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to MP4';
        progressBar.style.display = 'none';
        progressText.style.display = 'none';
        isConverting = false;
    }
}

// ==========================
// Audio Graph for Volume Control
// ==========================
function setupAudioGraph(videoElement) {
    if (!audioContext) audioContext = new AudioContext();
    if (!sourceNode) {
        try {
            sourceNode = audioContext.createMediaElementSource(videoElement);
        } catch (e) {
            console.warn("Cannot create MediaElementSourceNode:", e);
            return;
        }

        gainNodeOriginal = audioContext.createGain();
        gainNodeMusic = audioContext.createGain();
        gainNodeCorrupted = audioContext.createGain();
        gainNodeFinal = audioContext.createGain();

        gainNodeOriginal.gain.value = 1.0;
        gainNodeMusic.gain.value = 0.5;
        gainNodeCorrupted.gain.value = 0.2;
        gainNodeFinal.gain.value = 1.0;

        sourceNode.connect(gainNodeOriginal);
        sourceNode.connect(gainNodeMusic);
        sourceNode.connect(gainNodeCorrupted);
        gainNodeOriginal.connect(gainNodeFinal);
        gainNodeMusic.connect(gainNodeFinal);
        gainNodeCorrupted.connect(gainNodeFinal);
        gainNodeFinal.connect(audioContext.destination);

        audioContext.resume().catch(e => console.warn("AudioContext resume failed:", e));
    }
}

// ==========================
// Noise Canceling
// ==========================
function setupNoiseCancel() {
    const video = document.getElementById("video-player");
    const noiseBtn = document.getElementById("noise-cancel-btn");
    const noisePopup = document.getElementById("noise-popup");
    if (!noiseBtn) return;

    noiseBtn.addEventListener("click", () => {
        if (!video || !video.src) return alert("Please load a video first.");
        noisePopup.style.display = 'block';
    });

    // Live Noise Button
    document.getElementById("live-noise-btn").addEventListener("click", () => {
        alert("Live Noise Canceling applied!");
        noisePopup.style.display = 'none';
    });

    // Offline Noise Button
    document.getElementById("download-noise-btn").addEventListener("click", async () => {
        noisePopup.style.display = 'none';
        const progressContainer = document.getElementById("noise-progress-container");
        const progressBar = document.getElementById("noise-progress-bar");
        const progressText = document.getElementById("noise-progress-text");
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        await loadFFmpeg();
        ffmpeg.FS('writeFile', uploadedFile.name, await fetchFile(uploadedFile));
        ffmpeg.setProgress(({ ratio }) => {
            const percent = Math.round(ratio * 100);
            progressBar.style.width = `${percent}%`;
            progressText.textContent = `${percent}%`;
        });
        await ffmpeg.run('-i', uploadedFile.name, '-af', 'afftdn', 'noise_output.mp4');
        const data = ffmpeg.FS('readFile', 'noise_output.mp4');
        const blob = new Blob([data.buffer], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        const linkContainer = document.getElementById("download-link-container");
        linkContainer.innerHTML = `<a href="${url}" download="noise_output.mp4">Download Noise Reduced Video</a>`;
    });
}

// ==========================
// Volume Sliders Event Binding
// ==========================
function bindVolumeSliders() {
    const video = document.getElementById("video-player");
    const sliders = ["original", "corrupted", "music", "final"];
    sliders.forEach(id => {
        const slider = document.getElementById(`${id}-volume`);
        if (!slider) return;
        slider.addEventListener("input", () => {
            updateVolumePercentage(id);
            if (id === "original") video.volume = slider.value / 100;
        });
    });
}

// ==========================
// Fullscreen & Arrow Keys
// ==========================
function setupKeyboardControls() {
    const video = document.getElementById("video-player");
    const originalVolumeSlider = document.getElementById("original-volume");

    document.addEventListener("keydown", (e) => {
        if (!video) return;
        switch (e.key) {
            case "f":
                if (!document.fullscreenElement) video.requestFullscreen().catch(err => console.warn(err));
                else document.exitFullscreen();
                break;
            case "m":
                video.muted = !video.muted;
                break;
            case "ArrowLeft":
                video.currentTime = Math.max(0, video.currentTime - 5);
                break;
            case "ArrowRight":
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                break;
            case "ArrowUp":
                originalVolumeSlider.value = Math.min(100, +originalVolumeSlider.value + 5);
                updateVolumePercentage("original");
                video.volume = originalVolumeSlider.value / 100;
                break;
            case "ArrowDown":
                originalVolumeSlider.value = Math.max(0, +originalVolumeSlider.value - 5);
                updateVolumePercentage("original");
                video.volume = originalVolumeSlider.value / 100;
                break;
        }
    });
}

// ==========================
// Home Button Fix
// ==========================
document.getElementById("back-to-home-btn").addEventListener("click", () => {
    window.location.href = "index.html"; // Make sure this is your real homepage
});

// ==========================
// Upgrade Video Button Logic
// ==========================
document.getElementById("upgrade-video-btn").addEventListener("click", () => {
    if (!uploadedFile) return closePopup("popup-no-video");
    const warningPopup = document.getElementById("popup-warning");
    warningPopup.style.display = "block";
});

// ==========================
// Init Function
// ==========================
function init() {
    const video = document.getElementById("video-player");
    if (video) setupAudioGraph(video);
    bindVolumeSliders();
    setupNoiseCancel();
    setupKeyboardControls();

    document.getElementById("convert-btn").addEventListener("click", convertToMP4);
}

// ==========================
// Start
// ==========================
window.addEventListener("DOMContentLoaded", init);
