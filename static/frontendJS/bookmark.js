document.querySelectorAll(".remove-bookmark-button").forEach((button) => {
  button.addEventListener("click", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.disabled = true;

    const gameId = this.dataset.gameId;

    try {
      const response = await fetch("/bookmarks/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      if (response.ok) {
        this.closest("li")?.remove();
      } else {
        this.disabled = false;
        console.error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Network error:", error);
      this.disabled = false;
    }
  });
});
