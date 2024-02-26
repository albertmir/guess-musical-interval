document.addEventListener('DOMContentLoaded', generateQuestion);

const notesEs = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
const notesEn = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let notes = [...notesEs];

const userResponse = document.getElementById('userResponse');
const verifyButton = document.getElementById('verifyButton');
const questionElement = document.getElementById('question');
const responseMessage = document.getElementById('responseMessage');

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
  }, 250);
}

function verifyResponse() {
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
    pulseButtonSuccess();
    generateQuestion();
    setTimeout(() => {
      resetMessage();
    }, 1000);
  } else {
    shakeButtonError();
    setTimeout(() => {
      resetMessage();
    }, 1000);
    userResponse.select();
  }
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

function resetMessage() {
  responseMessage.innerHTML = '';
}
