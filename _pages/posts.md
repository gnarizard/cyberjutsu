---
permalink: /posts/
title: Posts
layout: site
---

<div class="posts-panel">
  <div class="posts-list">
    {% for post in site.posts %}
      <article class="post-card">
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
</div>