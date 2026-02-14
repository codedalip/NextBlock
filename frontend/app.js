const API = "http://localhost:5000";

// ---------------- REGISTER ----------------
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById("message").innerText =
    "Registered successfully. Now login.";
}

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("message").innerText =
      data.message || "Login failed";
  }
}

// ---------------- FIND MATCH ----------------
async function findMatch() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "index.html";
    return;
  }


  
  const minCal = document.getElementById("minCal").value;
  const maxCal = document.getElementById("maxCal").value;
  const goal = document.getElementById("goal").value;

const url = `${API}/recipes/match?` +
  `minCal=${minCal.value}&` +
  `maxCal=${maxCal.value}&` +
  `goal=${goal.value}&` +
  `minProtein=${minProtein.value}&` +
  `maxCarbs=${maxCarbs.value}&` +
  `maxSugar=${maxSugar.value}&` +
  `maxFat=${maxFat.value}&` +
  `minFiber=${minFiber.value}&` +
  `maxSodium=${maxSodium.value}&` +
  `minIron=${minIron.value}&` +
  `minVitaminC=${minVitaminC.value}`;
const res = await fetch(url, {
  headers: { Authorization: "Bearer " + token }
});



  const data = await res.json();

  const resultsDiv = document.getElementById("results");

  if (data.length === 0) {
    resultsDiv.innerHTML = "<p>No matches found.</p>";
    return;
  }

  resultsDiv.innerHTML = data.map(r => `
    <div class="card">
      <h3>${r.title}</h3>
      <p>Calories: ${r.calories}</p>
      <p>Match Score: ${r.score}</p>
      <p>Sugar Risk: ${r.risks.sugarRisk}</p>
      <p>Sodium Risk: ${r.risks.sodiumRisk}</p>
    </div>
  `).join("");
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


const card = document.getElementById("card");

card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
    `;
});

card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
});

function showLogin() {
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("signupForm").classList.remove("active");

    document.querySelectorAll(".tab")[0].classList.add("active");
    document.querySelectorAll(".tab")[1].classList.remove("active");
}

function showSignup() {
    document.getElementById("signupForm").classList.add("active");
    document.getElementById("loginForm").classList.remove("active");

    document.querySelectorAll(".tab")[1].classList.add("active");
    document.querySelectorAll(".tab")[0].classList.remove("active");
}