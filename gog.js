// Database of exercises covering all human muscle groups
const EXERCISES = [
  {
    id: "pushup",
    name: "Standard Push-Up",
    category: "chest",
    diff: "Beginner",
    target: "Chest, Triceps, Anterior Deltoids",
    desc: "Keep body rigid, lower chest until an inch off the floor, then push back up explosive.",
    tip: "Keep core tight and elbows angled at 45 degrees.",
    animType: "pushup"
  },
  {
    id: "diamond_pushup",
    name: "Diamond Push-Up",
    category: "arms",
    diff: "Intermediate",
    target: "Triceps, Inner Chest",
    desc: "Form a diamond shape with hands directly under sternum and lower chest to hands.",
    tip: "Focus pressure strictly through palms to engage triceps.",
    animType: "pushup"
  },
  {
    id: "pullup",
    name: "Bodyweight Pull-Up",
    category: "back",
    diff: "Intermediate",
    target: "Latissimus Dorsi, Biceps, Upper Back",
    desc: "Grasp overhead bar with overhand grip, pull body up until chin clears the bar.",
    tip: "Drive elbows down toward hips to maximize back engagement.",
    animType: "pullup"
  },
  {
    id: "pike_pushup",
    name: "Pike Push-Up",
    category: "shoulders",
    diff: "Intermediate",
    target: "Shoulders (Deltoids), Upper Triceps",
    desc: "Pike hips high into inverted V shape, lower head toward hands and push up.",
    tip: "Look toward your feet during movement to keep neck neutral.",
    animType: "pushup"
  },
  {
    id: "squat",
    name: "Bodyweight Squat",
    category: "legs",
    diff: "Beginner",
    target: "Quadriceps, Glutes, Hamstrings",
    desc: "Lower hips back as if sitting in a low chair, keeping chest lifted.",
    tip: "Push through heels and keep knees aligned with toes.",
    animType: "squat"
  },
  {
    id: "crunches",
    name: "Abdominal Crunches",
    category: "abs",
    diff: "Beginner",
    target: "Rectus Abdominis (Six-Pack)",
    desc: "Lie on back, curl upper torso up toward knees while pressing lower back to floor.",
    tip: "Avoid pulling neck; squeeze upper abs tightly at the top.",
    animType: "abs"
  }
];

let isPlaying = true;
let animSpeed = 1.0;
let animFrame = 0;
let currentEx = EXERCISES[0];

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  setupNavigation();
  renderCategories();
  renderExerciseGrid();
  selectExercise(EXERCISES[0].id);
  initHumanCanvas();
  setupChat();
});

function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("active", "text-cyan-400");
        b.classList.add("text-slate-400");
      });
      btn.classList.add("active", "text-cyan-400");
      btn.classList.remove("text-slate-400");

      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(tc => tc.classList.add("hidden"));
      const activeTab = document.getElementById(`tab-${tab}`);
      if (activeTab) activeTab.classList.remove("hidden");
    });
  });

  const btnPlay = document.getElementById("btnPlayPause");
  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      isPlaying = !isPlaying;
      document.getElementById("txtPause").innerText = isPlaying ? "Pause Animation" : "Play Animation";
    });
  }

  document.querySelectorAll(".speed-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      animSpeed = parseFloat(e.target.dataset.speed);
    });
  });
}

function renderCategories() {
  const cats = [
    { id: "all", name: "All Muscle Groups" },
    { id: "chest", name: "Chest" },
    { id: "back", name: "Back" },
    { id: "shoulders", name: "Shoulders" },
    { id: "arms", name: "Arms" },
    { id: "abs", name: "Abs & Core" },
    { id: "legs", name: "Legs" }
  ];
  const container = document.getElementById("muscleCategoryContainer");
  if (!container) return;

  container.innerHTML = cats.map(c => `
    <button class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-900 border border-slate-800 hover:border-cyan-400 transition" onclick="filterCategory('${c.id}')">
      ${c.name}
    </button>
  `).join('');
}

window.filterCategory = function(cat) {
  renderExerciseGrid(cat);
};

function renderExerciseGrid(filterCat = "all") {
  const container = document.getElementById("exerciseGrid");
  if (!container) return;

  const filtered = filterCat === "all" ? EXERCISES : EXERCISES.filter(e => e.category === filterCat);

  container.innerHTML = filtered.map(ex => `
    <div class="glass-panel p-4 flex flex-col justify-between hover:border-cyan-400 transition cursor-pointer" onclick="selectExercise('${ex.id}')">
      <div>
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-sm text-white">${ex.name}</h4>
          <span class="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">${ex.category}</span>
        </div>
        <p class="text-xs text-slate-400 line-clamp-2 mb-3">${ex.desc}</p>
      </div>
      <button class="w-full py-2 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-black text-xs font-bold transition">
        View Motion Guide
      </button>
    </div>
  `).join('');
}

