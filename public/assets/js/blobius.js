class Client {
  constructor(socket) {
    this.socket = socket;
  }
  
  captureEvent({ }) {
    if (event === 'Room/Create') {
      
    }
    
    if (event === 'Room/Create') {
      
    }
    
    if (event === 'Room/Create') {
      
    }
  }
  
  createInstance(formData) {
    if (formData.hasOwnProperty("room-id")) {
      this.socket.emit("Room/Join", formData);
    } else {
      this.socket.emit("Room/Random", formData);
    }
  }
}

export { Client };