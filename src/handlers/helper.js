import { CLIENT_VERSION } from '../constants.js';

// 콘솔로그 패킷 보내기.
const gameLogType = ['_DEFAULT', '_CURRENT_USERS', '_USER_SPECIFIC'];
export const gameLog = (io, socket, type, data) => {
  if (type === 2) {
    // 개인 메세지
    socket.emit('gameLog' + gameLogType[type], {
      userId: socket.id,
      clientVersion: CLIENT_VERSION,
      handlerId: 1,
      payload: { status: 'success', message: data },
    });
  } else if (type === 0 || type === 1) {
    // 전체 메세지.
    io.emit('gameLog' + gameLogType[type], {
      userId: socket.id,
      clientVersion: CLIENT_VERSION,
      handlerId: 1,
      payload: { status: 'success', message: data },
    });
  }
};

// 플레이어 패킷 보내기
export const mainUserInfo = (socket, data, name) => {  
  if(!data) {
    console.log("보낼 데이터가 없습니다.");
  }

  const info = {
    name: name,
    uuid: data.uuid,
    current_info: {
      stage: data.current_info.stage,
      score: data.current_info.score,
    },
    x: data.x,
    y: data.y,
  };

  socket.emit('nicknameEvent', {
    userId: socket.id,
    clientVersion: CLIENT_VERSION,
    handlerId: 1,
    payload: { status: 'success', message: info },
  });
};

// 헤제.
export const handleDisconnect = (socket, uuid) => {
  //removeUser(socket.id);
  console.log(`User disconnected:  ${socket.id}`);
  //console.log('Current users: ', getUser());
};

// 접속?
export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  //console.log(`Current users: `, getUser());

  // 메시지 수신 예시
  socket.on('message', (msg) => {
    console.log('Message received: ', msg); // 수신한 메시지 출력
    socket.emit('response', 'Hello from server!'); // 클라이언트로 응답 보내기
  });

  socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
  mainSceneUpdate(io, socket, data);
};
