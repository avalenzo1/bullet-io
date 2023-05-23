class Game {
  constructor(client, canvas) {
    this.client = client;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    
    window.requestAnimationFrame(this.render);
  }

  render() {
    this.ctx.fillText(const ctx = canvas.getContext("2d");)
    
  }
}

function createGame(client) {
  const canvas = document.getElementById("canvas");
  const game = new Game(client, canvas);
  
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
      
      this.game = createGame(this);
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