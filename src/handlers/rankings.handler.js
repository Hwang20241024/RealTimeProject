import RedisManager from '../utils/redisManager.js';

// 누적 랭킹
export const cumulativeRankings = async () => {
  const redisManager = RedisManager.getInstance();
  
  // 유저 데이터를 불러온다.
  const userData = await redisManager.getDataByPrefix('user');
  await redisManager.getAllDataFromAllKeys(); // 전체 검색

  //정렬
  const cumulativeRankings = getSortedLeaderboard(userData, 'cumulative');
  return displayRankings(cumulativeRankings);
  
};

// 실시간 랭킹
export const realTimeRankings = async () => {
  const redisManager = RedisManager.getInstance();

  // 유저 데이터를 불러온다.
  const userData = await redisManager.getDataByPrefix('user');

  // 정렬
  const realTimeRankings = getSortedLeaderboard(userData, 'realTime');
  
  // 메인메뉴에 있는 놈들은 제외하자. 
  const filteredUserData =  Object.values(realTimeRankings).filter(user => user.stage !== 0);
  return displayRankings(filteredUserData);
};

// 정렬
// 1. 스코어 순서대로 정렬
// 2. 스코어가 동률이라면 이름으로 정렬
// 최대 10개 까지
function getSortedLeaderboard(userData, rankingType = 'cumulative') {
  // 랭킹을 받을 배열
  const leaderboard = [];

  // userData 객체의 모든 키를 순회
  for (const key in userData) {
    const user = userData[key];
    let score = 0;
    let stage = 0;

    // 랭킹 종류에 따라 best_info 또는 current_info 선택
    if (rankingType === 'cumulative') {
      // cumulativeRankings는 best_info 기준
      score = user.best_info.score;
      stage = user.best_info.stage;
    } else {
      // realTimeRankings는 current_info 기준
      score = user.current_info.score;
      stage = user.current_info.stage;
    }

    // 점수가 null일 경우, 점수를 0으로 처리
    if (score === null) score = 0;

    // leaderboard 배열에 데이터 추가
    leaderboard.push({
      key: key.split(':')[1], // user:황윤석에서 '황윤석'만 가져오기
      stage: stage,
      score: score,
    });
  }

  // 점수와 스테이지를 기준으로 내림차순 정렬 (동점일 경우 이름순)
  leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      // 동점일 경우 이름순으로 정렬
      return a.key.localeCompare(b.key);
    }
    return b.score - a.score; // 점수 기준 내림차순 정렬
  });

  // 최대 10개까지만 반환
  return leaderboard.slice(0, 10);
}


// 텍스트 형식으로 랭킹 출력 함수 (배열로 )
function displayRankings(leaderboard) {
  return leaderboard.map((rank, index) => {
    return `${index + 1}등: "${rank.key}" (스테이지 ${rank.stage} 점수 ${rank.score})`;
  });
}
