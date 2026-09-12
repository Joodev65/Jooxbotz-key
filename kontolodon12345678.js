const jembod = "https://tg.joomods.web.id/tg";
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{5,32}$/;

const searchForm = document.getElementById("searchForm");
const searchControl = document.getElementById("searchControl");
const usernameInput = document.getElementById("usernameInput");
const searchButton = document.getElementById("searchButton");
const buttonLabel = searchButton.querySelector(".button-label");
const resultsContent = document.getElementById("resultsContent");
const apiStatus = document.getElementById("apiStatus");
const apiStatusText = document.getElementById("apiStatusText");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const ICONS = {
  search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  fingerprint: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"></path><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path><path d="M8.65 22c.21-.66.45-1.32.57-2"></path><path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path><path d="M2 16h.01"></path><path d="M21.8 16c.2-2 .131-5.354 0-6"></path><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"></path></svg>',
  alert: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  x: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  copy: '<svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
  chevron: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  atSign: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path></svg>',
  fallbackAvatar: '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  fingerprintSm: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"></path><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path><path d="M8.65 22c.21-.66.45-1.32.57-2"></path><path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path><path d="M2 16h.01"></path><path d="M21.8 16c.2-2 .131-5.354 0-6"></path><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"></path></svg>',
  hash: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>',
  server: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  activity: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
  refresh: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
  shield: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  database: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
};

const state = {
  loading: false,
  currentUsername: null,
  lastResult: null,
};

async function lookupTelegram(username) {
  const response = await fetch(
    `${jembod}?usn=${encodeURIComponent(username)}`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || data.status === false) {
    const message =
      (data && data.message) ||
      (response.status === 404
        ? "Telegram username not found"
        : response.status >= 500
          ? "Unable to retrieve profile information"
          : "Unable to retrieve profile");
    throw new Error(message);
  }

  return data;
}

async function checkApiStatus() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    await fetch(jembod, { signal: controller.signal });
    setApiStatus(true);
  } catch {
    setApiStatus(false);
  } finally {
    clearTimeout(timeout);
  }
}

function setApiStatus(online) {
  apiStatus.classList.toggle("is-online", online);
  apiStatus.classList.toggle("is-offline", !online);
  apiStatusText.textContent = online ? "API Online" : "API Offline";
}

function setLoading(isLoading) {
  state.loading = isLoading;
  searchButton.disabled = isLoading;
  searchButton.classList.toggle("is-loading", isLoading);
  buttonLabel.textContent = isLoading ? "Searching..." : "Search";
}

