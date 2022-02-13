var express = require('express');
var app     = require('express')();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use('/', express.static(__dirname + '/'));


app.get('/', function(req, res) {
   res.sendfile('index.html');
});
var whBlock = 20;
var Awidth  = 50;
var Aheight = 30;
var players = {};
var bullets = {}
var playersNo = 1;
// var intervals = [];
// var bullets   = [];
io.on('connection', function(socket) {
   socket.emit('createArea');
   // socket.emit('getPlayer', player);
   
   socket.on('newPlayer',function() {
      players[socket.id] = {
             id: playersNo,
          randW: Awidth/2,
          randH: Aheight/2,
            pos: 1,
         health: 3,
         color:'green'
      };
      bullets[socket.id] = {
         randH: 1,
         randW: 1,
         wheel: 1,
         active:false
      }
      socket.emit('getId', socket.id);
      playersNo++;
   });
   
   
   socket.on('movement', function(H, W, wh) {
      var player = players[socket.id] || {};
      player.randW = W;
      player.randH = H;
      player.wheel = wh;
   });
   
   socket.on('clear', function(trail){
      io.sockets.emit('clear', trail);
   })


   setInterval(function() {
      io.sockets.emit('state', players, bullets);
   }, 1000 / 60);
  
   socket.on('strike', function(H, W, wh) {
      var bullet = bullets[socket.id] || {};
      bullet.randH = H;
      bullet.randW = W;
      bullet.wheel = wh;
      bullet.active = true;
   });
   socket.on('newstrike', function(H, W, wh, id) {
      var bullet = bullets[id] || {};
      bullet.randH = H;
      bullet.randW = W;
      bullet.wheel = wh;
   });

   socket.on('hit', function(id) {
      var player = players[id];
      player.health--;
      if(player.health == 0){
         player.color = 'green';
         player.health = 3;
      }else if(player.health == 2){
         player.color = 'yellow';
      }else if(player.health == 1){
         player.color = 'red';
      }
      
   });

   socket.on('rmvBullet', function(id) {
       var bullet = bullets[id];
       bullet.active = false;
   });

   setInterval(function() {
      io.sockets.emit('shooting', bullets);
   }, 100);


});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});