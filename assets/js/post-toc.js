document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("post-content");
    const toc = document.getElementById("post-toc");
    const tocWrap = document.getElementById("post-toc-wrap");

    if (!content || !toc || !tocWrap) return;

    const headings = Array.from(content.querySelectorAll("h2, h3"));

    if (!headings.length) {
        tocWrap.style.display = "none";
        return;
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    const usedIds = new Set();

    headings.forEach((heading) => {
        if (!heading.id) {
            let base = slugify(heading.textContent);
            let candidate = base;
            let i = 2;

            while (usedIds.has(candidate) || document.getElementById(candidate)) {
                candidate = `${base}-${i}`;
                i += 1;
            }

            heading.id = candidate;
            usedIds.add(candidate);
        } else {
            usedIds.add(heading.id);
        }

        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = `toc-level-${heading.tagName.toLowerCase().replace("h", "")}`;
        toc.appendChild(link);
    });
});