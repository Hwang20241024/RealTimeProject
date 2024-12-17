export {nicknameEvent} from './stage/main.handler.js';
export {cumulativeRankings, realTimeRankings} from './rankings.handler.js';

const handlerMappings = {
  1:  "nicknameEvent",
  2:  "cumulativeRankings",
  3:  "realTimeRankings"
  
};

export default handlerMappings;
