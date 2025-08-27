import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';
const ffmpeg = createFFmpeg({ log: true });
let gainNodeOriginal, gainNodeMusic, gainNodeCorrupted, gainNodeFinal, audioContext, sourceNode;
let uploadedFile = null;
let isConverting = false;
let isUpgrading = false;
let originalVolumeSlider;
let acceptedTerms = false;
let lastOperation = ""; // "convert" eller "upgrade"
let userAcceptedTerms = false;
let selectedUpgradeResolution = null;
let warningAccepted = false;
let languagePopupShown = false;
let downloadBtn; // global variabel
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let musicGain = null;

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

async function handleFileSelect(event) {
  languagePopupShown = false;
  closePopup("popup-language-detection");

  const file = event.target.files[0];
  if (!file) return;
  uploadedFile = file;

  // Skapa eller återanvänd videospelare
  let video = document.getElementById("video-player");
  if (!video) {
    video = document.createElement("video");
    video.id = "video-player";
    video.controls = true;
    document.getElementById("video-container").appendChild(video);
  } else {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  video.src = URL.createObjectURL(file);
  window.currentVideo = video;

  video.onloadedmetadata = async () => {
    video.volume = 0.5;
    video.muted = false;
    loadProgress(uploadedFile.name);
      
    try {
      await video.play();
    } catch (err) {
      console.warn("⚠️ Kunde inte spela upp video direkt:", err);
    }

    // 👇 Skicka fil till din backend som FormData
    const formData = new FormData();
    formData.append("file", uploadedFile);

    console.log("📤 Skickar fil till /api/predict");

    try {
      const predictRes = await fetch("https://xenobelino-backend.onrender.com/api/predict", {
        method: "POST",
        body: formData
      });

      if (!predictRes.ok) {
        const text = await predictRes.text();
        console.error("❌ Predict-svar (ej OK):", predictRes.status, text);
        throw new Error(`Fel från predict: ${predictRes.status}`);
      }

      const predictData = await predictRes.json();
      console.log("✅ Predict-resultat (hela):", predictData);
      console.log("🔍 Data från predictData.data:", predictData.data);
      console.log("🎼 music_url-värde:", predictData.data?.music_url);

        if (predictData && predictData.data) {
        showLanguageDetectionPopup(predictData.data);
      } else {
        console.warn("⚠️ Inget 'data'-fält i predict-svaret:", predictData);
      }

      // 🎵 Hantera separat musikfil (accompaniment)
      if (predictData.data && predictData.data.music_url) {
        console.log("🎵 Fick tillbaka musik-URL:", predictData.data.music_url);

        let musicAudio = document.getElementById("music-audio");
        if (!musicAudio) {
          musicAudio = document.createElement("audio");
          musicAudio.id = "music-audio";
          musicAudio.hidden = true;
          document.body.appendChild(musicAudio);
        } else {
          musicAudio.pause();
          musicAudio.removeAttribute("src");
          musicAudio.load();
        }

        musicAudio.src = predictData.data.music_url;
        musicAudio.loop = true;

        if (audioCtx.state === "suspended") {
  await audioCtx.resume();
  console.log("🎧 AudioContext återupptagen (resumed)");
}

// Skapa musicGain om den inte finns
if (!musicGain) {
  musicGain = audioCtx.createGain();
}

// Koppla musicAudio till musicGain om inte redan kopplad
if (!musicAudio.source) {
  musicAudio.source = audioCtx.createMediaElementSource(musicAudio);
  musicAudio.source.connect(musicGain);
  musicGain.connect(audioCtx.destination);
}

const slider = document.getElementById("music-volume");
const percent = document.getElementById("music-volume-percent");

// Sätt initial volym om gain är 1 (standard)
if (musicGain.gain.value === 1) {
  const defaultVolume = 0.5;
  musicGain.gain.setValueAtTime(defaultVolume, audioCtx.currentTime);
  slider.value = defaultVolume * 100;
  if (percent) percent.textContent = `${slider.value}%`;
}

// Uppdatera volym när användaren rör på slidern
slider.oninput = (e) => {
  const value = parseInt(e.target.value);
  const gain = value / 100;
  musicGain.gain.setValueAtTime(gain, audioCtx.currentTime);
  console.log("🎚️ Slider ändrades till:", value);
  console.log("🔊 gain satt till:", gain);
  if (percent) percent.textContent = `${value}%`;
};
        try {
          await musicAudio.play();
          console.log("▶️ Musik spelas upp");
        } catch (err) {
          console.warn("⚠️ Kunde inte spela upp musik:", err);
        }
       
       } else {
  console.warn("⚠️ Ingen music_url i predictData.data");
}

    } catch (err) {
      console.error("❌ Fel i predict-anrop:", err);
    }
  };

  document.getElementById("file-name").textContent = uploadedFile.name;
}

function showLanguageDetectionPopup(languages) {
  const popup = document.getElementById("popup-language-detection");
  const popupContent = document.getElementById("popup-language-detection-content");
  popupContent.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = "Language Detections";
  popupContent.appendChild(heading);

  const info = document.createElement("p");
  popupContent.appendChild(info);

  const languageList = document.createElement("ul");

  const languageArray = Array.isArray(languages)
    ? languages
    : typeof languages === "string"
      ? [languages]
      : [];

  if (languageArray.length > 1) {
    info.textContent = "We detected multiple languages in the audio. Choose one to remove.";
  } else if (languageArray.length === 1) {
    info.textContent = `We detected the language: ${languageArray[0]}`;
  } else {
    info.textContent = "Language detection failed: We couldn't identify any language.";
  }

  languageArray.forEach((lang) => {
    const item = document.createElement("li");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = `Ta bort ${lang}`;
    deleteBtn.onclick = async () => {
      const remaining = languageArray.filter(l => l !== lang);
      closePopup("popup-language-detection");

      const languageKept = remaining[0] || "unknown";

      try {
        const resultBlob = await combineAudioWithoutLanguage(lang, languageKept);
        offerDownloadOfEditedFile(resultBlob, languageKept);
      } catch (e) {
        alert("Fel vid borttagning av språk: " + e.message);
      }
    };
    item.appendChild(deleteBtn);
    languageList.appendChild(item);
  });

  popupContent.appendChild(languageList);

  if (languageArray.length === 0) {
    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.onclick = () => closePopup("popup-language-detection");
    popupContent.appendChild(okBtn);
  }

  popup.style.display = "block";
}

async function fetchPredictWithRetry(metadata, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch("https://xenobelino-backend.onrender.com/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata)
      });

      if (!res.ok) throw new Error("Svar ej OK");
      return await res.json();

    } catch (err) {
      console.warn(`🔁 Försök ${i + 1} misslyckades:`, err);
      if (i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, 5000)); // Vänta 5 sek innan nästa försök
    }
  }
}

