class Client {
  constructor(socket) {
    this.socket = socket;
  }
  
  createInstance(formData) {
    this.socket.emit("Room/Join");
  }
}

export { Client };