/* ===== Widget Functionality ===== */

// ===== To-Do List =====
class TodoManager {
  constructor() {
    this.tasks = LS('mtd_tasks') || [];
    this.init();
  }

  init() {
    this.render();
    this.setupTimeOptions();
    setInterval(() => this.render(), 60000); // Update every minute
  }

  setupTimeOptions() {
    const timeSelect = $('#dueTimeInput');
    if (!timeSelect) return;

    timeSelect.innerHTML = '<option value="">--Giờ--</option>';
    for (let h = 0; h < 24; h++) {
      for (let m of [0, 15, 30, 45]) {
        const v = `${fmt2(h)}:${fmt2(m)}`;
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v;
        timeSelect.appendChild(o);
      }
    }
  }

  add() {
    const text = $('#taskInput')?.value.trim();
    const date = $('#dueDateInput')?.value;
    const time = $('#dueTimeInput')?.value;
    const repeat = $('#repeatInput')?.value;

    if (!text) {
      toast('Nhập nội dung');
      return;
    }

    this.tasks.push({
      id: generateUUID(),
      text,
      deadline: date || '',
      time: time || '',
      repeat: repeat || 'none',
      completed: false,
      createdAt: new Date().toISOString(),
    });

    this.save();
    this.render();

    // Clear inputs
    if ($('#taskInput')) $('#taskInput').value = '';
    if ($('#dueDateInput')) $('#dueDateInput').value = '';
    if ($('#dueTimeInput')) $('#dueTimeInput').value = '';
    if ($('#repeatInput')) $('#repeatInput').value = 'none';

    toast('Đã thêm task');
  }

  toggle(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.save();
    this.render();
  }

  delete(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.render();
    toast('Đã xóa task');
  }

  save() {
    LS('mtd_tasks', this.tasks);
  }

  render() {
    const wrap = $('#todoList');
    const report = $('#todoReport');
    if (!wrap) return;

    wrap.innerHTML = '';
    let overdue = 0;
    const now = new Date();

    this.tasks.forEach((t, i) => {
      const li = document.createElement('div');
      li.className = 'item';

      const dueStr = t.deadline
        ? ` (${t.deadline}${t.time ? ' ' + t.time : ''})`
        : '';
      const isOver =
        t.deadline &&
        !t.completed &&
        new Date(`${t.deadline} ${t.time || '23:59'}`) < now;

      if (t.completed) li.classList.add('completed');
      else if (isOver) {
        li.classList.add('overdue');
        overdue++;
      }

      li.innerHTML = `
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="todoManager.toggle(${i})">
        <span>${escapeHTML(t.text)}${dueStr}${
        t.repeat && t.repeat !== 'none' ? ' • <i>' + t.repeat + '</i>' : ''
      }</span>
        <button class="x" onclick="todoManager.delete(${i})">Xóa</button>
      `;

      wrap.appendChild(li);
    });

    if (report) {
      report.textContent = overdue ? `⚠️ ${overdue} nhiệm vụ đã quá hạn!` : '';
    }
  }

  exportICS() {
    let lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MTD VPS LinkBio//VI',
    ];

