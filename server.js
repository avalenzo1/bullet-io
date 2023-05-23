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

      this.io.of("/").adapter.on("delete-room", (room) => {
          console.log(`room ${room} was deleted`);
      });

      this.io.of("/").adapter.on("create-room", (room) => {
          console.log(`room ${room} was created`);
      });

      this.io.of("/").adapter.on("join-room", (room, socket) => {
          console.log(`socket ${socket} has joined room ${room}`);
      });

      this.io.of("/").adapter.on("leave-room", (room, socket) => {
          this.captureEvent({ event: 'Room/Leave', params: { socket, room: this.room[room] } });

          console.log(`socket ${socket} has left room ${room}`);
      });
    }
  
    parseSocket({ socket, socketId }) {
        if (socket instanceof Socket) {
            return socket;
        }
    }

    parseRoom({ socket, socketId, room, roomId }) {
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
        
        
      }
      
      return null;
    }
  
    captureEvent({ event, params }) {
      const navigator = event.split("/");
      
      let socket = this.parseSocket(params);
      
      if (navigator[0] === 'Room') {
        let room;
        
        if (navigator[1] === 'Join') {
          // Returns available rooms from room object
          room = this.getRandomRoom(params)
          
          // If returned room is null, creates one
          
          if (!(room instanceof Room)) {
            room = new Room(this.io);
          }
          
          // Attaches Socket
          room.attachSocket(socket, params.formData);
          
          this.room[room.id] = room;
        }
        
        if (navigator[1] === 'Create') {
          console.log(params);
          
          let room = new Room(this.io);
              room.attachSocket(socket, params.formData);
          
          this.room[room.id] = room;
        }

        if (navigator[1] === 'Leave') {
          console.log(params.socket.id);
        } 
      }
      
      console.log(this.room);
      
      console.log(`Event "${event}" was captured on ${new Date().toString()}`);
    }
  
    createInstance(socket) {
      // Creates On Events for Socket
      socket.on("Room/Create", () => {
          this.captureEvent({
            event: 'Room/Create',
            params: { socket }
          });
      });
      
      socket.on("Room/Join", (formData) => {
          this.captureEvent({
            event: "Room/Join",
            params: { formData, socket }
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
      
      socket.on("Room/List", () => {
          this.captureEvent({
            event: "Room/Join",
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