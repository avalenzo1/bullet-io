const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

class Room {
  constructor(io) {
    this.name = name;
    this.socket = {};
    this.capacity = 100;
    
  }
  
  attachSocket() {
    
  }
  
  unattachSocket() {
    
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