    const addEvent = (title, dt, desc) => {
      if (!dt) return;
      const dtstr = dt.replace(/[-:]/g, '').replace(' ', 'T') + '00';
      lines.push(
        'BEGIN:VEVENT',
        `UID:${generateUUID()}@mtdvps`,
        `DTSTAMP:${dtstr}Z`,
        `DTSTART:${dtstr}Z`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${desc || ''}`,
        'END:VEVENT'
      );
    };

    this.tasks.forEach((x) => {
      if (x.deadline) {
        const dt = x.deadline + (x.time ? ' ' + x.time : ' 09:00');
        addEvent(x.text, dt, 'To-Do');
      }
    });

    lines.push('END:VCALENDAR');
    downloadFile(lines.join('\n'), 'mtd-linkbio.ics', 'text/calendar');
    toast('Đã xuất file ICS');
  }
}

window.todoManager = new TodoManager();

function addTask() {
  window.todoManager.add();
}

function exportICS() {
  window.todoManager.exportICS();
}

// ===== Reminder Center =====
class ReminderManager {
  constructor() {
    this.reminders = LS('mtd_reminders') || [];
    this.timers = {};
    this.init();
  }

  init() {
    this.render();
    this.reminders.forEach((r) => this.schedule(r.id));
  }

  add() {
    const text = $('#remText')?.value.trim();
    const date = $('#remDate')?.value;
    const time = $('#remTime')?.value;
    const repeat = $('#remRepeat')?.value;

    if (!text || !date || !time) {
      toast('Nhập đủ nội dung, ngày, giờ');
      return;
    }

    const id = generateUUID();
    this.reminders.push({
      id,
      text,
      date,
      time,
      repeat: repeat || 'none',
      done: false,
      createdAt: new Date().toISOString(),
    });

    this.save();
    this.render();
    this.schedule(id);

    // Clear inputs
    if ($('#remText')) $('#remText').value = '';
    if ($('#remDate')) $('#remDate').value = '';
    if ($('#remTime')) $('#remTime').value = '';
    if ($('#remRepeat')) $('#remRepeat').value = 'none';

    toast('Đã đặt nhắc');
  }

  schedule(id) {
    const r = this.reminders.find((x) => x.id === id);
    if (!r) return;

    clearTimeout(this.timers[id]);

    const due = new Date(`${r.date} ${r.time}`).getTime();
    const now = Date.now();
    const wait = due - now;

    if (wait <= 0) {
      this.fire(r);
      return;
    }

    this.timers[id] = setTimeout(() => this.fire(r), wait);
  }

  fire(r) {
    notify('🔔 Reminder', `${r.text} — ${r.date} ${r.time}`);
    toast('Nhắc: ' + r.text);

    // Handle repeat
    if (r.repeat === 'daily' || r.repeat === 'weekly') {
      const d = new Date(`${r.date} ${r.time}`);
      if (r.repeat === 'daily') d.setDate(d.getDate() + 1);
      else d.setDate(d.getDate() + 7);

      r.date = d.toISOString().slice(0, 10);
      r.time = d.toTimeString().slice(0, 5);

      this.save();
      this.render();
      this.schedule(r.id);
    }
  }

  snooze(id, mins) {
    const r = this.reminders.find((x) => x.id === id);
    if (!r) return;

    const d = new Date();
    d.setMinutes(d.getMinutes() + mins);
    r.date = d.toISOString().slice(0, 10);
    r.time = d.toTimeString().slice(0, 5);

    this.save();
    this.render();
    this.schedule(id);
    toast(`Snooze ${mins} phút`);
  }

  delete(id) {
    this.reminders = this.reminders.filter((x) => x.id !== id);
    this.save();
    this.render();
    clearTimeout(this.timers[id]);
    toast('Đã xóa reminder');
  }

  save() {
    LS('mtd_reminders', this.reminders);
  }

  render() {
    const wrap = $('#remList');
    if (!wrap) return;

    wrap.innerHTML = '';
    this.reminders.sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

    this.reminders.forEach((r) => {
      const due = new Date(`${r.date} ${r.time}`);
      const now = new Date();
      const left = Math.max(0, due - now);
      const mins = Math.floor(left / 60000);
      const label = left ? `${mins} phút nữa` : 'Đến hạn';

      const div = document.createElement('div');
      div.className = 'item';
      if (left === 0) div.classList.add('warn');

      div.innerHTML = `
        <span><b>${escapeHTML(r.text)}</b> — ${r.date} ${r.time} (${
        r.repeat
      }) • <i>${label}</i></span>
        <button class="pill-btn" onclick="reminderManager.snooze('${r.id}',5)">Snooze 5'</button>
        <button class="x" onclick="reminderManager.delete('${r.id}')">Xóa</button>
      `;

      wrap.appendChild(div);
    });
  }
}

window.reminderManager = new ReminderManager();

function addReminder() {
  window.reminderManager.add();
}

// ===== Pomodoro Timer =====
class PomodoroTimer {
  constructor() {
    this.timer = null;
    this.timeLeft = 0;
    this.mode = 'work';
  }

  start() {
    const workMins = parseInt($('#pomoWork')?.value || 25, 10);
    const breakMins = parseInt($('#pomoBreak')?.value || 5, 10);

    if (!this.timeLeft) {
      this.timeLeft = (this.mode === 'work' ? workMins : breakMins) * 60;
    }

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.timeLeft--;
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      if ($('#pomoTime')) $('#pomoTime').textContent = `${fmt2(m)}:${fmt2(s)}`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        notify(
          '⏱ Pomodoro',
          this.mode === 'work'
            ? 'Hết phiên làm việc! Nghỉ thôi.'
            : 'Hết phiên nghỉ! Bắt đầu làm.'
        );
        this.mode = this.mode === 'work' ? 'break' : 'work';
        if ($('#pomoLabel'))
          $('#pomoLabel').textContent =
            'Chế độ: ' + (this.mode === 'work' ? 'Work' : 'Break');
        this.timeLeft = 0;
      }
    }, 1000);

    if ($('#pomoLabel'))
      $('#pomoLabel').textContent =
        'Chế độ: ' + (this.mode === 'work' ? 'Work' : 'Break');
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.timeLeft = 0;
    this.mode = 'work';
    const workMins = parseInt($('#pomoWork')?.value || 25, 10);
    if ($('#pomoTime')) $('#pomoTime').textContent = `${fmt2(workMins)}:00`;
    if ($('#pomoLabel')) $('#pomoLabel').textContent = 'Chế độ: Work';
  }
}

window.pomoTimer = new PomodoroTimer();

function startPomo() {
  window.pomoTimer.start();
}

function stopPomo() {
  window.pomoTimer.stop();
}

// ===== Health Reminders =====
class HealthReminder {
  constructor(type) {
    this.type = type; // 'hydration' or 'stretch'
    this.timer = null;
    this.restore();
  }

  restore() {
    const isOn = LS(`${this.type}_on`);
    const interval = LS(`${this.type}_int`) || (this.type === 'hydration' ? 30 : 60);
    
    const intInput = $(`#${this.type === 'hydration' ? 'hydr' : 'str'}Int`);
    if (intInput) intInput.value = interval;

    if (isOn) this.toggle();
  }

  toggle() {
    const prefix = this.type === 'hydration' ? 'hydr' : 'str';
    const statusEl = $(`#${prefix}Status`);
    const btnEl = $(`#${prefix}BtnTxt`);
    const intInput = $(`#${prefix}Int`);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      LS(`${this.type}_on`, false);
      if (statusEl) statusEl.textContent = 'Tắt';
      if (btnEl)
        btnEl.textContent =
          this.type === 'hydration' ? 'Bật nhắc uống nước' : 'Bật nhắc giãn cơ';
      return;
    }

    const mins = parseInt(intInput?.value || (this.type === 'hydration' ? 30 : 60), 10);
    const message =
      this.type === 'hydration'
        ? '💧 Uống nước!'
        : '🧍 Giãn cơ!';
    const detail =
      this.type === 'hydration'
        ? 'Đặt cốc nước xuống và làm 3 ngụm nhé!'
        : 'Đứng dậy vươn vai/đi lại 1-2 phút';

    this.timer = setInterval(() => {
      notify(message, detail);
      toast(message);
    }, mins * 60000);

    LS(`${this.type}_on`, true);
    LS(`${this.type}_int`, mins);
    if (statusEl) statusEl.textContent = 'Bật';
    if (btnEl)
      btnEl.textContent =
        this.type === 'hydration' ? 'Tắt nhắc uống nước' : 'Tắt nhắc giãn cơ';
    toast(
      this.type === 'hydration'
        ? 'Đã bật nhắc uống nước'
        : 'Đã bật nhắc giãn cơ'
    );
  }
}

