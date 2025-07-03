let timerDisplay = document.getElementById("timer");
let startStopBtn = document.getElementById("startStopBtn");
let resetBtn = document.getElementById("resetBtn");
let logList = document.getElementById("logList");
let dailyTotal = document.getElementById("dailyTotal");

let startTime, elapsedTime = 0, timerInterval;
let isRunning = false;

function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  let secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(elapsedTime);
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  let sessionDuration = elapsedTime;
  saveSession(sessionDuration);
  elapsedTime = 0;
  updateDisplay();
}

function toggleTimer() {
  if (!isRunning) {
    startTimer();
    startStopBtn.textContent = "Stop";
  } else {
    stopTimer();
    startStopBtn.textContent = "Start";
  }
  isRunning = !isRunning;
}

function resetTimer() {
  if (isRunning) toggleTimer();
  elapsedTime = 0;
  updateDisplay();
}

function saveSession(duration) {
  let today = new Date().toISOString().split("T")[0];
  let logs = JSON.parse(localStorage.getItem("studyLogs")) || {};

  if (!logs[today]) logs[today] = 0;
  logs[today] += duration;

  localStorage.setItem("studyLogs", JSON.stringify(logs));
  renderLog();
}

function renderLog() {
  let logs = JSON.parse(localStorage.getItem("studyLogs")) || {};
  logList.innerHTML = "";

  for (let date in logs) {
    let li = document.createElement("li");
    li.textContent = `${date} — ${formatTime(logs[date])}`;
    logList.appendChild(li);
  }

  let today = new Date().toISOString().split("T")[0];
  dailyTotal.textContent = formatTime(logs[today] || 0);
}

startStopBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
renderLog();

function tick() {
  seconds++;
  timerDisplay.textContent = formatTime(seconds);

  // Store per day study seconds
  const today = getTodayKey();
  const studyData = JSON.parse(localStorage.getItem('studyLog') || '{}');
  studyData[today] = (studyData[today] || 0) + 1;
  localStorage.setItem('studyLog', JSON.stringify(studyData));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function showPage(pageId) {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("studyLogPage").classList.add("hidden");

  document.getElementById(pageId + "Page").classList.remove("hidden");

  if (pageId === "studyLog") loadStudyLog(); // 👈 add this line only
}


function loadStudyLog() {
  const studyData = JSON.parse(localStorage.getItem('studyLog') || '{}');
  const fullLogDiv = document.getElementById("fullLog");
  fullLogDiv.innerHTML = '';

  Object.keys(studyData).sort().forEach(date => {
    const hours = (studyData[date] / 3600).toFixed(2);
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${date}: ${hours} hrs`;
    fullLogDiv.appendChild(logEntry);
  });
}
