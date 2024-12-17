import { CLIENT_VERSION } from './constants.js';

import  {addGameLogMessage, clearAllLogMessages}  from './gameLogMessge.js';
import  {updateUserCount}  from './usersMessage.js';

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
      this.userId = null;
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
    this.sendMessageToServer("오니");
  
    // 클라입장에서 서버와 접촉후 최초 한번 발생하는 이벤트.
    this.socket.on('connected', (data) => {
      console.log('Connected:', data);

      // 로그 메세지 추가.
      addGameLogMessage(data);
    });

    // 이건 접속 종료 까지 계속연결되면 발생하는 이벤트.
    this.socket.on('response', (data) => {
      console.log('Server response:', data);
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


  //테스트용도
  sendMessageToServer(message) {
    // 서버에 메시지를 보냄
    this.socket.emit('message', { content: message });
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
