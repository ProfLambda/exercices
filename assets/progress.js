/**
 * ProfLambda - Progress Tracking (Refactored)
 * Focus: Security, No innerHTML, CSP compliance
 */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof pageConfig === "undefined") {
        console.error("pageConfig is not defined.");
        return;
    }

    const checkboxes = document.querySelectorAll(".mastery-checkbox");
    const countEl = document.getElementById("progress-count");
    const summaryGrid = document.getElementById("summary-grid");
    const userNameInput = document.getElementById("user-name");
    
    const { storageKey, functionsList } = pageConfig;

    // 1. Initial Render of Summary
    if (summaryGrid) {
        summaryGrid.innerHTML = "";
        functionsList.forEach(t => {
            const item = document.createElement("div");
            item.id = `summary-${t.id}`;
            item.className = "flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 transition-all bg-white dark:bg-slate-900 shadow-sm";
            
            const nameSpan = document.createElement("span");
            nameSpan.textContent = t.name;
            
            const statusIcon = document.createElement("span");
            statusIcon.className = "status-icon w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
            statusIcon.textContent = "○";
            
            item.appendChild(nameSpan);
            item.appendChild(statusIcon);
            summaryGrid.appendChild(item);
        });
    }

    // 2. State Management
    const updateVisuals = (id, checked) => {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.classList.toggle("card-acquired", checked);
            if (checked) {
                card.classList.add("ring-2", "ring-green-500", "bg-green-50/30", "dark:bg-green-900/10");
            } else {
                card.classList.remove("ring-2", "ring-green-500", "bg-green-50/30", "dark:bg-green-900/10");
            }
        }
        
        const summaryItem = document.getElementById(`summary-${id}`);
        if (summaryItem) {
            const icon = summaryItem.querySelector(".status-icon");
            if (checked) {
                summaryItem.classList.add("bg-green-50", "dark:bg-green-900/20", "border-green-300", "dark:border-green-800", "text-green-700", "dark:text-green-400");
                summaryItem.classList.remove("text-slate-500");
                icon.textContent = "✓";
                icon.classList.replace("bg-slate-100", "bg-green-500");
                icon.classList.add("text-white", "border-none");
            } else {
                summaryItem.classList.remove("bg-green-50", "dark:bg-green-900/20", "border-green-300", "dark:border-green-800", "text-green-700", "dark:text-green-400");
                summaryItem.classList.add("text-slate-500");
                icon.textContent = "○";
                icon.classList.replace("bg-green-500", "bg-slate-100");
                icon.classList.remove("text-white", "border-none");
            }
        }
    };

    const saveState = () => {
        const state = {};
        let acquiredCount = 0;
        checkboxes.forEach(cb => {
            state[cb.dataset.id] = cb.checked;
            if (cb.checked) acquiredCount++;
        });
        localStorage.setItem(storageKey, JSON.stringify(state));
        if (countEl) countEl.textContent = acquiredCount;
    };

    const loadState = () => {
        let state = {};
        try {
            state = JSON.parse(localStorage.getItem(storageKey)) || {};
        } catch(e) { state = {}; }
        
        let acquiredCount = 0;
        checkboxes.forEach(cb => {
            const id = cb.dataset.id;
            const checked = state[id] === true;
            cb.checked = checked;
            if (checked) acquiredCount++;
            updateVisuals(id, checked);
        });
        if (countEl) countEl.textContent = acquiredCount;

        if (userNameInput) {
            userNameInput.value = localStorage.getItem("userName") || "";
        }
    };

    // 3. Events
    checkboxes.forEach(cb => {
        cb.addEventListener("change", (e) => {
            updateVisuals(e.target.dataset.id, e.target.checked);
            saveState();
            
            // Premium Feedback
            if (e.target.checked && window.gsap) {
                gsap.to(e.target.closest(".bg-white, .dark\\:bg-slate-900"), { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 });
            }
        });
    });

    if (userNameInput) {
        userNameInput.addEventListener("input", (e) => {
            localStorage.setItem("userName", e.target.value);
        });
    }

    loadState();
});
