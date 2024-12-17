import SocketManager from './socket.manager.js';

export default class SceneManager {
  constructor(game) {
    this.game = game;
    this.socket = SocketManager.getInstance().socket;

    this.update();
  }

  start() {
    this.game.scene.start('PreloadScene');
  }

  update() {
    // 체널 변경.
    this.socket.on('seneChange', (data) => {
      // 소켓에 바뀐 스테이지 저장.
      this.socket.currentStage = data.payload.message;
      const Stage = this.socket.currentStage;

      //
      if (Stage !== 0 && Stage !== null) {
        this.game.scene.start('Stage' + Stage + 'Scene');
      } else if(Stage === 0) {
        this.game.scene.start('MainScene');
      }
    });
  }
}


// 내일 할꺼. 
// 1. 명예의 전당 이름 변경, 랭킹 실시간으로 변경.
// 2. 현재 접속인원 -> 접속한 유저 최대 기록으로 변경.
// 3. 케릭터 생성. (이동, 충돌, 케릭위에 닉네임, 다른 유저도 보이게)
// 4. 아이템추가.
// 5. 몬스터 추가.
// 6. 맵추가.  