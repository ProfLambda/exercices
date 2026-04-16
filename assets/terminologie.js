/**
 * ProfLambda - Terminologie Médicale
 * Gestion de la recherche et des filtres
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('terms-search');
    const feedback = document.getElementById('search-feedback');
    const tableRows = document.querySelectorAll('tbody tr');
    const abbrevCards = document.querySelectorAll('.lexicon-section .grid > div');
    const lexiconSections = document.querySelectorAll('.lexicon-section');

    // Helper to normalize text (remove accents and special chars)
    const normalize = (str) => {
        if (!str) return "";
        return str.normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .trim();
    };

    function performSearch() {
        const term = normalize(searchInput.value);
        let totalVisible = 0;

        // Filter table rows
        tableRows.forEach(row => {
            const matches = term === '' || normalize(row.textContent).includes(term);
            row.style.display = matches ? '' : 'none';
            if (matches) totalVisible++;
        });

        // Filter abbrev cards (only for the Abbreviation section)
        abbrevCards.forEach(card => {
            const section = card.closest('.lexicon-section');
            const isAbbrevSection = section && section.querySelector('h2')?.textContent.includes('Abréviations');
            
            if (isAbbrevSection) {
                const matches = term === '' || normalize(card.textContent).includes(term);
                card.style.display = matches ? '' : 'none';
                if (matches) totalVisible++;
            }
        });

        // Hide sections with no results
        lexiconSections.forEach(section => {
            if (term === '') {
                section.style.display = '';
                return;
            }

            const hasVisibleInTable = Array.from(section.querySelectorAll('tbody tr')).some(tr => tr.style.display !== 'none');
            const hasVisibleCards = Array.from(section.querySelectorAll('.grid > div')).some(div => 
                div.style.display !== 'none' && section.querySelector('h2')?.textContent.includes('Abréviations')
            );
            
            section.style.display = (hasVisibleInTable || hasVisibleCards) ? '' : 'none';
        });

        // Feedback message
        if (term !== '' && totalVisible === 0) {
            feedback.textContent = `Aucun résultat pour "${searchInput.value}"`;
            feedback.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
        } else {
            feedback.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }

    // ESC key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchInput) {
                searchInput.value = '';
                performSearch();
                searchInput.blur();
            }
        }
    });
});
