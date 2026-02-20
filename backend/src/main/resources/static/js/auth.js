const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function showMessage(elementId, text, type) {
  const msg = document.getElementById(elementId);

  msg.classList.remove("success", "error");
  msg.classList.add(type);

  msg.innerText = text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

// Register API integration
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const response = await fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    showMessage("registerMsg", " Registered Successfully! Please Login.", "success");
    container.classList.remove("active");
  } else {
    showMessage("registerMsg", " Registration Failed. Try Again.", "error");
  }
});

// Login API integration
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    localStorage.setItem("taskora_token", data.token);
    localStorage.setItem("taskora_email", data.email);
    window.location.href = "dashboard.html";

    showMessage("loginMsg", " Login Successful! Redirecting...", "success");

    window.location.href = "dashboard.html";
  } else {
    showMessage("loginMsg", " Invalid Email or Password", "error");
  }
});
