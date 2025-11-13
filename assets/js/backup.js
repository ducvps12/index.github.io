/* ===== Backup & Restore Functionality ===== */

class BackupManager {
  constructor() {
    this.setupFileInput();
  }

  setupFileInput() {
    const fileInput = $('#importFile');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.import(e));
    }
  }

  export() {
    const payload = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        mode: LS('mtd_mode') || 'light',
        theme: LS('mtd_theme') || 'default',
        profile: LS('mtd_profile'),
        links: LS('mtd_links_data') || [],
        tasks: LS('mtd_tasks') || [],
        reminders: LS('mtd_reminders') || [],
        birthdays: LS('mtd_birthdays') || [],
        stats: LS('mtd_click_stats') || {},
        notes: LS('mtd_notes') || '',
        hydration: {
          on: LS('hydr_on') || false,
          interval: LS('hydr_int') || 30,
        },
        stretch: {
          on: LS('str_on') || false,
          interval: LS('str_int') || 60,
        },
      },
    };

    const filename = `mtd-linkbio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(JSON.stringify(payload, null, 2), filename, 'application/json');
    toast('Đã xuất dữ liệu');
  }

  import(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);

        if (!backup.version || !backup.data) {
          throw new Error('Invalid backup file format');
        }

        // Confirm before importing
        if (
          !confirm(
            `Nhập dữ liệu từ backup ngày ${new Date(backup.exportDate).toLocaleDateString()}?\n\nDữ liệu hiện tại sẽ bị ghi đè!`
          )
        ) {
          return;
        }

        // Import all data
        const d = backup.data;

        if (d.mode) LS('mtd_mode', d.mode);
        if (d.theme) LS('mtd_theme', d.theme);
        if (d.profile) LS('mtd_profile', d.profile);
        if (d.links) LS('mtd_links_data', d.links);
        if (d.tasks) LS('mtd_tasks', d.tasks);
        if (d.reminders) LS('mtd_reminders', d.reminders);
        if (d.birthdays) LS('mtd_birthdays', d.birthdays);
        if (d.stats) LS('mtd_click_stats', d.stats);
        if (d.notes !== undefined) LS('mtd_notes', d.notes);

        if (d.hydration) {
          LS('hydr_on', d.hydration.on);
          LS('hydr_int', d.hydration.interval);
        }

        if (d.stretch) {
          LS('str_on', d.stretch.on);
          LS('str_int', d.stretch.interval);
        }

        toast('Đã nhập dữ liệu. Đang tải lại...');

        // Reload page to apply changes
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (e) {
        console.error('Import error:', e);
        toast('File không hợp lệ hoặc bị lỗi');
      }
    };

    reader.onerror = () => {
      toast('Không thể đọc file');
    };

    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  }

  reset() {
    if (
      !confirm(
        'XÓA TẤT CẢ DỮ LIỆU?\n\nHành động này không thể hoàn tác!\n\nBạn nên xuất backup trước khi xóa.'
      )
    ) {
      return;
    }

    if (!confirm('Bạn có CHẮC CHẮN muốn xóa tất cả?')) {
      return;
    }

    // Clear all data
    const keys = [
      'mtd_mode',
      'mtd_theme',
      'mtd_profile',
      'mtd_links_data',
      'mtd_tasks',
      'mtd_reminders',
      'mtd_birthdays',
      'mtd_click_stats',
      'mtd_notes',
      'hydr_on',
      'hydr_int',
      'str_on',
      'str_int',
    ];

    keys.forEach((key) => localStorage.removeItem(key));

    toast('Đã xóa tất cả dữ liệu. Đang tải lại...');

    setTimeout(() => {
      location.reload();
    }, 1500);
  }

  exportStats() {
    const stats = LS('mtd_click_stats') || {};
    const links = LS('mtd_links_data') || [];

    const data = links.map((link) => ({
      title: link.title,
      url: link.url,
      clicks: stats[link.id] || 0,
    }));

    const csv = [
      'Title,URL,Clicks',
      ...data.map((row) => `"${row.title}","${row.url}",${row.clicks}`),
    ].join('\n');

    const filename = `mtd-linkbio-stats-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csv, filename, 'text/csv');
    toast('Đã xuất thống kê');
  }
}

window.backupManager = new BackupManager();

function exportBackup() {
  window.backupManager.export();
}

function importBackup(event) {
  // Handled by event listener in BackupManager
}

function resetAllData() {
  window.backupManager.reset();
}

function exportStats() {
  window.backupManager.exportStats();
}
