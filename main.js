// main.js - GLOBAL version
// Alla funktioner är deklarerade via window för att HTML-knappar ska hitta dem

// ================= FFmpeg Setup =================
window.ffmpeg = null;
window.isFFmpegLoaded = false;

async function loadFFmpeg() {
    if (!window.ffmpeg) {
        const { createFFmpeg, fetchFile } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js');
        window.ffmpeg = createFFmpeg({ log: true });
    }
    if (!window.isFFmpegLoaded) {
        await window.ffmpeg.load();
        window.isFFmpegLoaded = true;
        console.log("FFmpeg loaded");
    }
}
window.loadFFmpeg = loadFFmpeg;

// ================= File Upload =================
window.currentFile = null;

window.triggerFileInput = function () {
    document.getElementById("file-input").click();
};

window.handleFileSelect = function (event) {
    const file = event.target.files[0];
    if (!file) return;
    window.currentFile = file;
    document.getElementById("file-name").textContent = file.name;

    const videoPlayer = document.getElementById("video-player");
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
};

// ================= Volume Sliders =================
window.updateVolumePercentage = function (type) {
    const slider = document.getElementById(`${type}-volume`);
    const percentLabel = document.getElementById(`${type}-volume-percent`);
    if (slider && percentLabel) {
        percentLabel.textContent = `${slider.value}%`;
    }
};

// ================= Background Options =================
window.toggleBackgroundOptions = function () {
    const options = document.getElementById("background-options");
    if (!options) return;
    options.style.display = options.style.display === "block" ? "none" : "block";
};

window.setDarkMode = function () {
    document.body.classList.add("dark-mode");
};

window.setLightMode = function () {
    document.body.classList.remove("dark-mode");
};

// ================= Popup Helpers =================
window.openPopup = function (id) {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = "block";
};

window.closePopup = function (id) {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = "none";
};

// ================= Upgrade Video =================
window.upgradeVideo = async function () {
    if (!window.currentFile) {
        window.openPopup("popup-no-video");
        return;
    }
    window.openPopup("popup-warning");
};

window.proceedToResolution = function () {
    window.closePopup("popup-warning");
    window.openPopup("popup-terms");
};

window.acceptTerms = function () {
    window.closePopup("popup-terms");
    window.openPopup("upgrade-options");
};

window.denyTerms = function () {
    window.closePopup("popup-terms");
};

window.handleResolutionClick = async function (resolution) {
    console.log("Upgrading video to", resolution);
    // TODO: här kan du implementera AI / FFmpeg för att uppgradera video
    window.closePopup("upgrade-options");
    alert(`Video would be upgraded to ${resolution} (simulation)`);
};

// ================= Noise Canceling =================
window.openNoisePopup = function () {
    const popup = document.getElementById("noise-popup");
    if (popup) popup.style.display = "block";
};

window.closeNoisePopup = function () {
    const popup = document.getElementById("noise-popup");
    if (popup) popup.style.display = "none";
};

window.liveNoise = async function () {
    console.log("Live noise canceling started");
    closeNoisePopup();
    alert("Live noise canceling would start (simulation)");
};

window.downloadNoise = async function () {
    console.log("Offline noise processing started");
    const progressBar = document.getElementById("noise-progress-bar");
    const progressText = document.getElementById("noise-progress-text");
    const container = document.getElementById("noise-progress-container");
    container.style.display = "block";

    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + "%";
        progressText.textContent = progress + "%";
        if (progress >= 100) clearInterval(interval);
    }, 200);

    // Simulera nedladdning
    setTimeout(() => {
        container.style.display = "none";
        alert("Noise reduced video ready for download (simulation)");
    }, 4200);

    closeNoisePopup();
};

// ================= Download Video =================
window.downloadUpgradedVideo = function () {
    if (!window.currentFile) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(window.currentFile);
    a.download = `upgraded-${window.currentFile.name}`;
    a.click();
};

// ================= Language Detection =================
window.detectLanguages = async function () {
    if (!window.currentFile) return;
    console.log("Detecting languages in video...");
    // Här kan du anropa Hugging Face Space API för ljudsplittring
    alert("Language detection simulation complete. Choose a language to proceed.");
};

// ================= Event Listeners =================
document.getElementById("browse-btn")?.addEventListener("click", triggerFileInput);
document.getElementById("upgrade-video-btn")?.addEventListener("click", upgradeVideo);
document.getElementById("noise-cancel-btn")?.addEventListener("click", openNoisePopup);
document.getElementById("live-noise-btn")?.addEventListener("click", liveNoise);
document.getElementById("download-noise-btn")?.addEventListener("click", downloadNoise);
document.getElementById("change-background-btn")?.addEventListener("click", toggleBackgroundOptions);

console.log("Global main.js loaded successfully");
