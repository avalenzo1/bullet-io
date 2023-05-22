const { Socket } = require('socket.io');
const { Room } = require('./blobius');

function UUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function UID() {
    return Math.random().toString(36).slice(-6).toUpperCase();
}

function roomHasInstanceOfSocket(room, socket) {
    if (room === undefined || !socket === undefined) return false;
    if (room.socket[socket.id] !== undefined) return true;
}

class Server {
    constructor(io) {
      this.io = io;
      this.room = {};
    }
  
    listen() {
      this.io.on("connection", (socket) => {
          this.createInstance(socket);
      });
      
      
    }
  
    parseSocket({ socket, socketId }) {
        if (socket instanceof Socket) {
            return socket;
        }
    }

    parseRoom({ socket, socketId, room, roomId }) {
        if (typeof socket === 'object' && typeof this.socket[socket.id].roomId === 'string' && this.room[this.socket[socket.id].roomId] instanceof Room) {
            return this.room[this.socket[socket.id].roomId];
        }

        if (room instanceof Room) {
            return room;
        }

        if (this.room[roomId] instanceof Room) {
            return this.room[roomId];
        }
    }
  
    getRandomRoom() {
      
    }
  
    captureEvent({ event, params }) {
      const navigator = event.split("/");
      
      if (navigator[0] === 'Room') {
        let room;
        
        if (navigator[1] === 'Join') {
          console.log("Checking if roomId was given")
          
          let room = this.getRandomRoom();
          
          
          
          console.log("Searching for Rooms...")
          
          console.log(params.socket.id);
        }

        if (navigator[1] === 'Leave') {
          console.log(params.socket.id);
        } 
      }
      
      console.log(`Event "${event} was captured on ${new Date().toString()}"`);
    }
  
    createInstance(socket) {
      // Creates On Events for Socket
      socket.on("Room/Create", () => {
          this.captureEvent({
            event: 'Room/Create',
            params: { socket }
          });
      });
      
      socket.on("Room/Join", (roomId) => {
          this.captureEvent({
            event: "Room/Join",
            params: { roomId, socket }
          });
      });
      
      socket.on("Room/Kick", (socketId) => {
          this.captureEvent({
            event: 'Room/Leave',
            params: { socket }
          });
      });
      
      socket.on("Room/Leave", () => {
          this.captureEvent({
            event: 'Room/Leave',
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