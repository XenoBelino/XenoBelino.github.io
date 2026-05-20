import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';
const ffmpeg = createFFmpeg({ log: true });
// ==========================
// Global variables
// ==========================
let uploadedFile = null;
let ffmpeg = FFmpeg.createFFmpeg({ log: true });
let audioContext, sourceNode, gainNodeOriginal, gainNodeMusic, gainNodeCorrupted, gainNodeFinal;

// ==========================
// File handling
// ==========================
function handleFileSelect(event) {
    uploadedFile = event.target.files[0];
    document.getElementById("file-name").textContent = uploadedFile ? uploadedFile.name : "No file selected";
    document.getElementById("progress-status").innerText = uploadedFile ? "File ready" : "Ingen sparad progress";
}

// ==========================
// Volume sliders
// ==========================
function updateVolumePercentage(type) {
    const video = document.getElementById("video-player");
    const slider = document.getElementById(type + "-volume");
    const percent = document.getElementById(type + "-volume-percent");
    if (slider && percent) {
        percent.textContent = slider.value + "%";
        if (type === "original") video.volume = slider.value / 100;
        if (gainNodeOriginal && type === "original") gainNodeOriginal.gain.value = slider.value / 100;
        if (gainNodeMusic && type === "music") gainNodeMusic.gain.value = slider.value / 100;
        if (gainNodeCorrupted && type === "corrupted") gainNodeCorrupted.gain.value = slider.value / 100;
        if (gainNodeFinal && type === "final") gainNodeFinal.gain.value = slider.value / 100;
    }
}

// ==========================
// FFmpeg loader
// ==========================
async function loadFFmpeg() {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
}

// ==========================
// Video conversion
// ==========================
let isConverting = false;
async function convertToMP4() {
    if (isConverting) return alert("Konvertering pågår redan.");
    const fileInput = document.getElementById("file-input");
    if (!fileInput.files.length) return alert("Vänligen välj en videofil först!");
    const file = fileInput.files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'mp4') return alert("Videon är redan MP4.");

    isConverting = true;
    const convertBtn = document.getElementById('convert-btn');
    const videoPlayer = document.getElementById("video-player");
    const progressBar = document.getElementById("progress-bar");
    const progressBarFilled = document.getElementById("progress-bar-filled");
    const progressText = document.getElementById("progress-text");
    const downloadBtn = document.getElementById("download-btn");

    convertBtn.disabled = true;
    convertBtn.textContent = 'Konverterar...';
    progressBar.style.display = 'block';
    progressBarFilled.style.width = '0%';
    progressText.style.display = 'block';
    progressText.textContent = '0% av 100% klart';

    try {
        await loadFFmpeg();
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        const startTime = Date.now();
        ffmpeg.setProgress(({ ratio }) => {
            const percent = Math.round(ratio * 100);
            const elapsed = (Date.now() - startTime) / 1000;
            const estimatedTotal = elapsed / (ratio || 0.01);
            const remaining = estimatedTotal - elapsed;
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = Math.floor(remaining % 60);
            const timeLeft = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
            progressBarFilled.style.width = percent + '%';
            progressText.textContent = `${percent}% – approx. ${timeLeft} kvar`;
        });
        await ffmpeg.run('-i', file.name, '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4');
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);
        videoPlayer.src = videoURL;
        downloadBtn.style.display = 'inline-block';
        downloadBtn.textContent = "Download Converted Video";
    } catch (e) {
        alert('Fel vid konvertering: ' + e.message);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to MP4';
        progressBar.style.display = 'none';
        progressText.style.display = 'none';
        isConverting = false;
    }
}

