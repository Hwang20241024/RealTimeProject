export {nicknameEvent} from './stage/main.handler.js';
export {cumulativeRankings, realTimeRankings} from './rankings.handler.js';

const handlerMappings = {
  1:  "nicknameEvent",      // 닉네임.
  2:  "cumulativeRankings", // 누적랭킹.
  3:  "realTimeRankings"    // 리얼타임 랭킹. 
  
};

export default handlerMappings;
