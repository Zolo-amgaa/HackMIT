window.addEventListener('load', init);

// Globals
let difficulty = 'medium';
let rank = 0;

var socket = io.connect();

const difficulties = [
    "short",
    "medium",
    "long"
]
socket.on('connect',(name)=> {
  console.log('socket on: ' + localStorage.getItem("name"));
});

socket.on('gameReady', ()=> {
  console.log('gameReady received');
  startGame();
});

socket.on('sendDifficulty', (data) => {
  difficulty = data.difficulty;
  rank = data.rank;

})

socket.on('end', (data)=> {
  localStore.setItem("wpm", data.wpm);
  localStore.setItem("name", data.name);
  localStore.setItem("score", score);
  localStore.setItem("rank", data.rank);
  window.location.href = "gameover.html";
  console.log ("DEAD");

})

let wpm = 0;
let time = 0;
let score = 0;
let isPlaying;
let countDown = 30;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const wpmDisplay = document.querySelector("#wpm");
const rankDisplay = document.querySelector("#rank");


const shortWords = [
  'a',
  'short'
];

const mediumWords = [
  'aaaa',
  'medium'
];

const longWords = [
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'long'
]


function init()
{
  console.log(name + " joined the game lobby.");
}
// Initialize Game
function startGame() {
  // Show number of seconds in UI
  // Load word from array
  showWord();

  //showWord();
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  time = 0;

  setInterval(countup, 1000);

  //Check wpm
  setInterval(updateWpm, 1000);

}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    showWord();
    wordInput.value = '';
    score++;
    console.log(score);
  }

  // If score is -1, display 0
  if (score == -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

function updateWpm() {
    wpm = Math.round((score/time)*60);
    wpmDisplay.innerHTML = wpm;
    rankDisplay.innerHTML = rank + 1;
    socket.emit('wpm', wpm);

}
// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    message.style.color = "green";
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}


// Pick & show random word
function showWord() {
  let words;
  if(difficulty == "short"){
    words = shortWords;
  }
  if(difficulty == "medium"){
    words = mediumWords;
  }
  if(difficulty == "long"){
    words = longWords;
  }
  console.log(difficulty);
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countup() {
  if (countDown == 0) {
    //eliminate someone
    socket.emit()

    countDown = 30;
  }
  if (countDown <= 10) {
    document.getElementById("time").style.color = "red";
  }
  else {
    document.getElementById("time").style.color = "white";
  }
  countDown--;
  time++;
  // Show time
  timeDisplay.innerHTML = countDown;
  console.log("WPM: " + wpm + "Score: " + score + "\nTime: " + time);
}
