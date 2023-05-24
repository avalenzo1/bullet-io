const { Socket } = require("socket.io");
const { Room } = require("./blobius");

function roomHasInstanceOfSocket(room, socket) {
  if (!(room instanceof Room) || !(socket instanceof Socket)) return false;
  if (room.player[socket.id] !== undefined) return true;
}

class Server {
  constructor(io) {
    this.io = io;
    this.room = {};
    this.socket = {};
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
      if (roomHasInstanceOfSocket(this.room[room], this.socket[socket])) {
        this.captureEvent({
          event: 'Room/Leave',
          params: {
            socket: this.socket[socket],
            room: this.room[room]
          }
        });

        console.log(`socket ${socket} has left room ${room}`);
      }
    });
  }

  parseSocket({ socket, socketId }) {
    if (socket instanceof Socket) {
      return socket;
    }

    if (this.socket[socketId] instanceof Socket) {
      return this.socket[socketId];
    }

    return null;
  }

  parseRoom({ socket, socketId, room, roomId }) {
    if (socket instanceof Socket) {
      
    }

    if (this.socket[socketId] instanceof Socket) {
      
    }

    if (room instanceof Room) {
      return room;
    }

    if (this.room[roomId] instanceof Room) {
      return this.room[roomId];
    }

    return null;
  }

  getRandomRoom(params) {
    let roomList = Object.keys(this.room);
    let room;

    if (roomList.length > 0) {
      // If there are rooms available
      // Run This code block
      // Don't ask...

      return this.room[roomList[Math.floor(Math.random() * roomList.length)]];
    }

    return null;
  }

  captureEvent({ event, params }) {
    const navigator = event.split("/");

    let socket = this.parseSocket(params);

    if (navigator[0] === "Room") {
      // Socket Joins Room
      if (navigator[1] === "Join") {
        // Returns available rooms from room object
        let room = this.getRandomRoom(params);

        // If returned room is empty, create a room
        if (!(room instanceof Room)) {
          room = new Room(this.io);
        }

        // Attaches Socket
        room.attachSocket(socket, params.formData);

        this.room[room.id] = room;
      }

      // Socket creates room
      if (navigator[1] === "Create") {
        console.log(params);

        let room = new Room(this.io);
        room.attachSocket(socket, params.formData);

        this.room[room.id] = room;
      }

      // Socket leaves room
      if (navigator[1] === "Leave") {
        let room = this.parseRoom(params);

        if (roomHasInstanceOfSocket(room, socket)) {
          room.unattachSocket(socket);
        }
        
        // If Room is empty after 5 seconds, delete room
        setTimeout(() => {
          console.log("SELF DESTRUCT???")
          
          if (Object.keys(room.player).length === 0) {
            console.log("Yessir 💥")
            
            delete this.room[room.id];
          }
        }, 5000)
      }
      
      console.log(this.room)
    }

    console.log(`Event "${event}" was captured on ${new Date().toString()}`);
  }

  createInstance(socket) {
    this.socket[socket.id] = socket;

    // Creates On Events for Socket
    socket.on("Room/Create", () => {
      this.captureEvent({
        event: "Room/Create",
        params: { socket },
      });
    });

    socket.on("Room/Join", (formData) => {
      this.captureEvent({
        event: "Room/Join",
        params: { socket, formData },
      });
    });

    socket.on("Room/Kick", (socketId) => {
      this.captureEvent({
        event: "Room/Leave",
        params: { socket },
      });
    });

    socket.on("Room/Leave", () => {
      this.captureEvent({
        event: "Room/Leave",
        params: { socket },
      });
    });

    socket.on("Room/List", () => {
      this.captureEvent({
        event: "Room/Join",
        params: { socket },
      });
    });
    
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
    });
  }
}

function createServer(io) {
  let server = new Server(io);

  server.listen();
}

module.exports = {
  createServer,
};
