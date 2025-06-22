document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/user/user1').then(r=>r.json()).then(user=>{
    const div = document.getElementById('profile');
    div.innerHTML = `<p>Name: ${user.name}</p><p>Email: ${user.email}</p>`;
  });
});
