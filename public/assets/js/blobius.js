

class Client {
  constructor(socket) {
    this.socket = socket;
    this.room;
  }
  
  listen() {
    this.socket.on('disconnect', function() {
      console.log("Socket was disconnected");
    });
    
    this.socket.on('connect', function() {
      console.log("Socket was connected");
    });
    
    this.socket.on('Room/Join', function(room) {
      console.log(room);
      
      this.room = room;
    });
  }
  
  captureEvent({ event, params }) {
    if (event === 'Room/Create') {
      
    }
    
    if (event === 'Room/Join') {
      this.socket.emit("Room/Join", params.formData);
    }
    
    console.log(`Event "${event}" was captured on ${new Date().toString()}`);
  }
}

export { Client };