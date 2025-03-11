// Funktion för att hantera filval
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('file-name');
    const videoPlayer = document.getElementById('video-player');
    const videoSource = videoPlayer.querySelector('source');

    if (file) {
        if (file.type === 'video/mp4' || file.type === 'video/webm') {
            const fileURL = URL.createObjectURL(file);
            videoSource.src = fileURL;
            videoPlayer.load();
            fileInfo.textContent = `Selected file: ${file.name}`;
            localStorage.setItem('videoFile', fileURL);
        } else {
            fileInfo.textContent = 'Please select a valid video file (MP4 or WebM).';
        }
    } else {
        fileInfo.textContent = 'No file selected';
    }
}

// Kalla på när användaren väljer en fil
document.getElementById('browse-btn').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

// Funktion för att visa/dölja bakgrundsoptionssliden
let backgroundOptionsVisible = false;

document.getElementById('change-background-btn').addEventListener('click', function() {
    const options = document.getElementById('background-options');
    backgroundOptionsVisible = !backgroundOptionsVisible;
    options.style.display = backgroundOptionsVisible ? 'block' : 'none';
});

// Växla till Light Mode
document.getElementById('light-mode-btn').addEventListener('click', function() {
    document.body.className = 'light-mode';
    document.getElementById('background-options').style.display = 'none';
});

// Växla till Dark Mode
document.getElementById('dark-mode-btn').addEventListener('click', function() {
    document.body.className = 'dark-mode';
    document.getElementById('background-options').style.display = 'none';
});

// Funktion för att uppdatera volymprocent
function updateVolumePercentage(type) {
    const volumeElement = document.getElementById(`${type}-volume`);
    const volumePercent = document.getElementById(`${type}-volume-percent`);
    const volumeIcon = document.getElementById(`${type}-volume-icon`);
    volumePercent.textContent = `${volumeElement.value}%`;

    const volume = volumeElement.value;

    if (volume == 0) {
        volumeIcon.textContent = "🔈"; // Mute
    } else if (volume > 0 && volume <= 33) {
        volumeIcon.textContent = "🔉"; // Låg volym
    } else if (volume > 33 && volume <= 66) {
        volumeIcon.textContent = "🔊"; // Hög volym
    } else {
        volumeIcon.textContent = "🔊"; // Hög volym
    }
}

// Återställ volyminställningar och filreferens från localStorage när sidan laddas
window.addEventListener('load', function() {
    const originalVolume = localStorage.getItem('originalVolume') || 50;
    const corruptedVolume = localStorage.getItem('corruptedVolume') || 50;
    const musicVolume = localStorage.getItem('musicVolume') || 50;
    const finalVolume = localStorage.getItem('finalVolume') || 50;
    const videoFile = localStorage.getItem('videoFile');

    document.getElementById('original-volume').value = originalVolume;
    document.getElementById('corrupted-volume').value = corruptedVolume;
    document.getElementById('music-volume').value = musicVolume;
    document.getElementById('final-volume').value = finalVolume;

    updateVolumePercentage('original');
    updateVolumePercentage('corrupted');
    updateVolumePercentage('music');
    updateVolumePercentage('final');

    if (videoFile) {
        const videoPlayer = document.getElementById('video-player');
        const videoSource = videoPlayer.querySelector('source');
        videoSource.src = videoFile;
        videoPlayer.load();
    }
});

// Funktion för att spara ändringar
function saveChanges() {
    const originalVolume = document.getElementById('original-volume').value;
    const corruptedVolume = document.getElementById('corrupted-volume').value;
    const musicVolume = document.getElementById('music-volume').value;
    const finalVolume = document.getElementById('final-volume').value;
    const videoFile = localStorage.getItem('videoFile'); // Om video har laddats upp

    // Spara volyminställningar i localStorage
    localStorage.setItem('originalVolume', originalVolume);
    localStorage.setItem('corruptedVolume', corruptedVolume);
    localStorage.setItem('musicVolume', musicVolume);
    localStorage.setItem('finalVolume', finalVolume);

    // Om video är uppladdad, spara video-filen också
    if (videoFile) {
        localStorage.setItem('videoFile', videoFile);
    }

    // Bekräftelsemeddelande (kan vara tillfälligt)
    alert('Changes saved successfully!');
}

// Lägg till eventlyssnare på Save Changes-knappen
document.getElementById('save-btn').addEventListener('click', saveChanges);
