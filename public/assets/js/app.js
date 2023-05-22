import { Client } from './blobius.js';

const socket = io();
const client = new Client(socket);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// [Start of External Code]

function formToJSON(formData) {
  // https://stackoverflow.com/a/62010324
  
  return Object.fromEntries(
    Array.from(formData.keys()).map(key => [
      key, formData.getAll(key).length > 1 ? 
        formData.getAll(key) : formData.get(key)
    ])
  );
}

// [End of External Code]

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
  
  const formData = formToJSON(new FormData(e.target));
  
  localStorage.setItem("formData", JSON.stringify(formData));
  
  client.createInstance(formData);
});

$(document).ready(function() {
  if (localStorage.getItem("formData")) {
    let formData = JSON.parse(localStorage.getItem("formData"));
    
    console.log(formData)
    
    // Populates Input Data
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        $(`#new-game input[name='${key}']`).val(formData[key]);
      }
    }
  }
});