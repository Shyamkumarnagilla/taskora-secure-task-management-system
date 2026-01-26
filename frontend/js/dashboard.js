// ✅ Auth Protection
const token = localStorage.getItem("taskora_token");
const email = localStorage.getItem("taskora_email");

if (!token || !email) {
  alert("You are not logged in!");
  window.location.href = "index.html";
}

// ✅ Extract Name from Email
const name = email.split("@")[0];

// ✅ Show Email in Menu (Gmail Style)
document.getElementById("menuEmail").innerText = email;

// ✅ Profile Icon Letter
document.getElementById("profileIcon").innerText =
  name.charAt(0).toUpperCase();

document.getElementById("profileAvatar").innerText =
  name.charAt(0).toUpperCase();

// ✅ Greeting Text
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

// ✅ Global Tasks Storage
let allTasks = [];

// ✅ Render Tasks Function
function renderTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerText = task.title;

    taskList.appendChild(div);
  });
}

// ✅ Update Counts Function
function updateCounts() {
  document.getElementById("allCount").innerText = allTasks.length;

  document.getElementById("completedCount").innerText =
    allTasks.filter((t) => t.completed).length;

  document.getElementById("pendingCount").innerText =
    allTasks.filter((t) => !t.completed).length;
}

// ✅ Filter Tasks Function (called from HTML onclick)
function filterTasks(type) {
  if (type === "completed") {
    renderTasks(allTasks.filter((t) => t.completed));
  } else if (type === "pending") {
    renderTasks(allTasks.filter((t) => !t.completed));
  } else {
    renderTasks(allTasks);
  }

  // Hide menu after click
  filterMenu.style.display = "none";
}

// ✅ Make filterTasks available globally
window.filterTasks = filterTasks;

// ✅ Load Tasks from Backend
async function loadTasks() {
  const response = await fetch(`http://localhost:8081/tasks/${email}`);

  if (response.ok) {
    allTasks = await response.json();

    updateCounts();
    renderTasks(allTasks);
  } else {
    document.getElementById("taskList").innerHTML =
      "<p>Error loading tasks.</p>";
  }
}

// ✅ Initial Load
loadTasks();


// ✅ ===============================
// ✅ ChatGPT Style Task Composer
// ✅ ===============================

// Composer Elements
const newTaskBtn = document.getElementById("newTaskBtn");
const taskForm = document.getElementById("taskForm");

// Expand / Collapse Form
newTaskBtn.addEventListener("click", () => {
  taskForm.style.display =
    taskForm.style.display === "block" ? "none" : "block";
});

// Submit Task
document.getElementById("submitTaskBtn").addEventListener("click", async () => {

  const title = document.getElementById("taskTitleInput").value;
  const date = document.getElementById("taskDate").value;
  const time = document.getElementById("taskTime").value;

  if (!title) {
    alert("Please enter a task name!");
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

  // Close Form
  taskForm.style.display = "none";

  // Reload Tasks
  loadTasks();
});
