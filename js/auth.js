/* ═══════════════════════════════════════════════════
   auth.js — Authentication (placeholder)
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  const user = CREDENTIALS.find(c => c.email === email && c.password === pass);

  if (!user) {
    errEl.textContent = 'Invalid credentials. Please use a valid @binga.ac.zw email.';
    errEl.style.display = 'block';
    return;
  }

  // Show portal immediately so the map div exists before initMap() runs
  document.getElementById('user-display').textContent = user.name;
  document.getElementById('login-page').style.display  = 'none';
  document.getElementById('portal-page').style.display = 'flex';
  document.getElementById('portal-page').style.flexDirection = 'column';

  // initMap() is async — await it so errors surface properly
  try {
    await initMap();
    showToast('Welcome, ' + user.name + '!', 'success');
  } catch (err) {
    console.error('[Binga Geoportal] initMap failed:', err);
    showToast('Map failed to load. Please refresh.', 'error');
  }
}

function handleLogout() {
  document.getElementById('portal-page').style.display = 'none';
  document.getElementById('login-page').style.display  = 'flex';
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
}

// Allow Enter key to submit login form
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-page').style.display !== 'none') {
    handleLogin();
  }
});
