const socket = io();
socket.on('getId', getId);
socket.on('createArea', createArea);

socket.emit('newPlayer');

socket.on('state', function(players, bullets) {
	for (var id in players) {
		socket.emit('clear', trail);
	    var player = players[id];
	    drawTank(player.wheel, player.randH, player.randW);
	    clearUp(player.wheel);
       tankColor = player.color;
	    
	};
	
});

socket.on('shooting', function(bullets) {
   for (var id in bullets) {
      var bullet = bullets[id];
      if(bullet.active){
          Shoot(bullet.randH, bullet.randW, bullet.wheel, id);
      }
   }
});

var idPlayer;
function getId(data){
	idPlayer = data;
   // document.body.innerHTML += id;
   console.log(idPlayer);
};

socket.on('clear', function(data) {
	 ArrayBlock[data[0][0]][data[1][0]].style.background   = bgColor;
     ArrayBlock[data[0][1]][data[1][1]].style.background   = bgColor;
     ArrayBlock[data[0][2]][data[1][2]].style.background   = bgColor;
     ArrayBlock[data[0][3]][data[1][3]].style.background   = bgColor;
});



setInterval(function() {
  socket.emit('movement', randH, randW, wheel);
}, 1000 / 60);

var my_div = document.getElementById('div');

var whBlock = 20;
var Awidth  = 50;
var Aheight = 30;
var tankColor = "green";
var bgColor = "#010100";
var bulletColor = "red";
var body = document.getElementById("body");
    body.style.maxWidth = (Awidth*whBlock)+"px";
var allBlocks = document.getElementsByClassName('div');
var ArrayBlock = [];
var Tank = [];
var d = 0;
var gun;
var H = 0;
var wheel = 1;

var upBorder = [];
var downBorder = [];
var rightBorder = [];
var leftBorder = [];
var speed = 30;
var isShoot = false;
var randW = Awidth/2;
var randH = Aheight/2;
var trail = [];
for (var i = 0; i < 2; i++) {
  	trail[i] = [4];
}

function createArea() {

   for (var i = 0; i < Aheight; i++) {
  	ArrayBlock[i] = [Awidth];
     for (var j = 0; j < Awidth; j++) {
        var newDiv = document.createElement("div");
            newDiv.classList.add('div');
           //newDiv.innerHTML = j;
        ArrayBlock[i][j] = newDiv;
        document.body.insertBefore(newDiv, my_div);
     }
  }
  
  for (var j = 0; j < allBlocks.length; j++) {
     allBlocks[j].style.width = whBlock+"px";
     allBlocks[j].style.height = whBlock+"px";
  }
  
  for(var i = 0;i<Awidth;i++){
     upBorder[i] = ArrayBlock[0][i];
     downBorder[i] = ArrayBlock[Aheight-1][i];
     upBorder[i].style.background = 'grey';
     downBorder[i].style.background = 'grey';
  }
  for(var i = 0;i<Aheight;i++){
     rightBorder[i] = ArrayBlock[i][Awidth-1];
     leftBorder[i] = ArrayBlock[i][0];
     rightBorder[i].style.background = 'grey';
     leftBorder[i].style.background = 'grey';
  }
  drawTank(1,randH, randW);
}

function drawTank(pos,H,W) {
  Tank[0] = ArrayBlock[H-1][W-1];
  Tank[1] = ArrayBlock[H-1][W];
  Tank[2] = ArrayBlock[H-1][W+1];
  Tank[3] = ArrayBlock[H][W-1];
  Tank[4] = ArrayBlock[H][W];
  Tank[5] = ArrayBlock[H][W+1];
  Tank[6] = ArrayBlock[H+1][W-1];
  Tank[7] = ArrayBlock[H+1][W];
  Tank[8] = ArrayBlock[H+1][W+1];
  for(var i = 0;i<9;i++){
     Tank[i].style.background = tankColor;
  }

  switch(pos){
     case 1://up
        Tank[0].style.background = bgColor;
        Tank[2].style.background = bgColor;
        gun = Tank[1];
     break;

     case 2://right
        Tank[2].style.background = bgColor;
        Tank[8].style.background = bgColor;
        gun = Tank[5];
        
        
     break;

     case 3://down
        Tank[6].style.background = bgColor;
        Tank[8].style.background = bgColor;
        gun = Tank[7];
     break;

     case 4://left
        Tank[0].style.background = bgColor;
        Tank[6].style.background = bgColor;
        gun = Tank[3];
     break;
  }
}


function forward(pos, player) {
  switch(pos){
     case 1://up
        drawTank(pos, --randH,randW);
        clearUp(pos);
     break;

     case 2://right
        drawTank(pos, randH,++randW);
        clearUp(pos);
     break;

     case 3://down
        drawTank(pos, ++randH,randW);
        clearUp(pos);
     break;
     case 4://left
        drawTank(pos, randH,--randW);
        clearUp(pos);
     break;
  }
}

