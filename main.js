import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu.js';
import SubmarineShooter from './scenes/SubmarineShooter.js';
import GameOver from './scenes/GameOver.js';

// Retroactive commit for 12-21-2024
// Project completed: December 21, 2024
// All assets and files updated with retroactive date - Final

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MainMenu, SubmarineShooter, GameOver],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);