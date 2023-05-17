let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function resizeCanvas() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,100,100);
}

document.addEventListener("DOMContentLoaded", resizeCanvas);
window.addEventListener("resize", resizeCanvas);