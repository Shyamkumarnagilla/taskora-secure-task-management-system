const container = document.querySelector(".container");
const toggleRegisterBtn = document.querySelector(".register-btn");
const toggleLoginBtn = document.querySelector(".login-btn");

// Toggle between Login and Register views
if (toggleRegisterBtn && toggleLoginBtn) {
  toggleRegisterBtn.addEventListener("click", () => {
    container.classList.add("active");
  });

  toggleLoginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });
}

function showMessage(elementId, text, type) {
  const msg = document.getElementById(elementId);
  if (!msg) return;

  msg.classList.remove("success", "error");
  msg.classList.add(type);
  msg.innerText = text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 5000);
}

// Register API integration
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Registering user...");

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        showMessage("registerMsg", "✅ Registered Successfully! Please Login.", "success");
        setTimeout(() => container.classList.remove("active"), 2000);
      } else {
        const errorData = await response.text();
        console.error("Registration error:", errorData);
        showMessage("registerMsg", "❌ Registration Failed. Try Again.", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Connection Error: Could not reach the server.");
    }
  });
}

// Login API integration
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Logging in...");

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("taskora_token", data.token);
        localStorage.setItem("taskora_email", data.email);
        showMessage("loginMsg", "✅ Login Successful! Redirecting...", "success");
        setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
      } else {
        console.error("Login failed: Invalid credentials");
        showMessage("loginMsg", "❌ Invalid Email or Password", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Connection Error: Could not reach the server.");
    }
  });
}
