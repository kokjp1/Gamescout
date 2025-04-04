document.querySelectorAll(".remove-bookmark-button").forEach((button) => {
  button.addEventListener("click", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Disable button immediately
    this.disabled = true;

    const gameId = this.dataset.gameId; // Modern alternative to getAttribute

    try {
      const response = await fetch("/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      if (response.ok) {
        // Remove the game element from the DOM
        this.closest("li")?.remove();
      } else {
        // Re-enable button if request failed
        this.disabled = false;
        console.error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Network error:", error);
      this.disabled = false; // Re-enable button on error
    }
  });
});
