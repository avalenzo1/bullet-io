import { Client } from './blobius.js';

const socket = io();
const client = new Client(socket);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function parseForm(formData) {
  let object = {};
  
  formData.forEach((value, key) => object[key] = value);
  
  let json = JSON.stringify(object);
}

function resizeCanvas() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
  ctx.fillStyle = "#dfdfdf";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

window.addEventListener("DOMContentLoaded", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Populates and Handles Form Data

$("#new-game").on("submit", function (e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  console.log(formData)
  
  // client.createInstance();
});

$(document).ready(function() {
  
});