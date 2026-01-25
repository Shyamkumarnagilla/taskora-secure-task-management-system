const token = localStorage.getItem("taskora_token");
const email = localStorage.getItem("taskora_email");

if (!token || !email) {
  alert("You are not logged in!");
  window.location.href = "index.html";
}

async function loadTasks() {
  const taskList = document.getElementById("taskList");

  const response = await fetch(`http://localhost:8081/tasks/${email}`);

  if (response.ok) {
    const tasks = await response.json();

    if (tasks.length === 0) {
      taskList.innerHTML = "<p>No tasks yet. Add your first task!</p>";
      return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerText = task.title;
      taskList.appendChild(div);
    });

  } else {
    taskList.innerHTML = "<p>Error loading tasks.</p>";
  }
}

loadTasks();
document.getElementById("addTaskBtn").addEventListener("click", async () => {

  const title = prompt("Enter task title:");

  if (!title) return;

  await fetch("http://localhost:8081/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      description: "Added from dashboard",
      userEmail: email
    })
  });


  loadTasks();
});
