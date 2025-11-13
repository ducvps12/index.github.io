/* ===== Utility Functions ===== */

// DOM Selectors
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// LocalStorage Helper
const LS = (k, v) =>
  v === undefined
    ? JSON.parse(localStorage.getItem(k) || 'null')
    : (localStorage.setItem(k, JSON.stringify(v)), v);

// Format number to 2 digits
function fmt2(n) {
  return String(n).padStart(2, '0');
}

// Toast Notification
function toast(msg, duration = 1700) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.add('show');
  });
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, duration);
}

// Request Notification Permission
function requestNotif() {
  if (!('Notification' in window))
    return toast('Trình duyệt không hỗ trợ Notification');
  Notification.requestPermission().then((p) =>
    toast(p === 'granted' ? 'Đã bật thông báo' : 'Không cấp quyền')
  );
}

// Send Notification
function notify(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: 'https://i.imgur.com/GCITCIv.png' });
  }
}

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Format Date
function formatDate(date) {
  const d = new Date(date);
  return `${fmt2(d.getDate())}/${fmt2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Format Time
function formatTime(date) {
  const d = new Date(date);
  return `${fmt2(d.getHours())}:${fmt2(d.getMinutes())}`;
}

// Copy to Clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

// Download File
function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Escape HTML
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Validate URL
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Validate Email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Get Time Ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm trước';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';
  return Math.floor(seconds) + ' giây trước';
}

// Export utilities
window.Utils = {
  $,
  $$,
  LS,
  fmt2,
  toast,
  requestNotif,
  notify,
  debounce,
  generateUUID,
  formatDate,
  formatTime,
  copyToClipboard,
  downloadFile,
  escapeHTML,
  isValidURL,
  isValidEmail,
  timeAgo,
};
