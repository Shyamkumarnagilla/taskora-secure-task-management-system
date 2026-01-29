const email = localStorage.getItem("taskora_email");
const token = localStorage.getItem("taskora_token");

if (!email || !token) window.location.href = "index.html";

/* ✅ PROFILE DROPDOWN */
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

document.getElementById("menuEmail").innerText = email;
document.getElementById("profileGreeting").innerText =
  "Hi, " + email.split("@")[0] + "!";

profileIcon.innerText = email.charAt(0).toUpperCase();
document.getElementById("profileAvatar").innerText =
  email.charAt(0).toUpperCase();

profileIcon.onclick = () => {
  profileMenu.style.display =
    profileMenu.style.display === "block" ? "none" : "block";
};

/* ✅ LOGOUT */
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "index.html";
};

/* ✅ DARK MODE TOGGLE */
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

/* ✅ SIDEBAR NAVIGATION */
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

/* ✅ TASKS DATA */
let tasks = [
  {
    title: "Finish monthly reporting",
    due: "Today",
    priority: "High",
    group: "Today",
    pinned: false,
    done: false,
  },
  {
    title: "Contract signing",
    due: "Today",
    priority: "Medium",
    group: "Today",
    pinned: false,
    done: false,
  },
  {
    title: "Brand proposal",
    due: "Tomorrow",
    priority: "High",
    group: "Tomorrow",
    pinned: false,
    done: false,
  },
  {
    title: "Social media review",
    due: "Tomorrow",
    priority: "Medium",
    group: "Tomorrow",
    pinned: false,
    done: false,
  },
  {
    title: "Order check-ins",
    due: "Wednesday",
    priority: "Medium",
    group: "This Week",
    pinned: false,
    done: false,
  },
  {
    title: "HR reviews",
    due: "Friday",
    priority: "Low",
    group: "This Week",
    pinned: false,
    done: false,
  },
];

/* ✅ RENDER MY TASKS (Pending Tasks Only) */
function renderTasks() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  const groups = ["Today", "Tomorrow", "This Week"];

  groups.forEach((grp) => {
    let groupTasks = tasks.filter((t) => t.group === grp && !t.done);

    /* ✅ Pinned Tasks Come First */
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

          <!-- ✅ Star = Pin -->
          <i
            class="${task.pinned
          ? "fa-solid fa-star checked"
          : "fa-regular fa-star"
        } task-check"
            onclick="togglePin('${task.title}')">
          </i>

          <span class="task-title">${task.title}</span>

          <span class="task-pill due-pill">${task.due}</span>

          <span class="task-pill ${priorityClass}">
            ${task.priority}
          </span>

          <div class="task-actions">
            <!-- ✅ Done Marks Completed -->
            <button class="done-btn" onclick="markTaskDone('${task.title}')">
              Done
            </button>

            <button class="delete-btn" onclick="deleteTask('${task.title}')">
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

/* ✅ PIN TOGGLE */
function togglePin(title) {
  tasks = tasks.map((task) => {
    if (task.title === title) {
      task.pinned = !task.pinned;
    }
    return task;
  });

  renderTasks();
}

/* ✅ DONE BUTTON MARKS COMPLETED */
function markTaskDone(title) {
  tasks = tasks.map((task) => {
    if (task.title === title) {
      task.done = true;
    }
    return task;
  });

  renderTasks();
  renderCompletedSummary();
  updateDashboardData();
}

/* ✅ DELETE TASK COMPLETELY */
function deleteTask(title) {
  tasks = tasks.filter((task) => task.title !== title);

  renderTasks();
  renderCompletedSummary();
  updateDashboardData();
}

/* ✅ COMPLETED TASKS SUMMARY (Single Card Only) */
function renderCompletedSummary() {
  const container = document.getElementById("completedTaskContainer");
  if (!container) return;

  container.innerHTML = "";

  let completedTasks = tasks.filter((t) => t.done);

  if (completedTasks.length === 0) {
    container.innerHTML = `
      <div class="completed-group-card">
        <p style="text-align:center; color:var(--muted);">
          No tasks completed yet ✅
        </p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="completed-group-card">
      <ul>
  `;

  completedTasks.forEach((task) => {
    html += `<li>${task.title}</li>`;
  });

  html += `
      </ul>
    </div>
  `;

  container.innerHTML = html;
}

/* ✅ DASHBOARD DATA UPDATE */
function updateDashboardData() {
  let total = tasks.length;
  let completed = tasks.filter((t) => t.done).length;
  let pending = total - completed;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
  document.getElementById("pendingTasks").innerText = pending;

  /* ✅ Progress Ring */
  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressPercent").innerText = percent + "%";

  let ring = document.getElementById("progressRing");
  ring.style.background = `conic-gradient(
    var(--primary) ${percent * 3.6}deg,
    var(--border) 0deg
  )`;

  /* ✅ Week Plan */
  const weekList = document.getElementById("weekTasksList");
  weekList.innerHTML = "";

  tasks
    .filter(
      (t) =>
        (t.group === "Today" ||
          t.group === "Tomorrow" ||
          t.group === "This Week") &&
        !t.done
    )
    .forEach((task) => {
      let li = document.createElement("li");
      li.innerText = task.title;
      weekList.appendChild(li);
    });
}

/* ✅ INITIAL LOAD */
renderTasks();
renderCompletedSummary();
updateDashboardData();

/* ===================================== */
/* ✅ REAL-TIME CALENDAR CODE */
/* ===================================== */

const monthYearText = document.getElementById("calendarMonthYear");
const datesGrid = document.getElementById("calendarDates");

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function renderCalendar(month, year) {
  datesGrid.innerHTML = "";
  monthYearText.innerText = `${months[month]} ${year}`;

  let firstDay = new Date(year, month, 1).getDay();
  let totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    let blank = document.createElement("span");
    datesGrid.appendChild(blank);
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
