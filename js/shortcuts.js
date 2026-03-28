/* ═══════════════════════════════════════════════════
   shortcuts.js — Keyboard Shortcuts & Bookmarks
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // Only when portal is visible and not in an input
  if (document.getElementById('portal-page').style.display === 'none') return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

  switch (e.key.toLowerCase()) {
    case 'b':
      // Toggle sidebar
      toggleSidebar();
      break;
    case 'f':
      // Focus global search
      e.preventDefault();
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) searchInput.focus();
      break;
    case 'h':
      // Zoom to full extent
      zoomToDistrict();
      break;
    case 'm':
      // Cycle basemap
      cycleBasemap();
      break;
    case 'l':
      // Toggle legend
      toggleLegend();
      break;
    case '?':
      // Show shortcuts help
      openModal('shortcuts-modal');
      break;
    case 'escape':
      // Close any open modal
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      break;
  }
});


// ═══════════════════════════════════════════════════
// LEGEND TOGGLE
// ═══════════════════════════════════════════════════
function toggleLegend() {
  const legend = document.getElementById('legend-box');
  if (!legend) return;
  legend.style.display = legend.style.display === 'none' ? 'block' : 'none';
}


// ═══════════════════════════════════════════════════
// MAP BOOKMARKS (save/restore map views)
// ═══════════════════════════════════════════════════
const MAX_BOOKMARKS = 10;

function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('binga_bookmarks') || '[]');
  } catch { return []; }
}

function saveBookmark() {
  const name = prompt('Bookmark name:');
  if (!name) return;

  const center = map.getCenter();
  const zoom   = map.getZoom();
  const bookmarks = getBookmarks();

  if (bookmarks.length >= MAX_BOOKMARKS) {
    bookmarks.shift(); // Remove oldest
  }

  bookmarks.push({
    name,
    lat: center.lat.toFixed(5),
    lng: center.lng.toFixed(5),
    zoom,
    created: new Date().toISOString().split('T')[0]
  });

  localStorage.setItem('binga_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
  showToast(`Bookmark "${name}" saved`, 'success');
}

function loadBookmark(idx) {
  const bookmarks = getBookmarks();
  if (!bookmarks[idx]) return;
  map.setView([parseFloat(bookmarks[idx].lat), parseFloat(bookmarks[idx].lng)], bookmarks[idx].zoom);
  showToast(`Loaded: ${bookmarks[idx].name}`, 'info');
}

function deleteBookmark(idx) {
  const bookmarks = getBookmarks();
  bookmarks.splice(idx, 1);
  localStorage.setItem('binga_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
  showToast('Bookmark deleted', 'info');
}

function renderBookmarks() {
  const container = document.getElementById('bookmarks-list');
  if (!container) return;

  const bookmarks = getBookmarks();
  if (!bookmarks.length) {
    container.innerHTML = '<p style="font-size:0.8rem;color:var(--text-muted)">No saved bookmarks. Click "Save View" to bookmark your current map position.</p>';
    return;
  }

  let html = '';
  bookmarks.forEach((bm, idx) => {
    html += `
      <div class="bookmark-item">
        <div class="bookmark-info" onclick="loadBookmark(${idx})">
          <i class="fas fa-bookmark" style="color:var(--accent)"></i>
          <div>
            <div class="bookmark-name">${bm.name}</div>
            <div class="bookmark-meta">z${bm.zoom} · ${bm.created}</div>
          </div>
        </div>
        <button class="tbl-btn del" onclick="deleteBookmark(${idx})" title="Delete"><i class="fas fa-times"></i></button>
      </div>`;
  });

  container.innerHTML = html;
}
