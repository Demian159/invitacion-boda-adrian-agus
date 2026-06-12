const weddingStart = new Date("2027-02-07T19:30:00-03:00").getTime();

const countdownNodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const introScreen = document.querySelector(".intro-screen");
const introEnter = document.getElementById("intro-enter");
const toast = document.getElementById("toast");
const musicPlayer = document.querySelector(".music-player");
const musicToggle = document.getElementById("music-toggle");
const musicStatus = document.getElementById("music-status");
const youtubeVideoId = "vGJTaP6anOU";

let toastTimer;
let youtubePlayer;
let playMusicWhenReady = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}

function updateCountdown() {
  const diff = weddingStart - Date.now();

  if (diff <= 0) {
    countdownNodes.days.textContent = "000";
    countdownNodes.hours.textContent = "00";
    countdownNodes.minutes.textContent = "00";
    countdownNodes.seconds.textContent = "00";
    return;
  }

  const secondsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  countdownNodes.days.textContent = pad(days, 3);
  countdownNodes.hours.textContent = pad(hours);
  countdownNodes.minutes.textContent = pad(minutes);
  countdownNodes.seconds.textContent = pad(seconds);
}

function isPlaceholderHref(href) {
  return href.startsWith("REEMPLAZAR_");
}

function setMusicState(state, status) {
  if (!musicPlayer || !musicToggle || !musicStatus) {
    return;
  }

  musicPlayer.dataset.state = state;
  musicStatus.textContent = status;
  musicToggle.setAttribute("aria-pressed", state === "playing" ? "true" : "false");
  musicToggle.setAttribute("aria-label", state === "playing" ? "Pausar música" : "Reproducir música");
}

function closeIntroScreen() {
  if (!introScreen) {
    return;
  }

  document.body.classList.remove("intro-active");
  introScreen.classList.add("is-hidden");
  introScreen.setAttribute("aria-hidden", "true");
}

function playMusicFromIntent() {
  if (!youtubePlayer) {
    playMusicWhenReady = true;
    setMusicState("loading", "Preparando canción");
    loadYouTubeApi();
    return;
  }

  try {
    playMusicWhenReady = false;
    setMusicState("loading", "Intentando reproducir");
    youtubePlayer.unMute();
    youtubePlayer.setVolume(70);
    youtubePlayer.playVideo();

    setTimeout(() => {
      if (
        window.YT &&
        youtubePlayer &&
        youtubePlayer.getPlayerState() !== window.YT.PlayerState.PLAYING
      ) {
        setMusicState("blocked", "Tocar para escuchar");
      }
    }, 1300);
  } catch {
    setMusicState("blocked", "Tocar para escuchar");
  }
}

function onYouTubePlayerReady() {
  setMusicState("paused", "Lista para escuchar");

  if (playMusicWhenReady) {
    playMusicFromIntent();
  }
}

function onYouTubePlayerStateChange(event) {
  if (!window.YT) {
    return;
  }

  if (event.data === window.YT.PlayerState.PLAYING) {
    setMusicState("playing", "Sonando");
  }

  if (event.data === window.YT.PlayerState.PAUSED) {
    setMusicState("paused", "Pausada");
  }

  if (event.data === window.YT.PlayerState.ENDED) {
    setMusicState("paused", "Tocar para repetir");
  }
}

function createYouTubePlayer() {
  if (!window.YT || !window.YT.Player || youtubePlayer) {
    return;
  }

  youtubePlayer = new window.YT.Player("youtube-player", {
    width: "1",
    height: "1",
    videoId: youtubeVideoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      origin: window.location.origin,
    },
    events: {
      onReady: onYouTubePlayerReady,
      onStateChange: onYouTubePlayerStateChange,
    },
  });
}

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    createYouTubePlayer();
    return;
  }

  if (!musicPlayer || document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
    return;
  }

  window.onYouTubeIframeAPIReady = createYouTubePlayer;

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.async = true;
  tag.onerror = () => {
    setMusicState("blocked", "No se pudo cargar");
  };
  document.head.appendChild(tag);
}

function enterInvitation() {
  closeIntroScreen();
  playMusicFromIntent();
}

function toggleMusic() {
  if (!youtubePlayer) {
    playMusicFromIntent();
    return;
  }

  const state = youtubePlayer.getPlayerState();

  if (window.YT && state === window.YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
    return;
  }

  playMusicFromIntent();
}

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href") || "";

  if (!isPlaceholderHref(href)) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(link.dataset.pendingMessage || "Este link todavía está pendiente.");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      showToast("Copiado.");
    } catch {
      showToast(value);
    }
  });
});

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
  loadYouTubeApi();
}

if (introEnter) {
  introEnter.addEventListener("click", enterInvitation);
}

updateCountdown();
setInterval(updateCountdown, 1000);
