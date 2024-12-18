export const updateUserCount = (data) => {
  const userCountElement = document.getElementById('game-info-users');
  userCountElement.textContent = data;
};

export const updateRankingInfo = (data) => {
  const userCountElement = document.getElementById('game-info-h2');
  userCountElement.textContent = data;
};
