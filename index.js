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
    newPlayer.rank = 0
    newPlayer.name = ""
    players.push(newPlayer);
    numberOfPlayers++;
  }

  console.log("Player joined with id: " + socket.id +"\nNumber of players: " + numberOfPlayers);

  //waitTime = waitInterval;

  if (numberOfPlayers == 4)
  {
    io.sockets.emit('gameReady');
  }


  socket.on('disconnect', () => {
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

function selectionSort(players){
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
  return players;
}

setInterval(selectionSort(players), 500);
