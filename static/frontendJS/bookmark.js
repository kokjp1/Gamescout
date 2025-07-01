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

//button voor delete van Bookmarks//

document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearBookmarksBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (confirm("Weet je zeker dat je alle bookmarks wilt verwijderen?")) {
        fetch("/bookmarks/clear", {
          method: "POST",
        })
          .then((res) => {
            if (res.ok) {
              const bookmarkCards = document.querySelectorAll(".gametile");
              bookmarkCards.forEach((card) => card.closest("li").remove());
            } else {
              alert("Er is iets misgegaan bij het verwijderen.");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Netwerkfout.");
          });
      }
    });
  }
});

// Einde button //
