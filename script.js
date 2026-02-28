const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const GRID = 20; // 每格像素
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
let dir = {x:1, y:0};
let apple = null;
let score = 0;
let running = true;
let tickInterval = 100; // ms
let loop = null;

function placeApple(){
  while(true){
    const a = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
    if(!snake.some(s=>s.x===a.x && s.y===a.y)){ apple = a; break; }
  }
}

function reset(){
  snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
  dir = {x:1,y:0};
  score = 0; scoreEl.textContent = score;
  running = true;
  tickInterval = 100;
  placeApple();
  startLoop();
}

function startLoop(){
  if(loop) clearInterval(loop);
  loop = setInterval(tick, tickInterval);
}

function tick(){
  if(!running) return;
  const head = {x: (snake[0].x + dir.x + COLS) % COLS, y: (snake[0].y + dir.y + ROWS) % ROWS};
  // 撞到自己？
  if(snake.some(s=>s.x===head.x && s.y===head.y)){
    running = false; clearInterval(loop); draw(); return;
  }
  snake.unshift(head);
  if(apple && head.x===apple.x && head.y===apple.y){
    score += 1; scoreEl.textContent = score; placeApple();
    if(tickInterval>40){ tickInterval -= 3; startLoop(); }
  } else {
    snake.pop();
  }
  draw();
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // 背景格子
  ctx.fillStyle = '#071124';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // 苹果
  if(apple){ ctx.fillStyle = '#ff4d4f'; ctx.fillRect(apple.x*GRID, apple.y*GRID, GRID, GRID); }
  // 蛇
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle = i===0 ? '#9ae6b4' : '#34d399';
    ctx.fillRect(snake[i].x*GRID, snake[i].y*GRID, GRID-1, GRID-1);
  }
  if(!running){
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff'; ctx.font='20px sans-serif'; ctx.textAlign='center';
    ctx.fillText('游戏结束 - 按 R 重玩', canvas.width/2, canvas.height/2);
  }
}

window.addEventListener('keydown', e=>{
  if(e.code==='ArrowUp' && dir.y!==1){ dir={x:0,y:-1}; }
  if(e.code==='ArrowDown' && dir.y!==-1){ dir={x:0,y:1}; }
  if(e.code==='ArrowLeft' && dir.x!==1){ dir={x:-1,y:0}; }
  if(e.code==='ArrowRight' && dir.x!==-1){ dir={x:1,y:0}; }
  if(e.code==='Space'){ running = !running; if(running) startLoop(); else clearInterval(loop); }
  if(e.key==='r' || e.key==='R'){ reset(); }
});

placeApple();
startLoop();
draw();
