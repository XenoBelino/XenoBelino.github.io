import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

const ffmpeg = createFFmpeg({ log: true });
let gainNodeOriginal, gainNodeMusic, gainNodeCorrupted, gainNodeFinal, audioContext, sourceNode;
let uploadedFile = null;
let acceptedTerms = false;
let userAcceptedTerms = false;
let selectedUpgradeResolution = null;
let warningAccepted = false;
let languagePopupShown = false;

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

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFile = file;
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

  // Skapa ljudkedja
  setupAudioGraph(video);
    
 // Simulera språkdetektion
const simulatedLanguages = ["Svenska", "Engelska"]; // <-- ändra som du vill
const robotVoiceIncluded = true;

setTimeout(() => {
  showLanguageDetectionPopup(simulatedLanguages, robotVoiceIncluded);
}, 1000);
}    

function showLanguageDetectionPopup(languages, hasRobotVoice) {
    if (languagePopupShown) return;
    languagePopupShown = true;

    const popup = document.getElementById("popup-language-detection");
    const message = document.getElementById("language-detection-message");

    message.innerHTML = `Multiple audio tracks detected: ${languages.join(" and ")}${hasRobotVoice ? " and Robotic voice" : ""}.<br>Which one should be moved to <strong>Corrupted Volume</strong>?`;

    const anchor = document.getElementById("language-popup-anchor");
     anchor.appendChild(popup);
    if (!anchor.contains(popup)) {
  anchor.appendChild(popup);
}
    popup.style.display = "block";

    // Visa knappar
    const [btn1, btn2, btn3] = [document.getElementById("lang-btn-1"), document.getElementById("lang-btn-2"), document.getElementById("lang-btn-3")];
    [btn1, btn2, btn3].forEach(btn => btn.style.display = "none");

    if (languages[0]) {
        btn1.textContent = `Move ${languages[0]}`;
        btn1.onclick = () => assignLanguageToCorrupted(languages[0]);
        btn1.style.display = "inline-block";
    }

    if (languages[1]) {
        btn2.textContent = `Move ${languages[1]}`;
        btn2.onclick = () => assignLanguageToCorrupted(languages[1]);
        btn2.style.display = "inline-block";
    }

    if (hasRobotVoice) {
        btn3.textContent = "Move Robotic Voice";
        btn3.onclick = () => assignLanguageToCorrupted("Robotic voice");
        btn3.style.display = "inline-block";
    }
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

  const gainValue = parseInt(slider.value) / 100;

  if (type === "original" && gainNodeOriginal) {
    gainNodeOriginal.gain.value = gainValue;
  } else if (type === "music" && gainNodeMusic) {
    gainNodeMusic.gain.value = gainValue;
  } else if (type === "corrupted" && gainNodeCorrupted) {
    gainNodeCorrupted.gain.value = gainValue;
  } else if (type === "final" && gainNodeFinal) {
    gainNodeFinal.gain.value = gainValue;
  }
}

    // Kontroll om video är vald (ej sample.mp4)
    function isVideoSelected() {
    const videoSource = document.getElementById("video-source");
    return videoSource && videoSource.src && videoSource.src !== "";
}

    // När "Upgrade" klickas
 function onUpgradeClick() {
    const video = document.getElementById("video-player");
    const source = document.getElementById("video-source");

    // Kontrollera om video har src
    if (!source || !source.src || source.src === "") {
        showPopup("popup-no-video");
        return;
    }

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
    const videoFile = uploadedFile; // <-- fix: använd sparad fil

    if (!videoFile) {
        showPopup("popup-no-video");
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {

        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

        // Visa progressbar
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        progressBar.style.display = "block";
        progressText.style.display = "block";

        // Starta simulerad progressbar
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 99) {
                progress += 1;
                document.getElementById("progress-bar-filled").style.width = `${progress}%`;
                document.getElementById("progress-text").textContent = `${progress}% of 100% to complete upgrade`;
            }
        }, 100);

        const resolutionMap = {
            '480p': '854x480',
            '720p': '1280x720',
            '1080p': '1920x1080',
            '1440p': '2560x1440',
            '2160p': '3840x2160'
        };
        const size = resolutionMap[resolution] || '1280x720';

        await ffmpeg.run('-i', 'input.mp4', '-vf', `scale=${size}`, 'output.mp4');

        // Stoppa tick och sätt till 100%
        clearInterval(interval);
        document.getElementById("progress-bar-filled").style.width = "100%";
        document.getElementById("progress-text").textContent = "100% of 100% to complete upgrade";

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        const source = document.getElementById("video-source");
        const video = document.getElementById("video-player");
        source.src = url;
        video.load();
        video.onloadeddata = () => {
        video.play().catch((e) => console.warn("Autoplay error:", e));
    
       document.getElementById("download-btn").style.display = "block";

        // Efter 1.5 sekunder: dölj bar + visa klart-text
        setTimeout(() => {
            progressBar.style.display = "none";
            progressText.textContent = "Upgrade complete!";
        }, 1500);
    };

    reader.readAsArrayBuffer(videoFile);
}

function setupAudioGraph(videoElement) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  // Kontrollera om sourceNode redan finns och är kopplad till samma video
  if (sourceNode) {
    try {
      sourceNode.disconnect();
    } catch (e) {
      console.warn("sourceNode already disconnected or invalid:", e);
    }
  }

  // Skapa ny koppling
  sourceNode = audioContext.createMediaElementSource(videoElement);

  gainNodeOriginal = audioContext.createGain();
  gainNodeMusic = audioContext.createGain();
  gainNodeCorrupted = audioContext.createGain();
  gainNodeFinal = audioContext.createGain();

  sourceNode
    .connect(gainNodeOriginal)
    .connect(gainNodeMusic)
    .connect(gainNodeCorrupted)
    .connect(gainNodeFinal)
    .connect(audioContext.destination);
}

function assignLanguageToCorrupted(language) {
  alert(`${language} has been assigned to Corrupted Volume.`);
  closePopup("popup-language-detection");
}

   // Se till att allt detta ligger INUTI EN enda `load`-lyssnare:
window.addEventListener("load", () => {
  document.getElementById("original-volume").addEventListener("input", () => updateVolumePercentage("original"));
  document.getElementById("corrupted-volume").addEventListener("input", () => updateVolumePercentage("corrupted"));
  document.getElementById("music-volume").addEventListener("input", () => updateVolumePercentage("music"));
  document.getElementById("final-volume").addEventListener("input", () => updateVolumePercentage("final"));

  // Gör funktionerna globala
  window.updateVolumePercentage = updateVolumePercentage;
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
  window.proceedToResolution = proceedToResolution;
  window.startUpgradeProcess = startUpgradeProcess;
}); 
