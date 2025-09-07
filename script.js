const elevator = document.getElementById("elevator");
const progress = document.getElementById("progress");
const timeline = document.getElementById("timeline");
const products = document.querySelectorAll(".product");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function updateElevator() {
  if (!products.length) return;

  const vpH = window.innerHeight;
  const scrollY = window.scrollY;

  // Centers (absolute, relative to document) of first and last product
  const firstEl = products[0];
  const lastEl = products[products.length - 1];
  const firstMid = firstEl.offsetTop + firstEl.offsetHeight / 2;
  const lastMid = lastEl.offsetTop + lastEl.offsetHeight / 2;

  // Current viewport center (absolute)
  const viewMid = scrollY + vpH / 2;

  // Show elevator & spine only once we reach the first product
  if (viewMid < firstMid) {
    elevator.style.opacity = 0;
    timeline.style.opacity = 0;
    progress.style.height = "0px";
    // Remove any active styles before the list starts
    products.forEach((p) => p.classList.remove("active"));
    return;
  } else {
    elevator.style.opacity = 1;
    timeline.style.opacity = 1;
  }

  // Normalized progress from first product center to last product center
  const t = clamp((viewMid - firstMid) / (lastMid - firstMid), 0, 1);

  // Move elevator smoothly along the viewport spine (no snapping)
  const track = vpH - elevator.offsetHeight;
  const elevY = t * track;
  elevator.style.transform = `translate(-50%, ${elevY}px)`;

  // Grow progress line smoothly from top of viewport
  progress.style.height = `${t * 100}vh`;

  // Highlight the section whose center is closest to viewport center
  let nearest = products[0];
  let minDelta = Infinity;
  products.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    const secMid = rect.top + rect.height / 2;
    const delta = Math.abs(secMid - vpH / 2);
    if (delta < minDelta) {
      minDelta = delta;
      nearest = sec;
    }
  });
  products.forEach((p) => p.classList.remove("active"));
  nearest.classList.add("active");
}

window.addEventListener("scroll", updateElevator, { passive: true });
window.addEventListener("resize", updateElevator);
document.addEventListener("DOMContentLoaded", updateElevator);