function back(pos) {
  switch(pos){
     case 1://up
        drawTank(pos, ++randH,randW);
        clearUp(pos);
     break;

     case 2://right
        drawTank(pos, randH,--randW);
        clearUp(pos);
     break;

     case 3://down
        drawTank(pos, --randH,randW);
        clearUp(pos);
     break;
     case 4://left
        drawTank(pos, randH,++randW);
        clearUp(pos);
     break;
  }
}
function clearUp(pos) {
  switch(pos){
     case 1://up
        ArrayBlock[randH+2][randW].style.background   = bgColor;
        ArrayBlock[randH+2][randW-1].style.background = bgColor;
        ArrayBlock[randH+2][randW+1].style.background = bgColor;
        ArrayBlock[randH-2][randW].style.background   = bgColor;
        trail[0][0] = randH+2;
        trail[1][0] = randW;
        trail[0][1]=  randH+2;
        trail[1][1] = randW-1;
        trail[0][2] = randH+2;
        trail[1][2] = randW+1;
        trail[0][3] = randH-2;
        trail[1][3] = randW;
     break;

     case 2://right
        ArrayBlock[randH][randW-2].style.background = bgColor;
        ArrayBlock[randH-1][randW-2].style.background = bgColor;
        ArrayBlock[randH+1][randW-2].style.background = bgColor;
        ArrayBlock[randH][randW+2].style.background = bgColor;
        trail[0][0] = randH;
        trail[1][0] = randW-2;
        trail[0][1]=  randH-1;
        trail[1][1] = randW-2;
        trail[0][2] = randH+1;
        trail[1][2] = randW-2;
        trail[0][3] = randH;
        trail[1][3] = randW+2;
     break;

     case 3://down
        ArrayBlock[randH-2][randW].style.background = bgColor;
        ArrayBlock[randH-2][randW-1].style.background = bgColor;
        ArrayBlock[randH-2][randW+1].style.background = bgColor;
        ArrayBlock[randH+2][randW].style.background = bgColor;
        trail[0][0] = randH-2;
        trail[1][0] = randW;
        trail[0][1]=  randH-2;
        trail[1][1] = randW-1;
        trail[0][2] = randH-2;
        trail[1][2] = randW+1;
        trail[0][3] = randH+2;
        trail[1][3] = randW;
     break;
     case 4://left
        ArrayBlock[randH][randW+2].style.background = bgColor;
        ArrayBlock[randH-1][randW+2].style.background = bgColor;
        ArrayBlock[randH+1][randW+2].style.background = bgColor;
        ArrayBlock[randH][randW-2].style.background = bgColor;
        trail[0][0] = randH;
        trail[1][0] = randW+2;
        trail[0][1]=  randH-1;
        trail[1][1] = randW+2;
        trail[0][2] = randH+1;
        trail[1][2] = randW+2;
        trail[0][3] = randH;
        trail[1][3] = randW-2;
     break;
  }
}



document.addEventListener("keyup",Move);
var prev;

function Move(evt) {
  switch(evt.keyCode){
     case 38://up
     	// socket.emit('Mforward', wheel);
        forward(wheel);
        break;
     case 40://down
     	// socket.emit('Mback', wheel);
        back(wheel);
        break;
     case 39://right
        wheel++;
        if(wheel==5){
           wheel=1;
        }
        // socket.emit('Mdraw',wheel, randH, randW);
        drawTank(wheel, randH, randW,Tank);
        break;
     case 37://left
        wheel--;
        if(wheel==0){
           wheel=4;
        }
        // socket.emit('Mdraw',wheel, randH, randW);
        drawTank(wheel, randH, randW,Tank);
        break;
     case 32:
         if(!isShoot){
            var bulH = randH;
            var bulW = randW;
            switch(wheel){
               case 1:
                  bulH -= 2;
                  break;
               case 2:
                  bulW += 2;
                  break;
               case 3:
                  bulH += 2;
                  break;
               case 4:
                  bulW -= 2;
                  break;
            }
            socket.emit('strike', bulH, bulW, wheel);
            isShoot = true;
         }
  }
}

// socket.on('hitt', hit);
// function hit() {
//    tankColor = 'yellow';
// }

function Shoot(H, W, wh, id) {
  	switch(wh){
		case 1:
         H--;
			var trail = H+1;
		 	ArrayBlock[trail][W].style.background = bgColor;
		break;
		case 2:
         W++;
			var trail = W-1;
		 	ArrayBlock[H][trail].style.background = bgColor;
		break;
		case 3:
         H++;
			var trail = H-1;
		 	ArrayBlock[trail][W].style.background = bgColor;
		break;
		case 4:
         W--;
			var trail = W+1;
		 	ArrayBlock[H][trail].style.background = bgColor;
		break;
		}
      socket.emit('newstrike', H, W, wh, id);
      
   if(upBorder.includes(ArrayBlock[H][W])||rightBorder.includes(ArrayBlock[H][W])||downBorder.includes(ArrayBlock[H][W])||leftBorder.includes(ArrayBlock[H][W])){
      socket.emit('rmvBullet', id);
      ArrayBlock[H][W].style.background = 'grey';
      isShoot = false;
   }else if(ArrayBlock[H][W].style.background == tankColor){
      // tankColor = 'yellow';
      socket.emit('rmvBullet', id);
      console.log(id);
      socket.emit('hit', id);
      isShoot = false;
   }else{
      ArrayBlock[H][W].style.background = 'red';
   }
}








   
