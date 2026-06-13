const dice = document.getElementById('dice');
const result = document.getElementById('result');
const resultNumber = document.getElementById('resultNumber');
const rollBtn = document.getElementById('rollBtn');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');

const faceElements = document.querySelectorAll('.face');
const rollSound = new Audio('dice.mp3');
let isRolling = false;
let history = [];

function getRandomFace() {
  return Math.floor(Math.random() * 6);
}

function setDiceFace(value) {
  faceElements.forEach((face, i) => {
    face.style.display = i === value ? 'block' : 'none';
  });
}

function rollDice() {
  if (isRolling) return;
  isRolling = true;

  result.textContent = '';
  result.classList.remove('show');
  resultNumber.classList.remove('show');

  rollSound.currentTime = 0;
  rollSound.play();

  const finalValue = getRandomFace();

  dice.classList.add('rolling');

  const totalDuration = 550;
  const steps = 12;
  let step = 0;

  function doStep() {
    setDiceFace(getRandomFace());
    step++;

    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const delay = 30 + eased * 80;

    if (step < steps) {
      setTimeout(doStep, delay);
    } else {
      dice.classList.remove('rolling');
      setDiceFace(finalValue);

      dice.classList.add('landing');

      setTimeout(() => {
        dice.classList.remove('landing');
        isRolling = false;

        const num = finalValue + 1;
        result.textContent = `you rolled a ${num}`;
        result.classList.add('show');
        resultNumber.textContent = num;
        resultNumber.classList.add('show');

        addHistory(num);
      }, 500);
    }
  }

  doStep();
}

function addHistory(value) {
  history.push(value);
  if (history.length > 10) history.shift();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = history.map(v => `<span>${v}</span>`).join('');
}

function clearHistory() {
  history = [];
  renderHistory();
}

dice.addEventListener('click', rollDice);
rollBtn.addEventListener('click', rollDice);
clearBtn.addEventListener('click', clearHistory);

setDiceFace(0);
