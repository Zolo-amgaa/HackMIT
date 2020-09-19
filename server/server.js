//Packages
const express = require('express')
const socket = require('socket.io')


//App Setup
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
})

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
})

//Static Files
app.use(express.static('../startbootstrap-grayscale-gh-pages'));

//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connection made');
});
