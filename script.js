document.addEventListener('DOMContentLoaded', generateQuestion);

const notesEs = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];
const notesEn = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let notes = [...notesEs];

const userResponse = document.getElementById('userResponse');
const verifyButton = document.getElementById('verifyButton');
const questionElement = document.getElementById('question');
const responseMessage = document.getElementById('responseMessage');

function toggleScale() {
  const isChecked = document.getElementById('scaleToggle').checked;
  notes = isChecked ? [...notesEn] : [...notesEs];
  generateQuestion();
}

function generateQuestion() {
  const noteIndex = Math.floor(Math.random() * (notes.length - 1));
  const direction = Math.random() > 0.5 ? 'derecha' : 'izquierda';
  const selectedNote = notes[noteIndex];
  const responseIndex =
    direction === 'derecha'
      ? (noteIndex + 1) % notes.length
      : (noteIndex - 1 + notes.length) % notes.length;

  questionElement.innerHTML = `¿Qué nota hay a la <b>${direction}</b> de la nota <span class="bg-gray-700 text-white p-1 mr-0.5">${selectedNote}</span>?`;
  questionElement.dataset.response = notes[responseIndex];
  resetUI();
}

function verifyResponse() {
  if (
    userResponse.value.toUpperCase().trim() === questionElement.dataset.response
  ) {
    showMessage('¡Correcto!', true);
    setTimeout(generateQuestion, 1000);
  } else {
    showMessage('Incorrecto. Inténtalo de nuevo.', false);
    shakeButton();
    userResponse.select();
  }
}

function showMessage(message, isCorrect) {
  const icon = isCorrect ? '✅' : '❌';
  const spinner = isCorrect ? '<div class="spinner"></div>' : '';
  responseMessage.className = `mt-4 text-sm font-medium ${
    isCorrect ? 'text-green-500' : 'text-red-500'
  }`;
  responseMessage.innerHTML = `<span>${icon} ${message}</span> ${spinner}`;
  if (isCorrect) disableUI();
}

function shakeButton() {
  verifyButton.classList.add('shake-animation');
  verifyButton.classList.remove('bg-blue-500');
  verifyButton.classList.remove('hover:bg-blue-700');
  verifyButton.classList.add('bg-red-500');
  verifyButton.classList.add('hover:bg-red-700');
  setTimeout(() => {
    verifyButton.classList.remove('shake-animation');
    verifyButton.classList.remove('bg-red-500');
    verifyButton.classList.remove('hover:bg-red-700');
    verifyButton.classList.add('bg-blue-500');
    verifyButton.classList.add('hover:bg-blue-700');
  }, 820);
}

function disableUI() {
  userResponse.disabled = true;
  verifyButton.disabled = true;
}

function resetUI() {
  userResponse.disabled = false;
  verifyButton.disabled = false;
  userResponse.value = '';
  userResponse.focus();
  responseMessage.innerHTML = '';
}
