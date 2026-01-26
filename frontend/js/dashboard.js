// ✅ Auth Protection
const token = localStorage.getItem("taskora_token");
const email = localStorage.getItem("taskora_email");

if (!token || !email) {
  alert("You are not logged in!");
  window.location.href = "index.html";
}

// ✅ Extract Name from Email
const name = email.split("@")[0];

// ✅ Profile Icon + Greeting + Email
document.getElementById("menuEmail").innerText = email;

document.getElementById("profileIcon").innerText =
  name.charAt(0).toUpperCase();

document.getElementById("profileAvatar").innerText =
  name.charAt(0).toUpperCase();

document.getElementById("profileGreeting").innerText =
  `Hi, ${name}!`;

// ✅ Toggle Profile Dropdown
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

profileIcon.addEventListener("click", () => {
  profileMenu.style.display =
    profileMenu.style.display === "flex" ? "none" : "flex";
});

// ✅ Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("taskora_token");
  localStorage.removeItem("taskora_email");

  alert("Logged out successfully!");
  window.location.href = "index.html";
});

// ✅ Filter Menu Toggle
const filterBtn = document.getElementById("filterBtn");
const filterMenu = document.getElementById("filterMenu");

filterBtn.addEventListener("click", () => {
  filterMenu.style.display =
    filterMenu.style.display === "block" ? "none" : "block";
});

// ✅ Global Task Storage
let allTasks = [];

// ✅ Load Tasks from Backend
async function loadTasks() {
  const response = await fetch(`http://localhost:8081/tasks/${email}`);

  if (response.ok) {
    allTasks = await response.json();
    updateCounts();
    renderTasks(allTasks);
  }
}

// ✅ Update Filter Counts
function updateCounts() {
  document.getElementById("allCount").innerText = allTasks.length;

  document.getElementById("completedCount").innerText =
    allTasks.filter((t) => t.completed).length;

  document.getElementById("pendingCount").innerText =
    allTasks.filter((t) => !t.completed).length;
}

// ✅ Render Tasks as Horizontal Cards
function renderTasks(tasks) {
  const carousel = document.getElementById("taskCarousel");
  carousel.innerHTML = "";

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    if (task.completed) {
      card.classList.add("completed");
    }

    card.innerHTML = `
      <h3>${task.title}</h3>

      <div class="task-actions">
        <button onclick="pinTask(${task.id})">📌</button>
        <button onclick="completeTask(${task.id})">✅</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    carousel.appendChild(card);
  });
}

// ✅ Filter Tasks Function
function filterTasks(type) {
  if (type === "completed") {
    renderTasks(allTasks.filter((t) => t.completed));
  } else if (type === "pending") {
    renderTasks(allTasks.filter((t) => !t.completed));
  } else {
    renderTasks(allTasks);
  }

  filterMenu.style.display = "none";
}

window.filterTasks = filterTasks;

// ✅ Pin Task (Move to Front)
function pinTask(id) {
  const task = allTasks.find((t) => t.id === id);

  allTasks = allTasks.filter((t) => t.id !== id);
  allTasks.unshift(task);

  renderTasks(allTasks);
}

window.pinTask = pinTask;

// ✅ Complete Task API
async function completeTask(id) {
  await fetch(`http://localhost:8081/tasks/${id}/complete`, {
    method: "PUT",
  });

  loadTasks();
}

window.completeTask = completeTask;

// ✅ Edit Task API
async function editTask(id) {
  const newTitle = prompt("Update task title:");
  if (!newTitle) return;

  await fetch(
    `http://localhost:8081/tasks/${id}/update?title=${newTitle}`,
    {
      method: "PUT",
    }
  );

  loadTasks();
}

window.editTask = editTask;

// ✅ Delete Task API
async function deleteTask(id) {
  await fetch(`http://localhost:8081/tasks/${id}`, {
    method: "DELETE",
  });

  loadTasks();
}

window.deleteTask = deleteTask;

// ✅ Scroll Buttons
document.getElementById("scrollLeft").onclick = () => {
  document.getElementById("taskCarousel").scrollLeft -= 300;
};

document.getElementById("scrollRight").onclick = () => {
  document.getElementById("taskCarousel").scrollLeft += 300;
};

// ✅ Composer Elements
const newTaskBtn = document.getElementById("newTaskBtn");
const taskForm = document.getElementById("taskForm");

// Expand Composer
newTaskBtn.addEventListener("click", () => {
  taskForm.style.display =
    taskForm.style.display === "block" ? "none" : "block";
});

// ✅ Submit Task from Composer
document.getElementById("submitTaskBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitleInput").value;
  const date = document.getElementById("taskDate").value;
  const time = document.getElementById("taskTime").value;

  if (!title) {
    alert("Please enter task title!");
    return;
  }

  await fetch("http://localhost:8081/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: `Complete by ${date} ${time}`,
      userEmail: email,
    }),
  });

  // Reset Form
  document.getElementById("taskTitleInput").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskTime").value = "";

  taskForm.style.display = "none";

  loadTasks();
});

// ✅ Initial Load
loadTasks();
