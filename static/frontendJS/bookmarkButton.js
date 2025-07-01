document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#bookmarkButton");

  button.addEventListener("click", async () => {
    const gameId = button.dataset.gameid;
    const isBookmarked = button.dataset.bookmarked === "true";

    try {
      const response = await fetch("/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
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
      } else {
        console.error("Server response was not OK");
      }
    } catch (error) {
      console.error("Error tijdens fetch:", error);
    }
  });
});
