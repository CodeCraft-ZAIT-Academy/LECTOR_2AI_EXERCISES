let editor;
let currentExerciseId = null;
let starterCode = '';
let loadRequest = 0;
let saveTimer;
const exercises = window.EXERCISES;
const exerciseSettings = window.EXERCISE_SETTINGS;
const outputFrame = document.getElementById('output');
const descriptionDiv = document.getElementById('description');
const exerciseTitle = document.getElementById('exerciseTitle');
const saveStatus = document.getElementById('saveStatus');
const solutionButton = document.getElementById('solutionBtn');
const solutionDialog = document.getElementById('solutionDialog');

function solutionIsAvailable(exercise) {
  const categoryUnlocked = exerciseSettings.unlockedCategories.includes(exercise.category);
  return exerciseSettings.solutionsEnabled && exercise.solution && (exercise.solutionUnlocked || categoryUnlocked);
}

function buildNavigation() {
  const nav = document.getElementById('exerciseNav');
  [...new Set(exercises.map(exercise => exercise.category))].forEach(category => {
    const select = document.createElement('select');
    select.setAttribute('aria-label', `${category} exercises`);
    select.add(new Option(category, ''));
    exercises.filter(exercise => exercise.category === category).forEach(exercise => {
      select.add(new Option(exercise.title, exercise.id));
    });
    select.addEventListener('change', event => loadExercise(event.target.value, event.target));
    nav.appendChild(select);
  });
}

function setupEditor(initial) {
  editor = CodeMirror(document.getElementById('editor'), {
    value: initial,
    mode: 'htmlmixed',
    theme: 'eclipse',
    lineNumbers: true,
    lineWrapping: false
  });
  editor.on('change', updatePreview);
  updatePreview();
}

async function loadExercise(id, selectElement) {
  if (!id) return;
  const request = ++loadRequest;
  try {
    const [codeResponse, descResponse] = await Promise.all([
      fetch('exercises/default.html'),
      fetch(`exercises/${id}.desc.html`)
    ]);
    if (!codeResponse.ok || !descResponse.ok) throw new Error('Failed to load exercise');
    const [code, description] = await Promise.all([codeResponse.text(), descResponse.text()]);
    if (request !== loadRequest) return;

    const exercise = exercises.find(item => item.id === id);
    currentExerciseId = id;
    starterCode = code;
    const savedCode = localStorage.getItem(`html-exercise:${id}`);
    editor.setValue(savedCode ?? code);
    descriptionDiv.innerHTML = description;
    exerciseTitle.textContent = exercise.title;
    solutionButton.disabled = !solutionIsAvailable(exercise);
    solutionButton.title = solutionButton.disabled ? 'This solution is currently locked' : 'View solution';
    saveStatus.textContent = savedCode ? 'Restored from this browser' : 'Starter code loaded';
    document.querySelectorAll('#exerciseNav select').forEach(select => {
      if (select !== selectElement) select.value = '';
    });
  } catch (error) {
    alert(`Error loading exercise: ${error.message}`);
  }
}

function updatePreview() {
  outputFrame.srcdoc = editor.getValue();
  if (currentExerciseId) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(`html-exercise:${currentExerciseId}`, editor.getValue());
      saveStatus.textContent = 'Saved locally';
    }, 400);
  }
}

async function showSolution() {
  const exercise = exercises.find(item => item.id === currentExerciseId);
  if (!solutionIsAvailable(exercise)) return;
  try {
    const response = await fetch(`exercises/${currentExerciseId}.sol.html`);
    if (!response.ok) throw new Error('Failed to load solution');
    document.querySelector('#solutionCode code').textContent = await response.text();
    solutionDialog.showModal();
  } catch (error) {
    alert(`Error loading solution: ${error.message}`);
  }
}

function resetExercise() {
  if (!currentExerciseId || !confirm('Reset this exercise and remove your saved work?')) return;
  localStorage.removeItem(`html-exercise:${currentExerciseId}`);
  editor.setValue(starterCode);
  saveStatus.textContent = 'Reset to starter code';
}

document.getElementById('resetBtn').addEventListener('click', resetExercise);
solutionButton.addEventListener('click', showSolution);
document.getElementById('closeSolutionBtn').addEventListener('click', () => solutionDialog.close());
solutionDialog.addEventListener('click', event => {
  if (event.target === solutionDialog) solutionDialog.close();
});

buildNavigation();
setupEditor('');
loadExercise('tables_e1', document.querySelector('#exerciseNav select'));