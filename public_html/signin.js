function signUpUser() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value;
  const studentId = document.getElementById("studentId").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const agree = document.getElementById("agree").checked;

  if (!agree) {
    alert("You must agree to the Terms of Service and Privacy Policy.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }

  alert(`Account created for: ${firstName} ${lastName} (${email})`);
  return false; // Prevent form submission for now
}
