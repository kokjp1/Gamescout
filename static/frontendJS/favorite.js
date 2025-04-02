document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#bookmarkButton");
  if (!button) return;

  button.addEventListener("click", async () => {
    const gameId = button.dataset.gameid;
    const isBookmarked = button.dataset.bookmarked === "true";

    const response = await fetch("/bookmarks/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        gameId,
      }),
    });

    if (response.ok) {
      if (isBookmarked) {
        button.textContent = "Bookmark this game for later";
        button.dataset.bookmarked = "false";
        button.classList.remove("favoriteToggle");
      } else {
        button.textContent = "✓ Added to Bookmarks";
        button.dataset.bookmarked = "true";
        button.classList.add("favoriteToggle");
      }
    }
  });
});
