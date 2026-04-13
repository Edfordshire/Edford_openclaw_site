// blog.js — loads posts from JSON, renders listing and single post views

const POST_IDS = ['post1', 'post2'];

async function fetchPost(id) {
  const res = await fetch(`posts/${id}.json`);
  if (!res.ok) throw new Error(`Post not found: ${id}`);
  return res.json();
}

async function renderListing() {
  const container = document.getElementById('post-list');
  if (!container) return;

  for (const id of POST_IDS) {
    try {
      const post = await fetchPost(id);
      const article = document.createElement('article');
      article.className = 'post-card';
      article.innerHTML = `
        <a href="post.html?id=${post.id}" class="post-link">
          <h2 class="post-title">${post.title}</h2>
          <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
          <p class="post-excerpt">${post.excerpt}</p>
          <span class="read-more">read more →</span>
        </a>
      `;
      container.appendChild(article);
    } catch (e) {
      console.warn(e);
    }
  }
}

async function renderPost() {
  const container = document.getElementById('post-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="error">No post specified.</p>';
    return;
  }

  try {
    const post = await fetchPost(id);
    document.title = `${post.title} — Honda Blog`;

    const paragraphs = post.content
      .split('\n\n')
      .map(p => `<p>${p.trim()}</p>`)
      .join('');

    container.innerHTML = `
      <header class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
      </header>
      <div class="post-body">
        ${paragraphs}
      </div>
      <footer class="post-footer">
        <a href="index.html" class="back-link">← back to posts</a>
      </footer>
    `;
  } catch (e) {
    container.innerHTML = '<p class="error">Post not found.</p>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Run on load
if (document.getElementById('post-list')) renderListing();
if (document.getElementById('post-content')) renderPost();
