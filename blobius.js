const { v4 } = require('uuid');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function UUID() {
    return v4();
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

class Arena {
  constructor() {
    
  }
}

class PelletSystem {
  constructor() {
    
  }
}

class PlayerSystem {
  constructor() {
    
  }
}

class ItemSystem {
  constructor() {
    
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
      // this.socket = socket;
      this.username = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 });
      this.mass = 0;
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
    this.socket = {};
    this.capacity = 100;
  }
  
  get available() {
    // Checks if room is full
    return (Object.keys(this.socket).length / this.capacity) < 1;
  }
  
  attachSocket(socket, params) {
    if (this.socket.hasOwnProperty(socket.id)) {
      console.warn("Socket already exists")
    } else {
      this.socket[socket.id] = new Player({ socket, params });
    }
    
    
    this.#io.to(socket.id).emit("Room/Join", this);
    
    console.log(this.socket);
  }
  
  unattachSocket(socket) {
    delete this.socket[socket.id];
  }
}

module.exports = {
    Room
};