const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const imageGrid = document.getElementById("image-grid");
const loader = document.getElementById("loader");

const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

/* ================= THEME ================= */

(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
})();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

/* ================= GENERATE ================= */

promptForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = promptInput.value.trim();
  const count = parseInt(countSelect.value);
  const aspect = ratioSelect.value;

  if (!prompt) return;

  imageGrid.innerHTML = "";
  loader.classList.remove("hidden");

  for (let i = 0; i < count; i++) {
    await generateImage(prompt, aspect);
  }

  loader.classList.add("hidden");
});

/* ================= GEMINI IMAGE GENERATION ================= */

async function generateImage(prompt, aspectRatio) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await response.json();

    // For demo fallback image
    const imageUrl = "https://picsum.photos/500";

    createImageCard(imageUrl);

  } catch (error) {
    console.error(error);
  }
}

/* ================= CREATE CARD ================= */

function createImageCard(imageUrl){

  const card = document.createElement("div");
  card.className = "image-card";

  const img = document.createElement("img");
  img.src = imageUrl;

  const footer = document.createElement("div");
  footer.className = "image-footer";

  const downloadBtn = document.createElement("a");
  downloadBtn.href = imageUrl;
  downloadBtn.download = "";
  downloadBtn.className = "download-btn";
  downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';

  footer.appendChild(downloadBtn);
  card.appendChild(img);
  card.appendChild(footer);
  imageGrid.appendChild(card);

  // When image loads → add animation
  img.onload = () => {
    card.classList.add("loaded");
  };
}

const particleContainer = document.getElementById("particles-container");
for(let i=0; i<50; i++){
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.top = Math.random() * window.innerHeight + "px";
    p.style.width = p.style.height = Math.random() * 6 + 2 + "px";
    p.style.animationDuration = (3 + Math.random() * 5) + "s";
    particleContainer.appendChild(p);
}

