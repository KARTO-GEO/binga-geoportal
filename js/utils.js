/* ═══════════════════════════════════════════════════
   utils.js — Utility Functions
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ── Toast Notifications ──
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons  = { success: 'fa-check-circle',       error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const colors = { success: 'var(--success)',         error: 'var(--danger)',         info: 'var(--info)' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1.1rem"></i>
    <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


// ── Modal Helpers ──
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}


// ── File Download Helper ──
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ── Sidebar Toggle ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  // Let the map recalculate its size after the CSS transition
  setTimeout(() => map.invalidateSize(), 350);
}


// ── Tab Switching ──
function switchTab(btn, panelId) {
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  ['dashboard-panel', 'layers-panel', 'filter-panel', 'data-panel', 'tools-panel'].forEach(id => {
    document.getElementById(id).style.display = (id === panelId) ? 'block' : 'none';
  });
}
