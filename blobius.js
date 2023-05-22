const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function UUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

class Room {
  constructor(io, name, capacity = 100) {
    this.io = io;
    this.id = UUID();
    this.name = name || `Room-${this.id}`;
    this.socket = {};
    this.capacity = 100;
  }
  
  get available() {
    // Checks if room is full
    return (Object.keys(this.socket).length / this.capacity) < 1;
  }
  
  attachSocket(socket) {
    
  }
  
  unattachSocket(socket) {
    
  }
}

class Player {
    constructor({ socket, name }) {
        this.socket = socket;
        this.name = name || uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 3 });
    }
}

module.exports = {
    Room
};