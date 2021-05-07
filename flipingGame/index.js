let startTimer;
let gameDifficulty;
let gameErrors = 0;
class UI {
  static setColor(target, type) {
    if (type == "green") {
      target.style.backgroundColor = "#74e374";
    } else if (type == "red") {
      target.style.backgroundColor = "#ff4d4d";
    } else {
      console.error(`There is no type ${type}`);
    }
  }
  static hideCards() {
    let cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      card.style.backgroundColor = "white";
      card.style.pointerEvents = "auto";
    });
  }
  static UIGameEnd() {
    document.querySelector("#inputsContainer").style.pointerEvents = "auto";
    document.querySelector("#message").style.display = "none";
    document.querySelector("#wrongsSpan").innerText = "";
    document.querySelector("#startButton").style.display = "none";
    document.querySelector("#restartButton").style.display = "none";
  }
  static UIWin() {
    document.querySelector("body").style.backgroundColor = "#74e374";
    document.querySelector("#endMessage").innerText = `
      You won:) 
      \nTime: ${((new Date() - startTimer) / 1000).toFixed(3)}s `;
  }
  static UILoss() {
    document.querySelector("body").style.backgroundColor = "#ff4d4d";
    document.querySelector("#endMessage").innerText = "You lost :(";
  }
  static UIRestartGame() {
    document.querySelector("#numberOfDiv").style.display = "block";
    document.querySelector("#container").style.display = "none";
    document.querySelector("#startButton").style.display = "block";
    document.querySelector("#endMessage").innerText = "";
  }
  static UIInitializeGame() {
    document.querySelector("#numberOfDiv").style.display = "none";
    document.querySelector("#startButton").style.display = "none";
    document.querySelector("#countDown").innerHTML = "3";
  }

  static switchButons() {
    document.querySelector("#restartButton").style.display = "block";
  }
}
let wrong = 0;
let right = 0;

class Game {
  static startGame(difficulty) {
    let settings = {
      easy: {
        difficult: 5,
        time: 1500,
        wrongs: 4,
      },
      medium: {
        difficult: 7,
        time: 1000,
        wrongs: 3,
      },
      hard: {
        difficult: 9,
        time: 750,
        wrongs: 2,
      },
    }[difficulty];
    gameDifficulty = settings.difficult;

    let selectedCards = new Set();

    document.querySelector("#container").style.display = "flex";
    document.querySelector("#message").style.display = "block";
    while (selectedCards.size !== settings.difficult) {
      selectedCards.add(Math.round(Math.random() * (18 - 1) + 1));
    }

    let cards = document.querySelectorAll(".card");

    selectedCards.forEach((num) => {
      cards.forEach((card) => {
        if (card.id == num) {
          card.style.backgroundColor = "black";
          card.classList.add("win");
          card.style.pointerEvents = "none";
        }
      });
    });

    document.querySelector("#container").style.pointerEvents = "none";
    setTimeout(() => {
      UI.hideCards();
      startTimer = new Date();
    }, settings.time);

    const theSettings = Promise.resolve({
      wrong: settings.wrongs,
      right: selectedCards.size,
    });

    return theSettings;
  }

  static EndGame(type) {
    UI.UIGameEnd();
    let cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      card.style.backgroundColor = "transparent";
      card.style.pointerEvents = "none";
      if (card.classList.contains("win")) {
        card.classList.remove("win");
      }
    });
    wrong = 0;
    right = 0;
    if (type == "win") {
      UI.UIWin();
      Game.AddTimeToList(((new Date() - startTimer) / 1000).toFixed(3), "win");
    } else if (type == "lost") {
      UI.UILoss();
      Game.AddTimeToList(((new Date() - startTimer) / 1000).toFixed(3), "loss");
    } else {
      console.error(`${type} does not exists, only win/lost`);
    }
    setTimeout(() => {
      cards.forEach((card) => {
        card.style.backgroundColor = "white";
        card.style.pointerEvents = "none";
        UI.UIRestartGame();
        if (card.classList.contains("win")) {
          card.classList.remove("win");
        }
      });
      document.querySelector("body").style.backgroundColor = "#92A8D1";
    }, 2000);
  }

  static checkWinOrLose(settings) {
    if (right == settings.right) {
      Game.EndGame("win");
    } else if (wrong == settings.wrong) {
      Game.EndGame("lost");
    }
  }

  static AddTimeToList(time, type) {
    let actualTime = parseFloat(time);
    let times = [];
    if (localStorage.getItem("timesList") != null)
      times = JSON.parse(localStorage.getItem("timesList"));

    times.push({
      difficulty:
        gameDifficulty == 5 ? "Easy" : gameDifficulty == 7 ? "Medium" : "Hard",
      time: actualTime,
      errorsMade: gameErrors,
      type: type,
    });

    localStorage.setItem("timesList", JSON.stringify(times));
  }
}

document.querySelector("#cardsDiv").addEventListener("click", (e) => {
  console.log(gameErrors);
  let availableErrors = dif.wrong;

  if (e.target.classList.contains("card")) {
    if (e.target.classList.contains("win")) {
      UI.setColor(e.target, "green");
      right++;
    } else {
      UI.setColor(e.target, "red");
      wrong++;
      availableErrors--;
      gameErrors++;
    }
  }
  document.querySelector("#wrongsSpan").innerText = availableErrors;
  Game.checkWinOrLose(dif);
});

document.querySelector("#settingsForm").addEventListener("submit", (e) => {
  gameErrors = 0;
  e.preventDefault();
  const difficulty = document.querySelector("#difficulty").value;
  UI.UIInitializeGame();

  let timer = 3;

  const interval = setInterval(() => {
    timer--;
    document.querySelector("#countDown").innerHTML = timer;
    if (timer === 0) {
      document.querySelector("#countDown").innerHTML = "";

      clearInterval(interval);

      Game.startGame(difficulty).then((settings) => {
        dif = settings;
        UI.switchButons();
        document.querySelector("#wrongsSpan").innerText = settings.wrong;
      });
    }
  }, 1000);
});
