function createIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  //Deepseek uitleg gevraasgd over Intersection Observer en https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

  // Observe all game tiles
  document.querySelectorAll(".gametile").forEach((tile) => {
    observer.observe(tile);
  });
}

//voor ListJS
function resetAnimations() {
  document.querySelectorAll(".gametile").forEach((tile) => {
    tile.classList.remove("visible");
  });
}

document.addEventListener("DOMContentLoaded", createIntersectionObserver);
