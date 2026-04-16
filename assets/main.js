/**
 * ProfLambda - Main JS (Refactored for Excellence)
 * Focus: Security, XSS Prevention, Clean Code, Animations
 */

// 1. SECURITY & UTILS
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Tagged template for safe HTML injection (Rule n°10)
 */
class SafeString {
    constructor(str) { this.str = str; }
    toString() { return this.str; }
}

const html = (strings, ...values) => {
    const result = strings.reduce((acc, str, i) => {
        const val = values[i];
        let escapedVal = '';
        
        if (val instanceof SafeString) {
            escapedVal = val.toString();
        } else if (Array.isArray(val)) {
            escapedVal = val.map(v => v instanceof SafeString ? v.toString() : escapeHTML(String(v))).join('');
        } else if (val === undefined || val === null) {
            escapedVal = '';
        } else if (i < values.length) {
            escapedVal = escapeHTML(String(val));
        }
        
        return acc + str + escapedVal;
    }, '');
    return new SafeString(result);
};

const STORAGE_KEY = "exercices_progress";

const getProgress = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

const isCompleted = (id) => !!getProgress()[id];

const saveCompletion = (id) => {
    const data = getProgress();
    data[id] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const calculateGlobalProgress = (total) => {
    if (total === 0) return 0;
    const completed = Object.values(getProgress()).filter(Boolean).length;
    return Math.round((completed / total) * 100);
};

// 2. DATA FETCHING
async function fetchExercices() {
    try {
        const res = await fetch("./data/exercices/index.json");
        if (!res.ok) throw new Error("Erreur reseau");
        const data = await res.json();
        return data.exercices || [];
    } catch (err) {
        console.error("Erreur chargement exercices:", err);
        return [];
    }
}

async function fetchExerciceDetails(id) {
    try {
        const [software, num] = id.split("_");
        const res = await fetch(`./data/exercices/${software}/${num}/exercice.json`);
        if (!res.ok) throw new Error("Exercice non trouvé");
        return await res.json();
    } catch (err) {
        console.error("Erreur chargement exercice:", err);
        return null;
    }
}

// 3. UI RENDERING
function getSoftwareConfig(software) {
    const s = software.toLowerCase();
    if (s === "excel") {
        return { bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-100 dark:border-green-900/50", color: "text-green-600", icon: "table_view" };
    }
    if (s === "word") {
        return { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-100 dark:border-blue-900/50", color: "text-blue-600", icon: "description" };
    }
    return { bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700", color: "text-slate-600", icon: "folder" };
}

async function renderGrid() {
    const grid = document.getElementById("exercises-grid");
    const progressEl = document.getElementById("global-progress");
    const filters = document.querySelectorAll(".filter-btn");

    if (!grid) return;

    let items = await fetchExercices();
    let currentFilter = "all";

    const updateUI = () => {
        grid.innerHTML = "";
        const filtered = items.filter(ex => currentFilter === "all" || ex.software.toLowerCase() === currentFilter);

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-20 text-slate-400">Aucun exercice trouvé.</div>';
            return;
        }

        progressEl.textContent = `${calculateGlobalProgress(items.length)}%`;

        filtered.forEach(ex => {
            const done = isCompleted(ex.id);
            const conf = getSoftwareConfig(ex.software);
            
            const card = document.createElement("a");
            card.href = `./exercice.html?id=${ex.id}`;
            card.className = `exercise-card relative p-6 bg-white dark:bg-slate-900 border ${done ? 'border-green-500 shadow-lg shadow-green-500/10' : 'border-slate-100 dark:border-slate-800'} transition-all group`;
            
            // Using our safe html tag
            card.innerHTML = html`
                <div class="flex gap-5 items-start">
                    ${done ? html`<div class="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1.5 shadow-xl border-2 border-white dark:border-slate-900 scale-110"><span class="material-symbols-outlined text-sm font-bold">check</span></div>` : ''}
                    <div class="w-20 h-20 rounded-2xl ${conf.bg} flex items-center justify-center shrink-0 border ${conf.border} group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined text-4xl ${conf.color}">${conf.icon}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-[10px] font-black ${conf.color} ${conf.bg} px-2 py-0.5 rounded-full uppercase tracking-tighter">${ex.difficulty}</span>
                            <span class="flex items-center text-slate-400 text-[11px] gap-1 font-bold">
                                <span class="material-symbols-outlined text-xs">schedule</span> ${ex.estimatedTime}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">${ex.title}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${ex.description}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Entrance animation
        if (window.gsap) {
            gsap.from(".exercise-card", { opacity: 0, y: 20, stagger: 0.05, duration: 0.6, ease: "power2.out" });
        }
    };

    updateUI();

    filters.forEach(btn => {
        btn.addEventListener("click", () => {
            filters.forEach(b => b.classList.remove("active", "bg-primary", "text-white"));
            btn.classList.add("active", "bg-primary", "text-white");
            currentFilter = btn.dataset.filter;
            updateUI();
        });
    });
}

async function renderExercise() {
    const page = document.getElementById("exercice-page");
    if (!page) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) { window.location.href = "./"; return; }

    const ex = await fetchExerciceDetails(id);
    if (!ex) {
        document.getElementById("ex-main-title").textContent = "Erreur: Exercice introuvable";
        return;
    }

    document.title = `PL - ${ex.title}`;
    document.getElementById("ex-title").textContent = ex.title;
    document.getElementById("ex-main-title").textContent = ex.title;
    
    const level = document.getElementById("ex-level");
    level.textContent = ex.difficulty;
    const conf = getSoftwareConfig(ex.software);
    level.className = `inline-block px-3 py-1 ${conf.bg} ${conf.color} text-[11px] font-black rounded-full uppercase mb-2`;

    document.getElementById("ex-time").innerHTML = html`<span class="material-symbols-outlined text-base">schedule</span> ${ex.estimatedTime}`;
    
    // Contexte (Safe split into paragraphs)
    const contextContainer = document.getElementById("ex-context");
    contextContainer.innerHTML = "";
    ex.context.split("\n\n").forEach(p => {
        const para = document.createElement("p");
        para.textContent = p;
        para.className = "mb-4 leading-relaxed";
        contextContainer.appendChild(para);
    });

    // Tasks
    const tasksContainer = document.getElementById("ex-tasks");
    tasksContainer.innerHTML = "";
    ex.tasks.forEach(t => {
        const li = document.createElement("li");
        li.className = "flex gap-3 text-slate-700 dark:text-slate-300 items-start";
        li.innerHTML = html`<span class="material-symbols-outlined text-indigo-400 shrink-0">check_circle</span> <span class="text-sm font-medium">${t}</span>`;
        tasksContainer.appendChild(li);
    });

    // Result
    if (ex.expectedResult) {
        document.getElementById("ex-result").classList.remove("hidden");
        document.getElementById("ex-result-desc").textContent = ex.expectedResult.description;
        const [software, num] = id.split("_");
        const img = document.getElementById("ex-result-img");
        img.src = `./data/exercices/${software}/${num}/${ex.expectedResult.image}`;
        img.loading = "lazy";
        // Convert to webp if we did the migration (for now just use standard)
    }

    // Resources
    const resContainer = document.getElementById("ex-resources");
    resContainer.innerHTML = "";
    ex.resources.forEach(r => {
        const [sw, num] = id.split("_");
        const link = document.createElement("a");
        link.href = `./data/exercices/${sw}/${num}/${r.file}`;
        link.download = r.file;
        link.className = "flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold group";
        link.innerHTML = html`
            <span class="material-symbols-outlined text-indigo-500 group-hover:scale-120 transition-transform">download_for_offline</span>
            <span class="text-sm flex-1">${r.name}</span>
            <span class="text-[10px] uppercase text-slate-400 font-black">${r.type || 'file'}</span>
        `;
        resContainer.appendChild(link);
    });

    // Tutorials
    const tutContainer = document.getElementById("ex-tutorials");
    if (ex.tutorials) {
        tutContainer.innerHTML = "";
        ex.tutorials.forEach(t => {
            const link = document.createElement("a");
            link.href = t.url;
            link.target = "_blank";
            link.className = "flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline px-1 py-1";
            link.innerHTML = html`<span class="material-symbols-outlined text-base">link</span> ${t.name}`;
            tutContainer.appendChild(link);
        });
    }

    // Progression
    const btn = document.getElementById("btn-validate");
    const updateBtn = () => {
        if (isCompleted(id)) {
            btn.innerHTML = html`<span class="material-symbols-outlined">verified</span> Validé !`;
            btn.classList.replace("bg-primary", "bg-green-500");
            btn.classList.add("pointer-events-none");
        }
    };
    updateBtn();
    btn.addEventListener("click", () => {
        saveCompletion(id);
        updateBtn();
        if (window.gsap) gsap.to(btn, { scale: 1.1, repeat: 1, yoyo: true, duration: 0.2 });
    });
}

// 4. INIT & THEME
function initTheme() {
    const btn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-toggle-icon");
    if (!btn || !icon) return;

    const current = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    const setTheme = (t) => {
        document.documentElement.classList.toggle("dark", t === "dark");
        icon.textContent = t === "dark" ? "light_mode" : "dark_mode";
        localStorage.setItem("theme", t);
    };

    setTheme(current);
    btn.addEventListener("click", () => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        setTheme(next);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (window._appInitialized) return;
    window._appInitialized = true;

    initTheme();
    renderGrid();
    renderExercise();

    // GSAP global entrance
    if (window.gsap) {
        gsap.from("header", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
    }
});
