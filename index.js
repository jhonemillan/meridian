var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { generateMessage } = require('./utils/message');

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
 
  socket.broadcast.emit('newConnection',generateMessage('admin','msg'));

    socket.on('disconnect', ()=>{
        io.emit('disconnected', generateMessage('admin'))
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg + ' at:' + new Date());
        io.emit('sentchat',{msg: msg});
      });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});