// ==========================
// Noise Canceling
// ==========================
function setupNoiseCancel() {
    const video = document.getElementById("video-player");
    const noiseBtn = document.getElementById("noise-cancel-btn");
    const noisePopup = document.getElementById("noise-popup");
    const liveBtn = document.getElementById("live-noise-btn");
    const downloadBtn = document.getElementById("download-noise-btn");
    const progressContainer = document.getElementById("noise-progress-container");
    const progressBar = document.getElementById("noise-progress-bar");
    const progressText = document.getElementById("noise-progress-text");

    if (!noiseBtn) return;

    noiseBtn.addEventListener("click", () => {
        if (!video || !video.src) return alert("Please load a video first.");
        noisePopup.style.display = "block";
    });

    liveBtn.addEventListener("click", () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(video);
            const filter = audioContext.createBiquadFilter();
            filter.type = "highshelf";
            filter.frequency.value = 3000;
            filter.gain.value = -12;
            sourceNode.connect(filter);
            filter.connect(audioContext.destination);
            audioContext.resume().catch(e => console.warn("AudioContext resume failed:", e));
        }
        alert("Live Noise Canceling applied!");
        noisePopup.style.display = "none";
    });

    downloadBtn.addEventListener("click", async () => {
        noisePopup.style.display = "none";
        progressContainer.style.display = "block";
        progressBar.style.width = "0%";
        progressText.textContent = "0%";

        try {
            await loadFFmpeg();
            ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(uploadedFile));
            ffmpeg.setProgress(({ ratio }) => {
                const percent = Math.round(ratio * 100);
                progressBar.style.width = percent + "%";
                progressText.textContent = percent + "%";
            });

            await ffmpeg.run(
                '-i', 'input.mp4',
                '-af', 'highpass=f=200, lowpass=f=3000',
                '-c:v', 'copy',
                'output-noise.mp4'
            );

            const data = ffmpeg.FS('readFile', 'output-noise.mp4');
            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "noise_reduced.mp4";
            downloadLink.textContent = "Download Noise-Reduced Video";
            downloadLink.style.display = "block";
            downloadLink.style.marginTop = "10px";
            document.getElementById("download-link-container").appendChild(downloadLink);

            alert("Offline Noise Reduction complete!");
        } catch (e) {
            alert("Error applying offline noise reduction: " + e.message);
        } finally {
            progressContainer.style.display = "none";
        }
    });
}

// ==========================
// Audio routing & graph
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
        gainNodeCorrupted.gain.value
       // Koppla ihop nodernas ljudvägar
        sourceNode.connect(gainNodeOriginal);
        gainNodeOriginal.connect(gainNodeFinal);
        gainNodeMusic.connect(gainNodeFinal);
        gainNodeCorrupted.connect(gainNodeFinal);
        gainNodeFinal.connect(audioContext.destination);
    }
}

// ==========================
// Upgrade video popup & resolution
// ==========================
function openUpgradePopup() {
    const popup = document.getElementById("upgrade-options");
    popup.style.display = "block";
}

function handleResolutionClick(res) {
    alert("You chose " + res + " resolution!");
    document.getElementById("upgrade-options").style.display = "none";
}

// ==========================
// Close popups
// ==========================
function closePopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = "none";
}

// ==========================
// Terms acceptance
// ==========================
function acceptTerms() {
    closePopup('popup-terms');
    openUpgradePopup();
}

function denyTerms() {
    closePopup('popup-terms');
}

// ==========================
// Background toggle
// ==========================
function toggleBackgroundOptions() {
    const options = document.getElementById("background-options");
    options.style.display = options.style.display === "block" ? "none" : "block";
}

function setLightMode() {
    document.body.classList.remove("dark-mode");
}

function setDarkMode() {
    document.body.classList.add("dark-mode");
}

// ==========================
// Initialize on load
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video-player");
    setupAudioGraph(video);
    setupNoiseCancel();

    document.getElementById("convert-btn").addEventListener("click", convertToMP4);

    document.getElementById("upgrade-video-btn").addEventListener("click", () => {
        if (!uploadedFile) {
            document.getElementById("popup-no-video").style.display = "block";
        } else {
            document.getElementById("popup-warning").style.display = "block";
        }
    });
});
