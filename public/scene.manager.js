// game.manager.js
import SocketManager from './socket.manager.js';

export default class SceneManager {
  constructor(game) {
    this.game = game;
  }

  start() {
    // 게임 시작을 위한 로직
    console.log("Game has started");
    this.game.scene.start('PreloadScene');
   
  }

  update() {
    // 게임의 매 프레임 업데이트
  }
}





