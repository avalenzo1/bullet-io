class Client {
  constructor(socket) {
    this.socket = socket;
  }
  
  captureEvent(event) {
    if (event) {
      
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