//Import elements
var topBlock = document.getElementById("topBlock");
var bottomBlock = document.getElementById("bottomBlock");
var character = document.getElementById("character");
var game = document.getElementById("game");
var start = document.getElementById("start");
var end = document.getElementById("end");
var endScore = document.getElementById("endScore");
var earth = document.getElementById("earth");

//Initial state
var jumping = false;
let gameOver = false;
var updateInterval;
let name = "Spelare";

//Calculate element details
let gameHeight = parseInt(
  window.getComputedStyle(game).getPropertyValue("height")
);

let characterHeight = parseInt(
  window.getComputedStyle(character).getPropertyValue("height")
);
let characterLeft = parseInt(
  window.getComputedStyle(character).getPropertyValue("left")
);
let characterWidth = parseInt(
  window.getComputedStyle(character).getPropertyValue("width")
);
let blockWidth = parseInt(
  window.getComputedStyle(topBlock).getPropertyValue("width")
);

//Initial page display
start.style.display = "flex";
game.style.display = "none";
end.style.display = "none";
createStars();
function setName(value) {
  name = value;
}

//Start game
function startGame() {
  topBlock = document.createElement("div");
  topBlock.setAttribute("id", "topBlock");
  bottomBlock = document.createElement("div");
  bottomBlock.setAttribute("id", "bottomBlock");
  game.appendChild(topBlock);
  game.appendChild(bottomBlock);
  console.log("Startar spel");
  start.style.animation = "fadeOut 0.5s ease forwards";

  // end.style.animation = 'fadeOut 1s ease'

  setTimeout(() => {
    game.style.display = "block";
    end.style.display = "none";
    start.style.display = "none";
    let gw = parseInt(window.getComputedStyle(game).width);
    console.log("Gamew", gw);
    earth.style.marginLeft = `-${1200-gw/2}px`;
    document.querySelectorAll(".star").forEach((s) => s.remove());
    character.style.top = "20%";
    score.innerHTML = 0;
    createClouds();
    updateInterval = setInterval(checkStatus, 10);
    counter = -1;
    game.style.pointerEvents = "auto";
    gameOver = false;
    // character.style.animation = "none";
    character.classList.remove("crash");
    difficulty = 40;
  }, 500);
}

//Set random height on blocks for every iteration
topBlock.addEventListener("animationiteration", () => {
  var random = Math.random() * difficulty;
  topBlock.style.height = random + "%";
  bottomBlock.style.height = difficulty - random + "%";

  counter++;
  if (!gameOver) {
    score.innerHTML = counter;
  }
  if (difficulty < 65) {
    difficulty += 0.5;
  }
});

//Check collitions every 10ms
function checkStatus() {
  var characterTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );
  if (!jumping) {
    character.style.top = characterTop + 3 + "px";
    character.style.transform = "rotate(5deg)";
  }

  let topBlockHeight = parseInt(
    window.getComputedStyle(topBlock).getPropertyValue("height")
  );
  let topBlockLeft = parseInt(
    window.getComputedStyle(topBlock).getPropertyValue("left")
  );
  let bottomBlockHeight = parseInt(
    window.getComputedStyle(bottomBlock).getPropertyValue("height")
  );
  let bottomBlockLeft = parseInt(
    window.getComputedStyle(bottomBlock).getPropertyValue("left")
  );
  if (
    //Slår i backen
    characterTop + characterHeight - 40 > gameHeight ||
    //Slår i topblock
    !(
      characterTop + characterHeight < 0 ||
      characterTop > 0 + topBlockHeight ||
      characterLeft + characterWidth < topBlockLeft ||
      characterLeft > topBlockLeft + blockWidth
    ) ||
    //Slår i bottomBlock
    !(
      characterTop + characterHeight < gameHeight - bottomBlockHeight ||
      characterTop > gameHeight ||
      characterLeft + characterWidth < bottomBlockLeft ||
      characterLeft > bottomBlockLeft + blockWidth
    )
  ) {
    // alert('hej')
    setHighscore(counter);
    gameOver = true;

    character.classList.add("crash");
    game.style.pointerEvents = "none";
    clearInterval(updateInterval);
    console.log("gameOver");

    setTimeout(() => {
      topBlock.remove();
      bottomBlock.remove();
      document.querySelectorAll(".cloud").forEach((c) => c.remove());
      counter--;
      endScore.innerHTML = counter;
      game.style.display = "none";
      end.style.display = "flex";

      // start.style.display = "flex";
    }, 2000);
  }
}

//Jump player
function jump() {
  jumping = true;
  let jumpCount = 0;
  var jumpInterval = setInterval(function () {
    var characterTop = parseInt(
      window.getComputedStyle(character).getPropertyValue("top")
    );
    if (characterTop > 6 && jumpCount < 15) {
      character.style.top = characterTop - 6 + "px";
      character.style.transform = "rotate(-10deg)";
    }
    if (jumpCount > 25) {
      clearInterval(jumpInterval);
      jumping = false;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
}

function setHighscore(value) {
  let newHighscore = [];
  let oldHighscore = JSON.parse(localStorage.getItem("alfieHighscore"));

  console.log(oldHighscore);
  if (oldHighscore) {
    oldHighscore.forEach((score) => {
      newHighscore.push(score);
    });
  }

  newHighscore.push({ name: name, score: value });

  newHighscore.sort((a, b) =>
    a.score < b.score ? 1 : b.score < a.score ? -1 : 0
  );
  newHighscore = newHighscore.slice(0, 5);
  localStorage.setItem("alfieHighscore", JSON.stringify(newHighscore));
  // let place = document.getElementById(`place${1}`)
  // console.log(place)
  console.log(newHighscore.length);
  for (let i = 0; i < newHighscore.length; i++) {
    let place = document.getElementById(`place${i + 1}`);
    place.innerHTML = `${newHighscore[i].name} - ${newHighscore[i].score} `;
  }
}

function deleteHighscore() {
  let newHighscore = [];
  localStorage.setItem("alfieHighscore", JSON.stringify(newHighscore));
  for (let i = 0; i < 5; i++) {
    let place = document.getElementById(`place${i + 1}`);
    place.innerHTML = `-`;
  }
}

function createClouds() {
  console.log("Skapar moln");
  for (let i = 0; i < 8; i++) {
    let topRandom = Math.floor(Math.random() * 60) + 1;
    let sizeRandom = Math.floor(Math.random() * 80) + 10;
    let delayRandom = Math.floor(Math.random() * 10);

    let cloud = document.createElement("div");
    cloud.setAttribute("class", "cloud");
    cloud.style.top = `${topRandom}%`;
    cloud.style.height = `${sizeRandom * 1.5}px`;
    cloud.style.width = `${sizeRandom * 3}px`;
    cloud.style.animation = `cloud ${
      15 - sizeRandom / 10
    }s ${delayRandom}s linear infinite, cloudColor 60s 10s linear infinite alternate`;
    cloud.style.zIndex = Math.floor(sizeRandom * 0.1);

    game.appendChild(cloud);
  }
}

function createStars() {
  for (let i = 0; i < 20; i++) {
    let topRandom = Math.floor(Math.random() * 90) + 1;
    let leftRandom = Math.floor(Math.random() * 90) + 1;
    let delayRandom = Math.floor(Math.random() * 10000) + 1000;
    let star = document.createElement("span");
    star.setAttribute("class", "star");
    star.style.top = `${topRandom}%`;
    star.style.left = `${leftRandom}%`;
    star.style.animation = `star 0.5s ${delayRandom}ms ease infinite alternate-reverse`;
    start.appendChild(star);
  }
}
