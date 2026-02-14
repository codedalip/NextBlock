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

//   const res = await fetch(
//     `${API}/recipes/match?minCal=${minCal}&maxCal=${maxCal}&goal=${goal}`,
//     {
//       headers: {
//         Authorization: "Bearer " + token
//       }
//     }
//   );
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
