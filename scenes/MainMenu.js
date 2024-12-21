import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("bg", "/assets/ocean_background.png");
  }

  create() {
    this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.bg.setDisplaySize(this.scale.width, this.scale.height);

    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height * 0.3,
      "Press the mouse to begin...",
      { font: "48px Arial", fill: "#ffffff" }
    ).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("SubmarineShooter");
    });

    // Resize listener
    this.scale.on("resize", (gameSize) => {
      this.bg.setDisplaySize(gameSize.width, gameSize.height);
      this.titleText.setPosition(gameSize.width / 2, gameSize.height * 0.3);
    });
  }
}
