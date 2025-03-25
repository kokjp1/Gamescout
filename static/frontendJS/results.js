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

  document.getElementById("sort-ascending").addEventListener("click", function () {
    gameList.sort("name", { order: "asc" });
    smoothAnimationDelays();
  });

  document.getElementById("sort-descending").addEventListener("click", function () {
    gameList.sort("name", { order: "desc" });
    smoothAnimationDelays(); 
  });
});