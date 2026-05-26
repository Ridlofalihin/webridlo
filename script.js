/* ============================================================
   COUPLE WEBSITE — script.js
   ============================================================ */

// ── Cursor glow ──────────────────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ── Smooth scroll helper ─────────────────────────────────────
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.smoothScrollTo = smoothScrollTo;

// ── GSAP + ScrollTrigger setup ───────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Parallax on hero orbs ─────────────────────────────────────
gsap.to('.orb-1', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});
gsap.to('.orb-2', {
  yPercent: -50,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
});
gsap.to('.orb-3', {
  yPercent: -20,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
});

// ── Reveal: generic .reveal elements ─────────────────────────
document.querySelectorAll('.reveal').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => el.classList.add('is-visible')
  });
});

// ── Reveal: gallery items with stagger ───────────────────────
document.querySelectorAll('.reveal-item').forEach((el) => {
  const delay = parseInt(el.dataset.delay || 0, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    onEnter: () => {
      setTimeout(() => el.classList.add('is-visible'), delay);
    }
  });
});

// ── Video hover play ──────────────────────────────────────────
document.querySelectorAll('.video-item').forEach((item) => {
  const video    = item.querySelector('video');
  const playBtn  = item.querySelector('.video-play-btn');
  if (!video) return;

  let isPlaying = false;

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      video.pause();
      playBtn.style.opacity = '1';
      isPlaying = false;
    } else {
      video.play();
      playBtn.style.opacity = '0';
      isPlaying = true;
    }
  });

  video.addEventListener('click', () => {
    if (isPlaying) {
      video.pause();
      playBtn.style.opacity = '1';
      isPlaying = false;
    }
  });

  video.addEventListener('ended', () => {
    playBtn.style.opacity = '1';
    isPlaying = false;
  });
});

// ── Love Counter ──────────────────────────────────────────────
function updateCounter() {
  // Change this date to your real start date
  const startDate = new Date('2025-12-28T00:00:00');
  const now       = new Date();
  const diffMs    = now - startDate;

  const days  = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  animateCount(document.getElementById('daysCount'), days);
  animateCount(document.getElementById('hoursCount'), hours);
}

function animateCount(el, target) {
  if (!el) return;
  let current = 0;
  const step  = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}

ScrollTrigger.create({
  trigger: '.counter-section',
  start: 'top 80%',
  onEnter: () => updateCounter(),
  once: true
});

// ── Floating Hearts Canvas ─────────────────────────────────────
const canvas  = document.getElementById('heartsCanvas');
const ctx     = canvas.getContext('2d');
let   width, height;
const hearts  = [];

function resizeCanvas() {
  width  = canvas.width  = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
  constructor() { this.reset(true); }

  reset(initial) {
    this.x     = Math.random() * width;
    this.y     = initial ? Math.random() * height : height + 20;
    this.size  = 6 + Math.random() * 10;
    this.speed = 0.3 + Math.random() * 0.5;
    this.drift = (Math.random() - 0.5) * 0.5;
    this.alpha = 0.1 + Math.random() * 0.25;
    this.rot   = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.015;
  }

  update() {
    this.y   -= this.speed;
    this.x   += this.drift;
    this.rot += this.rotSpeed;
    if (this.y < -20) this.reset(false);
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.scale(this.size / 10, this.size / 10);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(5, -8, 10, -3, 0, 5);
    ctx.bezierCurveTo(-10, -3, -5, -8, 0, -3);
    ctx.fillStyle = '#f72585';
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 28; i++) hearts.push(new Heart());

function animateHearts() {
  ctx.clearRect(0, 0, width, height);
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// Click burst
document.addEventListener('click', (e) => {
  for (let i = 0; i < 5; i++) {
    const h = new Heart();
    h.x     = e.clientX + (Math.random() - 0.5) * 40;
    h.y     = e.clientY + (Math.random() - 0.5) * 20;
    h.speed = 1.5 + Math.random() * 2;
    h.size  = 8 + Math.random() * 8;
    h.alpha = 0.5;
    hearts.push(h);
    if (hearts.length > 60) hearts.shift();
  }
});

// ── Music Player ──────────────────────────────────────────────
const songs = [
  { title: 'Perfect',           artist: 'Ed Sheeran',       src: 'music/song1.mp3', duration: '4:23' },
  { title: 'All of Me',         artist: 'John Legend',       src: 'music/song2.mp3', duration: '4:29' },
  { title: 'A Thousand Years',  artist: 'Christina Perri',   src: 'music/song3.mp3', duration: '4:45' }
];

const audioPlayer   = document.getElementById('audioPlayer');
const playBtn       = document.getElementById('playBtn');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const songName      = document.getElementById('songName');
const songArtist    = document.getElementById('songArtist');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressBar   = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl   = document.getElementById('totalTime');
const equalizer     = document.getElementById('equalizer');
const albumArt      = document.getElementById('albumArt');
const spinRing      = document.querySelector('.album-spin-ring');
const songItems     = document.querySelectorAll('.song-item');

let currentIndex = 0;
let isPlaying    = false;

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function loadSong(index) {
  currentIndex = index;
  const song   = songs[index];

  audioPlayer.src = song.src;
  songName.textContent   = song.title;
  songArtist.textContent = '— ' + song.artist;

  // Update active in list
  songItems.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });

  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent   = song.duration;
}

function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    setPlaying(false);
  } else {
    audioPlayer.play().catch(() => {
      // Autoplay policy — still show playing UI
      setPlaying(true);
    });
    setPlaying(true);
  }
}

function setPlaying(state) {
  isPlaying = state;
  const iconPlay  = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');
  iconPlay.style.display  = state ? 'none'  : 'block';
  iconPause.style.display = state ? 'block' : 'none';
  equalizer.classList.toggle('active', state);
  albumArt.classList.toggle('spinning', state);
  spinRing.classList.toggle('active', state);
}

function playNext() {
  const next = (currentIndex + 1) % songs.length;
  loadSong(next);
  if (isPlaying) audioPlayer.play().catch(() => {});
}

function playPrev() {
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  const prev = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(prev);
  if (isPlaying) audioPlayer.play().catch(() => {});
}

playBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

audioPlayer.addEventListener('timeupdate', () => {
  if (!audioPlayer.duration) return;
  const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  totalTimeEl.textContent   = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', playNext);

// Click on progress bar
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  if (audioPlayer.duration) {
    audioPlayer.currentTime = pct * audioPlayer.duration;
  }
});

// Song list click
songItems.forEach((item) => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.index, 10);
    loadSong(idx);
    audioPlayer.play().catch(() => setPlaying(true));
    setPlaying(true);
  });
});

// Init
loadSong(0);

// ── Gallery section header fade in ───────────────────────────
ScrollTrigger.create({
  trigger: '.gallery-section',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.gallery-section .section-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
    );
  },
  once: true
});

// ── Gentle parallax on gallery grid rows ─────────────────────
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  const dir = i % 2 === 0 ? 20 : -20;
  gsap.fromTo(item,
    { y: dir },
    {
      y: -dir,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    }
  );
});

// ── Smooth section transitions via CSS-class-based reveal ─────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal, .reveal-item').forEach((el) => observer.observe(el));
