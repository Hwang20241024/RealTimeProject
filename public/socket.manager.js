import { CLIENT_VERSION } from './constants.js';

import { addGameLogMessage, clearAllLogMessages } from './gameLogMessge.js';
import { updateUserCount, updateRankingInfo } from './usersMessage.js';

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
      this._name = null;
      this._userId = null;
      this._uuid = null;
      this._currentStage = null;
      this._currentScore = null;
      this._x = null;
      this._y = null;

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

  /*====[ GET ]====*/
  get name() {
    return this._name;
  }

  get currentStage() {
    return this._currentStage;
  }

  get currentScore() {
    return this._currentScore;
  }

  get position() {
    return { x: this._x, y: this._y };
  }
  /*===============*/

  /*====[ SET ]====*/
  set name(value) {
    this._name = value;
  }

  set currentStage(value) {
    this._currentStage = value;
  }

  set currentScore(value) {
    this._currentScore = value;
  }

  set position(value) {
    this._x = value.x;
    this._y = value.y;
  }
  /*===============*/

  setupListeners() {
    // 클라입장에서 서버와 접촉후 최초 한번 발생하는 이벤트.
    this.socket.on('connected', (data) => {
      console.log('Connected:', data);

      // 로그 메세지 추가.
      addGameLogMessage(data);
    });

    /*==== 닉네임생성 및 접속 메세지 ====*/
    this.socket.on('nicknameEvent', (data) => {
      // 유저 정보 추가
      this._name = data.payload.message.name;
      this._userId = data.userId;
      this._uuid = data.payload.message.uuid;
      this._currentStage = data.payload.message.current_info.stage;
      this._currentScore = data.payload.message.current_info.score;
      this._x = data.payload.message.x;
      this._y = data.payload.message.y;

      // 로그 메세지 추가.
      addGameLogMessage(this._name + '님이 생성되었습니다.');
    });
    /*=================*/

    /*==== 랭킹메세지 ====*/
    this.socket.on('cumulativeRankings', (data) => {
      // 현재 위치가 메인이면 누적 랭킹 표시.
      if ((this._currentStage === 0 || this._currentStage === null) && data.payload.status === 'success') {
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
      };
    });

    this.socket.on('realTimeRankings', (data) => {
      console.log(this._currentStage);
      // 현재 위치가 메인이면 누적 랭킹 표시.
      if (this._currentStage !== 0 && data.payload.status === 'success') {
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
      };
    });
    /*=================*/


    


    /*==== 게임로그 ====*/
    this.socket.on('gameLog_DEFAULT', (data) => {
      // 로그 메세지 추가.
      addGameLogMessage(data.payload.message);
    });
    this.socket.on('gameLog_CURRENT_USERS', (data) => {
      // 로그 메세지 추가.
      updateUserCount(data.payload.message);
    });
    this.socket.on('gameLog_USER_SPECIFIC', (data) => {
      // 로그 메세지 추가.
      addGameLogMessage(data.payload.message);
    });
    this.socket.on('gameLog_BEST_INFO', (data) => {
      // 로그 메세지 추가.
      updateUserCount(data.payload.message);
    });
    this.socket.on('gameLog_RANKING_INFO', (data) => {
      // 로그 메세지 추가.
      updateRankingInfo(data.payload.message);
    });
    /*=================*/

    /*==== 에러메세지 ====*/
    this.socket.on('already_connected', (data) => {
      // 로그 메세지 추가.
      alert(data.payload.message);
    });

    /*=================*/

  }

  // 여러군대에서 사용할 메세지.
  sendEvent(eventName, handlerId, payload) {
    this.socket.emit(eventName, {
      userId: this._userId,
      clientVersion: CLIENT_VERSION,
      handlerId,
      payload,
    });
  }
}

export default SocketManager;
