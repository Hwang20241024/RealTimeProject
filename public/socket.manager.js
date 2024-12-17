import { CLIENT_VERSION } from './constants.js';

import { addGameLogMessage, clearAllLogMessages } from './gameLogMessge.js';
import { updateUserCount } from './usersMessage.js';

// 버튼 액션도 넣자.
class SocketManager {
  // 초기화.
  constructor() {
    if (!SocketManager.instance) {
      this.socket = io('http://localhost:3000', {
        query: {
          clientVersion: CLIENT_VERSION,
        },
      });
      this.name = null;
      this.userId = null;
      this.uuid = null;
      this.currentStage = null;
      this.currentScore = null;
      this.x = null;
      this.y = null;

      // 서버 접속.
      this.setupListeners();

      // 최초 접속시 게임 로그 삭제
      clearAllLogMessages();

      SocketManager.instance = this;
    }
  }

  // 싱글턴
  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  setupListeners() {
    // 클라입장에서 서버와 접촉후 최초 한번 발생하는 이벤트.
    this.socket.on('connected', (data) => {
      console.log('Connected:', data);

      // 로그 메세지 추가.
      addGameLogMessage(data);
    });

    // 닉네임 생성 메세지
    this.socket.on('nicknameEvent', (data) => {
      console.log();

      // 유저 정보 추가
      this.name = data.payload.message.name;
      this.userId = data.userId;
      this.uuid = data.payload.message.uuid;
      this.currentStage = data.payload.message.current_info.stage;
      this.currentScore = data.payload.message.current_info.score;
      this.x = data.payload.message.x;
      this.y = data.payload.message.y;

      console.log(data);

      // 로그 메세지 추가.
      addGameLogMessage(this.name + '님이 생성되었습니다.');

      // 스테이지 이동은 서버에서 처리하자. 꼮꼮꼬꼮꼬꼮 잊지말자
    });

    // 랭킹메세지.
    this.socket.on('cumulativeRankings', (data) => {
      // 연결.
      const rankingsElement = document.querySelector('#game-info-rankings');

      // 기존의 p 태그들 제거 (있다면)
      rankingsElement.innerHTML = '';

      // data.payload.message를 기준으로 p 태그 추가
      const messages = data.payload.message; 
      messages.forEach((message) => {
        // 새로운 p 태그 생성
        const newParagraph = document.createElement('p'); 
        // 메시지 추가
        newParagraph.textContent = message; 
        // rankingsElement에 추가
        rankingsElement.appendChild(newParagraph); 
      });
    });

    // 체널 변경.
    this.socket.on('seneChange', (data) => {
      // 로그 메세지 추가.
      this.currentStage = data.payload.message;
      console.log("현재 스테이지 : " + this.currentStage)
    });

    // 게임로그.
    this.socket.on('gameLog_DEFAULT', (data) => {
      // 로그 메세지 추가.
      addGameLogMessage(data.payload.message);
    });
    //
    this.socket.on('gameLog_CURRENT_USERS', (data) => {
      // 로그 메세지 추가.
      updateUserCount(data.payload.message);
    });
  }

  // 여러군대에서 사용할 메세지.
  sendEvent(eventName, handlerId, payload) {
    this.socket.emit(eventName, {
      userId: this.userId,
      clientVersion: CLIENT_VERSION,
      handlerId,
      payload,
    });
  }
}

export default SocketManager;
