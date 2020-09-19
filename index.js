//Packages
const express = require('express')
const socket = require('socket.io')

//App Setup
const app = express()
const port = process.env.PORT || 3000

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
})

//Static Files
app.use(express.static('./website'));

//Player Management
var players = [];
var numberOfPlayers = 0;

//Time Management
var time = 0;


//Socket Setup
var io = socket(server);

io.on('connection', function(socket){

  let i=0;
  for(i = 0; i<players.length;i++) {
      if(players[i].id == socket.id) {
        break;
      }
  }
  if(i == players.length) {
    newPlayer = new Object();
    newPlayer.id = socket.id;
    newPlayer.wpm = 0;
    newPlayer.rank = 0;
    newPlayer.name = ""
    players.push(newPlayer);
    numberOfPlayers++;
  }

  console.log("Player joined with id: " + socket.id +"\nNumber of players: " + numberOfPlayers);

  //waitTime = waitInterval;

  if (numberOfPlayers == 4)
  {
    io.emit('gameReady');
    time=0;
    setInterval(countup,1000)
  }

  socket.on('sendName', (name)=>{
    for (let p = 0; p<players.length;p++)
    {
      if (socket.id==players[p].id)
      {
        players[p].name = name;
      }
    }
  })

  socket.on('disconnect', () => {

    newPlayers = [];

    for (let k = 0; k < players.length; k++)
    {
        if (players[k] != null)
        {
          newPlayers.push(players[k]);
        } else
         {continue;}
    }
    players = newPlayers;
    numberOfPlayers--;

    console.log('USER DISCONNECTED');
  });

  socket.on('wpm', (data) => {
    for(let i = 0; i<players.length;i++) {
      if(players[i].id == socket.id) {
        players[i].wpm = data;
      }
  }
  })
});

function calculateLevels()
{
  if (players.length == 2)
  {
    io.to(players[0]).emit("sendDifficulty", {difficulty: "medium",rank: players[0].rank});
    io.to(players[1]).emit("sendDifficulty", {difficulty: "medium",rank: players[1].rank});
  }
  if (players.length == 3)
  {
    io.to(players[0].id).emit("sendDifficulty", {difficulty: "long",rank: players[0].rank})
    io.to(players[1].id).emit("sendDifficulty", {difficulty: "medium",rank: players[1].rank})
    io.to(players[2].id).emit("sendDifficulty", {difficulty: "short",rank: players[2].rank})
  }

  for (let j = 0; j < players.length;j++)
  {

    let level = (players[j].rank+1) / numberOfPlayers;
    let difficulty = -1;

    if (level <= 0.25)
      difficulty = "long";
    else if (level > 0.25 && level <= 0.75)
      difficulty = "medium";
    else
      difficulty = "short";

      io.to(players[j].id).emit("sendDifficulty", {difficulty: difficulty, rank:players[j].rank})
  }
}

function selectionSort(){
  var minIdx, temp,
      len = players.length;
  for(var i = 0; i < len; i++){
    minIdx = i;
    for(var  j = i+1; j<len; j++){
       if(players[j].wpm < players[minIdx].wpm){
          minIdx = j;
       }
    }
    temp = players[i];
    players[i] = players[minIdx];
    players[minIdx] = temp;
  }
  players.reverse();
  for(let k = 0; k < len; k++) {
    players[k].rank = k;
  }
  calculateLevels();

}

function countup(){
  if (time == 30) {
    eliminateLowest();
    time=0;
  }
  time++;

  console.log("Array Size: " + players.length);
  console.log(players);

}

//Removes the player with the lowest WPM from the game
function eliminateLowest()
{
  selectionSort();

  newPlayers = [];

  for (let k = 0; k < players.length; k++)
  {
      if (players[k] != null)
      {
        newPlayers.push(players[k]);
      } else
       {continue;}
  }
  players = newPlayers;
  numberOfPlayers--;

  var name = players[players.length-1].name;
  var wpm = players[players.length-1].wpm;
  var id = players[players.length-1].id;
  players.splice(players.length - 1,1);
  numberOfPlayers--;
  io.to(id).emit("end",  {name: name, wpm: wpm})
  console.log("Eliminating " + name + "(" + id + ")");
}

setInterval(selectionSort, 1000);
