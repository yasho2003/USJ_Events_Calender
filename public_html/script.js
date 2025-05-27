// Helper to show only one section at a time
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((el) => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  // Update active nav button
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white");
    btn.classList.add("text-gray-600");
  });
  const activeBtn = document.querySelector(`[onclick="showSection('${id}')"]`);
  if (activeBtn) {
    activeBtn.classList.add("bg-blue-600", "text-white");
    activeBtn.classList.remove("text-gray-600");
  }

  // Load dashboard data if showing dashboard
  if (id === "dashboard") {
    loadDashboardData();
  }
}

// Register new user
async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!name || !email || !password) {
    showMessage("regResult", "All fields are required", "error");
    return;
  }

  try {
    const res = await fetch("/php-structure/api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(
        "regResult",
        "Registration successful! Please login.",
        "success"
      );
      setTimeout(() => showSection("login"), 1500);
    } else {
      showMessage("regResult", data.error || "Something went wrong.", "error");
    }
  } catch (error) {
    showMessage("regResult", "Network error. Please try again.", "error");
  }
}

// Login and store JWT token
async function login() {
  const email = document.getElementById("logEmail").value.trim();
  const password = document.getElementById("logPassword").value;

  if (!email || !password) {
    showMessage("logResult", "Email and password are required", "error");
    return;
  }

  try {
    const res = await fetch("/php-structure/api/login.php", {
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
}

// Load user profile using stored token
async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("profileData").textContent =
      "You're not logged in.";
    return;
  }

  try {
    const res = await fetch("/php-structure/api/profile.php", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("profileData").innerHTML = `
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="font-medium">ID:</span>
            <span>${data.id}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Name:</span>
            <span>${data.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Email:</span>
            <span>${data.email}</span>
          </div>
        </div>
      `;
    } else {
      document.getElementById("profileData").textContent =
        "Failed to load profile.";
    }
  } catch (error) {
    document.getElementById("profileData").textContent =
      "Network error. Please try again.";
  }
}

// Load dashboard data
async function loadDashboardData() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // Load statistics
    const statsRes = await fetch("/php-structure/api/stats.php", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (statsRes.ok) {
      const stats = await statsRes.json();
      document.getElementById("totalPosts").textContent = stats.totalPosts || 0;
      document.getElementById("totalComments").textContent =
        stats.totalComments || 0;
    }

    // Load recent activity
    const activityRes = await fetch("/php-structure/api/activity.php", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (activityRes.ok) {
      const activities = await activityRes.json();
      const activityHtml = activities.length
        ? activities
            .map(
              (activity) => `
          <div class="flex items-center space-x-2">
            <i class="fas ${getActivityIcon(activity.type)} text-blue-500"></i>
            <span>${activity.description}</span>
          </div>
        `
            )
            .join("")
        : '<p class="text-gray-600">No recent activity</p>';
      document.getElementById("recentActivity").innerHTML = activityHtml;
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

// Create new post
async function createPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const token = localStorage.getItem("token");

  if (!title || !content) {
    showMessage("postResult", "Title and content are required", "error");
    return;
  }

  try {
    const res = await fetch("/php-structure/api/posts.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("postResult", "Post created successfully!", "success");
      // Clear form
      document.getElementById("postTitle").value = "";
      document.getElementById("postContent").value = "";
      // Return to dashboard after a delay
      setTimeout(() => {
        showSection("dashboard");
        loadDashboardData(); // Refresh dashboard data
      }, 1500);
    } else {
      showMessage("postResult", data.error || "Failed to create post", "error");
    }
  } catch (error) {
    showMessage("postResult", "Network error. Please try again.", "error");
  }
}

// Update password
async function updatePassword() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const token = localStorage.getItem("token");

  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage("settingsResult", "All fields are required", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("settingsResult", "New passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch("/php-structure/api/update_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(
        "settingsResult",
        "Password updated successfully!",
        "success"
      );
      // Clear form
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";
      // Return to dashboard after a delay
      setTimeout(() => showSection("dashboard"), 1500);
    } else {
      showMessage(
        "settingsResult",
        data.error || "Failed to update password",
        "error"
      );
    }
  } catch (error) {
    showMessage("settingsResult", "Network error. Please try again.", "error");
  }
}

// Helper function to get activity icon
function getActivityIcon(type) {
  const icons = {
    post: "fa-file-alt",
    comment: "fa-comment",
    like: "fa-heart",
    follow: "fa-user-plus",
  };
  return icons[type] || "fa-circle";
}

// Show message with appropriate styling
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = `mt-2 text-sm ${
    type === "error" ? "text-red-600" : "text-green-600"
  }`;
}

// Clear token and redirect
function logout() {
  localStorage.removeItem("token");
  showSection("login");
  document.getElementById("profileData").textContent = "You're not logged in.";
}

// Check authentication status on page load
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    showSection("dashboard");
    loadProfile();
  } else {
    showSection("login");
  }
});
