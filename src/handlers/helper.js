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

// 플레이어초기화 패킷 보내기
export const mainUserInfo = (socket, data, name) => {
  if (!data) {
    console.log('보낼 데이터가 없습니다.');
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

// 랭킹 패킷 보내기
export const rankings = (io, socket, type, data) => {
  if (type === 'cumulativeRankings') {
    // 누적 랭킹.
    io.emit('cumulativeRankings', {
      userId: socket.id,
      clientVersion: CLIENT_VERSION,
      handlerId: 2,
      payload: { status: 'success', message: data },
    });
  } else if (type === 'realTimeRankings') {
    // 실시간 랭킹.
    io.emit('realTimeRankings', {
      userId: socket.id,
      clientVersion: CLIENT_VERSION,
      handlerId: 3,
      payload: { status: 'success', message: data },
    });
  }
};

// 씬 변경 패킷 보내기.
export const seneChange = (socket,data) => {
  socket.emit('seneChange', {
    userId: socket.id,
    clientVersion: CLIENT_VERSION,
    handlerId: 7,
    payload: { status: 'success', message: data },
  });
}