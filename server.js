const { Socket } = require('socket.io');

function UUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


class Server {
    constructor(io) {
      this.io = io;
      
      this.io.on("connection", (socket) => {
            this.createInstance(socket);
        });
    }

    listen() {
        
    }
  
    createInstance(socket) {
      socket.on("Server/Room/Create", (state) => {
          this.captureEvent({ event: 'Server/Room/Join' });
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