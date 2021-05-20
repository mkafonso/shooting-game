const canvas = document.querySelector("#canvas");
canvas.height = innerHeight;
canvas.width = innerWidth;

const ctx = canvas.getContext("2d");
const bulletsCollection = [];
const enemiesCollection = [];
let isGameOver = false;
let shootBullet = false;
let gameReference;

const playerPosition = {
  // x: canvas.width / 2,
  // y: canvas.height / 2,
  x: canvas.width / 2,
  y: canvas.height - 50,
};

class Player {
  constructor(xCoord, yCoord, radius, color) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Bullet {
  constructor(xCoord, yCoord, radius, color, velocity) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.xCoord += this.velocity.xVelocity;
    this.yCoord += this.velocity.yVelocity;
  }
}

class Enemy {
  constructor(xCoord, yCoord, radius, color, velocity) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.xCoord += this.velocity.xVelocity;
    this.yCoord += this.velocity.yVelocity;
  }
}

class Sound {
  constructor(source) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    // this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("loop", "true");
    this.sound.style.display = "none";

    document.body.appendChild(this.sound);

    this.play = () => {
      this.sound.play();
    };

    this.stop = () => {
      this.sound.pause();
    };
  }
}

function createEnemies() {
  setInterval(() => {
    const xCoord = Math.random() * canvas.width,
      yCoord = 0,
      radius = 30,
      color = "pink";

    const enemyAngleWithPlayer = Math.atan2(
      playerPosition.y - yCoord,
      playerPosition.x - xCoord
    );

    const bulletVelocity = {
      xVelocity: Math.cos(enemyAngleWithPlayer),
      yVelocity: Math.sin(enemyAngleWithPlayer),
    };

    // create and draw the enemy
    if (!isGameOver) {
      const newEnemy = new Bullet(
        xCoord,
        yCoord,
        radius,
        color,
        bulletVelocity
      );

      newEnemy.draw();

      enemiesCollection.push(newEnemy);
    }
  }, 1000);
}

function animateBullets() {
  if (isGameOver) return;

  gameReference = requestAnimationFrame(animateBullets);

  ctx.fillStyle = "rgba(38,96,164, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // create and draw the player
  const player = new Player(playerPosition.x, playerPosition.y, 20, "#EDF7F6");
  player.draw();

  // shoot bullets and add to the bulletsCollection
  bulletsCollection.forEach((bullet) => {
    bullet.update();
  });

  // create enemies annd add to the enemiesCollection
  enemiesCollection.forEach((enemy, enemyIndex) => {
    enemy.update();

    // collision hapened [enemy - player]
    const distance = Math.hypot(
      player.xCoord - enemy.xCoord,
      player.yCoord - enemy.yCoord
    );

    if (distance - enemy.radius - player.radius < 1) {
      isGameOver = true;

      const environmentMusic = new Sound("./media/game-over.wav");
      environmentMusic.play();

      cancelAnimationFrame(gameReference);

      setTimeout(() => {
        environmentMusic.stop();
      }, 3000);
    }

    // check collision
    bulletsCollection.forEach((bullet, bulletIndex) => {
      // collision hapened [enemy - bullet]
      const distance = Math.hypot(
        bullet.xCoord - enemy.xCoord,
        bullet.yCoord - enemy.yCoord
      );

      if (distance - enemy.radius - bullet.radius < 1) {
        enemiesCollection.splice(enemyIndex, 1);
      }
    });
  });
}

if (!isGameOver) {
  document.addEventListener("click", (event) => {
    shootBullet = true;
    if (shootBullet) {
      const shoot = new Sound("./media/shoot.wav");
      shoot.play();

      setTimeout(() => {
        shoot.stop();
      }, 1000);
    }

    const bulletAngleWithPlayer = Math.atan2(
      event.clientY - playerPosition.y,
      event.clientX - playerPosition.x
    );

    const bulletVelocity = {
      xVelocity: Math.cos(bulletAngleWithPlayer),
      yVelocity: Math.sin(bulletAngleWithPlayer),
    };

    // create and draw the bullets
    const newBullet = new Bullet(
      playerPosition.x,
      playerPosition.y,
      5,
      "#F19953",
      bulletVelocity
    );

    bulletsCollection.push(newBullet);
  });
}

window.onload = () => {
  isGameOver = false;

  if (!isGameOver) {
    const environmentMusic = new Sound("./media/environment.wav");
    environmentMusic.play();
  }
};

animateBullets();
createEnemies();
