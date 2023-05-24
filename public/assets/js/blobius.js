class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  
  focus(object) {

  } 
}

function handleCtx(ctx) {
  ctx.fillMultiLineText = (_string, x, y, gap = 2) => {
    let stringList = _string.split("\n");
    
    const match = /(?<value>\d+\.?\d*)/;
    
    for (let i = 0; i < stringList.length; i++) {
      ctx.fillText(stringList[i], x, y + (i * ctx.font.match(match)[0]) + gap);
    }
  }
  
  return ctx;
}

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.ctx = handleCtx(this.ctx);

    // Handles objects
    this.camera = new Camera();
    
    // List of all rendered items
    this.playerList = [];
    this.itemList = [];
    this.pelletList = [];

    // Variables
    this.showDebug = false;
    
    // Resizes Canvas
    this.requestId = null;
    
    window.addEventListener("DOMContentLoaded", this.resizeCanvas.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    
    // Handles Key Events
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
    
    this.controls = {
      top: false,
      left: false,
      right: false,
      bottom: false
    }
  }
  
  keyDown(e) {
    if (e.shiftKey) {
      this.showDebug = !this.showDebug;
    }
    
    switch (e.key) {
      case 'W':
      case 'w':
      case 'ArrowTop':
        this.controls.top = true;
        break;
      case 'A':
      case 'a':
      case 'ArrowLeft':
        this.controls.left = true;
        break;
      case 'R':
      case 'r':
      case 'ArrowRight':
        this.controls.right = true;
        break;
      case 'S':
      case 's':
      case 'ArrowDown':
        this.controls.down = true;
        break;
    }
  }
  
  keyUp(e) {
    switch (e.key) {
      case 'W':
      case 'w':
      case 'ArrowTop':
        this.controls.top = false;
        break;
      case 'A':
      case 'a':
      case 'ArrowLeft':
        this.controls.left = false;
        break;
      case 'R':
      case 'r':
      case 'ArrowRight':
        this.controls.right = false;
        break;
      case 'S':
      case 's':
      case 'ArrowDown':
        this.controls.down = false;
        break;
    }
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
    
    ctx.fillStyle = "#fdfdfd";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    ctx.font = "16px Monospace"
    
    if (this.showDebug) {
      ctx.fillStyle = "#000";
      ctx.fillMultiLineText(`Camera: ${JSON.stringify(this.camera, null, " ")}\n\nPlayer: ${JSON.stringify(this.controls, null, " ")}`, 0, 16);
    }
    
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
      this.socket.emit("Room/Tick", this.game.controls)
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
