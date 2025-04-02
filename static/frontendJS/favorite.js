document.addEventListener("DOMContentLoaded", function () {
  const favoriteButton = document.querySelector('[data-action="favorite"]');

  favoriteButton.addEventListener("click", function () {
    favoriteButton.classList.toggle("favoriteToggle");
    if (favoriteButton.innerHTML === "Bookmarked") {
      favoriteButton.innerHTML = "Bookmark this game for later";
    } else {
      favoriteButton.innerHTML = "Bookmarked";
    }  });
});
