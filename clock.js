function formatTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const $timeSection = document.getElementById("timer");

function render() {
  $timeSection.textContent = formatTime();
}

const timer = setInterval(render, 1000);
