# AI Prompt Manager

A simple and elegant Chrome extension for managing AI prompts with a modern, calming UI.

## Features

- **Add Prompts**: Create prompts with titles and text through a clean, intuitive interface
- **One-Click Copy**: Instantly copy any prompt to your clipboard with a single click
- **Delete Prompts**: Remove unwanted prompts with smooth animations
- **Persistent Storage**: All prompts are saved using Chrome's sync storage, syncing across devices
- **Modern UI**: Beautiful gradient design with smooth animations and contemporary styling
- **Calming Design**: Purple gradient theme with soft colors for a pleasant user experience

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The AI Prompt Manager icon should appear in your Chrome toolbar

## Usage

### Adding a Prompt

1. Click the extension icon in your Chrome toolbar
2. Enter a title for your prompt in the "Prompt title..." field
3. Enter the prompt text in the text area below
4. Click "Add Prompt" or press Enter (Ctrl+Enter in the text area)

### Copying a Prompt

1. Click the copy icon (📋) next to any prompt
2. The prompt text is instantly copied to your clipboard
3. A notification confirms the copy action

### Deleting a Prompt

1. Click the delete icon (🗑️) next to any prompt
2. The prompt is removed with a smooth fade-out animation
3. A notification confirms the deletion

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Storage**: Chrome Sync Storage API for cross-device synchronization
- **Permissions**: Storage only (minimal permissions for security)
- **UI Framework**: Pure HTML, CSS, and JavaScript (no dependencies)

## File Structure

```
ai-prompt-manager-ghai/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js           # JavaScript functionality
├── styles.css         # Modern UI styling
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # Documentation
```

## Development

The extension uses:
- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage Sync API
- Modern CSS with animations and gradients

No build process is required - the extension can be loaded directly in Chrome.

## Browser Compatibility

- Chrome (version 88+)
- Edge (Chromium-based)
- Brave
- Other Chromium-based browsers

## License

MIT License - feel free to use and modify as needed.