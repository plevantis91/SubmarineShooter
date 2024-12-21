import Phaser from "phaser";
// Retroactive update for 12-21-2024 - Final

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.image("bg", "/assets/ocean_background.png");
  }

  create() {
    this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.bg.setDisplaySize(this.scale.width, this.scale.height);

    this.gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "YOU LOST!!!",
      { font: "64px Arial", fill: "#ffffff" }
    ).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    // Resize listener
    this.scale.on("resize", (gameSize) => {
      this.bg.setDisplaySize(gameSize.width, gameSize.height);
      this.gameOverText.setPosition(gameSize.width / 2, gameSize.height / 2);
    });
  }
}
