document.addEventListener('DOMContentLoaded', generateQuestion);

let correctCount = 0;
let wrongCount = 0;
let totalResponseTime = 0;
let questionCount = 0;
let startTime;

const notesEs = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
const notesEn = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let notes = [...notesEs];

const userResponse = document.getElementById('userResponse');
const verifyButton = document.getElementById('verifyButton');
const questionElement = document.getElementById('question');
const responseMessage = document.getElementById('responseMessage');
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const averageTimeElement = document.getElementById('averageTime');


function toggleScale() {
  notes = document.getElementById('scaleToggle').checked
    ? [...notesEn]
    : [...notesEs];
  generateQuestion();
}

function selectNoteAndDirection() {
  const noteIndex = Math.floor(Math.random() * notes.length);
  const direction = Math.random() > 0.5 ? 'derecha' : 'izquierda';
  return {
    noteIndex,
    direction,
    selectedNote: notes[noteIndex],
    responseIndex:
      direction === 'derecha'
        ? (noteIndex + 1) % notes.length
        : (noteIndex - 1 + notes.length) % notes.length,
  };
}

function generateQuestion() {
  const { direction, selectedNote, responseIndex } = selectNoteAndDirection();
  questionElement.classList.add('fade-animation');
  setTimeout(() => {
    questionElement.innerHTML = `¿Qué nota hay a la <b>${direction}</b> de la nota <span class="bg-gray-700 text-white p-1 mr-0.5">${selectedNote}</span>?`;
    questionElement.dataset.response = notes[responseIndex];
    questionElement.classList.remove('fade-animation');
    startTime = Date.now();
  }, 250);
}

function verifyResponse() {
  const responseTime = Date.now() - startTime;
  totalResponseTime += responseTime;
  questionCount++;

  const isCorrect =
    userResponse.value.toUpperCase().trim() ===
    questionElement.dataset.response;
  showMessage(
    isCorrect ? '¡Correcto!' : 'Incorrecto. Inténtalo de nuevo.',
    isCorrect
  );
  userResponse.value = '';
  userResponse.focus();
  if (isCorrect) {
    correctCount++;
    pulseButtonSuccess();
    generateQuestion();
    setTimeout(() => {
      resetMessage();
    }, 1000);
  } else {
    wrongCount++;
    shakeButtonError();
    setTimeout(() => {
      resetMessage();
    }, 1000);
    userResponse.select();
  }
  updateUI();
}

function showMessage(message, isCorrect) {
  responseMessage.className = `mt-4 text-sm font-medium ${
    isCorrect ? 'text-green-500' : 'text-red-500'
  }`;
  responseMessage.innerHTML = `<span>${
    isCorrect ? '✅' : '❌'
  } ${message}</span>`;
  if (isCorrect) setTimeout(resetMessage, 2000);
}

function pulseButtonSuccess() {
  verifyButton.classList.add('pulse-animation');
  setTimeout(() => {
    verifyButton.classList.remove('pulse-animation');
  }, 1000);
}

function shakeButtonError() {
  verifyButton.classList.add(
    'shake-animation',
    'bg-red-500',
    'hover:bg-red-700'
  );
  verifyButton.classList.remove('bg-blue-500', 'hover:bg-blue-700');
  setTimeout(() => {
    verifyButton.classList.remove(
      'shake-animation',
      'bg-red-500',
      'hover:bg-red-700'
    );
    verifyButton.classList.add('bg-blue-500', 'hover:bg-blue-700');
  }, 820);
}

function updateUI() {
  correctCountElement.textContent = correctCount;
  wrongCountElement.textContent = wrongCount;
  const averageTimeSeconds =
    questionCount > 0 ? totalResponseTime / questionCount / 1000 : 0;

  let timeDisplay;
  if (averageTimeSeconds >= 60) {
    const averageTimeMinutes = averageTimeSeconds / 60;
    timeDisplay = `${averageTimeMinutes.toFixed(2)}m`;
  } else {
    timeDisplay = `${averageTimeSeconds.toFixed(2)}s`;
  }

  averageTimeElement.textContent = timeDisplay;
}


function resetMessage() {
  responseMessage.innerHTML = '';
}
