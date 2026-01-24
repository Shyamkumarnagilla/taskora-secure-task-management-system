const token = localStorage.getItem("taskora_token");

if (!token) {
  alert("You are not logged in!");
  window.location.href = "index.html";
} else {
  console.log("JWT Token:", token);
}
