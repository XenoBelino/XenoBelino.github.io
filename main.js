import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

const ffmpeg = createFFmpeg({ log: true });
let gainNodeOriginal, gainNodeMusic, gainNodeCorrupted, gainNodeFinal, audioContext, sourceNode;
let uploadedFile = null;
let acceptedTerms = false;
let userAcceptedTerms = false;
let selectedUpgradeResolution = null;
let warningAccepted = false;
let languagePopupShown = false;

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
  video.onloadedmetadata = () => {
  video.play().catch((e) => console.warn("Autoplay error:", e));
  };

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

    // Visa popup
    function showPopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.style.display = "block";
    }
}

function closePopup(id) {
    const popup = document.getElementById(id);
    if (popup) {
        popup.style.display = "none";
    }
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
   const noVideoPopup = document.getElementById("popup-no-video");
     if (!uploadedFile) {
        // Om popup redan är öppen -> stäng den
        if (noVideoPopup.style.display === "block") {
            closePopup("popup-no-video");
        } else {
            showPopup("popup-no-video");
        }
        return;
    }

    // ✅ Stäng popup om redan öppen
    if (isAnyUpgradePopupOpen()) {
        closeAllUpgradePopups();
        return;
    }

    // ✅ Fortsätt med varning och upplösning
    if (warningAccepted) {
        showResolutionOptions();
    } else {
        showPopup("popup-warning");
    }
}

    function proceedToResolution() {
        warningAccepted = true;
        closePopup("popup-warning");
        const optionsBox = document.getElementById("upgrade-options");
        optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
        showResolutionOptions();
    }

    async function handleResolutionClick(resolution) {
    selectedUpgradeResolution = resolution;
    document.getElementById("upgrade-options").style.display = "none"; // Stäng popup

    const currentResolution = getVideoResolution(); // Din egen funktion

    // Kontrollera om videon redan har tillräckligt hög upplösning
    if (compareResolutions(currentResolution, resolution) >= 0) {
       document.getElementById("sufficient-text").textContent = 
    `Your video is already sufficient. It already has ${currentResolution}.`;
        showPopup("popup-sufficient");
        return;
    }

    // Kontrollera om användaren godkänt villkoren
    if (!userAcceptedTerms) {
        showPopup("popup-terms");
        return;
    }

    // Kör uppgraderingen, säkert med felhantering
    try {
        await startUpgradeProcess(resolution);
    } catch (error) {
        console.error("Upgrade failed:", error);
        showPopup("popup-error"); // Visa något om det misslyckas
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
    document.getElementById("progress-bar").style.display = "none";
    document.getElementById("progress-text").style.display = "none";
}


    // Dummy-metod: få aktuell videoupplösning
    function getVideoResolution() {
  const video = document.getElementById("video-player");
  if (video.videoHeight) {
    if (video.videoHeight >= 2160) return "2160p";
    if (video.videoHeight >= 1440) return "1440p";
    if (video.videoHeight >= 1080) return "1080p";
    if (video.videoHeight >= 720)  return "720p";
    return "480p";
  }
  return "Unknown";
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
    if (optionsBox.style.display === "block") {
        optionsBox.style.display = "none";
    } else {
        optionsBox.style.display = "block";
    }
}  
       
async function startUpgradeProcess(resolution) {
     console.log("Resolution selected:", resolution); // Debug
  showProgressBar(); // Visa progress bar
  simulateUpgrade(resolution);
    const videoFile = uploadedFile; // <-- fix: använd sparad fil

    if (!videoFile) {
        showPopup("popup-no-video");
        return;
    }

    const reader = new FileReader();
   reader.onload = async () => {
    if (!ffmpeg.isLoaded()) {
  await ffmpeg.load();
}
    ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    progressBar.style.display = "block";
    progressText.style.display = "block";

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

        setTimeout(() => {
            progressBar.style.display = "none";
            progressText.textContent = "Upgrade complete!";
        }, 1500);
    };
};

// ✅ Flytta reader.readAsArrayBuffer(videoFile) INNANFÖR funktionen:
reader.readAsArrayBuffer(videoFile); // <-- ska vara här inne

 };

function showProgressBar() {
  document.getElementById("progress-bar").style.display = "block";
  document.getElementById("progress-text").style.display = "block";
}

function simulateUpgrade(resolution) {
  let progress = 0;
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
      document.getElementById("progress-text").textContent = `Upgrade to ${resolution} complete!`;
      document.getElementById("download-btn").style.display = "block";
    } else {
      progress += 10;
      document.getElementById("progress-bar-filled").style.width = `${progress}%`;
      document.getElementById("progress-text").textContent = `${progress}% of 100% to complete upgrade`;
    }
  }, 500);
}


