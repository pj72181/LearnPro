document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/leaderboard').then(r=>r.json()).then(data=>{
    const tbody = document.querySelector('#leaderboard-table tbody');
    data.sort((a,b)=>b.score-a.score);
    data.forEach((entry,idx)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx+1}</td><td>${entry.userId}</td><td>${entry.score}</td>`;
      tbody.appendChild(tr);
    });
  });
});
