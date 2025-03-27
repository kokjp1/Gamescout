document.addEventListener("DOMContentLoaded", function () {
  const sortButton = document.querySelector(".sort-button");
  const gameList = new List("game-list", {
    valueNames: ["name", "released", "rating"]
  });

  function updateSortButton(text = "Sort by:") {
    sortButton.textContent = text;
  }

  updateSortButton();

  document.getElementById("sort-A-Z-ascending").onclick = function() {
    gameList.sort("name", { order: "asc" });
    resetAnimations();
    updateSortButton("Sort by: A-Z");
  };

  document.getElementById("sort-Z-A-descending").onclick = function() {
    gameList.sort("name", { order: "desc" });
    resetAnimations();
    updateSortButton("Sort by: Z-A");
  };

  document.getElementById("sort-Rating-ascending").onclick = function() {
    gameList.sort("rating", { order: "asc" });
    resetAnimations();
    updateSortButton("Sort by: Rating (lowest first)");
  };

  document.getElementById("sort-Rating-descending").onclick = function() {
    gameList.sort("rating", { order: "desc" });
    resetAnimations();
    updateSortButton("Sort by: Rating (highest first)");
  };

  document.getElementById("sort-Released-ascending").onclick = function() {
    gameList.sort("released", { order: "asc" });
    resetAnimations();
    updateSortButton("Sort by: Oldest first");
  };

  document.getElementById("sort-Released-descending").onclick = function() {
    gameList.sort("released", { order: "desc" });
    resetAnimations();
    updateSortButton("Sort by: Newest first");
  };
});