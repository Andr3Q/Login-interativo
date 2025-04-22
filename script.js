const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const naveImg = new Image();
naveImg.src = "assets/img/nave.png";

const inimigosImgs = [
  "assets/img/inimigo1.png",
  "assets/img/inimigo2.png",
  "assets/img/inimigo3.png",
  "assets/img/inimigo4.png",
  "assets/img/inimigo5.png"
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const somTiro = new Audio("assets/laser.mp3");
const somExplosao = new Audio("assets/explosion.mp3");
const bgMusic = new Audio("assets/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 60,
  height: 60,
  speed: 6
};

let tiros = [];
let inimigos = [];
let estrelas = [];
let teclas = {};
let pontuacao = 0;

document.addEventListener("keydown", (e) => teclas[e.key] = true);
document.addEventListener("keyup", (e) => teclas[e.key] = false);

for (let i = 0; i < 100; i++) {
  estrelas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    speed: Math.random() * 1.5 + 0.5
  });
}

function desenharEstrelas() {
  ctx.fillStyle = "white";
  estrelas.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    e.y += e.speed;
    if (e.y > canvas.height) {
      e.y = 0;
      e.x = Math.random() * canvas.width;
    }
  });
}

function desenharPlayer() {
  ctx.drawImage(naveImg, player.x, player.y, player.width, player.height);
}

function moverPlayer() {
  if (teclas["ArrowLeft"] || teclas["a"]) player.x -= player.speed;
  if (teclas["ArrowRight"] || teclas["d"]) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    tiros.push({ x: player.x + player.width / 2 - 2, y: player.y });
    somTiro.currentTime = 0;
    somTiro.play();
  }
});

function desenharTiros() {
  ctx.fillStyle = "lime";
  for (let i = 0; i < tiros.length; i++) {
    let t = tiros[i];
    ctx.fillRect(t.x, t.y, 4, 10);
    t.y -= 10;
    if (t.y < 0) tiros.splice(i, 1);
  }
}

function spawnInimigos() {
  if (Math.random() < 0.02) {
    inimigos.push({
      x: Math.random() * (canvas.width - 40),
      y: -40,
      width: 50,
      height: 50,
      speed: 1.5 + Math.random() * 2,
      img: inimigosImgs[Math.floor(Math.random() * inimigosImgs.length)]
    });
  }
}

function desenharInimigos() {
  for (let i = 0; i < inimigos.length; i++) {
    let e = inimigos[i];
    ctx.drawImage(e.img, e.x, e.y, e.width, e.height);
    e.y += e.speed;
    if (e.y > canvas.height) inimigos.splice(i, 1);
  }
}

function detectarColisoes() {
  for (let i = tiros.length - 1; i >= 0; i--) {
    for (let j = inimigos.length - 1; j >= 0; j--) {
      let t = tiros[i];
      let e = inimigos[j];
      if (
        t.x < e.x + e.width &&
        t.x + 4 > e.x &&
        t.y < e.y + e.height &&
        t.y + 10 > e.y
      ) {
        tiros.splice(i, 1);
        inimigos.splice(j, 1);
        pontuacao += 100;
        document.getElementById("score").innerText = "PONTOS: " + pontuacao;
        somExplosao.currentTime = 0;
        somExplosao.play();
        break;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharEstrelas();
  moverPlayer();
  desenharPlayer();
  desenharTiros();
  desenharInimigos();
  detectarColisoes();
  spawnInimigos();
  requestAnimationFrame(gameLoop);
}

gameLoop();