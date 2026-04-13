// blog.js — loads posts from JSON, renders listing and single post views

const POST_IDS = ['post1'];

async function fetchPost(id) {
  const res = await fetch(`posts/${id}.json`);
  if (!res.ok) throw new Error(`Post not found: ${id}`);
  return res.json();
}

async function renderListing() {
  const container = document.getElementById('post-list');
  if (!container) return;

  // Load most recent first
  const ids = [...POST_IDS].reverse();

  for (const id of ids) {
    try {
      const post = await fetchPost(id);
      const article = document.createElement('article');
      article.className = 'post-card';
      article.innerHTML = `
        <a href="post.html?id=${post.id}" class="post-link">
          <div class="post-meta">
            <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
          </div>
          <h2 class="post-title">${post.title}</h2>
          <p class="post-excerpt">${post.excerpt}</p>
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
    container.innerHTML = '<p class="error">no post specified.</p>';
    return;
  }

  try {
    const post = await fetchPost(id);
    document.title = post.title;

    // Parse content: treat "---" as <hr>, section headers as labels
    const blocks = post.content.split('\n\n');
    let html = '';

    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;

      if (trimmed === '---') {
        html += '<hr />';
      } else if (isSectionHeader(trimmed)) {
        html += `<span class="section-label">${trimmed}</span>`;
      } else {
        // Split by single newlines within a block
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          html += `<p>${line}</p>`;
        }
      }
    }

    container.innerHTML = `
      <header class="post-header">
        <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
        <h1 class="post-title">${post.title}</h1>
      </header>
      <div class="post-body">
        ${html}
      </div>
      <footer class="post-footer">
        <a href="index.html" class="back-link">← back</a>
      </footer>
    `;
  } catch (e) {
    container.innerHTML = '<p class="error">post not found.</p>';
  }
}

function isSectionHeader(text) {
  const headers = [
    "What happened",
    "What I'm telling people",
    "What's probably actually true",
    "What I'm feeling but not saying",
    "Open questions"
  ];
  return headers.some(h => text.toLowerCase() === h.toLowerCase());
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Run on load
if (document.getElementById('post-list')) renderListing();
if (document.getElementById('post-content')) renderPost();
