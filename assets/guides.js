/**
 * ProfLambda - Guides Dashboard JS
 * Focus: Security (CSP compliance), Zero Inline
 */

document.addEventListener("DOMContentLoaded", () => {
    const storageKeys = {
        excel: "excelMasteryProgress",
        word: "wordMasteryProgress",
        powerpoint: "powerpointMasteryProgress",
    };

    const countAcquiredSkills = (storageKey) => {
        const rawData = localStorage.getItem(storageKey);
        try {
            const data = JSON.parse(rawData) || {};
            return Object.values(data).filter(Boolean).length;
        } catch(e) {
            return 0;
        }
    };

    const updateProgressCircle = (circleId, percentage) => {
        const circle = document.getElementById(circleId);
        if (!circle) return;
        const circumference = 175.93;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    };

    const updateCard = (prefix, count, total = 20) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        const countEl = document.getElementById(`${prefix}-count`);
        const textEl = document.getElementById(`${prefix}-progress-text`);
        const barEl = document.getElementById(`${prefix}-progress-bar`);

        if (countEl) countEl.textContent = `${count}/${total}`;
        if (textEl) textEl.textContent = `${percentage}%`;
        if (barEl) barEl.style.width = `${percentage}%`;

        updateProgressCircle(`${prefix}-progress-circle`, percentage);
    };

    const updateAllData = () => {
        const excelProgress = countAcquiredSkills(storageKeys.excel);
        const wordProgress = countAcquiredSkills(storageKeys.word);
        const powerpointProgress = countAcquiredSkills(storageKeys.powerpoint);

        const totalAcquired = excelProgress + wordProgress + powerpointProgress;
        const totalSkills = 60;
        const globalProgressPercent = totalSkills > 0 ? Math.round((totalAcquired / totalSkills) * 100) : 0;

        const acquiredEl = document.getElementById("acquired-skills");
        const globalEl = document.getElementById("global-progress");

        if (acquiredEl) acquiredEl.textContent = totalAcquired;
        if (globalEl) globalEl.textContent = `${globalProgressPercent}%`;

        updateCard("excel", excelProgress);
        updateCard("word", wordProgress);
        updateCard("powerpoint", powerpointProgress);
    };

    updateAllData();

    // GSAP Staggered Entrance
    if (window.gsap) {
        gsap.from(".animate-entrance", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    window.addEventListener("storage", (e) => {
        if (Object.values(storageKeys).includes(e.key)) {
            updateAllData();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            updateAllData();
        }
    });
});
