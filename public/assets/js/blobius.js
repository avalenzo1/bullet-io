function createGame() {
  let canvasContainer = document.getElementById("canvas-container");
  
  canvasContainer.innerHTML = "";
  
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  
  canvasContainer.appendChild(canvas);
  
  function resizeCanvas() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillStyle = "#dfdfdf";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
}

class Client {
  constructor(socket) {
    this.socket = socket;
    this.game;
    this.room;
  }
  
  listen() {
    this.socket.on('disconnect', function() {
      console.log("Socket was disconnected");
    });
    
    this.socket.on('connect', function() {
      console.log("Socket was connected");
    });
    
    this.socket.on('Room/Join', function(room) {
      this.room = room;
      
      this.game = createGame();
    });
  }
  
  captureEvent({ event, params }) {
    if (event === 'Room/Create') {
      
    }
    
    if (event === 'Room/Join') {
      this.socket.emit("Room/Join", params.formData);
    }
    
    console.log(`Event "${event}" was captured on ${new Date().toString()}`);
  }
}

export { Client };