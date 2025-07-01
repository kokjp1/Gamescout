document.addEventListener("DOMContentLoaded", function () {
  const sortButton = document.querySelector(".sort-button");

  if (!document.querySelector("#bookmark-list")) return;

  const bookmarkList = new List("bookmark-list", {
    valueNames: ["name", "released"],
  });

  function updateSortButton(text = "Sort by...") {
    if (sortButton) sortButton.textContent = text;
  }

  function resetAnimations() {
    document.querySelectorAll(".gametile").forEach((el) => {
      el.classList.remove("fade-in");
      void el.offsetWidth;
      el.classList.add("fade-in");
    }); 
  }

  updateSortButton();

  document.getElementById("sort-Released-ascending").onclick = function () {
    bookmarkList.sort("released", { order: "asc" });
    resetAnimations();
    updateSortButton("Sort by: Oldest First");
  };

  document.getElementById("sort-Released-descending").onclick = function () {
    bookmarkList.sort("released", { order: "desc" });
    resetAnimations();
    updateSortButton("Sort by: Newest First");
  };
});
