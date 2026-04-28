/* ================================================================
   dashboard.js — Shared Logic for Student & Trainer Dashboards
   - JWT management
   - API fetch wrapper with 401/403 handling
   - Navigation (SPA-like sections)
   - UI helpers (alerts, loading, empty states)
   - Sidebar mobile toggle
   ================================================================ */

'use strict';

// ── Config ───────────────────────────────────────────────────
const API_BASE = 'https://centre-formation.onrender.com/api'; // ← Adaptez à votre backend

// ── JWT Helpers ──────────────────────────────────────────────

/** Retourne le token JWT depuis localStorage */
function getToken() {
  return localStorage.getItem('jwt_token');
}

/** Retourne l'objet user stocké */
function getUser() {
  try { return JSON.parse(localStorage.getItem('user_info')) || {}; }
  catch { return {}; }
}

/** Sauvegarde token + user */
function saveAuth(token, user) {
  localStorage.setItem('jwt_token', token);
  localStorage.setItem('user_info', JSON.stringify(user));
}

/** Supprime toutes les données d'auth (logout) */
function clearAuth() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
}

/** Vérifie si un token est présent */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Garde d'authentification.
 * Redirige vers login.html si pas de token.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace('login.html');
  }
}

// ── Redirection par rôle (à appeler après le login) ──────────
/**
 * Redirige selon le rôle de l'utilisateur.
 * @param {string} role - 'admin' | 'formateur' | 'etudiant'
 */
function redirectByRole(role) {
  switch (role) {
    case 'admin':
      window.location.href = 'dashboard.html';
      break;
    case 'formateur':
    case 'trainer':
      window.location.href = 'trainer-dashboard.html';
      break;
    case 'etudiant':
    case 'student':
      window.location.href = 'student-dashboard.html';
      break;
    default:
      window.location.href = 'dashboard.html';
  }
}

// ── API Fetch Wrapper ─────────────────────────────────────────
/**
 * fetch() avec injection automatique du JWT + gestion 401/403.
 * @param {string} path      - ex: '/student/me'
 * @param {object} opts      - options fetch standard
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
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

    // Token expiré ou invalide → logout automatique
    if (res.status === 401 || res.status === 403) {
      clearAuth();
      window.location.replace('login.html');
      return;
    }

    let data;
    const ct = res.headers.get('Content-Type') || '';
    data = ct.includes('application/json') ? await res.json() : await res.text();

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('[apiFetch]', err);
    return { ok: false, status: 0, data: { message: 'Erreur réseau. Vérifiez votre connexion.' } };
  }
}

// ── Logout ───────────────────────────────────────────────────
function logout() {
  clearAuth();
  window.location.replace('login.html');
}

// ── Navigation SPA ───────────────────────────────────────────
/**
 * Gère la navigation entre sections sans rechargement.
 * @param {string} sectionId - id de la section à afficher
 */
function showSection(sectionId) {
  // Masquer toutes les sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Afficher la section cible
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  // Mettre à jour les nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionId);
  });

  // Mettre à jour le titre de la topbar
  const titleEl = document.querySelector('.topbar-title');
  const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (titleEl && activeNav) {
    // Extraire le texte sans l'icône
    const text = activeNav.querySelector('.nav-label-text')?.textContent
               || activeNav.textContent.trim();
    titleEl.textContent = text;
  }

  // Fermer sidebar mobile
  closeMobileSidebar();
}

/** Initialise les nav-items pour la navigation par section */
function initNav() {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', () => showSection(item.dataset.section));
  });
}

// ── Mobile Sidebar ────────────────────────────────────────────
function initMobileSidebar() {
  const toggle  = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay?.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('open');
}

// ── UI Helpers ────────────────────────────────────────────────

/** Affiche une alerte dans un élément */
function showAlert(elId, msg, type = 'error') {
  const el = document.getElementById(elId);
  if (!el) return;
  const icons = { error: '⚠', success: '✓', info: 'ℹ', warn: '⚡' };
  el.className = `alert alert-${type} show`;
  el.innerHTML = `<span>${icons[type] || '⚠'}</span><span>${msg}</span>`;
  if (type === 'success') setTimeout(() => el.classList.remove('show'), 4000);
}

function hideAlert(elId) {
  document.getElementById(elId)?.classList.remove('show');
}

/** Insère un spinner dans un conteneur */
function showLoading(containerId, msg = 'Chargement…') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="loading-row"><div class="spinner"></div><span>${msg}</span></div>`;
}

/** Insère un état vide dans un conteneur */
function showEmpty(containerId, title = 'Aucun résultat', sub = '') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div class="empty-state">
      <div class="es-icon">📭</div>
      <div class="es-title">${title}</div>
      ${sub ? `<div class="es-sub">${sub}</div>` : ''}
    </div>`;
}

/** Met à jour les infos de l'utilisateur dans la sidebar */
function populateSidebarUser(user) {
  const name   = user.name || user.email || 'Utilisateur';
  const role   = user.role || '—';
  const avatar = name.charAt(0).toUpperCase();

  const nameEl   = document.getElementById('sb-name');
  const roleEl   = document.getElementById('sb-role');
  const avatarEl = document.getElementById('sb-avatar');
  const topNameEl = document.getElementById('top-username');

  if (nameEl)    nameEl.textContent   = name;
  if (roleEl)    roleEl.textContent   = role;
  if (avatarEl)  avatarEl.textContent = avatar;
  if (topNameEl) topNameEl.textContent = name;
}

/** Formate une date ISO en français */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

/** Normalise un tableau depuis différents formats de réponse API */
function normalizeArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data))   return data.data;
  if (data && Array.isArray(data.items))  return data.items;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}

// ── Init commun ───────────────────────────────────────────────
/** À appeler dans le <script> de chaque dashboard */
function initDashboard() {
  requireAuth();
  populateSidebarUser(getUser());
  initNav();
  initMobileSidebar();

  // Logout buttons
  document.querySelectorAll('.btn-logout, [data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', logout);
  });
}