window.selectExercise = function(id) {
  const found = EXERCISES.find(e => e.id === id);
  if (!found) return;
  currentEx = found;

  document.getElementById("activeExTag").innerText = currentEx.name;
  document.getElementById("exTitle").innerText = currentEx.name;
  document.getElementById("exDesc").innerText = currentEx.desc;
  document.getElementById("exTarget").innerText = currentEx.target;
  document.getElementById("exDiff").innerText = currentEx.diff;
  document.getElementById("exTip").innerText = currentEx.tip;
};

function setupChat() {
  const form = document.getElementById("chatForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const val = input.value.trim();
    if (!val) return;

    appendMessage('YOU', val, false);
    input.value = "";

    setTimeout(() => {
      appendMessage('AI', `For perfect results regarding "${val}": Always focus on mind-muscle connection and strictly control the eccentric (lowering) phase!`, true);
    }, 600);
  });
}

function appendMessage(sender, text, isAi) {
  const box = document.getElementById("chatMessages");
  if (!box) return;

  const div = document.createElement("div");
  div.className = `flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`;
  div.innerHTML = `
    <div class="w-8 h-8 rounded-full ${isAi ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-600 text-white'} flex items-center justify-center shrink-0 text-xs font-bold">
      ${sender}
    </div>
    <div class="p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${isAi ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-cyan-500 text-black font-semibold'}">
      ${text}
    </div>
  `;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// REALISTIC HUMAN BODY ANATOMICAL CANVAS RENDERER
function initHumanCanvas() {
  const canvas = document.getElementById("exerciseCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function drawHumanFigure(type, progress) {
    ctx.save();
    ctx.strokeStyle = "#00F2FE";
    ctx.fillStyle = "#00F2FE";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (type === "pushup") {
      const yOffset = cy + 20 + (progress * 30);
      
      // Floor line
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.moveTo(40, cy + 60); ctx.lineTo(460, cy + 60); ctx.stroke();

      ctx.strokeStyle = "#00F2FE";
      // Head
      ctx.beginPath(); ctx.arc(380, yOffset - 12, 12, 0, Math.PI * 2); ctx.fill();
      // Torso
      ctx.beginPath(); ctx.moveTo(370, yOffset - 5); ctx.lineTo(180, yOffset + 5); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(180, yOffset + 5); ctx.lineTo(80, cy + 58); ctx.stroke();
      // Arms
      ctx.beginPath(); ctx.moveTo(350, yOffset - 2); ctx.lineTo(340, cy + 58); ctx.stroke();

    } else if (type === "pullup") {
      const yOffset = cy - 40 - (progress * 45);

      // Pull up bar
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 100); ctx.lineTo(cx + 100, cy - 100); ctx.stroke();

      ctx.strokeStyle = "#00F2FE";
      // Head
      ctx.beginPath(); ctx.arc(cx, yOffset - 15, 12, 0, Math.PI * 2); ctx.fill();
      // Torso
      ctx.beginPath(); ctx.moveTo(cx, yOffset); ctx.lineTo(cx, yOffset + 70); ctx.stroke();
      // Arms
      ctx.beginPath(); ctx.moveTo(cx, yOffset + 10); ctx.lineTo(cx - 30, cy - 98); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, yOffset + 10); ctx.lineTo(cx + 30, cy - 98); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(cx, yOffset + 70); ctx.lineTo(cx - 15, yOffset + 130); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, yOffset + 70); ctx.lineTo(cx + 15, yOffset + 130); ctx.stroke();

    } else if (type === "squat") {
      const hipY = cy - 20 + (progress * 50);

      // Head
      ctx.beginPath(); ctx.arc(cx, hipY - 65, 12, 0, Math.PI * 2); ctx.fill();
      // Torso
      ctx.beginPath(); ctx.moveTo(cx, hipY - 50); ctx.lineTo(cx, hipY); ctx.stroke();
      // Thighs
      ctx.beginPath(); ctx.moveTo(cx, hipY); ctx.lineTo(cx + (progress * 25) - 20, hipY + 35); ctx.stroke();
      // Shin
      ctx.beginPath(); ctx.moveTo(cx + (progress * 25) - 20, hipY + 35); ctx.lineTo(cx - 10, cy + 100); ctx.stroke();

    } else {
      // Abs Crunch
      ctx.beginPath(); ctx.arc(cx - 50, cy + 20 - (progress * 15), 12, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 40, cy + 25); ctx.lineTo(cx + 20, cy + 40); ctx.stroke();
    }

    ctx.restore();
  }

  function loop() {
    if (isPlaying) animFrame += 0.04 * animSpeed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    const progress = (Math.sin(animFrame) + 1) / 2;
    drawHumanFigure(currentEx.animType, progress);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}