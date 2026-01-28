---
layout: default
title: Home
---

<div class="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
  <div class="col-lg-6 px-0">
    <h1 class="display-4 fst-italic">Title of a longer featured blog post</h1>
    <p class="lead my-3">
      Multiple lines of text that form the lede.
    </p>
  </div>
</div>

<div class="row mb-2">
  {% for post in site.posts limit:2 %}
  <div class="col-md-6">
    <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div class="col p-4 d-flex flex-column position-static">
        <h3 class="mb-0">{{ post.title }}</h3>
        <div class="mb-1 text-body-secondary">{{ post.date | date: "%b %d" }}</div>
        <p class="card-text mb-auto">{{ post.excerpt }}</p>
        <a href="{{ post.url }}" class="stretched-link">Continue reading</a>
      </div>
    </div>
  </div>
  {% endfor %}
</div>
