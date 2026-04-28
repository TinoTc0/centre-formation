/* =========================================================
   app.js — Utilitaires partagés & couche API
   ========================================================= */

// ── Configuration ──────────────────────────────────────────
const API_BASE = 'https://centre-formation.onrender.com/api'; // ← Adaptez votre URL backend

// ── Gestion du token JWT ────────────────────────────────────

/** Lit le token stocké */
function getToken() {
  return localStorage.getItem('jwt_token');
}

/** Enregistre le token + les infos utilisateur */
function saveAuth(token, user) {
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('user_info', JSON.stringify(user));
}

/** Supprime l'authentification (déconnexion) */
function clearAuth() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
}

/** Retourne les infos de l'utilisateur connecté */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user_info')) || {};
  } catch { return {}; }
}

/** Vérifie si l'utilisateur est authentifié */
function isAuthenticated() {
  return !!getToken();
}

// ── Garde de route ──────────────────────────────────────────

/**
 * Redirige vers login si pas de token.
 * À appeler en haut de chaque page protégée.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/**
 * Redirige vers dashboard si déjà connecté.
 * À appeler sur login.html et register.html.
 */
function redirectIfAuthed() {
  if (isAuthenticated()) {
    window.location.href = 'dashboard.html';
  }
}

// ── Couche API (fetch avec token) ───────────────────────────

/**
 * Wrapper fetch qui injecte automatiquement le header Authorization.
 * @param {string} path  - chemin relatif ex: /students
 * @param {object} opts  - options fetch standard (method, body, etc.)
 * @returns {Promise<{ok, status, data}>}
 */
async function apiFetch(path, opts = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
    });

    // Déconnexion automatique si le token est expiré
    if (res.status === 401) {
      clearAuth();
      window.location.href = 'login.html';
      return;
    }

    let data;
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('[apiFetch] Erreur réseau:', err);
    return { ok: false, status: 0, data: { message: 'Erreur réseau — vérifiez votre connexion.' } };
  }
}

// ── Affichage des alertes HTML ──────────────────────────────

/**
 * Affiche un message dans un élément .alert.
 * @param {string} elId   - id de l'élément alert
 * @param {string} msg    - texte du message
 * @param {'error'|'success'|'info'} type
 */
function showAlert(elId, msg, type = 'error') {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = `<span>${type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ'}</span> ${msg}`;
  // Masque automatiquement après 5 s
  setTimeout(() => { el.classList.remove('show'); }, 5000);
}

/** Masque une alerte */
function hideAlert(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.remove('show');
}

// ── Aide UI : chargement ────────────────────────────────────

/**
 * Remplace le contenu d'un conteneur par un spinner de chargement.
 */
function showLoading(containerId, msg = 'Chargement…') {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = `
      <div class="loading-overlay">
        <div class="spinner"></div>
        <span>${msg}</span>
      </div>`;
  }
}

/** Affiche un état vide */
function showEmpty(containerId, msg = 'Aucune donnée disponible.') {
  const el = document.getElementById(containerId);
  if (el) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <p>${msg}</p>
      </div>`;
  }
}

// ── Aide UI : modal ─────────────────────────────────────────

/** Ouvre une modale */
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

/** Ferme une modale */
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ── Initialisation sidebar ──────────────────────────────────

/**
 * Peuple la sidebar avec les infos utilisateur connecté.
 * À appeler sur chaque page protégée.
 */
function initSidebar() {
  const user = getUser();
  const nameEl = document.getElementById('sidebar-username');
  const roleEl = document.getElementById('sidebar-role');
  const avatarEl = document.getElementById('sidebar-avatar');

  if (nameEl) nameEl.textContent = user.name || user.email || 'Utilisateur';
  if (roleEl) roleEl.textContent = user.role || 'Administrateur';
  if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

  // Bouton déconnexion
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    clearAuth();
    window.location.href = 'login.html';
  });

  // Lien actif dans la nav
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
}

// ── Export implicite (tout dans le scope global) ────────────
// Toutes les fonctions sont disponibles globalement dans chaque page HTML.
