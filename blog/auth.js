// auth.js — client-side password gate
// NOTE: This is security-by-obscurity, not true encryption.
// Keeps casual visitors out. Not suitable for truly sensitive data.

(function () {
  const HASH = '0b4ad32f0b0154cee2e4f34132cb3f0174fec6d025c076df2cb454fe65531c77';
  const SESSION_KEY = 'diary_auth';

  function hashPassword(pw) {
    // Simple hash using SubtleCrypto
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
  }

  function isAuthed() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }

  function showGate() {
    document.body.innerHTML = `
      <div id="gate">
        <div id="gate-box">
          <p id="gate-label">—</p>
          <input type="password" id="gate-input" placeholder="password" autocomplete="current-password" />
          <button id="gate-btn">enter</button>
          <p id="gate-error"></p>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      body { margin: 0; background: #f5f0e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Courier New', monospace; }
      #gate { width: 100%; display: flex; align-items: center; justify-content: center; }
      #gate-box { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem; }
      #gate-label { font-size: 1.4rem; letter-spacing: 0.1em; color: #1a1a18; margin: 0; }
      #gate-input { border: 2px solid #1a1a18; background: #fdfaf4; padding: 0.6rem 1rem; font-family: 'Courier New', monospace; font-size: 1rem; width: 220px; text-align: center; outline: none; box-shadow: 3px 3px 0 #1a1a18; }
      #gate-btn { border: 2px solid #1a1a18; background: #1a1a18; color: #f5f0e8; padding: 0.5rem 1.4rem; font-family: 'Courier New', monospace; font-size: 0.85rem; cursor: pointer; letter-spacing: 0.08em; box-shadow: 3px 3px 0 #c94a2a; }
      #gate-btn:hover { background: #c94a2a; }
      #gate-error { color: #c94a2a; font-size: 0.8rem; min-height: 1rem; margin: 0; }
    `;
    document.head.appendChild(style);

    const input = document.getElementById('gate-input');
    const btn = document.getElementById('gate-btn');
    const err = document.getElementById('gate-error');

    async function attempt() {
      const pw = input.value;
      if (!pw) return;
      const hash = await hashPassword(pw);
      if (hash === HASH) {
        sessionStorage.setItem(SESSION_KEY, '1');
        location.reload();
      } else {
        err.textContent = 'wrong password';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
    input.focus();
  }

  // Check auth state before page renders
  if (!isAuthed()) {
    document.addEventListener('DOMContentLoaded', showGate);
    // Also intercept if DOM already loaded
    if (document.readyState !== 'loading') showGate();
  }
})();
