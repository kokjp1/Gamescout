document.addEventListener("DOMContentLoaded", function () {
  var options = {
    valueNames: ["name", "released", "rating"],
  };
  var gameList = new List("game-list", options);

  // Sort buttons
  document.getElementById("sort-ascending").addEventListener("click", function () {
    gameList.sort("name", { order: "asc" });
  });

  document.getElementById("sort-descending").addEventListener("click", function () {
    gameList.sort("name", { order: "desc" });
  });
});

const gameResult = document.querySelectorAll("article");
    gameResult.forEach((genreTile, index) => {
        genreTile.style.animationDelay = `${index * 0.1}s`;
    });