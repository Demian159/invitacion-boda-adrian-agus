const weddingStart = new Date("2027-02-07T19:30:00-03:00").getTime();

const countdownNodes = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const toast = document.getElementById("toast");
let toastTimer;

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

updateCountdown();
setInterval(updateCountdown, 1000);
