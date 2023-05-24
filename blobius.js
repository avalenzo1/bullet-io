const { Socket } = require("socket.io");
const { v4 } = require('uuid');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function UUID() {
    return v4();
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

class Ticker {
  constructor() {
    this.delay = 50;
    this.intervalId = null;
  }
  
  start() {
    console.log(this)
    if (typeof this.step === 'function' && typeof this.delay === 'number') {
      setInterval(this.step, this.delay);
    }
    
  }
  
  stop() {
    clearInterval(this.timeoutId);
  }
}

class Player {
  constructor({ socket, params }) {
      this.id = socket.id;
      this.username = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 });
      this.hp = 100;
      this.x = 0;
      this.y = 0;
      this.xVel = 0;
      this.yVel = 0;
      this.theta = 0;
    
      this.username = params.username || "Anonymous";
  }
}

class Room {
  #io;
  
  constructor(io, name, capacity = 100) {
    this.#io = io;
    this.id = UUID();
    this.name = name || `${uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 })}`;
    this.player = {};
    this.capacity = 5;
    this.ticker = new Ticker();
    
    this.ticker.step = () => {
      console.log("heyyaaa")
    };
    
    this.ticker.start();
  }
  
  get available() {
    // Checks if room is full
    return (Object.keys(this.player).length / this.capacity) < 1;
  }
  
  attachSocket(socket, params) {
    if (this.player.hasOwnProperty(socket.id)) {
      console.warn("Socket already exists");
    } else {
      socket.join(this.id);
      this.player[socket.id] = new Player({ socket, params });
      this.#io.to(socket.id).emit("Room/Join", this);
    }
  }
  
  unattachSocket(socket) {
    if (socket instanceof Socket) {
      let player = this.player[socket.id];
    
      if (player instanceof Player) {
        socket.leave(this.id);
        delete this.player[socket.id]; 
        
        console.log(`Socket ${socket.id} was unattached from room ${this.id}`); 
      }
    }
  }
  
  selfDestruct() {
    this.ticker.stop();
  }
}

module.exports = {
    Room
};