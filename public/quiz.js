let current = 0;
let answers = [];
let questions = [];
const progressBar = document.getElementById('progress-bar');
const timerDiv = document.getElementById('timer');
let time = 300;

function renderQuestion() {
  const q = questions[current];
  const container = document.getElementById('quiz-container');
  container.innerHTML = `<h3>${q.text}</h3>` +
    q.options.map((opt,i)=>`<label><input type='radio' name='q${current}' value='${i}'> ${opt}</label><br>`).join('');
  progressBar.style.width = `${(current/questions.length)*100}%`;
}

function startTimer() {
  const interval = setInterval(()=>{
    time--; if(time<=0){clearInterval(interval); submit();}
    timerDiv.textContent = `${Math.floor(time/60)}:${String(time%60).padStart(2,'0')}`;
  },1000);
}

function submit() {
  questions.forEach((q,idx)=>{
    const sel = document.querySelector(`input[name='q${idx}']:checked`);
    answers[idx] = sel ? parseInt(sel.value) : null;
  });
  fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:'user1',answers})})
    .then(r=>r.json()).then(res=>alert('Score: '+res.score));
}

fetch('/api/quizzes').then(r=>r.json()).then(data=>{
  questions = data.questions;
  renderQuestion();
  startTimer();
});

document.getElementById('submit').addEventListener('click', submit);
