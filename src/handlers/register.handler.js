import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

let connectedSocketsCount = 0; // 연결된 소켓의 수를 추적하는 변수

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`유저가 서버에 접속했습니다. [${socket.id}]`);

    connectedSocketsCount++;
    const userUUID = uuidv4();

    // 유저가 접속시 뜨는곳
    handleConnection(socket, userUUID);

    // 클라이언트에서 메세지왔을떄 이벤트.
    socket.on('message', (data) => {
      console.log('Received message: ', data);
      // 클라이언트로부터 받은 메세지 처리
      handlerEvent(io,socket,connectedSocketsCount)
    });

    // 클라이언트에서 접속헤제 했을때 이벤트
    socket.on('disconnect', () => {
      handleDisconnect(socket, userUUID);
      connectedSocketsCount--;
      console.log('Number of connected sockets:', connectedSocketsCount);
    });
  });
};

export default registerHandler;
