const postsSearch = document.getElementById("posts-search");
const emptyState = document.getElementById("posts-empty-state");

if (postsSearch) {
    const cards = Array.from(document.querySelectorAll(".post-card"));
    const sections = Array.from(document.querySelectorAll(".posts-section"));

    function filterPosts() {
        const query = postsSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
            const haystack = (card.dataset.search || "").toLowerCase();
            const matches = !query || haystack.includes(query);

            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        sections.forEach((section) => {
            const visibleCards = section.querySelectorAll(".post-card:not([hidden])");
            section.hidden = visibleCards.length === 0;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    postsSearch.addEventListener("input", filterPosts);
}