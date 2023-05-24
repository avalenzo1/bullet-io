class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.canvas.style.border = "1px solid";

    // List of all rendered items
    this.playerList = [];
    this.itemList = [];
    this.pelletList = [];

    this.showDebug = false;
    this.requestId = null;
  }
  
  startConnection() {
    this.canvas.style.borderColor = "blue";
    this.requestId = window.requestAnimationFrame(this.render);
  }
  
  endConnection() {
    this.canvas.style.borderColor = "blue";
    this.requestId = window.cancelAnimationFrame(this.render);
  }

  render() {
    let ctx = this.ctx;

    ctx.fillText(Math.random(), 12, 12);
    
    this.render();
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

    this.socket.on("disconnect", () => {
      console.log("Socket was disconnected");
    });

    this.socket.on("connect", () => {
      console.log("Socket was connected");
    });

    this.socket.on("Room/Join", (room) => {
      this.game.startConnection();
    });
    
    this.socket.on("Room/Leave", (room) => {
      this.game.endConnection();
    });
    
    this.socket.on("Room/Tick", (room) => {
      
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
