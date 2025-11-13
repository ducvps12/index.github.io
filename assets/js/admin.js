/* ===== Admin Panel Management ===== */

class AdminPanel {
  constructor() {
    this.linksData = LS('mtd_links_data') || [];
    this.profileData = LS('mtd_profile') || this.getDefaultProfile();
    this.themeData = LS('mtd_theme') || 'default';
    this.draggedIndex = null;
    this.init();
  }

  getDefaultProfile() {
    return {
      name: 'MTD VPS',
      desc: 'Cloud VPS • Proxy • Hosting • Tools',
      avatar: 'https://i.imgur.com/GCITCIv.png',
      email: 'support@mtdvps.com',
      facebook: 'https://www.facebook.com/ducvps123/?locale=vi_VN',
      youtube: 'https://www.youtube.com/@ducvps1com',
      tiktok: 'https://www.tiktok.com/@ducvps001',
    };
  }

  init() {
    this.applyTheme();
    this.renderProfile();
    if (this.linksData.length > 0) this.renderPublicLinks();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Color picker
    $$('.color-option').forEach((el) =>
      el.addEventListener('click', () => {
        $$('.color-option').forEach((e) => e.classList.remove('selected'));
        el.classList.add('selected');
      })
    );
  }

  toggle() {
    $('#adminPanel').classList.toggle('active');
    if ($('#adminPanel').classList.contains('active')) {
      this.loadAdminData();
    }
  }

  switchTab(tab) {
    $$('.admin-tab').forEach((t) => t.classList.remove('active'));
    $$('.admin-section').forEach((s) => s.classList.remove('active'));
    event.target.classList.add('active');
    $(`#section-${tab}`).classList.add('active');
  }

  loadAdminData() {
    this.renderLinksList();
    this.loadProfileForm();
    this.loadThemeSelection();
  }

