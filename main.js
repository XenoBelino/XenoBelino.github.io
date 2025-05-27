import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

const ffmpeg = createFFmpeg({ log: true });

let uploadedFile = null;
let acceptedTerms = false;
let userAcceptedTerms = false;
let selectedUpgradeResolution = null;
let warningAccepted = false;

document.getElementById('file-input').addEventListener('change', handleFileSelect);
document.getElementById('convert-btn').addEventListener('click', convertToMP4);

// Klick utanför popups = stäng
document.addEventListener("click", function (event) {
    const upgradeButton = document.getElementById("upgrade-video-btn");
    const popups = document.querySelectorAll("#popup-no-video, #popup-warning, #popup-terms, #popup-sufficient, #upgrade-options");

    const isClickInsidePopup = [...popups].some(popup => popup.contains(event.target)) || upgradeButton.contains(event.target);

    if (!isClickInsidePopup) {
        closeAllUpgradePopups();
    }

    const backgroundButton = document.getElementById("change-background-btn");
    const bgOptions = document.getElementById("background-options");
    const isClickInsideBg = bgOptions.contains(event.target) || backgroundButton.contains(event.target);

    if (!isClickInsideBg) {
        bgOptions.style.display = "none";
    }
});

 // Visa eller dölj bakgrundsalternativ
    function toggleBackgroundOptions() {
        const bgOpts = document.getElementById("background-options");
        bgOpts.style.display = bgOpts.style.display === "block" ? "none" : "block";
    }

    // Sätt ljus läge
    function setLightMode() {
        document.body.classList.remove("dark-mode");
        updatePopupDarkMode(false);
        document.getElementById("background-options").style.display = "none";
    }

    // Sätt mörkt läge
    function setDarkMode() {
        document.body.classList.add("dark-mode");
        updatePopupDarkMode(true);
        document.getElementById("background-options").style.display = "none";
    }

    // Uppdatera popup-stil efter mörkt/ljust läge
    function updatePopupDarkMode(isDark) {
        const popups = document.querySelectorAll(".popup");
        popups.forEach(popup => {
            if (isDark) {
                popup.classList.add("dark-mode");
            } else {
                popup.classList.remove("dark-mode");
            }
        });
    }

    // Triggera file input
    function triggerFileInput() {
        document.getElementById("file-input").click();
    }

    // Hantera vald videofil
    function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploadedFile = file; // <--- SPARAR filen

    const video = document.getElementById("video-player");
    const source = document.getElementById("video-source");

    const url = URL.createObjectURL(file);
    source.src = url;
    video.load();
    video.play();

    document.getElementById("file-name").textContent = file.name;

    acceptedTerms = false;
    selectedUpgradeResolution = null;
    warningAccepted = false;
    userAcceptedTerms = false;
}

    // Dummy-funktion
    function convertToMP4() {
        alert("Convert to MP4-funktion kommer snart!");
    }

    // Visa popup
    function showPopup(id) {
        document.getElementById(id).style.display = "block";
    }

    function closePopup(id) {
        document.getElementById(id).style.display = "none";
    }

    // Uppdatera volym
    function updateVolumePercentage(type) {
        const slider = document.getElementById(type + "-volume");
        const percentSpan = document.getElementById(type + "-volume-percent");
        percentSpan.textContent = slider.value + "%";
    }

    // Kontroll om video är vald (ej sample.mp4)
    function isVideoSelected() {
        const src = document.getElementById("video-source").src;
        return src && !src.includes("sample.mp4") && src !== "";
    }

    // När "Upgrade" klickas
   function onUpgradeClick() {
    const anyPopupOpen = isAnyUpgradePopupOpen();

    if (anyPopupOpen) {
        closeAllUpgradePopups();
        return;
    }

    if (!isVideoSelected()) {
        showPopup("popup-no-video");
        return;
    }

    if (warningAccepted) {
        showResolutionOptions(); // Visa direkt om redan godkänt
    } else {
        showPopup("popup-warning"); // Visa varning först
    }
}

    function proceedToResolution() {
        warningAccepted = true;
        closePopup("popup-warning");
        const optionsBox = document.getElementById("upgrade-options");
        optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
        showResolutionOptions();
    }

    function handleResolutionClick(resolution) {
    selectedUpgradeResolution = resolution;

    const currentResolution = getVideoResolution(); // Dummy

    if (compareResolutions(currentResolution, resolution) >= 0) {
        document.getElementById("sufficient-text").textContent = `Your video is already sufficient. It already has ${currentResolution}.`;
        showPopup("popup-sufficient");
        return;
    }

    if (!userAcceptedTerms) {
        showPopup("popup-terms");
    } else {
        startUpgradeProcess(resolution);
    }
}
       
    function acceptTerms() {
        userAcceptedTerms = true;
        closePopup("popup-terms");

        if (selectedUpgradeResolution) {
            startUpgradeProcess(selectedUpgradeResolution);
        }
    }

    function denyTerms() {
        userAcceptedTerms = false;
        closePopup("popup-terms");
    }

     function downloadUpgradedVideo() {
    const videoSrc = document.getElementById("video-source").src;

    if (!videoSrc) {
        alert("No video available to download.");
        return;
    }

    let fileName = "upgraded_video"; // fallback
    if (uploadedFile) {
        const originalName = uploadedFile.name;
        const extension = originalName.split('.').pop();
        const baseName = originalName.replace(/\.[^/.]+$/, ""); // tar bort ändelsen
        fileName = `upgraded_${baseName}.${extension}`;
    }

    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Dölj knappen efter nedladdning
    document.getElementById("download-btn").style.display = "none";
}


    // Dummy-metod: få aktuell videoupplösning
    function getVideoResolution() {
        return "720p"; // Ersätt med faktisk metadata om möjligt
    }

    // Jämför upplösningar
    function compareResolutions(current, target) {
        const order = { "480p": 0, "720p": 1, "1080p": 2, "1440p": 3, "2160p": 4 };
        return order[current] - order[target];
    }

       function isAnyUpgradePopupOpen() {
    const popupIds = ["popup-no-video", "popup-warning", "popup-terms", "popup-sufficient", "upgrade-options"];
    return popupIds.some(id => document.getElementById(id).style.display === "block");
    }
   
    function closeAllUpgradePopups() {
    const popupIds = ["popup-no-video", "popup-warning", "popup-terms", "popup-sufficient", "upgrade-options"];
    popupIds.forEach(id => {
        document.getElementById(id).style.display = "none";
    });
}       

    function showResolutionOptions() {
    const optionsBox = document.getElementById("upgrade-options");
    optionsBox.style.display = "block";
}  
       
