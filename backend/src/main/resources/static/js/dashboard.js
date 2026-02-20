const email = localStorage.getItem("taskora_email");
const token = localStorage.getItem("taskora_token");

if (!email || !token) window.location.href = "index.html";

const API = "/tasks";

const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

// Show Email in Profile Menu
document.getElementById("menuEmail").innerText = email;

async function loadUserProfile() {
  try {
    const res = await fetch(`/users/${email}`);
    const user = await res.json();

    document.getElementById("profileGreeting").innerText =
      "Hi, " + user.name + "!";

    profileIcon.innerText = user.name.charAt(0).toUpperCase();
    document.getElementById("profileAvatar").innerText =
      user.name.charAt(0).toUpperCase();

  } catch (err) {
    console.error("User profile load failed:", err);

    document.getElementById("profileGreeting").innerText = "Hi, User!";
  }
}

// Call Once When Dashboard Loads
loadUserProfile();

profileIcon.onclick = () => {
  profileMenu.style.display =
    profileMenu.style.display === "block" ? "none" : "block";
};

/* LOGOUT */
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

/* DARK MODE TOGGLE */
const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

lightBtn.onclick = () => setMode("light");
darkBtn.onclick = () => setMode("dark");

function setMode(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark");
    darkBtn.classList.add("active");
    lightBtn.classList.remove("active");
  } else {
    document.body.classList.remove("dark");
    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
  }
}

// NAVIGATION LOGIC

const links = document.querySelectorAll(".nav-link");

const sections = {
  dashboard: document.getElementById("dashboardSection"),
  mytasks: document.getElementById("mytasksSection"),
};

links.forEach((link) => {
  link.onclick = () => {
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    Object.values(sections).forEach((sec) =>
      sec.classList.remove("active-section")
    );

    sections[link.dataset.section].classList.add("active-section");
  };
});

// TASK MANAGEMENT LOGIC

let allTasks = [];
let filteredTasks = [];

async function loadTasks() {
  try {
    const res = await fetch(`${API}/${email}`);
    allTasks = await res.json();

    filteredTasks = [...allTasks];

    renderTasks();
    renderCompletedSummary();
    updateDashboardData();
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// CHIP SELECTION LOGIC
function setupChips(groupId) {
  const chips = document.querySelectorAll(`#${groupId} .chip`);

  chips.forEach((chip) => {
    chip.onclick = () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    };
  });
}

setupChips("dayChips");
setupChips("priorityChips");

// CREATE TASK LOGIC
document.getElementById("createTaskBtn").onclick = async () => {
  const title = document.getElementById("taskInput").value.trim();

  const msg = document.getElementById("taskSuccessMsg");

  msg.classList.remove("success", "error");

  if (!title) {
    msg.innerText = "Please enter a task title!";
    msg.classList.add("error");
    msg.style.display = "block";

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);

    return;
  }

  const groupName =
    document.querySelector("#dayChips .chip.active")?.dataset.value;

  const priority =
    document.querySelector("#priorityChips .chip.active")?.dataset.value;

  if (!groupName || !priority) {
    msg.innerText = "Please select Day and Priority!";
    msg.classList.add("error");
    msg.style.display = "block";

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);

    return;
  }

  const newTask = {
    title,
    groupName,
    due: groupName,
    priority,
    pinned: false,
    done: false,
    userEmail: email,
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  document.getElementById("taskInput").value = "";

  msg.innerText = "Task Created Successfully!";
  msg.classList.add("success");
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);

  loadTasks();
};


//  RENDER TASKS (MY TASKS SECTION)

function renderTasks() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  const groups = ["Today", "Tomorrow", "This Week"];

  groups.forEach((grp) => {
    let groupTasks = filteredTasks.filter(
      (t) => t.groupName === grp && !t.done
    );

    // Pinned tasks first
    groupTasks.sort((a, b) => b.pinned - a.pinned);

    let html = `
      <div class="task-group-card">
        <div class="task-header">
          <span></span>
          <span class="group-title">${grp}</span>
          <span>Due Date</span>
          <span>Priority</span>
          <span>Action</span>
        </div>
    `;

    groupTasks.forEach((task) => {
      let priorityClass =
        task.priority === "High"
          ? "priority-high"
          : task.priority === "Medium"
            ? "priority-medium"
            : "priority-low";

      html += `
        <div class="task-row">

          <!--  Pin Star -->
          <i
            class="${task.pinned
          ? "fa-solid fa-star checked"
          : "fa-regular fa-star"
        } task-check"
            onclick="togglePin(${task.id})">
          </i>

          <span class="task-title">${task.title}</span>

          <span class="task-pill due-pill">${task.due}</span>

          <span class="task-pill ${priorityClass}">
            ${task.priority}
          </span>

          <div class="task-actions">
            <button class="done-btn" onclick="markTaskDone(${task.id})">
              Done
            </button>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
              Delete
            </button>
          </div>

        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML += html;
  });
}


async function togglePin(id) {
  await fetch(`${API}/${id}/pin`, { method: "PUT" });
  loadTasks();
}


async function markTaskDone(id) {
  await fetch(`${API}/${id}/complete`, { method: "PUT" });
  loadTasks();
}


async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

//  COMPLETED TASKS SUMMARY
function renderCompletedSummary() {
  const container = document.getElementById("completedTaskContainer");
  container.innerHTML = "";

  let completedTasks = filteredTasks.filter((t) => t.done);

  if (completedTasks.length === 0) {
    container.innerHTML = `
      <div class="completed-group-card">
        <p style="text-align:center; color:var(--muted);">
          No tasks completed yet
        </p>
      </div>
    `;
    return;
  }

  let html = `<div class="completed-group-card"><ul>`;

  completedTasks.forEach((task) => {
    html += `<li>${task.title}</li>`;
  });

  html += `</ul></div>`;
  container.innerHTML = html;
}

//  DASHBOARD STATS
function updateDashboardData() {
  let total = allTasks.length;
  let completed = allTasks.filter((t) => t.done).length;
  let pending = total - completed;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressPercent").innerText = percent + "%";

  let ring = document.getElementById("progressRing");
  ring.style.background = `conic-gradient(
    var(--primary) ${percent * 3.6}deg,
    var(--border) 0deg
  )`;

  const weekList = document.getElementById("weekTasksList");
  weekList.innerHTML = "";

  allTasks.filter((t) => !t.done).forEach((task) => {
    let li = document.createElement("li");
    li.innerText = task.title;
    weekList.appendChild(li);
  });
}

window.togglePin = togglePin;
window.markTaskDone = markTaskDone;
window.deleteTask = deleteTask;

const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();

  filteredTasks = allTasks.filter((task) =>
    task.title.toLowerCase().includes(query)
  );

  renderTasks();
  renderCompletedSummary();
});

loadTasks();

// CALENDAR WIDGET
const monthYearText = document.getElementById("calendarMonthYear");
const datesGrid = document.getElementById("calendarDates");

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function renderCalendar(month, year) {
  datesGrid.innerHTML = "";
  monthYearText.innerText = `${months[month]} ${year}`;

  let firstDay = new Date(year, month, 1).getDay();
  let totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    datesGrid.appendChild(document.createElement("span"));
  }

  for (let day = 1; day <= totalDays; day++) {
    let cell = document.createElement("span");
    cell.innerText = day;

    if (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      cell.classList.add("today-date");
    }

    datesGrid.appendChild(cell);
  }
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

renderCalendar(currentMonth, currentYear);
