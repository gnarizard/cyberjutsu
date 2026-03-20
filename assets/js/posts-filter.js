const postsSearch = document.getElementById("posts-search");
const postsList = document.getElementById("posts-list");
const emptyState = document.getElementById("posts-empty-state");

if (postsSearch && postsList) {
    const cards = Array.from(postsList.querySelectorAll(".post-card"));

    function filterPosts() {
        const query = postsSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
            const haystack = (card.dataset.search || "").toLowerCase();
            const matches = !query || haystack.includes(query);

            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    postsSearch.addEventListener("input", filterPosts);
}