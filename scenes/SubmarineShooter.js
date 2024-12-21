import Phaser from "phaser";
// Retroactive update for 12-21-2024 - Final

export default class SubmarineShooter extends Phaser.Scene {
  constructor() {
    super("SubmarineShooter");
    this.level = 0;
    this.lives = 3;
    this.enemyVel = 100; // pixels/sec
    this.weaponVel = 400;
    this.playerVel = 300;
  }

  preload() {
    // Background
    this.load.image("bg", "/assets/ocean_background.png");
    // Player
    this.load.image("sub", "/assets/yellow_sub.png");
    this.load.image("torpedo", "/assets/Torpedo.png");
    // Enemies
    this.load.image("shark", "/assets/Shark.png");
    this.load.image("octopus", "/assets/Octopus.png");
    this.load.image("fish", "/assets/Fish.png");
    this.load.image("bubble", "/assets/Bubble.png");
  }

  create() {
    // Background
    this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.bg.setDisplaySize(this.scale.width, this.scale.height);

    // Player
    this.player = this.physics.add.sprite(
      this.scale.width * 0.5,
      this.scale.height * 0.85,
      "sub"
    );
    this.player.setCollideWorldBounds(true);
    this.player.health = 100;
    this.player.maxHealth = 100;
    this.player.cooldown = 0;

    // Player weapons
    this.playerWeapons = this.physics.add.group();

    // Enemy group
    this.enemies = this.physics.add.group();
    this.waveLength = 5;

    // Input keys
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // UI
    this.livesText = this.add.text(20, 20, `Lives: ${this.lives}`, { fontSize: "24px", fill: "#fff" });
    this.levelText = this.add.text(this.scale.width - 150, 20, `Level: ${this.level}`, { fontSize: "24px", fill: "#fff" });

    // Resize listener
    this.scale.on("resize", (gameSize) => {
      this.bg.setDisplaySize(gameSize.width, gameSize.height);
      this.levelText.setPosition(gameSize.width - 150, 20);
      this.player.setPosition(gameSize.width * 0.5, gameSize.height * 0.85);
    });
  }

  update(time, delta) {
    // Player movement
    this.player.setVelocity(0);
    if (this.keys.A.isDown) this.player.setVelocityX(-this.playerVel);
    if (this.keys.D.isDown) this.player.setVelocityX(this.playerVel);
    if (this.keys.W.isDown) this.player.setVelocityY(-this.playerVel);
    if (this.keys.S.isDown) this.player.setVelocityY(this.playerVel);

    // Player shooting
    if (this.keys.SPACE.isDown && this.player.cooldown <= 0) {
      this.shootTorpedo();
      this.player.cooldown = 300; // ms cooldown
    }
    if (this.player.cooldown > 0) this.player.cooldown -= delta;

    // Spawn enemies if none left
    if (this.enemies.countActive(true) === 0) {
      this.level++;
      this.waveLength += 5;
      this.spawnWave();
    }

    // Move player weapons
    this.playerWeapons.children.iterate((weapon) => {
      if (!weapon) return;
      weapon.x += this.weaponVel * (delta / 1000);
      if (weapon.x > this.scale.width) weapon.destroy();

      // Check collisions with enemies
      this.enemies.children.iterate((enemy) => {
        if (!enemy) return;
        if (Phaser.Geom.Intersects.RectangleToRectangle(weapon.getBounds(), enemy.getBounds())) {
          enemy.health -= 10;
          weapon.destroy();
          if (enemy.health <= 0) enemy.destroy();
        }
      });
    });

    // Enemy behavior
    this.enemies.children.iterate((enemy) => {
      if (!enemy) return;
      enemy.x -= this.enemyVel * (delta / 1000);

      // Collide with player
      if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), this.player.getBounds())) {
        this.player.health -= 10;
        enemy.destroy();
        if (this.player.health <= 0) {
          this.lives--;
          this.player.health = this.player.maxHealth;
          if (this.lives <= 0) this.scene.start("GameOver");
        }
      }

      // Remove off-screen enemies
      if (enemy.x + enemy.width < 0) enemy.destroy();
    });

    // Update UI
    this.livesText.setText(`Lives: ${this.lives}`);
    this.levelText.setText(`Level: ${this.level}`);

    // Draw health bar
    this.drawHealthBar();
  }

  shootTorpedo() {
    const torpedo = this.playerWeapons.create(this.player.x + 40, this.player.y, "torpedo");
    torpedo.setOrigin(0.5, 0.5);
  }

  spawnWave() {
    const enemyTypes = ["shark", "octopus", "fish"];
    for (let i = 0; i < this.waveLength; i++) {
      const x = Phaser.Math.Between(this.scale.width + 50, this.scale.width + 1000);
      const y = Phaser.Math.Between(50, this.scale.height - 50);
      const type = Phaser.Utils.Array.GetRandom(enemyTypes);
      const enemy = this.enemies.create(x, y, type);
      enemy.health = 20;
      enemy.setOrigin(0.5, 0.5);
    }
  }

  drawHealthBar() {
    if (this.healthGraphics) this.healthGraphics.clear();
    else this.healthGraphics = this.add.graphics();

    const x = this.player.x - this.player.width * 0.5;
    const y = this.player.y + this.player.height * 0.6;
    const width = this.player.width;
    const height = 10;

    this.healthGraphics.fillStyle(0xff0000);
    this.healthGraphics.fillRect(x, y, width, height);

    this.healthGraphics.fillStyle(0x00ff00);
    this.healthGraphics.fillRect(x, y, width * (this.player.health / this.player.maxHealth), height);
  }
}
