---
permalink: /posts/
title: Posts
layout: site
use_post_filter: true
---

<div class="posts-panel toon-panel toon-panel--purple toon-panel--content">
  <div class="posts-search-wrap">
    <input
      id="posts-search"
      class="posts-search-input"
      type="text"
      placeholder="Search posts..."
      aria-label="Search posts"
    >
  </div>

  <div class="posts-list" id="posts-list">
    {% for post in site.posts %}
      <article
        class="post-card"
        data-search="{{ post.title | downcase | escape }} {{ post.excerpt | strip_html | strip_newlines | downcase | escape }} {{ post.categories | join: ' ' | downcase | escape }}"
      >
        <h2 class="post-card-title">
          <a class="rainbow-inline-text post-card-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h2>

        <p class="post-meta">
          {{ post.date | date: "%B %-d, %Y" }}
          {% if post.categories and post.categories.size > 0 %}
            &nbsp;•&nbsp;
            {{ post.categories | join: ", " }}
          {% endif %}
        </p>

        {% if post.excerpt %}
          <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
        {% endif %}
      </article>
    {% endfor %}
  </div>

  <p class="posts-empty-state" id="posts-empty-state" hidden>No matching posts found.</p>
</div>