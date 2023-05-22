import { Client } from './blobius.js';

const socket = io();
const client = new Client(socket);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
  ctx.fillStyle = "#dfdfdf";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

window.addEventListener("DOMContentLoaded", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

const form = document.getElementById("Form/Room/Join");
const nameInput = form.querySelector("[name='username']");

if (localStorage.getItem("player")) {
  let player = JSON.parse(localStorage.getItem("player"));
  
  nameInput.value = player.username;
}

form.onsubmit = (e) => {
  e.preventDefault();
  
  let player = {
    username: nameInput.value,
  };
  
  localStorage.setItem("player", JSON.stringify(player));
  
  client.createInstance();
};