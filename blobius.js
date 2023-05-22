const { v4 } = require('uuid');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function UUID() {
    return v4();
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

class Game {
  constructor() {
    
  }
}

class Player {
    constructor({ socket, name }) {
        this.socket = socket;
        this.name = name || uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 });
    }
}

class Room {
  constructor(io, name, capacity = 100) {
    this.io = io;
    this.id = UUID();
    this.name = name || `Room ${uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 })}`;
    this.socket = {};
    this.capacity = 100;
  }
  
  get available() {
    // Checks if room is full
    return (Object.keys(this.socket).length / this.capacity) < 1;
  }
  
  attachSocket(socket) {
    this.socket[socket.id] = new Player(socket);
    
    this.io.to()
    
    console.log(this.socket);
  }
  
  unattachSocket(socket) {
    
  }
}

module.exports = {
    Room
};