import { nicknameEvent } from './nickname.handler.js';
import { cumulativeRankings, realTimeRankings } from './rankings.handler.js';
import { gameLog, mainUserInfo, rankings, seneChange, sendErrorMessage, updateUserInfo } from './helper.js';
import { spawnItem } from './spawnItem.handler.js';


const handlerMappings = {
  1: nicknameEvent, // 닉네임.
  2: cumulativeRankings, // 누적랭킹.
  3: realTimeRankings, // 리얼타임 랭킹.
  4: gameLog, // 게임로그.
  5: mainUserInfo, // 유저초기화.
  6: rankings, // 랭킹.
  7: seneChange, // 씬체인지.
  8: sendErrorMessage, // 에러
  9: spawnItem, // 아이템 리스폰
  10: updateUserInfo, // 유저정보갱신.
  
};

export default handlerMappings;