async function startUpgradeProcess(resolution) {
    const videoFile = window.currentVideoFile;
    if (!videoFile) {
        showPopup("popup-no-video");
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const { createFFmpeg } = FFmpeg;
        const ffmpeg = createFFmpeg({ log: true });

        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

        // Visa progressbar
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        progressBar.style.display = "block";
        progressText.style.display = "block";

        // 🟩 Riktig progress med ffmpeg.setProgress()
        ffmpeg.setProgress(({ ratio }) => {
            const percent = Math.min(Math.round(ratio * 100), 100);
            document.getElementById("progress-bar-filled").style.width = `${percent}%`;
            document.getElementById("progress-text").textContent = `${percent}% of 100% to complete upgrade`;
        });

        const resolutionMap = {
            '480p': '854x480',
            '720p': '1280x720',
            '1080p': '1920x1080',
            '1440p': '2560x1440',
            '2160p': '3840x2160'
        };

        const size = resolutionMap[resolution] || '1280x720';

        await ffmpeg.run('-i', 'input.mp4', '-vf', `scale=${size}`, 'output.mp4');

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        const a = document.createElement('a');
        a.href = url;
        a.download = 'upgraded_video.mp4';
        document.getElementById("download-btn").style.display = "block";

        // Avsluta progress
        document.getElementById("progress-bar-filled").style.width = `100%`;
        document.getElementById("progress-text").textContent = `100% of 100% to complete upgrade`;

        // Snygg fördröjning innan döljs
        setTimeout(() => {
            progressBar.style.display = "none";
            progressText.textContent = "Upgrade complete!";
        }, 1500);
    };

    reader.readAsArrayBuffer(videoFile);
}

window.addEventListener("load", () => {
  window.onUpgradeClick = onUpgradeClick;
  window.acceptTerms = acceptTerms;
  window.denyTerms = denyTerms;
  window.setLightMode = setLightMode;
  window.setDarkMode = setDarkMode;
  window.triggerFileInput = triggerFileInput;
  window.downloadUpgradedVideo = downloadUpgradedVideo;
  window.handleFileSelect = handleFileSelect;
  window.convertToMP4 = convertToMP4;
  window.toggleBackgroundOptions = toggleBackgroundOptions;
  window.closePopup = closePopup;
  window.updateVolumePercentage = updateVolumePercentage;
  window.proceedToResolution = proceedToResolution;
  window.startUpgradeProcess = startUpgradeProcess; 
});
