import  {CLIENT_VERSION}  from '../constants.js';

// 콘솔로그 패킷 보내기.
export const gameLog = (io,socket, type, data) => {
  io.emit('gameLog' + type, {
    userId: socket.id,
    clientVersion: CLIENT_VERSION,
    handlerId: 1,
    payload: { status: 'success', message: data },
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
