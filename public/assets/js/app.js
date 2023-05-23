import { Client } from './blobius.js';

const socket = io();
const client = new Client(socket);

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

// Populates and Handles Form Data

$("#new-game").on("submit", function (e) {
  e.preventDefault();
  
  const formData = formToJSON(new FormData(e.target));
  
  localStorage.setItem("formData", JSON.stringify(formData));
  
  client.captureEvent({
    event: "Room/Join",
    params: { formData }
  });
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
  
  client.listen();
});