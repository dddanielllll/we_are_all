// Simple game logic for We Are All One (mix of story + mini-games)
const scenes = [
  {
    id: 'scene1',
    title: 'The Excluded Student',
    text: 'In class, a student named Lina is left out of a group project because of her accent. Other kids laugh. What do you do?',
    choices: [
      { id: 'c1', text: 'Ignore it and join the laughter', stars:0, unity:0, next:'scene1_mg1' },
      { id: 'c2', text: 'Talk to Lina and invite her to the group', stars:2, unity:2, next:'scene1_mg1' },
      { id: 'c3', text: 'Tell the teacher privately and help Lina later', stars:2, unity:1, next:'scene1_mg1' },
    ]
  },
  {
    id: 'scene2',
    title: 'Job Interview Bias',
    text: 'A hiring manager assumes a candidate cannot do the job because of their age. How would you respond?',
    choices: [
      { id: 'c1', text: 'Say it\'s none of your business', stars:0, unity:0, next:'scene2_mg2' },
      { id: 'c2', text: 'Highlight the candidate\'s experience and suggest fair criteria', stars:3, unity:2, next:'scene2_mg2' },
      { id: 'c3', text: 'Ignore the comment', stars:0, unity:0, next:'scene2_mg2' },
    ]
  }
];

let state = { stars:0, unity:0, sceneIndex:0 };

const els = {
  intro: document.getElementById('intro'),
  how: document.getElementById('how'),
  scene: document.getElementById('scene'),
  sceneTitle: document.getElementById('sceneTitle'),
  sceneText: document.getElementById('sceneText'),
  choices: document.getElementById('choices'),
  mg1: document.getElementById('minigame1'),
  mg2: document.getElementById('minigame2'),
  end: document.getElementById('end'),
  stars: document.getElementById('stars'),
  unity: document.getElementById('unity'),
  startBtn: document.getElementById('startBtn'),
  howBtn: document.getElementById('howBtn'),
  backFromHow: document.getElementById('backFromHow'),
  restart: document.getElementById('restart'),
  summaryApi: '/api/summary'
};

document.getElementById('startBtn').addEventListener('click', ()=>startGame());
document.getElementById('howBtn').addEventListener('click', ()=>show('how'));
document.getElementById('backFromHow').addEventListener('click', ()=>show('intro'));
document.getElementById('restart').addEventListener('click', ()=>{ state = { stars:0, unity:0, sceneIndex:0 }; show('intro'); updateScore(); });

