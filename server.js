const { Socket } = require('socket.io');

function UUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

class Server {
    constructor(io) {
      this.io = io;
    }
  
    listen() {
      this.io.on("connection", (socket) => {
          this.createInstance(socket);
      });
    }

    captureEvent({ event, params }) {
      if (event === 'Room/Join') {
        console.log(params.socket.id)
      }
      
      console.log(`Event "${event} was captured on ${new Date().toString()}"`);
    }
  
    createInstance(socket) {
      this.socket[socket.id] = socket;
      // Creates On Events for Socket
      socket.on("Room/Create", (state) => {
          this.captureEvent({
            event: 'Room/Create',
            params: { socket }
          });
      });
      
      socket.on("Room/Join", (state) => {
          this.captureEvent({
            event: 'Room/Join',
            params: { socket }
          });
      });
    }
}

function createServer(io) {
  let server = new Server(io);
  
  server.listen();
}

module.exports = {
    createServer
};