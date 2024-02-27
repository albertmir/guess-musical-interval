document.addEventListener('DOMContentLoaded', generateQuestion);

let correctCount = 0;
let wrongCount = 0;
let totalResponseTime = 0;
let questionCount = 0;
let startTime;
let lastResponseIndex = null;
let currentLanguage = 'es';
let currentNotation = 'es';

const noteMapping = {
  c: { es: 'DO', en: 'C' },
  // cs: { es: 'DO#', en: 'C#' },
  d: { es: 'RE', en: 'D' },
  // ds: { es: 'RE#', en: 'D#' },
  e: { es: 'MI', en: 'E' },
  f: { es: 'FA', en: 'F' },
  // fs: { es: 'FA#', en: 'F#' },
  g: { es: 'SOL', en: 'G' },
  // gs: { es: 'SOL#', en: 'G#' },
  a: { es: 'LA', en: 'A' },
  // as: { es: 'LA#', en: 'A#' },
  b: { es: 'SI', en: 'B' },
};
const directionMapping = {
  left: { es: 'izquierda', en: 'left'},
  right: { es: 'derecha', en: 'right'}
}
let noteKeys = Object.keys(noteMapping);

const userResponse = document.getElementById('userResponse');
const verifyButton = document.getElementById('verifyButton');
const questionElement = document.getElementById('question');
const responseMessage = document.getElementById('responseMessage');
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const averageTimeElement = document.getElementById('averageTime');
const scaleToggle = document.getElementById('scaleToggle');
const showLabelsToggle = document.getElementById('showLabelsToggle');


function toggleScale() {
  document.getElementById('scaleToggle').checked
    ? currentNotation = 'en'
    : currentNotation = 'es';
  if (showLabelsToggle.checked) showNoteLabels(currentNotation);
  generateQuestion();
}

function toggleLabels() {
  showLabelsToggle.checked ? showNoteLabels(currentNotation) : hideNoteLabels();
}

function selectNoteAndDirection() {
  let noteIndex;
  let responseIndex;
  let direction;

  do {
    noteIndex = Math.floor(Math.random() * noteKeys.length);
    direction = Math.random() > 0.5 ? 'left' : 'right';
    responseIndex =
      direction === 'right'
        ? (noteIndex + 1) % noteKeys.length
        : (noteIndex + noteKeys.length - 1) % noteKeys.length;
  } while (responseIndex === lastResponseIndex);

  lastResponseIndex = responseIndex;

  return {
    noteIndex,
    direction,
    selectedNoteKey: noteKeys[noteIndex],
    responseIndex,
  };
}

function pressActivePianoKey(noteKey) {
  document.querySelectorAll('.virtual-piano li').forEach((note) => {
    note.classList.remove('active');
  });
  const activeNote = document.getElementById(`note-${noteKey}`);
  activeNote.classList.add('active');
}

function generateQuestion() {
  const { direction, selectedNoteKey, responseIndex } = selectNoteAndDirection();
  const selectedNote = noteMapping[selectedNoteKey][currentNotation];
  const responseNoteKey = noteKeys[responseIndex];
  const responseNote = noteMapping[responseNoteKey][currentNotation];

  questionElement.classList.add('fade-animation');
  setTimeout(() => {
    questionElement.innerHTML = `¿Cuál es la nota activa, qué está a la <br><b>${directionMapping[direction][currentLanguage]}</b> de la nota <span class="bg-gray-700 text-white p-1 mr-0.5">${selectedNote}</span>?`;
    questionElement.dataset.response = responseNote;
    questionElement.classList.remove('fade-animation');
    startTime = Date.now();
    pressActivePianoKey(responseNoteKey);
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
  if (isCorrect) {
    correctCount++;
    userResponse.value = '';
    userResponse.focus();
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
  updateCounters();
}

function calculateAverageTime() {
  const averageTimeSeconds =
    questionCount > 0 ? totalResponseTime / questionCount / 1000 : 0;
  return averageTimeSeconds;
}

function updateCounters() {
  const averageTimeSeconds = calculateAverageTime();
  const timeDisplay =
    averageTimeSeconds >= 60
      ? `${(averageTimeSeconds / 60).toFixed(2)}m`
      : `${averageTimeSeconds.toFixed(2)}s`;

  averageTimeElement.textContent = timeDisplay;
  correctCountElement.textContent = correctCount;
  wrongCountElement.textContent = wrongCount;
}

function showMessage(message, isCorrect) {
  responseMessage.classList.add(isCorrect ? 'text-green-500' : 'text-red-500');
  responseMessage.classList.remove(isCorrect ? 'text-red-500' : 'text-green-500');
  responseMessage.innerHTML = `<span>${
    isCorrect ? '✅' : '❌'
  } ${message}</span>`;
  if (isCorrect) setTimeout(resetMessage, 2000);
}

function resetMessage() {
  responseMessage.innerHTML = '';
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

function showNoteLabels(language) {
  document
    .querySelectorAll('.virtual-piano .note-label')
    .forEach((note, index) => {
      note.innerHTML = Object.values(noteMapping)[index][language];
    });
}

function hideNoteLabels() {
  document
    .querySelectorAll('.virtual-piano .note-label')
    .forEach((note, index) => {
      note.innerHTML = '';
    });
}
