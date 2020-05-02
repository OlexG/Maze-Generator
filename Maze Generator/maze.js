//CODE TO SHUFFLE ARRAY
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



var vertWalls = [];
var horWalls = [];
var visited = [];
var size = 30;
function generateVertWalls(){
  var interval = 500/size;
  for (var x = 0; x < size; x++){
    vertWalls.push([]);
    visited.push([]);
    for (var y = 0; y < size; y++){
      vertWalls[x].push({x1: interval * y, x2: interval * y, y1: x * interval, y2: (x + 1) * interval})
      visited[x].push(1);
    }
  }
}
function generateHorWalls(){
  var interval = 500/size;
  for (var x = 0; x < size; x++){
    horWalls.push([]);
    for (var y = 0; y < size; y++){
      horWalls[x].push({x1: interval * y, x2: interval * (y + 1), y1: x * interval, y2: x * interval})
    }
  }
}
var dx = [-1, 0, 1, 0];
var dy = [0, -1, 0, 1];
var dir = [0,1,2,3];
var stack = [];
var totalvisited = 0;
function dfs(x, y){
  if (visited[x][y] === 1){
    stack.push({x: x, y: y});
    totalvisited++;
  }
  visited[x][y] = 0;
  shuffle(dir);
  var deadend = true;
  for (var z = 0; z < 4; z++){
    var cx = x + dx[z];
    var cy = y + dy[z];
    if (cx >= 0 && cx < size && cy >= 0 && cy < size){
      if (visited[cx][cy] === 1){
        deadend = false;
      }
    }
  }
  if (deadend){
    if (totalvisited >= size * size){
      return 0;
    }
    else{
      stack.pop();
      prevx = stack[stack.length - 1].x;
      prevy = stack[stack.length - 1].y;
      return dfs(prevx,prevy)
    }
  }
  else{
    for (var z = 0; z < 4; z++){
      var cx = x + dx[dir[z]];
      var cy = y + dy[dir[z]];
      if (cx >= 0 && cx < size && cy >= 0 && cy < size){
        if (visited[cx][cy] === 1){
          if (dir[z] == 0){
            horWalls[x][y].x1 = 0;
            horWalls[x][y].y1 = 0;
            horWalls[x][y].x2 = 0;
            horWalls[x][y].y2 = 0;
          }
          if (dir[z] == 1){
            vertWalls[x][y].x1 = 0;
            vertWalls[x][y].y1 = 0;
            vertWalls[x][y].x2 = 0;
            vertWalls[x][y].y2 = 0;
          }
          if (dir[z] == 2){
            horWalls[x + 1][y].x1 = 0;
            horWalls[x + 1][y].y1 = 0;
            horWalls[x + 1][y].x2 = 0;
            horWalls[x + 1][y].y2 = 0;
          }
          if (dir[z] == 3){
            vertWalls[x][y + 1].x1 = 0;
            vertWalls[x][y + 1].y1 = 0;
            vertWalls[x][y + 1].x2 = 0;
            vertWalls[x][y + 1].y2 = 0;
          }
          dfs(cx, cy);
        }
      }
    }
  }
}



generateVertWalls();
generateHorWalls();
dfs(0,0);
var sizex = 50;
var newsize = size;
function draw(){
  background(255,255,255);
  stroke(0,0,0);
  strokeWeight(3);
  for (var x = 0; x < size; x++){
    for (var y = 0; y < size; y++){
      line(vertWalls[x][y].x1, vertWalls[x][y].y1, vertWalls[x][y].x2, vertWalls[x][y].y2);
      line(horWalls[x][y].x1, horWalls[x][y].y1, horWalls[x][y].x2, horWalls[x][y].y2);
    }
  }
  line(0, 500, 500, 500);
  line(500, 0, 500, 500);
  fill(0, 255, 0);
  noStroke();
  rect(2.5,2.5, 500/size - 5, 500/size - 5);
  fill(255, 0, 0);
  rect(500 - 500/size +2.5, 500 - 500/size + 2.5, 500/size - 5, 500/size - 5);
  //Regenerate button
  if (mouseX > 190 && mouseX < 190 + 120 && mouseY > 540 && mouseY < 560){
    fill(100, 100, 100, 255);
  }
  else{
    fill(100, 100, 100, 100);
  }
  rect(190, 540, 120, 20);
  fill(0, 0, 0, 255);
  text("Regenerate", 218, 551);
  stroke(0,0,0);
  line(50, 550, 150, 550);
  text("Size", 50 , 570);
  ellipse(sizex, 550, 10, 10);
  if (mouseIsPressed && abs(mouseY - 550) < 20 && mouseX >= 50 && mouseX <= 150){
    sizex = max(50, min(mouseX, 150));
    newsize =  Math.round(map(sizex, 50, 150, 10, 60)/5) * 5;
  }
}

function mouseClicked(){
  if (mouseX > 190 && mouseX < 190 + 120 && mouseY > 540 && mouseY < 560){
    vertWalls = [];
    horWalls = [];
    visited = [];
    size = newsize;
    generateVertWalls();
    generateHorWalls();
    dfs(0,0);
  }
}
