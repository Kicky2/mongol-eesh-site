// Static quiz app - loads questions.json from same folder.
// If fetch fails, you can click 'Load sample' to use built-in sample.
let QUESTIONS = [];
let current = 0;
let score = 0;
let answeredCount = 0;

const startBtn = document.getElementById('startBtn');
const loadSample = document.getElementById('loadSample');
const clearStorage = document.getElementById('clearStorage');
const qBox = document.getElementById('questionBox');
const intro = document.getElementById('intro');
const qText = document.getElementById('qText');
const choicesDiv = document.getElementById('choices');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const feedback = document.getElementById('feedback');
const explain = document.getElementById('explain');
const finalBox = document.getElementById('finalBox');
const finalScore = document.getElementById('finalScore');
const retryBtn = document.getElementById('retryBtn');
const loadPrevBtn = document.getElementById('loadPrevBtn');
const progressStat = document.getElementById('progressStat');
const langSelect = document.getElementById('langSelect');

function updateProgress(){
  progressStat.textContent = `${answeredCount} / ${QUESTIONS.length}`;
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function renderQuestion(){
  const q = QUESTIONS[current];
  const lang = langSelect.value;
  qText.textContent = lang==='mn' ? q.question_mn : q.question_en;
  choicesDiv.innerHTML = q.choices.map((c,i)=>
    `<label><input type="radio" name="answer" value="${c}"> ${c}</label>`
  ).join('');
  feedback.textContent = '';
  explain.style.display = 'none';
  nextBtn.disabled = true;
}

function showFinal(){
  qBox.style.display = 'none';
  finalBox.style.display = 'block';
  finalScore.textContent = `${score} / ${QUESTIONS.length}`;
  const prev = JSON.parse(localStorage.getItem('eesh_scores')||'[]');
  prev.unshift({date:new Date().toISOString(),score:score,total:QUESTIONS.length});
  localStorage.setItem('eesh_scores', JSON.stringify(prev.slice(0,10)));
  updateProgress();
}

startBtn.addEventListener('click',()=>{
  if(QUESTIONS.length===0){ alert('Асуулт байхгүй байна. "Load sample" эсвэл questions.json-ыг байрлуулна уу.'); return; }
  current=0; score=0; answeredCount=0;
  intro.style.display='none';
  finalBox.style.display='none';
  qBox.style.display='block';
  renderQuestion(); updateProgress();
});

loadSample.addEventListener('click',()=>{
  // Load built-in sample if questions.json not available
  QUESTIONS = [
    {"id":1,"question_mn":"He ____ to school every day.","question_en":"He ____ to school every day.","choices":["go","goes","going","gone"],"answer":"goes","explanation_mn":"Сэдэв: 3-р нэгж. 'He' тул 3-р хувилбар -> goes.","explanation_en":"Subject 'He' is 3rd person singular, so 'goes'."},
    {"id":2,"question_mn":"If I _____ rich, I would travel the world.","question_en":"If I _____ rich, I would travel the world.","choices":["am","were","was","be"],"answer":"were","explanation_mn":"Худалдаа: unreal conditional - 'If I were' нь зөв.","explanation_en":"This is a hypothetical; use 'If I were'."},
    {"id":3,"question_mn":"She is looking forward to _____ her friends.","question_en":"She is looking forward to _____ her friends.","choices":["see","seeing","to see","be seeing"],"answer":"seeing","explanation_mn":"'look forward to' дараа -ing хэлбэр ирнэ.","explanation_en":"'look forward to' is followed by a gerund: 'seeing'."},
    {"id":4,"question_mn":"He is good ___ math.","question_en":"He is good ___ math.","choices":["in","at","on","with"],"answer":"at","explanation_mn":"'good at' гэж хэрэглэнэ.","explanation_en":"Use the collocation 'good at'."},
    {"id":5,"question_mn":"They _____ already eaten when we arrived.","question_en":"They _____ already eaten when we arrived.","choices":["had","have","are","were"],"answer":"had","explanation_mn":"Past perfect шаардлагатай - 'had already eaten'.","explanation_en":"Past perfect: 'had already eaten' is correct."}
  ];
  QUESTIONS.forEach(q=>q.choices=shuffle(q.choices.slice()));
  alert('Жишээ асуултууд ачааллаа. Тест эхлэх товч дарна уу.');
  updateProgress();
});

clearStorage.addEventListener('click',()=>{
  localStorage.removeItem('eesh_scores');
  alert('Local хадгалагдсан дүнг устгалаа.');
});

checkBtn.addEventListener('click',()=>{
  const sel = document.querySelector('input[name="answer"]:checked');
  if(!sel){ alert('Нэг хариулт сонгоно уу!'); return; }
  const q = QUESTIONS[current];
  answeredCount++;
  if(sel.value === q.answer){
    feedback.textContent = langSelect.value==='mn' ? '✅ Зөв!' : '✅ Correct!';
    score++;
  } else {
    feedback.textContent = langSelect.value==='mn' ? `❌ Буруу. Зөв хариулт: ${q.answer}` : `❌ Wrong. Answer: ${q.answer}`;
  }
  explain.style.display = 'block';
  explain.textContent = langSelect.value==='mn' ? (q.explanation_mn || q.explanation_en) : (q.explanation_en || q.explanation_mn);
  nextBtn.disabled = false;
  updateProgress();
});

nextBtn.addEventListener('click',()=>{
  current++;
  if(current < QUESTIONS.length){
    renderQuestion();
  } else {
    showFinal();
  }
});

showAnswerBtn.addEventListener('click',()=>{
  const q = QUESTIONS[current];
  explain.style.display = 'block';
  explain.textContent = langSelect.value==='mn' ? (q.explanation_mn || q.explanation_en) : (q.explanation_en || q.explanation_mn);
});

retryBtn.addEventListener('click',()=>{
  intro.style.display='none'; qBox.style.display='block'; finalBox.style.display='none';
  current=0; score=0; answeredCount=0; renderQuestion(); updateProgress();
});

loadPrevBtn.addEventListener('click',()=>{
  const prev = JSON.parse(localStorage.getItem('eesh_scores')||'[]');
  if(prev.length===0){ alert('Өмнөх дүн байхгүй байна.'); return; }
  alert('Latest: ' + JSON.stringify(prev[0]));
});

// Attempt to fetch questions.json on load
fetch('questions.json')
  .then(res => {
    if(!res.ok) throw new Error('no questions.json');
    return res.json();
  })
  .then(data => {
    if(Array.isArray(data) && data.length>0){
      QUESTIONS = data;
      // optional: shuffle choices
      QUESTIONS.forEach(q=>{ if(Array.isArray(q.choices)) q.choices = shuffle(q.choices.slice()); });
      updateProgress();
    }
  })
  .catch(err=>{
    // no external questions.json found; user can click Load sample
    console.log('questions.json not found or failed to load.', err);
  });

