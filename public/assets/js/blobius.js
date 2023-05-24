class Camera {
  constructor() {
    
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // List of all rendered items
    this.camera = new Camera();
    this.playerList = [];
    this.itemList = [];
    this.pelletList = [];

    this.showDebug = false;
    this.requestId = null;
    
    window.addEventListener("DOMContentLoaded", this.resizeCanvas.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }
  
  resizeCanvas() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerWidth;
  }
  
  startConnection() {
    this.requestId = window.requestAnimationFrame(this.render.bind(this));
  }
  
  endConnection() {
    this.requestId = window.cancelAnimationFrame(this.render.bind(this));
  }

  render() {
    let ctx = this.ctx;
    let canvas = this.canvas;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    ctx.fillStyle = "#fff";
    ctx.fillText(Math.random(), 12, 12);
    
    this.requestId = window.requestAnimationFrame(this.render.bind(this));
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
