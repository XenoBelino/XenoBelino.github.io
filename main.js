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


// Gör funktioner tillgängliga i HTML
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
