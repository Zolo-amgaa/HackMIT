//Packages
const express = require('express')
const socket = require('socket.io')


//App Setup
const app = express()
const port = 3000


var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
})

//Static Files
app.use(express.static('../website'));

//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connection made');
});
