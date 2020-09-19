//Packages
const express = require('express')
const socket = require('socket.io')


var number = 0;

//App Setup
const app = express()
const port = process.env.PORT || 3000

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
})

//Static Files
app.use(express.static('./website'));

//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connection made for id: ',socket.id);
  number++;
  console.log(number);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('wpm', (data) => {
    console.log("cur wpm is " + data); 
  })
});


