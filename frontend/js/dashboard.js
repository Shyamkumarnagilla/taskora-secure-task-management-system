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

/* ✅ TASKS DATA (NO STATUS COLUMN) */
let tasks = [
  {
    title: "Finish monthly reporting",
    due: "Today",
    priority: "High",
    group: "Today",
    done: false,
  },
  {
    title: "Contract signing",
    due: "Today",
    priority: "Medium",
    group: "Today",
    done: false,
  },
  {
    title: "Brand proposal",
    due: "Tomorrow",
    priority: "High",
    group: "Tomorrow",
    done: false,
  },
  {
    title: "Social media review",
    due: "Tomorrow",
    priority: "Medium",
    group: "Tomorrow",
    done: false,
  },
  {
    title: "Order check-ins",
    due: "Wednesday",
    priority: "Medium",
    group: "This Week",
    done: false,
  },
  {
    title: "HR reviews",
    due: "Friday",
    priority: "Low",
    group: "This Week",
    done: false,
  },
];

/* ✅ RENDER TASKS IN 3 GROUP CARDS */
function renderTasks() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  const groups = ["Today", "Tomorrow", "This Week"];

  groups.forEach((grp) => {
    let groupTasks = tasks.filter((t) => t.group === grp);

    /* ✅ Starred Tasks Come First */
    groupTasks.sort((a, b) => b.done - a.done);

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

          <!-- ✅ Hollow Star Default + Filled Green on Click -->
          <i
            class="${
              task.done
                ? "fa-solid fa-star checked"
                : "fa-regular fa-star"
            } task-check"
            onclick="toggleDone('${task.title}')">
          </i>

          <span class="task-title">${task.title}</span>

          <!-- ✅ Due Date Same Size as Pills -->
          <span class="task-pill due-pill">${task.due}</span>

          <!-- ✅ Priority -->
          <span class="task-pill ${priorityClass}">
            ${task.priority}
          </span>

          <!-- ✅ Actions -->
          <div class="task-actions">
            <button class="done-btn">Done</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML += html;
  });
}

/* ✅ TOGGLE STAR + MOVE TASK TO TOP */
function toggleDone(title) {
  tasks = tasks.map((task) => {
    if (task.title === title) {
      task.done = !task.done;
    }
    return task;
  });

  renderTasks();
}

/* ✅ LOAD TASKS INITIALLY */
renderTasks();

/* ===================================== */
/* ✅ REAL-TIME FUNCTIONAL CALENDAR CODE */
/* ===================================== */

const monthYearText = document.getElementById("calendarMonthYear");
const datesGrid = document.getElementById("calendarDates");

const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ✅ Render Calendar */
function renderCalendar(month, year) {
  datesGrid.innerHTML = "";

  monthYearText.innerText = `${months[month]} ${year}`;

  let firstDay = new Date(year, month, 1).getDay();
  let totalDays = new Date(year, month + 1, 0).getDate();

  /* ✅ Blank Cells */
  for (let i = 0; i < firstDay; i++) {
    let blank = document.createElement("span");
    blank.classList.add("empty");
    datesGrid.appendChild(blank);
  }

  /* ✅ Dates */
  for (let day = 1; day <= totalDays; day++) {
    let cell = document.createElement("span");
    cell.innerText = day;

    /* ✅ Highlight Today */
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

/* ✅ Month Navigation */
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

/* ✅ Initial Calendar Load */
renderCalendar(currentMonth, currentYear);
