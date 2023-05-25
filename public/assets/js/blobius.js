class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.θ = 0;
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
    
    this.room = null;
    
    // List of all rendered items
    this.playerList = [];
    this.itemList = [];
    this.pelletList = [];

    // Variables
    this.showDebug = true;
    
    // Resizes Canvas
    this.requestId = null;
    
    window.addEventListener("DOMContentLoaded", this.resizeCanvas.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    
    // Handles Key Events
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
    
    // Handles Mousemove Events
    window.addEventListener("mousemove", this.mouseMove.bind(this));
    
    this.playerId;
    this.controls = {
      up: false,
      left: false,
      right: false,
      down: false
    }
  }
  
  attachSocket(socket) {
    this.socket = socket;
    this.playerId = this.socket.id;
  }
  
  setControls(key, state) { 
    switch (key) {
      case 'W':
      case 'w':
      case 'ArrowUp':
        this.controls.up = state;
        break;
      case 'A':
      case 'a':
      case 'ArrowLeft':
        this.controls.left = state;
        break;
      case 'D':
      case 'd':
      case 'ArrowRight':
        this.controls.right = state;
        break;
      case 'S':
      case 's':
      case 'ArrowDown':
        this.controls.down = state;
        break;
    }
  }
  
  keyDown(e) {
    if (e.shiftKey) {
      this.showDebug = !this.showDebug;
    }
    
    this.setControls(e.key, true);
  }
  
  keyUp(e) {
    this.setControls(e.key, false);
  }
  
  mouseMove(e) {
    if (this.room) {
      let player = this.room.player[this.playerId];
      this.controls.θ = Math.atan2(
        (e.clientY - player.y - (player.h / 2)),
        (e.clientX - player.x - (player.w / 2))
      ) || 0;
    }
  }
  
  resizeCanvas() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
  
  startConnection() {
    this.requestId = window.requestAnimationFrame(this.render.bind(this));
  }
  
  tick(room) {
    this.room = room;
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
    
    ctx.fillStyle = "#dfdfdf";
    ctx.fillRect(0,500,canvas.width, canvas.height);
    
    ctx.font = "16px Monospace";

    if (this.room) {
      ctx.save();
      for (let playerId of Object.keys(this.room.player)) {
        let player = this.room.player[playerId];
        
        ctx.fillStyle = "#333";
        ctx.fillText(`${player.hp} / ${player.hpCapacity} hp`, player.x, player.y)
        ctx.fillStyle = player.color;
        ctx.fillText(`${player.username}`, player.x, player.y - 12);
        ctx.fillRect(player.x, player.y, player.w, player.h);
        
        ctx.save();
        ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
        ctx.rotate(player.controls.θ)
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(100,0);
        ctx.stroke();
        
        ctx.restore();
      }
      ctx.restore();
    }
    
    
    if (this.showDebug) {
      ctx.fillStyle = "#000";
      ctx.fillMultiLineText(`Camera: ${JSON.stringify(this.camera, null, "  ")}\n\nPlayer: ${JSON.stringify(this.controls, null, " ")}\n\nRoom: ${JSON.stringify(this.room, null, " ")}`, 0, 16);
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
      this.game.attachSocket(this.socket);
    });

    this.socket.on("Room/Join", (room) => {
      this.game.startConnection();
      
      this.game.tick(room);
    });
    
    this.socket.on("Room/Leave", () => {
      this.game.endConnection();
    });
    
    this.socket.on("Room/Tick", (room) => {
      this.game.tick(room);
      
      this.socket.emit("Room/Tick", this.game.controls);
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
