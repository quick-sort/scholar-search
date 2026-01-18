#!/bin/bash
# Automated screenshot script for Claude Code visual feedback

PORT=${1:-3000}
URL="http://localhost:${PORT}"
OUTPUT_DIR="./screenshots"
FILENAME="screenshot-$(date +%Y%m%d-%H%M%S).png"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Take screenshot using different methods based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    # Use Safari's built-in screenshot or screencapture
    echo "Opening $URL in browser for screenshot..."
    osascript <<EOF
tell application "Safari"
    activate
    open location "$URL"
    delay 3
end tell
EOF
    screencapture -x "$OUTPUT_DIR/$FILENAME"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux with gnome-screenshot
    gnome-screenshot --file="$OUTPUT_DIR/$FILENAME" --delay=3
else
    # Windows or fallback
    echo "Please take a manual screenshot of $URL"
    echo "Save it as: $OUTPUT_DIR/$FILENAME"
fi

echo "Screenshot saved to: $OUTPUT_DIR/$FILENAME"
echo "Share this path with Claude Code for analysis"
