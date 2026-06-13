const selector = document.querySelector('.selector');
const diceRow = document.getElementById('diceRow');
const result = document.getElementById('result');
const resultNumber = document.getElementById('resultNumber');
const rollBtn = document.getElementById('rollBtn');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');

const rollSound = new Audio('dice.mp3');
let mode = 'd6';
let diceCount = 3;
let isRolling = false;
let history = [];

const dotPositions = {
  1: ['center'],
  2: ['top-right', 'bottom-left'],
  3: ['top-right', 'center', 'bottom-left'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
};

function buildDice() {
  const el = document.createElement('div');
  el.className = 'dice';
  for (let v = 1; v <= 6; v++) {
    const face = document.createElement('div');
    face.className = `face face-${v}`;
    face.dataset.value = v;
    for (const pos of dotPositions[v]) {
      const dot = document.createElement('span');
      dot.className = `dot ${pos}`;
      face.appendChild(dot);
    }
    el.appendChild(face);
  }
  return el;
}

function showDiceFace(diceEl, value) {
  const faces = diceEl.querySelectorAll('.face');
  faces.forEach((face, i) => {
    face.style.display = i === value - 1 ? 'block' : 'none';
  });
}

function rollD6() {
  const diceEls = diceRow.querySelectorAll('.dice');
  const finalValues = [];
  const offset = Math.random() * 200;

  diceEls.forEach((diceEl, i) => {
    const fv = Math.floor(Math.random() * 6) + 1;
    finalValues.push(fv);

    diceEl.classList.add('rolling');

    const steps = 10 + Math.floor(Math.random() * 4);
    let step = 0;

    function doStep() {
      showDiceFace(diceEl, Math.floor(Math.random() * 6) + 1);
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const delay = 30 + eased * 90;

      if (step < steps) {
        setTimeout(doStep, delay);
      } else {
        diceEl.classList.remove('rolling');
        showDiceFace(diceEl, fv);
        diceEl.classList.add('landing');
      }
    }

    setTimeout(() => doStep(), offset + i * 60);
  });

  const maxDuration = 600 + offset + diceEls.length * 60 + 500;
  setTimeout(() => {
    diceEls.forEach(diceEl => diceEl.classList.remove('landing'));
    isRolling = false;

    const sum = finalValues.reduce((a, b) => a + b, 0);
    result.textContent = finalValues.join(' · ');
    result.classList.add('show');
    resultNumber.textContent = sum;
    resultNumber.classList.add('show');

    addHistory(finalValues, sum);
  }, maxDuration);
}

function rollD100() {
  const el = document.querySelector('.dice-d100');
  const finalValue = Math.floor(Math.random() * 100) + 1;

  el.classList.add('rolling');

  const steps = 25;
  let step = 0;

  function doStep() {
    el.textContent = Math.floor(Math.random() * 100) + 1;
    step++;
    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const delay = 20 + eased * 100;

    if (step < steps) {
      setTimeout(doStep, delay);
    } else {
      el.classList.remove('rolling');
      el.textContent = finalValue;
      el.classList.add('landing');

      setTimeout(() => {
        el.classList.remove('landing');
        isRolling = false;

        result.textContent = `you rolled a ${finalValue}`;
        result.classList.add('show');
        resultNumber.textContent = finalValue;
        resultNumber.classList.add('show');

        addHistory([finalValue], finalValue);
      }, 500);
    }
  }

  doStep();
}

function initD6(count) {
  diceRow.innerHTML = '';
  const size = count <= 2 ? 200 : count <= 4 ? 140 : 110;

  for (let i = 0; i < count; i++) {
    const diceEl = buildDice();
    if (size < 200) diceEl.classList.add('small');
    diceEl.style.width = size + 'px';
    diceEl.style.height = size + 'px';
    diceEl.dataset.index = i;
    showDiceFace(diceEl, 1);
    diceRow.appendChild(diceEl);
  }
}

function initD100() {
  diceRow.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'dice-d100';
  el.textContent = '—';
  diceRow.appendChild(el);
}

function addHistory(values, sum) {
  history.push({ values, sum });
  if (history.length > 10) history.shift();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = history.map(h =>
    `<span title="${h.values.join(', ')}">${h.sum}</span>`
  ).join('');
}

function clearHistory() {
  history = [];
  renderHistory();
}

selector.addEventListener('click', e => {
  const btn = e.target.closest('.sel-btn');
  if (!btn) return;
  selector.querySelectorAll('.sel-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const count = parseInt(btn.dataset.count);

  if (count === 100) {
    mode = 'd100';
    initD100();
  } else {
    mode = 'd6';
    diceCount = count;
    initD6(diceCount);
  }

  result.textContent = 'click roll';
  result.classList.remove('show');
  resultNumber.classList.remove('show');
  resultNumber.textContent = '';
});

function doRoll() {
  if (isRolling) return;
  isRolling = true;

  result.textContent = '';
  result.classList.remove('show');
  resultNumber.classList.remove('show');

  rollSound.currentTime = 0;
  rollSound.play();

  if (mode === 'd100') {
    rollD100();
  } else {
    rollD6();
  }
}

rollBtn.addEventListener('click', doRoll);
diceRow.addEventListener('click', e => {
  if (e.target.closest('.dice') || e.target.closest('.dice-d100')) {
    doRoll();
  }
});

clearBtn.addEventListener('click', clearHistory);

initD6(3);