function setupAudioGraph(videoElement) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  // Undvik att skapa flera MediaElementSourceNode från samma element
  try {
    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode.mediaElement = null; // 👈 viktigt ibland för vissa browsers
      sourceNode = null;
    }
  } catch (e) {
    console.warn("Error disconnecting sourceNode:", e);
  }

  try {
    sourceNode = audioContext.createMediaElementSource(videoElement);
  } catch (e) {
    console.warn("MediaElementSourceNode error:", e);
    return;
  }

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
  const messageDiv = document.getElementById("corrupted-selected-language");
  messageDiv.textContent = `${language} has been assigned to Corrupted Volume.`;
  messageDiv.style.display = "block"; // visa texten
  closePopup("popup-language-detection");
}

function closeResolutionPopup() {
    document.getElementById('upgrade-options').style.display = 'none';
}

function onUpgradeComplete() {
    document.getElementById('progress-bar').style.display = 'none';
    document.getElementById('download-btn').style.display = 'block';
}

function closeNoVideoPopup() {
    document.getElementById('popup-no-video').style.display = 'none';
}

 async function loadFFmpeg() {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
}
   // Se till att allt detta ligger INUTI EN enda load-lyssnare:
  window.addEventListener("load", () => {
  const convertBtn = document.getElementById('convert-btn');
  const fileInput = document.getElementById('file-input');
  const videoPlayer = document.getElementById('video-player');
  const progressBar = document.getElementById('progress-bar');
  const progressBarFilled = document.getElementById('progress-bar-filled');
  const progressText = document.getElementById('progress-text');
  const downloadBtn = document.getElementById('download-btn');

  document.getElementById("original-volume").addEventListener("input", () => updateVolumePercentage("original"));
  document.getElementById("corrupted-volume").addEventListener("input", () => updateVolumePercentage("corrupted"));
  document.getElementById("music-volume").addEventListener("input", () => updateVolumePercentage("music"));
  document.getElementById("final-volume").addEventListener("input", () => updateVolumePercentage("final"));
  document.getElementById('file-input').addEventListener('change', handleFileSelect);
  document.getElementById('convert-btn').addEventListener('click', convertToMP4);
  document.getElementById("upgrade-video-btn").addEventListener("click", onUpgradeClick);
  document.getElementById("corrupted-selected-language").textContent = "";
  document.getElementById("corrupted-selected-language").style.display = "none";
  async function convertToMP4() {
  if (!fileInput.files.length) {
    alert('Vänligen välj en videofil först!');
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = 'Konverterar...';

  progressBar.style.display = 'block';
  progressBarFilled.style.width = '0%';
  progressText.style.display = 'block';
  progressText.textContent = '0% av 100% klart';

  await loadFFmpeg();

  const file = fileInput.files[0];
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));

  ffmpeg.setProgress(({ ratio }) => {
    const percent = Math.round(ratio * 100);
    progressBarFilled.style.width = percent + '%';
    progressText.textContent = `${percent}% av 100% klart`;
  });

  try {
    await ffmpeg.run('-i', file.name, '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4');
  } catch (e) {
    alert('Fel vid konvertering: ' + e.message);
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert to MP4';
    progressBar.style.display = 'none';
    progressText.style.display = 'none';
    return;
  }

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const videoURL = URL.createObjectURL(videoBlob);

  videoPlayer.src = videoURL;

  downloadBtn.style.display = 'inline-block';
  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = videoURL;
    a.download = 'converted-video.mp4';
    a.click();
  };

  convertBtn.disabled = false;
  convertBtn.textContent = 'Convert to MP4';

  progressBar.style.display = 'none';
  progressText.style.display = 'none';
}
  document.addEventListener("keydown", (e) => {
  const video = document.getElementById("video-player");
  if (!video) return;

  switch (e.key.toLowerCase()) {
    case "f":
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
      break;
    case "m":
      video.muted = !video.muted;
      break;
    case "k":
    case " ":
      // Play/pause
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      e.preventDefault(); // förhindra scroll om det är mellanslag
      break;
    case "arrowleft":
      video.currentTime = Math.max(0, video.currentTime - 5);
      break;
    case "arrowright":
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
      break;
  }
});

  // Gör funktionerna globala
  window.handleResolutionClick = handleResolutionClick;
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
  console.log("main.js loaded successfully!");
}); 
