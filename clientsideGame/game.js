
window.addEventListener('load', init);

// Globals





let wpm = 0; 
let time = 0;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const wpmDisplay = document.querySelector("#wpm");

const words = [
  'a'
];

// Initialize Game
function init() {
  // Show number of seconds in UI
  // Load word from array
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countup, 1000);
  // Check game status
  setInterval(checkStatus, 50);

  //Check wpm
  setInterval(updateWpm, 1000);
  time = 0;
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    showWord(words);
    wordInput.value = '';
    score++;

  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

function updateWpm() {
    wpm = Math.round((score/time)*60);
    wpmDisplay.innerHTML = wpm;
}
// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countup() {
  time++;
  // Show time
  timeDisplay.innerHTML = time;
  console.log(wpm);
}

// Check game status
function checkStatus() {
//   if (!isPlaying) {
//     message.innerHTML = 'Game Over!!!';
//     score = -1;
//   }
}
