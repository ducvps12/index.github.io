/* ===== Core Functionality ===== */

// Sidebar Toggle
function toggleSidebar() {
  $('#sidebar').classList.toggle('active');
  $('#overlay').classList.toggle('active');
}

// Dark Mode
(function initMode() {
  const saved = LS('mtd_mode') || 'light';
  if (saved === 'dark') {
    document.body.classList.add('dark');
    const modeText = $('#modeText');
    if (modeText) modeText.textContent = 'Light';
  }
})();

function toggleMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  LS('mtd_mode', isDark ? 'dark' : 'light');
  const modeText = $('#modeText');
  if (modeText) modeText.textContent = isDark ? 'Light' : 'Dark';
}

// Back to Top Button
const toTop = $('#toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) toTop.classList.add('show');
    else toTop.classList.remove('show');
  });
}

// Clock
function updateClock() {
  const clockEl = $('#clock');
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = `${fmt2(now.getHours())}:${fmt2(now.getMinutes())}:${fmt2(
    now.getSeconds()
  )}`;
}
setInterval(updateClock, 1000);
updateClock();

// Weather (Open-Meteo API)
async function loadWeather() {
  const weatherMain = $('#weatherMain');
  const weatherSub = $('#weatherSub');
  if (!weatherMain) return;

  let lat = 21.0278,
    lon = 105.8342,
    label = 'Hà Nội';

  // Try to get user location
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 2500 })
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      label = 'Vị trí của bạn';
    } catch (e) {
      // Use default location
    }
  }

  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    );
    const d = await r.json();
    const cw = d.current_weather;

    const weatherMap = {
      0: 'Trời quang',
      1: 'Ít mây',
      2: 'Mây vừa',
      3: 'Nhiều mây',
      45: 'Sương mù',
      51: 'Mưa phùn',
      61: 'Mưa nhẹ',
      63: 'Mưa vừa',
      65: 'Mưa to',
      80: 'Mưa rào',
    };

    weatherMain.textContent = `${Math.round(cw.temperature)}°C • ${
      weatherMap[cw.weathercode] || 'Thời tiết'
    }`;
    if (weatherSub) {
      weatherSub.textContent = `${label} • Gió ${Math.round(cw.windspeed)} km/h`;
    }
  } catch (e) {
    weatherMain.textContent = 'Không tải được thời tiết';
    if (weatherSub) weatherSub.textContent = '';
  }
}
loadWeather();

// Random Quote
const quotes = [
  'Thành công = 1% tài năng + 99% nỗ lực 💪',
  'Muốn đi nhanh hãy đi một mình. Muốn đi xa hãy đi cùng nhau 🚀',
  'Cơ hội không tự đến — hãy tạo ra nó 🔥',
  'Không có thất bại, chỉ có bài học 📘',
  'Kỷ luật là cầu nối giữa mục tiêu và thành tựu.',
  'Hành động là chìa khóa của mọi thành công.',
  'Đừng đợi cơ hội hoàn hảo, hãy tạo ra nó.',
  'Mỗi ngày là một cơ hội mới để trở nên tốt hơn.',
  'Sự kiên trì là bí quyết của mọi chiến thắng.',
  'Hãy bắt đầu từ nơi bạn đang đứng, với những gì bạn có.',
];

const quoteBox = $('#quoteBox');
if (quoteBox) {
  quoteBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// Link Filter
function filterLinks() {
  const searchInput = $('#searchInput');
  if (!searchInput) return;
  const q = searchInput.value.trim().toLowerCase();
  $$('#linksWrap .link').forEach((a) => {
    a.style.display = a.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function resetFilter() {
  const searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.value = '';
    filterLinks();
  }
}

// Link Tracker
class LinkTracker {
  constructor() {
    this.STAT_KEY = 'mtd_click_stats';
    this.stats = LS(this.STAT_KEY) || {};
  }

  track(id) {
    this.stats[id] = (this.stats[id] || 0) + 1;
    LS(this.STAT_KEY, this.stats);
    this.renderStats();
  }

  async copy(url) {
    const success = await copyToClipboard(url);
    toast(success ? 'Đã copy link!' : 'Copy không thành công');
  }

  renderStats() {
    const tbody = $('#statTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const links = $$('#linksWrap .link');

    links.forEach((a) => {
      const id = a.dataset.id;
      const name = a.querySelector('.h')?.textContent || 'Unknown';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHTML(name)}</td><td>${this.stats[id] || 0}</td>`;
      tbody.appendChild(tr);
    });
  }

  reset() {
    if (confirm('Xóa tất cả thống kê?')) {
      this.stats = {};
      LS(this.STAT_KEY, this.stats);
      this.renderStats();
      toast('Đã xóa thống kê');
    }
  }
}

window.linkTracker = new LinkTracker();
window.linkTracker.renderStats();

// QR Code Manager
class QRManager {
  constructor() {
    this.qr = null;
  }

  open(url) {
    const modal = $('#qrModal');
    const qrcode = $('#qrcode');
    const qrUrl = $('#qrUrl');

    if (!modal || !qrcode || !qrUrl) return;

    modal.classList.add('active');
    qrUrl.textContent = url;
    qrcode.innerHTML = '';

    // Wait for QRCode library to load
    if (typeof QRCode !== 'undefined') {
      this.qr = new QRCode(qrcode, {
        text: url,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.M,
      });
    } else {
      qrcode.innerHTML = '<p>Đang tải QR Code...</p>';
    }
  }

  close() {
    const modal = $('#qrModal');
    if (modal) modal.classList.remove('active');
  }
}

window.qrManager = new QRManager();

function closeQR(ev) {
  if (ev.target.id === 'qrModal') {
    window.qrManager.close();
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('MTD Link Bio loaded successfully! 🚀');
});
