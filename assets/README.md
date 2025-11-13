# Assets Directory

This directory contains all CSS and JavaScript files for MTD Link Bio.

## 📁 Structure

```
assets/
├── css/
│   ├── main.css          # Core styles and layout
│   ├── admin.css         # Admin panel styles
│   ├── dark-mode.css     # Dark mode overrides
│   └── widgets.css       # Widget-specific styles
└── js/
    ├── utils.js          # Utility functions and helpers
    ├── core.js           # Core functionality (clock, weather, etc.)
    ├── admin.js          # Admin panel management
    ├── widgets.js        # Widget functionality (todo, reminders, etc.)
    └── backup.js         # Backup and restore functionality
```

## 🎨 CSS Files

### main.css (~400 lines)
Core styles including:
- CSS variables and theme colors
- Layout and grid system
- Typography
- Card and button styles
- Link styles with animations
- Responsive breakpoints

### admin.css (~300 lines)
Admin panel specific styles:
- Modal and overlay
- Form elements
- Drag and drop styles
- Color picker
- Link management UI

### dark-mode.css (~100 lines)
Dark mode overrides:
- Color adjustments for dark theme
- Contrast improvements
- Component-specific dark styles

### widgets.css (~250 lines)
Widget-specific styles:
- To-do list
- Reminders
- Pomodoro timer
- Notes
- Birthday tracker
- Stats table

## 💻 JavaScript Files

### utils.js (~150 lines)
Utility functions:
- DOM selectors ($, $$)
- LocalStorage helper (LS)
- Toast notifications
- Date/time formatting
- Validation functions
- File download helpers

### core.js (~200 lines)
Core functionality:
- Sidebar toggle
- Dark/Light mode
- Clock widget
- Weather widget
- Quote display
- Link filtering
- Link tracking
- QR code management

### admin.js (~350 lines)
Admin panel management:
- AdminPanel class
- Link CRUD operations
- Drag and drop
- Profile management
- Theme management
- Public link rendering

### widgets.js (~500 lines)
Widget functionality:
- TodoManager class
- ReminderManager class
- PomodoroTimer class
- HealthReminder class
- BirthdayTracker class
- Notes management

### backup.js (~150 lines)
Backup and restore:
- BackupManager class
- Export to JSON
- Import from JSON
- Data validation
- Stats export to CSV

## 🔧 Modifying Files

### Adding New Styles
1. Identify the appropriate CSS file
2. Add your styles following existing patterns
3. Use CSS variables for colors
4. Test in both light and dark modes

### Adding New Features
1. Choose the appropriate JS file
2. Follow existing code structure
3. Use utility functions from utils.js
4. Add comments for complex logic
5. Test thoroughly

### Best Practices
- Keep files focused on their purpose
- Use meaningful variable/function names
- Add comments for complex code
- Follow existing code style
- Test on multiple browsers
- Check mobile responsiveness

## 📦 File Loading Order

Files are loaded in this order in index.html:

1. **CSS Files** (in <head>)
   - main.css
   - admin.css
   - dark-mode.css
   - widgets.css

2. **JavaScript Files** (before </body>)
   - utils.js (first - provides utilities)
   - core.js
   - admin.js
   - widgets.js
   - backup.js (last)

This order ensures dependencies are loaded correctly.

## 🎯 Performance Tips

### CSS
- Use CSS variables for theme colors
- Minimize specificity
- Use efficient selectors
- Leverage CSS Grid and Flexbox
- Avoid !important

### JavaScript
- Use event delegation where possible
- Debounce expensive operations
- Cache DOM queries
- Use LocalStorage efficiently
- Minimize reflows/repaints

## 🔍 Debugging

### CSS Issues
1. Check browser DevTools
2. Verify CSS file is loaded
3. Check for specificity conflicts
4. Test in different browsers

### JavaScript Issues
1. Check browser console
2. Verify file load order
3. Check for undefined variables
4. Test in different browsers
5. Use console.log for debugging

## 📝 Documentation

Each file includes:
- Header comment with purpose
- Function/class documentation
- Inline comments for complex logic
- Clear variable names

## 🤝 Contributing

When modifying these files:
1. Follow existing code style
2. Add comments for new code
3. Test thoroughly
4. Update this README if needed
5. Submit a pull request

## 📞 Support

Questions about the code?
- 📧 Email: support@mtdvps.com
- 💬 Discord: https://discord.gg/Mumgffrp5b
- 🐛 Issues: GitHub Issues

---

**MTD VPS** - Built with ❤️
