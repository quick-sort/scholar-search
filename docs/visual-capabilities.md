# Claude Code Visual Capabilities Guide

## Overview
Claude Code can analyze images and screenshots, allowing it to visually inspect generated webpages, UI components, and design work.

## Methods for Visual Feedback

### Method 1: Manual Screenshots (Simplest)

**Workflow:**
```bash
# 1. Start your dev server
pnpm dev

# 2. Open your browser to localhost:3000

# 3. Take a screenshot
# macOS: Use Cmd+Shift+4 or screenshot tool
# Windows: Win+Shift+S
# Linux: gnome-screenshot or similar

# 4. Save screenshot (e.g., to ./screenshots/my-page.png)

# 5. Ask Claude to analyze
```

**Example prompt:**
```
I took a screenshot of the search page at ./screenshots/my-page.png
Can you review the layout and suggest improvements?
```

### Method 2: Automated Screenshot Script

**Setup:**
```bash
# Make the script executable
chmod +x scripts/screenshot.sh

# Run it (assumes dev server on port 3000)
./scripts/screenshot.sh
```

**Usage:**
```bash
# Custom port
./scripts/screenshot.sh 3001

# Then tell Claude:
"The screenshot is saved at ./screenshots/screenshot-20240116-143022.png"
```

### Method 3: Playwright/Puppeteer Automation

**Install dependencies:**
```bash
pnpm add -D playwright
npx playwright install chromium
```

**Usage:**
```bash
# Capture default (localhost:3000)
node scripts/capture-screenshot.js

# Capture specific URL
node scripts/capture-screenshot.js http://localhost:3000/search

# Capture to specific path
node scripts/capture-screenshot.js http://localhost:3000 ./screenshots/search-page.png
```

### Method 4: MCP Vision Tool (Remote URLs)

If your screenshot is hosted online:

```
Can you analyze the webpage at https://example.com/screenshot.png?
```

## Example Workflows

### Workflow 1: UI Review During Development

```bash
# 1. Make changes to your component
# 2. Start dev server
pnpm dev

# 3. Take screenshot
node scripts/capture-screenshot.js http://localhost:3000 ./screenshots/after-change.png

# 4. Ask Claude
```

**Prompt:**
```
I just updated the search page layout.
The screenshot at ./screenshots/after-change.png shows the new design.
The previous version is at ./screenshots/before-change.png.
Can you compare them and tell me:
1. What improved?
2. Any visual issues?
3. Suggestions for further refinement?
```

### Workflow 2: Component Visual Testing

```bash
# Generate screenshots of different states
node scripts/capture-screenshot.js http://localhost:3000?state=loading ./screenshots/loading.png
node scripts/capture-screenshot.js http://localhost:3000?state=error ./screenshots/error.png
node scripts/capture-screenshot.js http://localhost:3000?state=success ./screenshots/success.png
```

**Prompt:**
```
Review these component states:
- Loading: ./screenshots/loading.png
- Error: ./screenshots/error.png
- Success: ./screenshots/success.png

Check for:
- Visual consistency
- Accessibility
- Clear user feedback
```

### Workflow 3: Design Implementation Verification

```
The Figma design is at ./designs/search-page-mockup.png
My implementation screenshot is at ./screenshots/implementation.png

Can you:
1. Compare them pixel-by-pixel for layout accuracy
2. Identify any spacing/alignment issues
3. Check if colors match
4. Suggest CSS fixes for any discrepancies
```

### Workflow 4: Responsive Design Testing

```bash
# Update capture-screenshot.js to test different viewports
node scripts/capture-screenshot.js 1920x1080 ./screenshots/desktop.png
node scripts/capture-screenshot.js 768x1024 ./screenshots/tablet.png
node scripts/capture-screenshot.js 375x667 ./screenshots/mobile.png
```

## Advanced: Continuous Visual Feedback Loop

### Create a package.json script:

```json
{
  "scripts": {
    "screenshot": "node scripts/capture-screenshot.js",
    "screenshot:all": "node scripts/capture-all-sizes.js",
    "dev:screenshot": "pnpm dev & sleep 5 && pnpm screenshot"
  }
}
```

### Usage:

```bash
# One command to start server and capture
pnpm dev:screenshot

# Share the screenshot path with Claude immediately
```

## Tips for Best Results

1. **High Quality Screenshots**
   - Use full-page captures when needed
   - Ensure images are not compressed
   - Use PNG format for clarity

2. **Context is Key**
   - Tell Claude what you're looking for
   - Specify what aspect to focus on (layout, colors, spacing, etc.)
   - Provide comparison screenshots (before/after)

3. **Multiple States**
   - Capture different states (hover, active, disabled)
   - Test different screen sizes
   - Include dark/light mode if applicable

4. **Organize Screenshots**
   ```
   screenshots/
   ├── before/
   ├── after/
   ├── desktop/
   ├── mobile/
   └── components/
   ```

## Example Prompts

### Layout Review:
```
Review the layout at ./screenshots/home-page.png:
- Check spacing consistency
- Verify alignment
- Identify visual hierarchy issues
- Suggest improvements
```

### Color & Design:
```
Analyze the color scheme in ./screenshots/dashboard.png:
- Are colors consistent?
- Is there good contrast?
- Do colors follow accessibility guidelines?
- Suggest a refined palette
```

### Bug Identification:
```
Something looks wrong in ./screenshots/broken-layout.png
The expected design is in ./screenshots/expected.png
Can you identify what's broken and suggest CSS fixes?
```

### Responsive Issues:
```
Compare these screenshots:
- Desktop: ./screenshots/desktop.png
- Mobile: ./screenshots/mobile.png

The mobile version looks off. Can you identify what needs to be fixed in the CSS?
```

## Limitations

- Claude cannot interact with live webpages directly
- Screenshots must be saved as files (PNG, JPG, etc.)
- Claude sees static images, not animations or hover states
- For dynamic content, capture the specific state you want reviewed

## Alternative: Browser Extensions

Some users set up browser extensions that:
1. Capture screenshots with one click
2. Automatically save to a watched directory
3. Claude monitors that directory for new images

This enables a seamless "show Claude" button in your browser.
