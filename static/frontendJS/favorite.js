document.addEventListener("DOMContentLoaded", function () {
  const favoriteButton = document.querySelector('[data-action="favorite"]');

  favoriteButton.addEventListener("click", function () {
    favoriteButton.classList.toggle("favoriteToggle");
  });

  console.log("test");
});
