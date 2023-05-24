const { Socket } = require("socket.io");
const { v4 } = require('uuid');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function UUID() {
    return v4();
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

class PelletSystem {
  constructor() {
    this.pelletList = [];
    this.maxPellets = 10000;
  }
}

class PlayerSystem {
  constructor() {
    this.playerList = [];
  }
}

class ItemSystem {
  constructor() {
    this.array = [];
  }
}

class CollisionDetectionEngine {
  constructor() {
    
  }
}

class Game {
  constructor() {
    this.arena = new Arena();
    this.pelletSystem = new PelletSystem();
    this.playerSystem = new PlayerSystem();
    this.itemSystem = new ItemSystem();
    this.collisionDetectionEngine = new CollisionDetectionEngine();
  }
}

class Player {
  constructor({ socket, params }) {
      this.id = socket.id;
      this.username = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 });
      this.mass = 10;
      this.x = 0;
      this.y = 0;
      this.xVel = 0;
      this.yVel = 0;
    
      if (params.hasOwnProperty("username")) {
        this.username = params.username;
      }
  }
}

class Room {
  #io;
  
  constructor(io, name, capacity = 100) {
    this.#io = io;
    this.id = UUID();
    this.name = name || `Room ${uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 })}`;
    this.player = {};
    this.capacity = 5;
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
}

module.exports = {
    Room
};