

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.blobSystem = [];
    this.pelletSystem = [];
    this.showDebug = false;
  }
  
  render() {
    
  }
}

function createGame() {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas);
  
  return game;
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