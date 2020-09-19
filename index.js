//Packages
const express = require('express')
const socket = require('socket.io')

var players = [];
var numberOfPlayers = 0;

//App Setup
const app = express()
const port = process.env.PORT || 3000

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
})

//Static Files
app.use(express.static('./website'));

//player check


//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
  if(numberOfPlayers < 4) {
    socket.emit('gameReady', false);
  }
  else {
    socket.emit('gameReady', true);
  }
  console.log('Connection made for id: ',socket.id);
  let i;
  for(i = 0; i<players.length;i++) {
      if(players[i].id == socket.id) {
        break;
      }

  }
  if(i == players.length) {
      let newPlayer = new Object();
      newPlayer.id = socket.id;
      newPlayer.wpm = 0;
      players.push(newPlayer);
      numberOfPlayers++;
  }


  socket.on('disconnect', () => {
    numberOfPlayers--;
    console.log('user disconnected');
  });
  socket.on('wpm', (data) => {
    for(let i = 0; i<players.length;i++) {
      if(players[i].id == socket.id) {
        players[i].wpm = data;
      }

  }
    console.log(players);
  })
});
