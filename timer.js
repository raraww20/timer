const unit = document.querySelector('.unit');
const displayEl = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsEl = document.getElementById('laps');

let running = false;
let startTime = 0;
let elapsed = 0;
let rafId = null;
let laps = [];

function formatTime(ms){
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);
  const pad = (n, len=2) => String(n).padStart(len, '0');
  return { main: `${pad(minutes)}:${pad(seconds)}`, ms: pad(centis) };
}

function updateDisplay(){
  const t = formatTime(elapsed);
  displayEl.innerHTML = `${t.main}<span class="ms">.${t.ms}</span>`;
}

function tick(){
  elapsed = performance.now() - startTime;
  updateDisplay();
  rafId = requestAnimationFrame(tick);
}

function start(){
  running = true;
  startTime = performance.now() - elapsed;
  rafId = requestAnimationFrame(tick);
  unit.classList.add('running');
  startBtn.textContent = 'JEDA';
  startBtn.classList.add('stop');
  lapBtn.disabled = false;
}

function pause(){
  running = false;
  cancelAnimationFrame(rafId);
  unit.classList.remove('running');
  startBtn.textContent = 'LANJUT';
  startBtn.classList.remove('stop');
}

function reset(){
  running = false;
  cancelAnimationFrame(rafId);
  elapsed = 0;
  laps = [];
  updateDisplay();
  renderLaps();
  unit.classList.remove('running');
  startBtn.textContent = 'MULAI';
  startBtn.classList.remove('stop');
  lapBtn.disabled = true;
}

function addLap(){
  if(!running) return;
  laps.push(elapsed);
  renderLaps();
}

function renderLaps(){
  lapsEl.innerHTML = '';
  if(laps.length === 0){
    const empty = document.createElement('div');
    empty.className = 'empty-laps';
    empty.textContent = 'Belum ada lap yang dicatat';
    lapsEl.appendChild(empty);
    return;
  }

  const fastest = Math.min(...laps.map((t, i) => i === 0 ? t : t - laps[i-1]));

  laps.forEach((t, i) => {
    const diff = i === 0 ? t : t - laps[i-1];
    const li = document.createElement('li');
    if(diff === fastest && laps.length > 1) li.classList.add('fastest');

    const idx = document.createElement('span');
    idx.className = 'lap-index';
    idx.textContent = `LAP ${i + 1}`;

    const time = document.createElement('span');
    time.className = 'lap-time';
    const f = formatTime(diff);
    time.textContent = `${f.main}.${f.ms}`;

    li.appendChild(idx);
    li.appendChild(time);
    lapsEl.appendChild(li);
  });
}

startBtn.addEventListener('click', () => {
  if(running) pause();
  else start();
});

resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', addLap);

updateDisplay();
renderLaps();