window.hydrationReminder = new HealthReminder('hydration');
window.stretchReminder = new HealthReminder('stretch');

function toggleHydration() {
  window.hydrationReminder.toggle();
}

function toggleStretch() {
  window.stretchReminder.toggle();
}

// ===== Birthday Tracker =====
class BirthdayTracker {
  constructor() {
    this.birthdays = LS('mtd_birthdays') || [];
    this.render();
  }

  add() {
    const name = $('#bdName')?.value.trim();
    const date = $('#bdDate')?.value;

    if (!name || !date) {
      toast('Nhập tên và ngày');
      return;
    }

    this.birthdays.push({ id: generateUUID(), name, date });
    this.save();
    this.render();

    if ($('#bdName')) $('#bdName').value = '';
    if ($('#bdDate')) $('#bdDate').value = '';
    toast('Đã thêm sinh nhật');
  }

  delete(index) {
    this.birthdays.splice(index, 1);
    this.save();
    this.render();
    toast('Đã xóa');
  }

  nextBirthday(dateStr) {
    const [Y, M, D] = dateStr.split('-').map(Number);
    const now = new Date();
    let next = new Date(now.getFullYear(), M - 1, D);

    if (
      next <
      new Date(now.getFullYear(), now.getMonth(), now.getDate())
    ) {
      next.setFullYear(next.getFullYear() + 1);
    }

    const days = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return { next, days };
  }

  save() {
    LS('mtd_birthdays', this.birthdays);
  }

  render() {
    const wrap = $('#bdList');
    if (!wrap) return;

    wrap.innerHTML = '';
    this.birthdays.sort(
      (a, b) => this.nextBirthday(a.date).days - this.nextBirthday(b.date).days
    );

    this.birthdays.forEach((x, i) => {
      const info = this.nextBirthday(x.date);
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <span><b>${escapeHTML(x.name)}</b> — ${x.date} • Còn <b>${
        info.days
      }</b> ngày</span>
        <button class="x" onclick="birthdayTracker.delete(${i})">Xóa</button>
      `;
      wrap.appendChild(div);
    });
  }
}

window.birthdayTracker = new BirthdayTracker();

function addBirthday() {
  window.birthdayTracker.add();
}

function delBirthday(i) {
  window.birthdayTracker.delete(i);
}

// ===== Notes =====
const noteKey = 'mtd_notes';
const noteBox = $('#noteBox');
if (noteBox) {
  noteBox.value = LS(noteKey) || '';
  noteBox.addEventListener('input', (e) => LS(noteKey, e.target.value));
}

function clearNotes() {
  if (confirm('Xóa tất cả ghi chú?')) {
    if ($('#noteBox')) $('#noteBox').value = '';
    LS(noteKey, '');
    toast('Đã xóa ghi chú');
  }
}

function downloadText() {
  const content = $('#noteBox')?.value || '';
  downloadFile(content, 'notes.txt', 'text/plain');
  toast('Đã tải file');
}
