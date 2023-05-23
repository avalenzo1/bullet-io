class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // List of all rendered items
    this.playerList = [];
    this.itemList = [];
    this.pelletList = [];

    this.showDebug = false;
  }
  
  tick(room) {
    
  }

  render() {
    
  }
}

class Client {
  constructor(socket) {
    this.socket = socket;
    this.room = null;
    this.game = new Game();
  }

  listen() {
    // Creates onEvents for socket

    this.socket.on("disconnect", function () {
      console.log("Socket was disconnected");
    });

    this.socket.on("connect", function () {
      console.log("Socket was connected");
    });

    this.socket.on("Room/Join", function (room) {
      
    });
    
    this.socket.on("Room/Tick", function (room) {
      
    });
  }

  captureEvent({ event, params }) {
    if (event === "Room/Create") {
    }

    if (event === "Room/Join") {
      this.socket.emit("Room/Join", params.formData);
    }

    console.log(`Event "${event}" was captured on ${new Date().toString()}`);
  }
}

export { Client };
