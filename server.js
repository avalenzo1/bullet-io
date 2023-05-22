const { Socket } = require('socket.io');
const { Room } = require('./blobius');



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
  
    getRandomRoom(params) {
      let roomList = Object.keys(this.room);
      let room;
      
      if (roomList.length > -1) {
        // If there are rooms available
        // Run This code block
        
        if (params.roomId) {
          // Check if room was given
          console.log(params.roomId);
          
          room = this.parseRoom({ roomId: params.roomId });
        }
      } else {
        // If there are no rooms available
        // Create one!
        
        room = new Room(this.io);
        
        return room;
      }
    }
  
    captureEvent({ event, params }) {
      const navigator = event.split("/");
      
      if (navigator[0] === 'Room') {
        let room;
        
        if (navigator[1] === 'Random') {
          let room = this.getRandomRoom(params);
          
          room.attachSocket();
          
          console.log(params.socket.id);
        }
        
        if (navigator[1] === 'Join') {
          
        }
        
        if (navigator[1] === 'Create') {
          console.log(params);
          
          let room = new Room(this.io);
          
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