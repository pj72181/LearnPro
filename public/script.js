document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/leaderboard')
    .then(r => r.json())
    .then(data => {
      const recent = data.slice(-3).reverse();
      const list = document.getElementById('recent-list');
      if (list) {
        recent.forEach(entry => {
          const li = document.createElement('li');
          li.textContent = `${entry.userId} scored ${entry.score}`;
          list.appendChild(li);
        });
      }
    });
});
