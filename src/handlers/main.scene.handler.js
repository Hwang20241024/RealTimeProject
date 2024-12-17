import handlerMappings from './handlerMapping.js';
import { CLIENT_VERSION } from '../constants.js';

export const mainSceneUpdate = (io, socket, SocketsCount) => {
  // // 버전이 다를 경우.
  // if (!CLIENT_VERSION.includes(data.clientVersion)) {
  //   socket.emit('response', { status: 'fall', message: 'Client version mismatch' });
  //   return;
  // }

  // // 핸들ID가 다른경우
  // const handler = handlerMappings[data.handlerId];
  // if (!handler) {
  //   socket.emit('response', { status: 'fall', message: 'Handler not found' });
  //   return;
  // }

  io.emit('response', {
    userId: "테스트",
    clientVersion: CLIENT_VERSION,
    handlerId: 1,
    payload: {status: 'success', message: `현재 접속인원은 ${SocketsCount}명입니다`},
  });

};