  // ===== Links Management =====
  renderLinksList() {
    const wrap = $('#linksList');
    if (!wrap) return;

    if (this.linksData.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-link"></i>
          <p>Chưa có link nào. Thêm link đầu tiên!</p>
        </div>
      `;
      return;
    }

    wrap.innerHTML = '';
    this.linksData.forEach((link, i) => {
      const div = document.createElement('div');
      div.className = 'link-item';
      div.draggable = true;
      div.dataset.index = i;
      div.innerHTML = `
        <div class="drag-handle">☰</div>
        <div class="info">
          <b>${escapeHTML(link.title)}</b>
          <small>${escapeHTML(link.url)}</small>
        </div>
        <div class="actions">
          <button class="btn-edit" onclick="admin.editLink(${i})">✏️ Sửa</button>
          <button class="btn-delete" onclick="admin.deleteLink(${i})">🗑️ Xóa</button>
        </div>
      `;

      // Drag events
      div.addEventListener('dragstart', (e) => this.handleDragStart(e));
      div.addEventListener('dragover', (e) => this.handleDragOver(e));
      div.addEventListener('drop', (e) => this.handleDrop(e));
      div.addEventListener('dragend', (e) => this.handleDragEnd(e));

      wrap.appendChild(div);
    });
  }

  handleDragStart(e) {
    this.draggedIndex = parseInt(e.currentTarget.dataset.index);
    e.currentTarget.classList.add('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    const dropIndex = parseInt(e.currentTarget.dataset.index);
    if (this.draggedIndex !== dropIndex) {
      const item = this.linksData.splice(this.draggedIndex, 1)[0];
      this.linksData.splice(dropIndex, 0, item);
      LS('mtd_links_data', this.linksData);
      this.renderLinksList();
      this.renderPublicLinks();
      toast('Đã thay đổi thứ tự');
    }
  }

  handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
  }

  showAddLink() {
    $('#linkForm').style.display = 'block';
    $('#formTitle').textContent = 'Thêm Link Mới';
    $('#editIndex').value = '';
    $('#linkTitle').value = '';
    $('#linkDesc').value = '';
    $('#linkUrl').value = '';
    $('#linkIcon').value = 'fas fa-link';
    $('#linkBadge').value = '';
    $('#linkTitle').focus();
  }

  cancelLinkForm() {
    $('#linkForm').style.display = 'none';
  }

  editLink(i) {
    const link = this.linksData[i];
    $('#linkForm').style.display = 'block';
    $('#formTitle').textContent = 'Chỉnh sửa Link';
    $('#editIndex').value = i;
    $('#linkTitle').value = link.title;
    $('#linkDesc').value = link.desc;
    $('#linkUrl').value = link.url;
    $('#linkIcon').value = link.icon;
    $('#linkBadge').value = link.badge || '';
    $('#linkTitle').focus();
  }

  deleteLink(i) {
    if (confirm('Xóa link này?')) {
      this.linksData.splice(i, 1);
      LS('mtd_links_data', this.linksData);
      this.renderLinksList();
      this.renderPublicLinks();
      toast('Đã xóa link');
    }
  }

  saveLink() {
    const title = $('#linkTitle').value.trim();
    const desc = $('#linkDesc').value.trim();
    const url = $('#linkUrl').value.trim();
    const icon = $('#linkIcon').value.trim();
    const badge = $('#linkBadge').value.trim();
    const idx = $('#editIndex').value;

    if (!title || !url) {
      toast('Nhập tiêu đề và URL');
      return;
    }

    if (!isValidURL(url)) {
      toast('URL không hợp lệ');
      return;
    }

    const link = {
      title,
      desc,
      url,
      icon: icon || 'fas fa-link',
      badge,
      id: generateUUID(),
    };

    if (idx === '') {
      this.linksData.push(link);
      toast('Đã thêm link mới');
    } else {
      this.linksData[parseInt(idx)] = { ...this.linksData[parseInt(idx)], ...link };
      toast('Đã cập nhật link');
    }

    LS('mtd_links_data', this.linksData);
    this.renderLinksList();
    this.renderPublicLinks();
    this.cancelLinkForm();
  }

  // ===== Profile Management =====
  loadProfileForm() {
    $('#profileName').value = this.profileData.name || '';
    $('#profileDesc').value = this.profileData.desc || '';
    $('#profileAvatar').value = this.profileData.avatar || '';
    $('#profileEmail').value = this.profileData.email || '';
    $('#profileFacebook').value = this.profileData.facebook || '';
    $('#profileYoutube').value = this.profileData.youtube || '';
    $('#profileTiktok').value = this.profileData.tiktok || '';
  }

  saveProfile() {
    this.profileData = {
      name: $('#profileName').value.trim(),
      desc: $('#profileDesc').value.trim(),
      avatar: $('#profileAvatar').value.trim(),
      email: $('#profileEmail').value.trim(),
      facebook: $('#profileFacebook').value.trim(),
      youtube: $('#profileYoutube').value.trim(),
      tiktok: $('#profileTiktok').value.trim(),
    };

    // Validate
    if (this.profileData.email && !isValidEmail(this.profileData.email)) {
      toast('Email không hợp lệ');
      return;
    }

    LS('mtd_profile', this.profileData);
    this.renderProfile();
    toast('Đã lưu hồ sơ');
  }

  renderProfile() {
    $('.title').textContent = this.profileData.name || 'MTD VPS';
    $('.subtitle').textContent = this.profileData.desc || '';

    if (this.profileData.avatar) {
      $('.avatar').style.backgroundImage = `url(${this.profileData.avatar})`;
    }

    const socials = $('.social-links');
    socials.innerHTML = '';

    const socialLinks = [
      { url: this.profileData.email, icon: 'fas fa-envelope', title: 'Email', prefix: 'mailto:' },
      { url: this.profileData.tiktok, icon: 'fab fa-tiktok', title: 'TikTok' },
      { url: this.profileData.youtube, icon: 'fab fa-youtube', title: 'YouTube' },
      { url: this.profileData.facebook, icon: 'fab fa-facebook', title: 'Facebook' },
    ];

    socialLinks.forEach((social) => {
      if (social.url) {
        const a = document.createElement('a');
        a.href = social.prefix ? social.prefix + social.url : social.url;
        a.title = social.title;
        a.innerHTML = `<i class="${social.icon}"></i>`;
        if (!social.prefix) a.target = '_blank';
        socials.appendChild(a);
      }
    });
  }

  // ===== Theme Management =====
  loadThemeSelection() {
    $$('.color-option').forEach((el) => {
      el.classList.remove('selected');
      if (el.dataset.theme === this.themeData) el.classList.add('selected');
    });
  }

  saveTheme() {
    const selected = $('.color-option.selected');
    if (selected) {
      this.themeData = selected.dataset.theme;
      LS('mtd_theme', this.themeData);
      this.applyTheme();
      toast('Đã lưu giao diện');
    }
  }

  applyTheme() {
    const themes = {
      default: { bg1: '#ee7752', bg2: '#e73c7e', bg3: '#23a6d5', bg4: '#23d5ab' },
      purple: { bg1: '#667eea', bg2: '#764ba2', bg3: '#f093fb', bg4: '#4facfe' },
      sunset: { bg1: '#fa709a', bg2: '#fee140', bg3: '#30cfd0', bg4: '#330867' },
      dark: { bg1: '#0f2027', bg2: '#203a43', bg3: '#2c5364', bg4: '#0f2027' },
      nature: { bg1: '#56ab2f', bg2: '#a8e063', bg3: '#56ccf2', bg4: '#2f80ed' },
    };

    const t = themes[this.themeData] || themes.default;
    document.documentElement.style.setProperty('--bg1', t.bg1);
    document.documentElement.style.setProperty('--bg2', t.bg2);
    document.documentElement.style.setProperty('--bg3', t.bg3);
    document.documentElement.style.setProperty('--bg4', t.bg4);
  }

  // ===== Public Links Rendering =====
  renderPublicLinks() {
    const wrap = $('#linksWrap');
    if (!wrap) return;

    // Keep existing links if no custom data
    if (this.linksData.length === 0) return;

    wrap.innerHTML = '';
    this.linksData.forEach((link, i) => {
      const a = document.createElement('a');
      a.className = 'link';
      a.href = link.url;
      a.dataset.id = link.id || `link-${i}`;
      a.dataset.url = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.onclick = (e) => {
        e.preventDefault();
        window.linkTracker.track(link.id || `link-${i}`);
        window.open(link.url, '_blank');
      };

      a.innerHTML = `
        <div class="icon"><i class="${link.icon}"></i></div>
        <div class="txt">
          <div class="h">${escapeHTML(link.title)}</div>
          <div class="s">${escapeHTML(link.desc)}</div>
        </div>
        ${link.badge ? `<span class="chip">${escapeHTML(link.badge)}</span>` : ''}
        <div class="tools">
          <div class="tool-btn" onclick="event.preventDefault(); event.stopPropagation(); window.qrManager.open('${link.url}')">
            <i class="fas fa-qrcode"></i>
          </div>
          <div class="tool-btn" onclick="event.preventDefault(); event.stopPropagation(); window.linkTracker.copy('${link.url}')">
            <i class="fas fa-link"></i>
          </div>
        </div>
      `;

      wrap.appendChild(a);
    });

    // Update stats table
    if (window.linkTracker) {
      window.linkTracker.renderStats();
    }
  }
}

// Initialize Admin Panel
window.admin = new AdminPanel();

// Global functions for onclick handlers
function toggleAdmin() {
  window.admin.toggle();
}

function switchTab(tab) {
  window.admin.switchTab(tab);
}

function showAddLink() {
  window.admin.showAddLink();
}

function cancelLinkForm() {
  window.admin.cancelLinkForm();
}

function saveLink() {
  window.admin.saveLink();
}

function saveProfile() {
  window.admin.saveProfile();
}

function saveTheme() {
  window.admin.saveTheme();
}
