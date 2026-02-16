// Target Date: Chinese New Year 2026 (Feb 17, 2026 at 00:00:00 in +07:00)
const TARGET_DATE = new Date('2026-02-17T00:00:00+07:00').getTime();

// Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownSection = document.getElementById('countdownSection');
const videoSection = document.getElementById('videoSection');
const lanternContainer = document.getElementById('lanternContainer');
const fireworkSound = document.getElementById('fireworkSound');
const musicToggle = document.getElementById('musicToggle');

let player;
let bgMusicPlayer;
let countdownStarted = false;
let isPlaying = false;

// YouTube IFrame API Ready
function onYouTubeIframeAPIReady() {
    // Firework Player
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'sX6z6fI-S8M', // Saigon 2024 Fireworks Spectacular
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });

    // Background Music Player
    bgMusicPlayer = new YT.Player('musicPlayer', {
        height: '0',
        width: '0',
        videoId: 'IQlBt_BEWfg', // Nhạc Tết Remix 2024
        playerVars: {
            'autoplay': 0,
            'loop': 1,
            'playlist': 'IQlBt_BEWfg'
        }
    });
}

function onPlayerReady(event) {
    console.log("Player ready");
}

// Create Lanterns
function createLanterns() {
    for (let i = 0; i < 15; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.style.left = Math.random() * 100 + 'vw';
        lantern.style.animationDuration = (Math.random() * 5 + 10) + 's';
        lantern.style.animationDelay = (Math.random() * 10) + 's';
        lantern.style.opacity = Math.random() * 0.5 + 0.3;
        lantern.style.width = (Math.random() * 20 + 40) + 'px';
        lantern.style.height = (parseFloat(lantern.style.width) * 1.33) + 'px';
        lanternContainer.appendChild(lantern);
    }
}

// Create Hoa Mai (Blossoms)
function createBlossoms() {
    for (let i = 0; i < 20; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'blossom';
        blossom.style.left = Math.random() * 100 + 'vw';
        blossom.style.top = -20 + 'px';
        blossom.style.animationDuration = (Math.random() * 5 + 5) + 's';
        blossom.style.animationDelay = (Math.random() * 10) + 's';
        blossom.style.opacity = Math.random() * 0.7 + 0.3;
        lanternContainer.appendChild(blossom);
    }
}

// Countdown Logic
function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance < 0) {
        if (!countdownStarted) {
            startCelebration();
            countdownStarted = true;
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minutesEl.innerText = String(minutes).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
}

function startCelebration() {
    countdownSection.classList.add('hidden');
    videoSection.classList.remove('hidden');

    // Pause background music if it's playing to let fireworks sound take over
    if (bgMusicPlayer && bgMusicPlayer.pauseVideo) {
        bgMusicPlayer.pauseVideo();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.text').innerText = 'Play Tết Music';
        isPlaying = false;
    }

    // Play Video
    if (player && player.playVideo) {
        player.playVideo();
    }

    // Play sound effect
    fireworkSound.play().catch(e => console.log("Sound autoplay blocked"));

    // Trigger Confetti
    startConfetti();
}

function toggleMusic() {
    if (!bgMusicPlayer) return;

    if (isPlaying) {
        bgMusicPlayer.pauseVideo();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.text').innerText = 'Play Tết Music';
    } else {
        bgMusicPlayer.playVideo();
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.text').innerText = 'Tết Music Playing...';
    }
    isPlaying = !isPlaying;
}

function restartCelebration() {
    if (player && player.seekTo) {
        player.seekTo(0);
        player.playVideo();
    }
    startConfetti();
}

// Simple Confetti Effect
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function startConfetti() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 5 + 2,
            d: Math.random() * 10,
            color: `hsl(${Math.random() * 40 + 20}, 100%, 50%)`, // Gold/Red tones
            tilt: Math.random() * 10 - 10
        });
    }
    requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.tilt += Math.sin(p.d) * 0.1;

        if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(drawConfetti);
}

// Init
createLanterns();
createBlossoms();
setInterval(updateCountdown, 1000);
updateCountdown();

// Resize handle for canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
