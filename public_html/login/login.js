// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginBtn = document.getElementById("login-btn");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const forgotPasswordLink = document.getElementById("forgot-password");

  // Login button click handler
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Simulate login process
    loginBtn.textContent = "Logging in...";
    loginBtn.disabled = true;

    try {
      const res = await fetch("/USJ_Events_Calender/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        showMessage("logResult", "Login successful!", "success");
        setTimeout(() => showSection("dashboard"), 1000);
        loadProfile();
      } else {
        showMessage("logResult", data.error || "Invalid credentials", "error");
      }
    } catch (error) {
      showMessage("logResult", "Network error. Please try again.", "error");
    }
  });

  // Allow Enter key to submit form
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        loginBtn.click();
      }
    });
  });

  // Forgot password handler
  forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Password reset functionality would be implemented here");
    // You can redirect to a password reset page
    // window.location.href = 'forgot-password.html';
  });

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
