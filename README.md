# 🔗 MTD Link Bio

<div align="center">

![MTD Link Bio](https://i.imgur.com/GCITCIv.png)

**A powerful, feature-rich link-in-bio platform with productivity tools**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤-red.svg)](https://mtdvps.com)

[Demo](https://id.mtdvps.com) • [Documentation](./HUONG-DAN.md) • [Report Bug](https://github.com/yourusername/mtd-linkbio/issues) • [Request Feature](https://github.com/yourusername/mtd-linkbio/issues)

</div>

---

## ✨ Features

### 🎯 Core Features
- **Dynamic Link Management** - Add, edit, delete, and reorder links with drag & drop
- **Admin Panel** - Full-featured admin interface for easy management
- **Profile Customization** - Customize name, avatar, description, and social links
- **Theme System** - 5 beautiful gradient themes + Dark/Light mode
- **Analytics** - Track clicks on each link with local storage
- **QR Code Generator** - Generate QR codes for any link
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### 🛠️ Productivity Tools
- ⏰ **Clock & Weather** - Real-time clock and weather widget
- ⏱️ **Pomodoro Timer** - Focus timer with work/break cycles
- ✅ **To-Do List** - Task management with deadlines and reminders
- 🔔 **Reminder Center** - Set reminders with desktop notifications
- 💧 **Hydration Reminder** - Stay hydrated with periodic reminders
- 🧍 **Stretch Reminder** - Take breaks and stretch regularly
- 🎂 **Birthday Tracker** - Never forget important birthdays
- 📝 **Sticky Notes** - Quick notes with auto-save
- 💾 **Backup & Restore** - Export/import all your data

## 🚀 Quick Start

### Option 1: Direct Use
1. Download or clone this repository
2. Open `index.html` in your browser
3. Click **⚙️ Quản lý** to open admin panel
4. Start adding your links!

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your link bio will be live at `https://yourusername.github.io/mtd-linkbio`

### Option 3: Custom Domain
1. Follow Option 2
2. Add a `CNAME` file with your domain
3. Configure DNS settings at your domain provider
4. Done! Your link bio is now at your custom domain

## 📖 Usage

### Adding Links
1. Click **⚙️ Quản lý** button
2. Go to **🔗 Links** tab
3. Click **➕ Thêm Link Mới**
4. Fill in the form:
   - **Title**: Display name
   - **Description**: Short description
   - **URL**: Full URL (https://...)
   - **Icon**: Font Awesome class (e.g., `fas fa-cloud`)
   - **Badge**: Optional badge text (e.g., "-50% HOT")
5. Click **💾 Lưu**

### Reordering Links
- Drag the **☰** handle on the left of each link
- Drop it in the desired position
- Order is saved automatically

### Customizing Profile
1. Go to **👤 Hồ sơ** tab
2. Update your information:
   - Name, description, avatar URL
   - Social media links (Email, Facebook, YouTube, TikTok)
3. Click **💾 Lưu hồ sơ**

### Changing Theme
1. Go to **🎨 Giao diện** tab
2. Select one of 5 gradient themes
3. Click **💾 Lưu giao diện**

## 🎨 Themes

- **Default** - Vibrant multi-color gradient
- **Purple** - Dreamy purple gradient
- **Sunset** - Warm sunset colors
- **Dark** - Dark mysterious gradient
- **Nature** - Fresh green gradient

## 📱 Screenshots

<div align="center">

### Desktop View
![Desktop](https://via.placeholder.com/800x400?text=Desktop+View)

### Mobile View
![Mobile](https://via.placeholder.com/400x800?text=Mobile+View)

### Admin Panel
![Admin](https://via.placeholder.com/800x400?text=Admin+Panel)

</div>

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome 5** - Icon library
- **QRCode.js** - QR code generation
- **Open-Meteo API** - Weather data
- **LocalStorage** - Data persistence

## 📂 Project Structure

```
mtd-linkbio/
├── assets/
│   ├── css/
│   │   ├── main.css          # Main styles
│   │   ├── admin.css         # Admin panel styles
│   │   ├── dark-mode.css     # Dark mode styles
│   │   └── widgets.css       # Widget styles
│   └── js/
│       ├── utils.js          # Utility functions
│       ├── core.js           # Core functionality
│       ├── admin.js          # Admin panel logic
│       ├── widgets.js        # Widget functionality
│       └── backup.js         # Backup/restore logic
├── index.html                # Main HTML file
├── HUONG-DAN.md             # Vietnamese guide
├── README.md                # This file
└── CNAME                    # Custom domain (optional)
```

## 🔧 Configuration

All data is stored in browser's LocalStorage:

- `mtd_links_data` - Your links
- `mtd_profile` - Profile information
- `mtd_theme` - Selected theme
- `mtd_mode` - Dark/Light mode
- `mtd_click_stats` - Click statistics
- `mtd_tasks` - To-do list
- `mtd_reminders` - Reminders
- `mtd_birthdays` - Birthday list
- `mtd_notes` - Sticky notes

## 🔒 Privacy

- **100% Client-Side** - All data stored locally in your browser
- **No Server** - No data sent to any server
- **No Tracking** - No analytics or tracking scripts
- **No Cookies** - Uses LocalStorage only
- **Offline Ready** - Works without internet (except weather)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) - Icon library
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/) - QR code generation
- [Open-Meteo](https://open-meteo.com/) - Weather API
- Inspired by Linktree, Bio.link, and other link-in-bio platforms

## 📞 Support

- **Website**: [mtdvps.com](https://mtdvps.com)
- **Facebook**: [facebook.com/ducvps123](https://www.facebook.com/ducvps123)
- **Zalo Group**: [zalo.me/g/afdrwb295](https://zalo.me/g/afdrwb295)
- **Discord**: [discord.gg/Mumgffrp5b](https://discord.gg/Mumgffrp5b)
- **Email**: support@mtdvps.com

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ by [MTD VPS](https://mtdvps.com)**

[⬆ Back to Top](#-mtd-link-bio)

</div>