function show(id){
  ['intro','how','scene','minigame1','minigame2','end'].forEach(k=>document.getElementById(k).classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function startGame(){
  state = { stars:0, unity:0, sceneIndex:0 };
  updateScore();
  playScene(0);
}

function playScene(index){
  const s = scenes[index];
  if(!s){ finishGame(); return; }
  show('scene');
  els.sceneTitle.textContent = s.title;
  els.sceneText.textContent = s.text;
  els.choices.innerHTML = '';
  s.choices.forEach(ch=>{
    const btn = document.createElement('button');
    btn.textContent = ch.text;
    btn.className = 'choiceBtn';
    btn.style.margin = '6px';
    btn.addEventListener('click', ()=>{ choose(ch); });
    els.choices.appendChild(btn);
  });
}

function choose(choice){
  state.stars += choice.stars;
  state.unity += choice.unity;
  updateScore();
  // navigate
  if(choice.next === 'scene1_mg1' || choice.next === 'scene2_mg2'){
    if(choice.next.endsWith('mg1')) startMiniGame1();
    else startMiniGame2();
  } else {
    // default next scene
    state.sceneIndex++;
    playScene(state.sceneIndex);
  }
}

function updateScore(){ els.stars.textContent = state.stars; els.unity.textContent = state.unity; }

// Mini-game 1: drag actions to emotions
const actionsData = [
  { id:'a1', text:'Listen actively' },
  { id:'a2', text:'Invite to join' },
  { id:'a3', text:'Report to a teacher/adult' }
];
const targetsData = [
  { id:'t1', text:'Feeling lonely' },
  { id:'t2', text:'Feeling excluded' },
  { id:'t3', text:'Feeling unsafe' }
];

function startMiniGame1(){
  show('minigame1');
  const actionsEl = document.getElementById('actions');
  const targetsEl = document.getElementById('targets');
  actionsEl.innerHTML=''; targetsEl.innerHTML='';
  // shuffle actions
  actionsData.sort(()=>Math.random()-0.5).forEach(a=>{
    const d = document.createElement('div');
    d.className='actionItem';
    d.draggable = true;
    d.id = a.id;
    d.textContent = a.text;
    d.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', a.id); });
    actionsEl.appendChild(d);
  });
  targetsData.forEach(t=>{
    const div = document.createElement('div');
    div.className='target';
    div.id = t.id;
    div.textContent = t.text;
    div.addEventListener('dragover', (e)=>e.preventDefault());
    div.addEventListener('drop', (e)=>{
      e.preventDefault();
      const aid = e.dataTransfer.getData('text/plain');
      const node = document.getElementById(aid);
      if(node) div.appendChild(node);
    });
    targetsEl.appendChild(div);
  });
  document.getElementById('mg1Result').textContent = '';
}

document.getElementById('mg1Check').addEventListener('click', ()=>{
  // simple scoring logic: count correct placements
  const correct = {
    'a1':'t1',
    'a2':'t2',
    'a3':'t3'
  };
  let score = 0;
  Object.keys(correct).forEach(aid=>{
    const node = document.getElementById(aid);
    if(node && node.parentElement && node.parentElement.id === correct[aid]) score++;
  });
  const res = document.getElementById('mg1Result');
  if(score === 3){ res.textContent = 'Great! You matched all actions.'; state.stars += 2; state.unity +=2; }
  else { res.textContent = `You matched ${score}/3. Try to think what helps each feeling.`; state.stars += score; state.unity += Math.max(0, score-1); }
  updateScore();
  // proceed to next scene or mini-game depending on scene index
  setTimeout(()=>{ state.sceneIndex++; playScene(state.sceneIndex); }, 1200);
});

// Mini-game 2: reorder steps
function startMiniGame2(){
  show('minigame2');
  const steps = [
    'Listen and acknowledge the person\'s experience',
    'Offer help or include them in an activity',
    'Speak up against the unfair behaviour',
    'Follow up later to ensure they are okay'
  ];
  // shuffle
  const shuffled = steps.slice().sort(()=>Math.random()-0.5);
  const ul = document.getElementById('stepsList');
  ul.innerHTML = '';
  shuffled.forEach((s,i)=>{
    const li = document.createElement('li');
    li.draggable = true;
    li.textContent = s;
    li.id = 'step'+i;
    li.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', li.id); });
    ul.appendChild(li);
  });
  // allow drop to reorder
  ul.addEventListener('dragover', e=>e.preventDefault());
  ul.addEventListener('drop', e=>{
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const dragged = document.getElementById(id);
    const target = e.target.closest('li');
    if(!target || !dragged) return;
    ul.insertBefore(dragged, target.nextSibling);
  });
  document.getElementById('mg2Result').textContent = '';
}

document.getElementById('mg2Check').addEventListener('click', ()=>{
  const correctOrder = [
    'Listen and acknowledge the person\'s experience',
    'Offer help or include them in an activity',
    'Speak up against the unfair behaviour',
    'Follow up later to ensure they are okay'
  ];
  const lis = Array.from(document.querySelectorAll('#stepsList li'));
  const texts = lis.map(li=>li.textContent.trim());
  let score = 0;
  for(let i=0;i<correctOrder.length;i++) if(texts[i]===correctOrder[i]) score++;
  const res = document.getElementById('mg2Result');
  if(score===4){ res.textContent = 'Excellent ordering!'; state.stars +=3; state.unity +=3; }
  else { res.textContent = `You got ${score}/4 steps in correct order.`; state.stars += score; state.unity += Math.floor(score/2); }
  updateScore();
  setTimeout(()=> finishGame(), 1000);
});

function finishGame(){
  show('end');
  const t = `You finished with ${state.stars} Empathy Stars and ${state.unity} Unity Points. Reflect on actions: empathy, speaking up and including others create fairer communities.`;
  document.getElementById('endText').textContent = t;
  // optionally send summary to serverless endpoint
  try{
    fetch('/api/summary').then(r=>r.json()).then(j=>console.log('API summary:',j.summary)).catch(()=>{});
  }catch(e){}
}
