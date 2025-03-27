document.addEventListener("DOMContentLoaded", function () {
  var options = {
    valueNames: ["name", "released", "rating"],
  };
  var gameList = new List("game-list", options);

  function smoothAnimationDelays() {
    const gameResult = document.querySelectorAll("article");
    gameResult.forEach((gameTile, index) => {
      gameTile.style.animationDelay = `${index * 0.1}s`;
    });
  }

  smoothAnimationDelays();

  document.getElementById("sort-A-Z-ascending").addEventListener("click", function () {
    gameList.sort("name", { order: "asc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-Z-A-descending").addEventListener("click", function () {
    gameList.sort("name", { order: "desc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-Rating-ascending").addEventListener("click", function () {
    gameList.sort("rating", { order: "asc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-Rating-descending").addEventListener("click", function () {
    gameList.sort("rating", { order: "desc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-Released-ascending").addEventListener("click", function () {
    gameList.sort("released", { order: "asc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-Released-descending").addEventListener("click", function () {
    gameList.sort("released", { order: "desc" });
    smoothAnimationDelays();
  });
});
