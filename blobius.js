const { Socket } = require("socket.io");
const { v4 } = require("uuid");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

function UUID() {
  return v4();
}

function UID() {
  return Math.random().toString(36).slice(-6).toUpperCase();
}

class Ticker {
  constructor(delay) {
    this.delay = delay > 5 ? delay : 50;
    this.intervalId = null;
  }

  start() {
    console.log(this);
    if (typeof this.step === "function" && typeof this.delay === "number") {
      this.intervalId = setInterval(this.step, this.delay);
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

class GameObject {
  constructor(x, y, w, h, mass) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 10;
    this.h = h || 10;
    this.mass = mass || 1;

    this.config = {
      useGravity: true,
    };
    
    this.opacity = 1;

    // Theta
    this.θ = 0;

    // Mu
    this.µ = 0.95;

    // Gravity
    this.g = 9.8;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.acceleration = {
      x: 1,
      y: this.config.useGravity ? this.g : 0,
    };

    this.collision = {
      w: this.w,
      h: this.h,
    };
  }
}

class Bullet extends GameObject {
  #ticker;
  
  constructor(x, y, θ) {
    super(x,y,10,10);
    
    this.config.useGravity = false;
    
    this.showExplosion = false;
    
    this.θ = θ;
    this.range = 5;
    this.#ticker = new Ticker(50);
    
    this.#ticker.step = () => {
      this.velocity.x += Math.cos(this.θ) * this.range;
      this.velocity.y += Math.sin(this.θ) * this.range;
      
      this.velocity.y += this.acceleration.y / 5;
      
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.velocity.x *= this.µ;
      this.velocity.y *= this.µ;
    }
    
    this.#ticker.start();
  }
  
  selfDestruct() {
    this.showExplosion = true;
    this.#ticker.stop();
  }
}

class Player extends GameObject {
  #ticker;

  constructor({ socket, params }) {
    super(0, 0, 50, 100);

    this.id = socket.id;
    this.username = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
    });

    this.lives = 3;
    this.hp = 100;
    this.hpCapacity = 100;

    this.controls = {
      up: false,
      left: false,
      right: false,
      down: false,
      shoot: false,
      θ: 0,
    };
    
    this.bullets = [];

    this.username = params.username || "Anonymous";
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
    
    console.log(this.velocity)

    this.buffer = [];

    this.#ticker = new Ticker(50);

    this.#ticker.step = () => {
      if (this.controls.up) {
        this.velocity.y -= this.g * 2;
      }

      this.velocity.y += this.acceleration.y;
      
      if (this.controls.shoot) {
        let bullet = new Bullet(this.x + this.w / 2, this.y + this.h / 2, this.controls.θ);
        
        this.bullets.push(bullet);
        
        setTimeout(() => {
          
          bullet.selfDestruct();
          
          setTimeout(() => {
            this.bullets.shift()
          }, 1000);
        }, 1000);
      }

      if (this.controls.left) {
        this.velocity.x -= this.acceleration.x;
      }

      if (this.controls.right) {
        this.velocity.x += this.acceleration.x;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.velocity.x *= this.µ;
      this.velocity.y *= this.µ;

      // Sets boundaries of arena
      if (this.y < 0) {
        this.velocity.y = 0;
        this.y = 0;
        this.hp--;
      }

      if (this.y > 500 - this.collision.h) {
        this.velocity.y = 0;
        this.y = 500 - this.collision.h;
      }

      if (this.hp < 0) {
        this.die();
      }
    };

    this.#ticker.start();
  }

  die() {
    this.lives--;

    if (this.lives < 0) {
      this.#ticker.stop();
    }

    this.hp = this.hpCapacity;

    this.x = 0;
    this.y = 0;
  }
}

class CollisionEngine {
  constructor(world) {
    this.world = world;
  }
}

class Room {
  #io;
  #ticker;

  constructor(io, name, capacity = 100) {
    this.#io = io;
    this.id = UUID();
    this.name =
      name ||
      `${uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 3,
      })}`;
    this.player = {};
    this.capacity = 5;
    this.#ticker = new Ticker(50);

    this.#ticker.step = () => {
      this.#io.to(this.id).emit("Room/Tick", this);
    };

    this.#ticker.start();
  }

  get available() {
    // Checks if room is full
    return Object.keys(this.player).length / this.capacity < 1;
  }

  attachSocket(socket, params) {
    if (this.player.hasOwnProperty(socket.id)) {
      console.warn("Socket already exists");
    } else {
      socket.join(this.id);
      this.player[socket.id] = new Player({ socket, params });
      this.#io.to(socket.id).emit("Room/Join", this);

      this.createLocalInstance(socket);
    }
  }

  createLocalInstance(socket) {
    // Creates onEvents for socket

    socket.on("Room/Tick", (controls) => {
      this.player[socket.id].controls = controls;
    });
  }

  unattachSocket(socket) {
    if (socket instanceof Socket) {
      let player = this.player[socket.id];

      if (player instanceof Player) {
        socket.leave(this.id);
        delete this.player[socket.id];

        console.log(`Socket ${socket.id} was unattached from room ${this.id}`);
      }
    }
  }

  selfDestruct() {
    this.#ticker.stop();
  }
}

module.exports = {
  Room,
};
