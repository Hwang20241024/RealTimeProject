export const updateUserCount = (data) => {
  const userCountElement = document.getElementById('game-info-users');
  userCountElement.textContent = data;
};
