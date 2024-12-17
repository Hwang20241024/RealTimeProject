import PreloadScene from './scenes/preload.scene.js';
import MainScene from './scenes/main.scene.js';
import SceneManager from './scene.manager.js';
import SocketManager from './socket.manager.js';

// 게임 설정
const config = {
  type: Phaser.AUTO,
  width: `100%`,
  height: `100%`,
  parent: 'game-container',
  scene: [PreloadScene, MainScene],
  audio: {
    noAudio: true,
  },
};

// 소켓 초기화.
SocketManager.getInstance();

// Phaser 게임 초기화
const game = new Phaser.Game(config);
const gameManager = new SceneManager(game);

// 게임 시작
gameManager.start();


