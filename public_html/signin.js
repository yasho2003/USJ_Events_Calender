function signInUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate input
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }

  // Simulate account creation success
  alert(`Account created for: ${email}`);
  return false; // Prevent form from submitting
}
