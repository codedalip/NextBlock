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

    // const resultsDiv = document.getElementById("results");
    displayResults(data); 

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


// display result 
// function displayResults(recipes) {

//     const results = document.getElementById("results");
//     results.innerHTML = "";

//     // Add heading
//     const heading = document.createElement("h2");
//     heading.className = "results-title";
//     heading.innerText = "Results";
//     results.appendChild(heading);

//     // Create grid container
//     const grid = document.createElement("div");
//     grid.className = "results-grid";
//     results.appendChild(grid);

//     recipes.forEach(recipe => {

//         const card = document.createElement("div");
//         card.className = "result-card";

//         const sugarClass = recipe.sugarRisk.toLowerCase();
//         const sodiumClass = recipe.sodiumRisk.toLowerCase();

//         card.innerHTML = `
//             <h3>${recipe.name}</h3>
//             <p><strong>Calories:</strong> ${recipe.calories}</p>
//             <p><strong>Match Score:</strong> ${recipe.matchScore}</p>
//             <p><strong>Sugar Risk:</strong> 
//                 <span class="${sugarClass}">${recipe.sugarRisk}</span>
//             </p>
//             <p><strong>Sodium Risk:</strong> 
//                 <span class="${sodiumClass}">${recipe.sodiumRisk}</span>
//             </p>
//         `;

//         grid.appendChild(card);
//     });

//     results.scrollIntoView({ behavior: "smooth" });
// }

function displayResults(recipes) {

    const results = document.getElementById("results");
    results.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        results.innerHTML = "<h2 class='results-title'>No Matches Found</h2>";
        return;
    }

    // Add heading
    const heading = document.createElement("h2");
    heading.className = "results-title";
    heading.innerText = "Results";
    results.appendChild(heading);

    // Create grid container
    const grid = document.createElement("div");
    grid.className = "results-grid";
    results.appendChild(grid);

    recipes.forEach(recipe => {

        const card = document.createElement("div");
        card.className = "result-card";

        // Access correct nested properties
        const sugarRisk = recipe.risks?.sugarRisk || "Unknown";
        const sodiumRisk = recipe.risks?.sodiumRisk || "Unknown";

        const sugarClass = sugarRisk.toLowerCase();
        const sodiumClass = sodiumRisk.toLowerCase();

        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Calories:</strong> ${recipe.calories}</p>
            <p><strong>Match Score:</strong> ${recipe.score}</p>
            <p><strong>Sugar Risk:</strong> 
                <span class="${sugarClass}">${sugarRisk}</span>
            </p>
            <p><strong>Sodium Risk:</strong> 
                <span class="${sodiumClass}">${sodiumRisk}</span>
            </p>
        `;

        grid.appendChild(card);
    });

    results.scrollIntoView({ behavior: "smooth" });
}



function showSection(sectionId) {

    document.querySelectorAll(".dash-section")
        .forEach(sec => sec.classList.remove("active"));

    document.querySelectorAll(".dash-tab")
        .forEach(tab => tab.classList.remove("active"));

    document.getElementById(sectionId).classList.add("active");

    event.target.classList.add("active");
}

function skipSection() {

    const currentSection = sections[currentIndex];

    if (currentSection === "calories") {
        // Jump directly to Micronutrients
        showSectionByIndex(1);
    }

    else if (currentSection === "macros") {
        // Go to Micronutrients
        showSectionByIndex(2);
    }

    else if (currentSection === "micros") {
        alert("You are already on the last section.");
    }
}