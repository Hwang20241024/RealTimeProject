import { Server as SocketIO } from 'socket.io';
import stageManagerHandler from '../handlers/stage.manager.handler.js';

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);
  
  // 결국에 메니저 같은거자나..
  // 클라이언트로부터 오는 이벤트를 처리할 핸들러를 서버에 등록
  //registerHandler(io);
  stageManagerHandler(io);
};

export default initSocket;