function offerDownloadOfEditedFile(blob, languageKept) {
  const url = URL.createObjectURL(blob);
  const container = document.getElementById("download-link-container");
  if (!container) return;
  container.innerHTML = "";

  const link = document.createElement("a");
  link.href = url;
  link.download = `edited_video.mp4`;
  link.textContent = "Download new video";
  link.className = "button"; // 👈 samma stil som övriga knappar

  container.appendChild(link);
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

function saveProgress(videoId, progress) {
  localStorage.setItem(`progress_${videoId}`, progress);
}

function loadProgress(videoFileName) {
  const savedProgress = localStorage.getItem(`progress_${videoFileName}`);
  if (savedProgress) {
    const { time } = JSON.parse(savedProgress);
    const video = window.currentVideo || document.getElementById("video-player");
    if (video) {
      video.currentTime = time;
      document.getElementById("progress-status").innerText = `⏪ Återupptar från ${Math.floor(time)} sekunder`;
    }
  } else {
    document.getElementById("progress-status").innerText = "Ingen sparad progress";
  }
}

function clearProgress(videoId) {
  localStorage.removeItem(`progress_${videoId}`);
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
  const video = document.getElementById("video-player");
  return video && video.src && !video.src.includes("blob:null");
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
    optionsBox.style.display = "block"; // 👈 visa alltid – inte toggle
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
    optionsBox.style.display = "block";
}
       
async function startUpgradeProcess(resolution) {
  if (isUpgrading) {
    alert("En uppgradering pågår redan. Vänta tills den är klar.");
    return;
  }

  isUpgrading = true;

  console.log("Resolution selected:", resolution);
  showProgressBar();

  const videoFile = uploadedFile;
  if (!videoFile) {
    showPopup("popup-no-video");
    isUpgrading = false;
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");

      let startTime = Date.now();

    ffmpeg.setProgress(({ ratio }) => {
  const percent = Math.round(ratio * 100);
  const elapsed = (Date.now() - startTime) / 1000;
  const estimatedTotal = elapsed / (ratio || 0.01);
  const remaining = estimatedTotal - elapsed;

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = Math.floor(remaining % 60);

  const timeLeft =
    hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${minutes}m ${seconds}s`;

  document.getElementById("progress-bar-filled").style.width = `${percent}%`;
  progressText.textContent = `${percent}% of 100% to complete upgrade – approx. ${timeLeft} remaining`;
});

      const resolutionMap = {
        '480p': '854x480',
        '720p': '1280x720',
        '1080p': '1920x1080',
        '1440p': '2560x1440',
        '2160p': '3840x2160'
      };
      const size = resolutionMap[resolution] || '1280x720';

      await ffmpeg.run(
        '-i', 'input.mp4',
        '-vf', `scale=${size}:flags=lanczos`,
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-c:a', 'copy',
        'output.mp4'
      );

      // Läs och visa videon
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(videoBlob);

      const video = document.getElementById("video-player");
      video.pause();
      video.removeAttribute("src");
      video.src = url;
      video.load();
      video.play().catch((e) => console.warn("Autoplay error:", e));

      // Sätt upp nedladdning
      let fileName = "upgraded_video.mp4";
      if (uploadedFile) {
        const originalName = uploadedFile.name.replace(/\.[^/.]+$/, "");
        fileName = `${originalName}_upgraded_to_${resolution}.mp4`;
      }

      const downloadBtn = document.getElementById("download-btn");
      downloadBtn.href = url;
      downloadBtn.download = fileName;
      downloadBtn.style.display = "inline-block";
      downloadBtn.textContent = "Download Upgraded Video";

      setTimeout(() => {
        progressBar.style.display = "none";
        progressText.textContent = "Upgrade complete!";
      }, 1500);

      lastOperation = "upgrade";

    } catch (err) {
      console.error("Fel vid uppgradering:", err);
      alert("Ett fel uppstod under videouppgraderingen.");
    } finally {
      isUpgrading = false;
    }
  };

  // 🔁 Viktigt: detta kallas sist
  reader.readAsArrayBuffer(videoFile);
}

async function removeLanguageFromVideo(languageToDelete, languageKept) {
  if (!uploadedFile) {
    alert("No uploaded file found.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(reader.result));

      // 🔊 Här redigerar vi ljudet — detta exempel tar bort höger kanal (kan vara "Arabic")
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-af', 'pan=stereo|c0=c0|c1=0', // ← detta "mutar" höger kanal
        '-c:v', 'copy',
        'output.mp4'
      );

      const data = ffmpeg.FS('readFile', 'output.mp4');
      const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });

      offerDownloadOfEditedFile(videoBlob, languageKept);

    } catch (err) {
      console.error("Error while removing language:", err);
      alert("An error occurred during language removal.");
    }
  };

  reader.readAsArrayBuffer(uploadedFile);
}
    
function showProgressBar() {
  document.getElementById("progress-bar").style.display = "block";
  document.getElementById("progress-text").style.display = "block";
}

function setupAudioGraph(videoElement) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (!sourceNode) {
    try {
      sourceNode = audioContext.createMediaElementSource(videoElement);
    } catch (e) {
      console.warn("Kan inte skapa MediaElementSourceNode:", e);
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

    audioContext.resume().catch(e => {
      console.warn("AudioContext resume failed:", e);
    });
  }
  // Om sourceNode redan finns — gör inget mer här
}

function stopArrowKeysFromAffectingVideo(sliderElement) {
  sliderElement.addEventListener('keydown', (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.stopPropagation();
    }
  });
}

function assignLanguageToCorrupted(language) {
  const messageDiv = document.getElementById("corrupted-selected-language");
  messageDiv.textContent = `${language} has been assigned to Corrupted Volume.`;
  messageDiv.style.display = "block"; // visa texten
  closePopup("popup-language-detection");
}

    function handleLanguageDeletion(langToDelete, allLanguages) {
  const messageDiv = document.getElementById("corrupted-selected-language");
  messageDiv.textContent = `${langToDelete} has been deleted from the video.`;
  messageDiv.style.display = "block";

  const remaining = allLanguages.filter(l => l !== langToDelete);
  console.log("Remaining language(s):", remaining);

  // ⚙️ Kör riktig FFmpeg-baserad borttagning om bara ett språk kvar
  if (remaining.length === 1) {
    removeLanguageFromVideo(langToDelete, remaining[0]); // Anropa den nya funktionen
  }

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

 function setupAudioRouting(originalBuffer, musicBuffer, corruptedBuffer) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const gainOriginal = audioContext.createGain();
  const gainMusic = audioContext.createGain();
  const gainCorrupted = audioContext.createGain();

  const originalSource = audioContext.createBufferSource();
  const musicSource = audioContext.createBufferSource();
  const corruptedSource = audioContext.createBufferSource();

  originalSource.buffer = originalBuffer;
  musicSource.buffer = musicBuffer;
  corruptedSource.buffer = corruptedBuffer;

  originalSource.connect(gainOriginal).connect(audioContext.destination);
  musicSource.connect(gainMusic).connect(audioContext.destination);
  corruptedSource.connect(gainCorrupted).connect(audioContext.destination);

  gainOriginal.gain.value = 1.0;
  gainMusic.gain.value = 0.5;
  gainCorrupted.gain.value = 0.2;

  originalSource.start();
  musicSource.start();
  corruptedSource.start();
}

 window.setLightMode = setLightMode;
 window.setDarkMode = setDarkMode; 
 window.addEventListener("load", () => {
 // Variabler
const fileInput = document.getElementById('file-input');
const videoPlayer = document.getElementById('video-player');
const progressBar = document.getElementById('progress-bar');
const progressBarFilled = document.getElementById('progress-bar-filled');
const progressText = document.getElementById('progress-text');
const downloadBtn = document.getElementById('download-btn');
const originalVolumeSlider = document.getElementById('original-volume');
const video = videoPlayer;

let isConverting = false;
let lastOperation = null;

// Hjälpfunktion för att ladda ffmpeg vid behov
async function loadFFmpeg() {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
}

// Stoppa pil-tangenter från att påverka video-volym på sliders (om sådan funktion finns)
['original-volume', 'corrupted-volume', 'music-volume', 'final-volume'].forEach(id => {
  const slider = document.getElementById(id);
  if (slider) stopArrowKeysFromAffectingVideo(slider);
});

// Lyssnare: när original-volume slider ändras → uppdatera videons volym
originalVolumeSlider.addEventListener('input', () => {
  const volumeValue = originalVolumeSlider.value / 100;
  video.volume = volumeValue;
  video.muted = volumeValue === 0;
  updateVolumePercentage("original");
});

// Lyssnare: när video volym eller mute ändras (t.ex. med 'm' tangent)
video.addEventListener('volumechange', () => {
  if (video.muted) {
    originalVolumeSlider.value = 0;
  } else {
    originalVolumeSlider.value = video.volume * 100;
  }
  updateVolumePercentage("original");
});

// Funktion: Konvertera video till MP4 med ffmpeg
async function convertToMP4() {
  if (isConverting) {
    alert("Konvertering pågår redan. Vänta tills den är klar.");
    return;
  }

  if (!fileInput.files.length) {
    alert('Vänligen välj en videofil först!');
    return;
  }

  const file = fileInput.files[0];
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'mp4') {
    alert("Den här videofilen är redan i MP4-format. Ingen konvertering behövs.");
    return;
  }

  isConverting = true;
  const convertBtn = document.getElementById('convert-btn');
  convertBtn.disabled = true;
  convertBtn.textContent = 'Konverterar...';

  progressBar.style.display = 'block';
  progressBarFilled.style.width = '0%';
  progressText.style.display = 'block';
  progressText.textContent = '0% av 100% klart';

  try {
    await loadFFmpeg();

    const file = fileInput.files[0];
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    let startTime = Date.now();

   ffmpeg.setProgress(({ ratio }) => {
  const percent = Math.round(ratio * 100);
  const elapsed = (Date.now() - startTime) / 1000; // sekunder
  const estimatedTotal = elapsed / (ratio || 0.01); // undvik div/0
  const remaining = estimatedTotal - elapsed;

  // Beräkna timmar, minuter, sekunder
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = Math.floor(remaining % 60);

  // Formatera tid: dölj "0h" om onödigt
  const timeLeft =
    hours > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${minutes}m ${seconds}s`;

  progressBarFilled.style.width = percent + '%';
  progressText.textContent = `${percent}% av 100% to complete conversion – approx. ${timeLeft} kvar`;
});

    await ffmpeg.run('-i', file.name, '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(videoBlob);

    videoPlayer.src = videoURL;

    downloadBtn.style.display = 'inline-block';
    downloadBtn.textContent = "Download Converted Video";

    lastOperation = "convert";

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

// Download-knappens klick-händelse
downloadBtn.onclick = () => {
  if (lastOperation === "convert") {
    const file = fileInput.files[0];
    if (!file) return;
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const a = document.createElement("a");
    a.href = videoPlayer.src;
    a.download = `${originalName}_converted.mp4`;
    a.click();
  } else if (lastOperation === "upgrade") {
    downloadUpgradedVideo();
  }
};

// Övriga event-lyssnare
document.getElementById("original-volume").addEventListener("input", () => updateVolumePercentage("original"));
document.getElementById("corrupted-volume").addEventListener("input", () => updateVolumePercentage("corrupted"));
document.getElementById("music-volume").addEventListener("input", () => updateVolumePercentage("music"));
document.getElementById("final-volume").addEventListener("input", () => updateVolumePercentage("final"));
fileInput.addEventListener('change', handleFileSelect);
document.getElementById('convert-btn').addEventListener('click', convertToMP4);
document.getElementById("upgrade-video-btn").addEventListener("click", onUpgradeClick);

document.getElementById("corrupted-selected-language").textContent = "";
document.getElementById("corrupted-selected-language").style.display = "none";

document.addEventListener("keydown", (e) => {
  if (!video) return;
  switch (e.key) {
    case "f":
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => console.warn("Fullscreen error:", err));
      } else {
        document.exitFullscreen();
      }
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
      video.volume = Math.min(1, video.volume + 0.05);
      originalVolumeSlider.value = video.volume * 100;
      updateVolumePercentage("original");
      break;
    case "ArrowDown":
      video.volume = Math.max(0, video.volume - 0.05);
      originalVolumeSlider.value = video.volume * 100;
      updateVolumePercentage("original");
      break;
  }
});
     
// Eventlyssnare när användaren väljer fil
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    loadProgress(file.name);  // Använd filnamnet som id
  } else {
    document.getElementById("progress-status").innerText = "Ingen sparad progress";
  }
});

// Gör funktioner tillgängliga globalt så HTML kan anropa dem
window.triggerFileInput = triggerFileInput;
window.toggleBackgroundOptions = toggleBackgroundOptions;
window.updateVolumePercentage = updateVolumePercentage;
window.onUpgradeClick = onUpgradeClick;
window.acceptTerms = acceptTerms;
window.denyTerms = denyTerms;
window.proceedToResolution = proceedToResolution;
window.startUpgradeProcess = startUpgradeProcess;
window.handleResolutionClick = handleResolutionClick;
window.downloadUpgradedVideo = downloadUpgradedVideo;
window.closePopup = closePopup;
window.handleFileSelect = handleFileSelect;
window.setupAudioGraph = setupAudioGraph;
window.assignLanguageToCorrupted = assignLanguageToCorrupted;
window.showLanguageDetectionPopup = showLanguageDetectionPopup;
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
window.clearProgress = clearProgress;

console.log("main.js loaded successfully!");
});
