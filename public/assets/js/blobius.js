class Client {
  constructor(socket) {
    this.socket = socket;
  }
  
  createInstance() {
    this.socket.emit("Room/Join");
  }
}

export { Client };