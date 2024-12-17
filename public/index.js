import PreloadScene from './scenes/preload.scene.js';
import MainScene from './scenes/main.scene.js';

import Stage1Scene from './scenes/stage1.scene.js';
import Stage2Scene from './scenes/stage2.scene.js';
import Stage3Scene from './scenes/stage3.scene.js';
import Stage4Scene from './scenes/stage4.scene.js';
import Stage5Scene from './scenes/stage5.scene.js';

import SceneManager from './scene.manager.js';

import SocketManager from './socket.manager.js';

// 게임 설정
const config = {
  type: Phaser.AUTO,
  width: `100%`,
  height: `100%`,
  parent: 'game-container',
  scene: [PreloadScene, MainScene, Stage1Scene, Stage2Scene, Stage3Scene, Stage4Scene, Stage5Scene],
  audio: {
    noAudio: true,
  },
};

// 소켓 초기화.
SocketManager.getInstance();

// Phaser 게임 초기화
const game = new Phaser.Game(config);
const sceneManager = new SceneManager(game);


// 게임 시작
sceneManager.start();

