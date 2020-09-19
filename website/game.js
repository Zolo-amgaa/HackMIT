//Make the command just fetch; convenient
const fetch = require("node-fetch");

//Method to make the fetch call; waits appropriately
async function fetchWordString() {
  //await the response of the fetch call
  let response = await fetch('http://www.mieliestronk.com/corncob_lowercase.txt');
  //proceed once the first promise is resolved
  let data = await response.text();
  //proceed once the second promise is resolved
  return data;
}

//'Main' zone
(async function(){
  //Fetch list of words
  var wordString = await fetchWordString()
  var wordList = wordString.split('\r\n')

  //Split list of words into 3 tiers
  //console.log(wordList[0])
  var wordListAlpha = new Array();
  var wordListBeta = new Array();
  var wordListGamma = new Array();

  for (i = 0; i < wordList.length; i++) {
    if(wordList[i].length<4) { 
      wordListAlpha.push(wordList[i]) //1-3 letter words
    }else if(wordList[i].length<8) { 
      wordListBeta.push(wordList[i]) //4-7 letter words
    }else { 
      wordListGamma.push(wordList[i]) //7+ letter words
    }
  }

  window.addEventListener('load', init);

// Globals
let difficulty = 'medium';


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
  difficulty = data;

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
const accuracyDisplay = document.querySelector("#accuracy");


const shortWords = wordListAlpha;

const mediumWords = wordListBeta;

const longWords = wordListGamma;


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
  setInterval(countup, 1000);

  //Check wpm
  setInterval(updateWpm, 1000);

  time = 0;
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

})()