function normalizeUsername(raw) {
  return raw
    .trim()
    .replace(/^https?:\/\/(www\.)?t\.me\//i, "")
    .replace(/^@/, "")
    .trim();
}

function setSearchError(active) {
  searchControl.classList.toggle("is-error", active);
}

function renderEmpty() {
  resultsContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${ICONS.fingerprint}</div>
      <p class="empty-title">Search a Telegram username</p>
      <p class="empty-sub">Enter a username above to inspect the available profile data.</p>
    </div>
  `;
}

function renderSkeleton() {
  resultsContent.innerHTML = `
    <div class="skeleton-wrap">
      <div class="skeleton-panel">
        <div class="sk sk-avatar"></div>
        <div class="sk sk-line sk-w60"></div>
        <div class="sk sk-line sk-w40"></div>
      </div>
      <div class="skeleton-panel">
        <div class="sk sk-line sk-w40"></div>
        <div class="sk sk-line sk-w80"></div>
        <div class="sk sk-line sk-w60"></div>
        <div class="sk sk-line sk-w80"></div>
        <div class="sk sk-line sk-w40"></div>
      </div>
    </div>
  `;
}

function renderError(message) {
  resultsContent.innerHTML = `
    <div class="alert alert-error" role="alert">
      ${ICONS.alert}
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFullName(data) {
  const parts = [
    data.telegram && data.telegram.firstName,
    data.telegram && data.telegram.lastName,
  ].filter(Boolean);
  return parts.join(" ");
}

function copyButton(value, label) {
  return `
    <button type="button" class="copy-btn" data-copy="${escapeHtml(value)}" aria-label="Copy ${escapeHtml(label)}">
      ${ICONS.copy}<span class="copy-label">Copied</span>
    </button>
  `;
}

function buildAvatar(data, fullName) {
  const url = data.profile && data.profile.url;
  const alt = fullName
    ? `Profile photo of ${fullName}`
    : `Profile photo of ${data.username}`;

  if (url) {
    return `
      <button type="button" class="avatar-button" data-full="${escapeHtml(url)}" aria-label="View full profile photo">
        <img class="avatar" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" width="112" height="112">
      </button>
    `;
  }

  return `
    <div class="avatar avatar-fallback" role="img" aria-label="No profile photo available">
      ${ICONS.fallbackAvatar}
    </div>
  `;
}

function indicatorRow(label, value, kind) {
  const icon = value ? ICONS.check : ICONS.x;
  const text = value ? "Yes" : "No";
  const valueClass =
    kind === "risk" ? (value ? "is-danger" : "is-negative")
    : value ? "is-positive" : "is-negative";

  return `
    <div class="indicator-row">
      <span class="indicator-label">${label}</span>
      <span class="indicator-value ${valueClass}">${icon}<span>${text}</span></span>
    </div>
  `;
}

function buildStatusIndicators(data) {
  const rows = [
    indicatorRow("Premium", data.data.premium, "positive"),
    indicatorRow("Profile Photo", data.data.photos, "positive"),
    indicatorRow("Scam Label", data.data.scam, "risk"),
    indicatorRow("Fake Label", data.data.fake, "risk"),
    indicatorRow("Paid Message", data.data.paidMessage, "neutral"),
  ].join("");

  return `
    <section class="panel" aria-label="Account indicators">
      <h3 class="panel-title">${ICONS.shield} Indicators</h3>
      <div class="indicator-list">${rows}</div>
    </section>
  `;
}

function infoItem(icon, label, value, copyable) {
  const safeValue = value === null || value === undefined || value === "" ? "—" : String(value);
  const copy = copyable && safeValue !== "—" ? copyButton(safeValue, label) : "";
  return `
    <div class="info-item">
      <span class="info-icon">${icon}</span>
      <div class="info-body">
        <div class="info-label">${label}</div>
        <div class="info-value">
          <span class="info-value-text">${escapeHtml(safeValue)}</span>
          ${copy}
        </div>
      </div>
    </div>
  `;
}

function buildInfoGrid(data) {
  const d = data.data;
  const items = [
    infoItem(ICONS.fingerprintSm, "Telegram ID", d.id, true),
    infoItem(ICONS.hash, "ID Digits", d.digits, false),
    infoItem(ICONS.server, "Data Center", d.dc, false),
    infoItem(ICONS.calendar, "Created", d.created, false),
    infoItem(ICONS.clock, "Account Age", d.accountAge, false),
    infoItem(ICONS.activity, "Status", d.status, false),
    infoItem(ICONS.refresh, "Last Checked", d.date, false),
    infoItem(ICONS.atSign, "Username", d.username, true),
  ].join("");

  return `
    <section class="panel" aria-label="Account information">
      <h3 class="panel-title">${ICONS.database} Account Information</h3>
      <div class="info-grid">${items}</div>
    </section>
  `;
}

function buildProfileCard(data) {
  const fullName = buildFullName(data);
  const d = data.data;

  const metaChips = [
    `<span class="meta-chip">${ICONS.fingerprintSm}<span>ID ${escapeHtml(d.id)}</span></span>`,
    `<span class="meta-chip">${ICONS.server}<span>DC ${escapeHtml(d.dc)}</span></span>`,
    `<span class="meta-chip">${ICONS.clock}<span>${escapeHtml(d.accountAge)}</span></span>`,
  ].join("");

  return `
    <article class="panel profile-card" aria-label="Profile">
      ${buildAvatar(data, fullName)}
      <h2 class="profile-username">
        <span>${escapeHtml(d.username)}</span>
        ${copyButton(d.username, "username")}
      </h2>
      ${fullName ? `<p class="profile-name">${escapeHtml(fullName)}</p>` : ""}
      <div class="profile-meta">${metaChips}</div>
    </article>
  `;
}

function buildRawSection(data) {
  return `
    <div class="raw-toggle">
      <button type="button" class="raw-toggle-btn" id="rawToggle" aria-expanded="false" aria-controls="rawPanel">
        ${ICONS.chevron}<span>View API Response</span>
      </button>
      <div class="raw-panel" id="rawPanel" hidden>
        <div class="raw-header">
          <span>api-response.json</span>
          <button type="button" class="raw-copy" id="rawCopy">
            ${ICONS.copy}<span class="copy-label">Copied</span><span class="raw-copy-text">Copy</span>
          </button>
        </div>
        <pre class="raw-pre">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
      </div>
    </div>
  `;
}

function renderResult(data) {
  state.lastResult = data;
  resultsContent.innerHTML = `
    <div class="result-layout">
      ${buildProfileCard(data)}
      <div class="result-side">
        ${buildStatusIndicators(data)}
        ${buildInfoGrid(data)}
      </div>
    </div>
    ${buildRawSection(data)}
  `;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    textarea.remove();
    return ok;
  }
}

function showCopyFeedback(button) {
  button.classList.add("is-copied");
  const timer = setTimeout(() => button.classList.remove("is-copied"), 1400);
  button.addEventListener("click", () => {
    clearTimeout(timer);
    button.classList.remove("is-copied");
  }, { once: true });
}

let lastFocusedElement = null;

function openLightbox(src, alt) {
  lastFocusedElement = document.activeElement;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "Profile photo";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
  if (lastFocusedElement && lastFocusedElement.focus) {
    lastFocusedElement.focus();
  }
}

function updateUrl(username) {
  const url = new URL(window.location.href);
  url.searchParams.set("username", username);
  history.pushState({ username }, "", url);
}

function getUrlUsername() {
  return new URL(window.location.href).searchParams.get("username");
}

resultsContent.addEventListener("click", async (event) => {
  const copyBtn = event.target.closest(".copy-btn");
  if (copyBtn) {
    await copyText(copyBtn.dataset.copy);
    showCopyFeedback(copyBtn);
    return;
  }

  const avatarBtn = event.target.closest(".avatar-button");
  if (avatarBtn) {
    const img = avatarBtn.querySelector("img");
    openLightbox(avatarBtn.dataset.full, img ? img.alt : "");
    return;
  }

  const rawToggle = event.target.closest("#rawToggle");
  if (rawToggle) {
    const panel = document.getElementById("rawPanel");
    const expanded = rawToggle.getAttribute("aria-expanded") === "true";
    rawToggle.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
    rawToggle.querySelector("svg").style.transform = expanded ? "" : "rotate(180deg)";
    return;
  }

  const rawCopy = event.target.closest("#rawCopy");
  if (rawCopy && state.lastResult) {
    const ok = await copyText(JSON.stringify(state.lastResult, null, 2));
    if (ok) {
      rawCopy.classList.add("is-copied");
      const text = rawCopy.querySelector(".raw-copy-text");
      if (text) text.style.display = "none";
      setTimeout(() => {
        rawCopy.classList.remove("is-copied");
        if (text) text.style.display = "";
      }, 1400);
    }
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.loading) return;

  const username = normalizeUsername(usernameInput.value);

  if (!username) {
    setSearchError(true);
    renderError("Please enter a Telegram username");
    usernameInput.focus();
    return;
  }

  if (!USERNAME_PATTERN.test(username)) {
    setSearchError(true);
    renderError("Please enter a valid Telegram username (5–32 letters, numbers or underscores)");
    usernameInput.focus();
    return;
  }

  setSearchError(false);
  performLookup(username);
});

usernameInput.addEventListener("input", () => {
  if (searchControl.classList.contains("is-error")) setSearchError(false);
});

async function performLookup(username) {
  if (state.loading) return;

  setLoading(true);
  renderSkeleton();
  state.currentUsername = username;

  try {
    const data = await lookupTelegram(username);
    renderResult(data);
    updateUrl(username);
  } catch (error) {
    renderError(
      error.name === "TypeError"
        ? "Unable to connect to the API. Check your network connection."
        : error.message || "Unable to retrieve profile information"
    );
  } finally {
    setLoading(false);
  }
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

window.addEventListener("popstate", () => {
  const username = getUrlUsername();
  if (username) {
    usernameInput.value = username;
    performLookup(normalizeUsername(username));
  } else {
    state.currentUsername = null;
    renderEmpty();
  }
});

function init() {
  renderEmpty();
  checkApiStatus();

  const urlUsername = getUrlUsername();
  if (urlUsername) {
    const clean = normalizeUsername(urlUsername);
    if (clean && USERNAME_PATTERN.test(clean)) {
      usernameInput.value = clean;
      performLookup(clean);
    }
  }
}

init();
