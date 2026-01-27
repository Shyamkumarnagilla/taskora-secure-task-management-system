const email = localStorage.getItem("taskora_email");
const token = localStorage.getItem("taskora_token");

if (!email || !token) {
  window.location.href = "index.html";
}

/* ✅ Profile */
const profileIcon = document.getElementById("profileIcon");
const profileMenu = document.getElementById("profileMenu");

document.getElementById("menuEmail").innerText = email;

document.getElementById("profileGreeting").innerText =
  "Hi, " + email.split("@")[0] + "!";

profileIcon.innerText = email.charAt(0).toUpperCase();
document.getElementById("profileAvatar").innerText =
  email.charAt(0).toUpperCase();

/* ✅ Toggle Profile Dropdown */
profileIcon.onclick = () => {
  profileMenu.style.display =
    profileMenu.style.display === "block" ? "none" : "block";
};

/* ✅ Logout ONLY Sidebar */
document.getElementById("logoutBtn").onclick = logout;

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* ✅ Dark / Light Mode */
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

/* ✅ Sidebar Navigation */
const links = document.querySelectorAll(".nav-link");

const sections = {
  dashboard: document.getElementById("dashboardSection"),
  mytasks: document.getElementById("mytasksSection"),
  track: document.getElementById("trackSection"),
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

/* ✅ New Task */
document.getElementById("newTaskBtn").onclick = async () => {
  const title = prompt("Enter task name:");
  if (!title) return;

  await fetch("http://localhost:8081/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description: "",
      userEmail: email,
    }),
  });

  alert("Task Added ✅");
};

/* ✅ Search */
document.getElementById("searchBox").oninput = (e) => {
  console.log("Search:", e.target.value);
};
