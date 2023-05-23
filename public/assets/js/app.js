import { Client } from "./blobius.js";
import { formToJSON } from "./tool-box.js";

// Creates Socket Connection
const socket = io();
const client = new Client(socket);

// Resizes Canvas
const canvas = document.getElementById("canvas");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("DOMContentLoaded", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Populates and Handles Form Data

$("#new-game").on("submit", function (e) {
  e.preventDefault();

  // On form submit, convert form input to JSON
  const formData = formToJSON(new FormData(e.target));

  // Saves form data to localStorage
  localStorage.setItem("formData", JSON.stringify(formData));

  // Starts Client Connection
  client.captureEvent({
    event: "Room/Join",
    params: { formData },
  });
});

$(document).ready(function () {
  // If localStorage includes formData, populate data into form

  if (localStorage.getItem("formData")) {
    let formData = JSON.parse(localStorage.getItem("formData"));

    console.log(formData);

    // Populates Input Data
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        $(`#new-game input[name='${key}']`).val(formData[key]);
      }
    }
  }

  // Creates Socket.IO onEvents
  client.listen();
});
