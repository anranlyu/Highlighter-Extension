console.log('content script has been injected');

import { popupMessage } from '../App';
import './content.css'
// Create the highlight element
const highlight = document.createElement('div');
highlight.className = 'highlight'; // Tailwind classes

document.body.appendChild(highlight);

// Update the highlight position based on cursor and scroll position
document.addEventListener('mousemove', (event) => {
    const { clientY } = event;

    // Account for scroll position to ensure correct placement
    const topPosition = clientY + window.scrollY -10;

    // Set the position of the highlight line
    highlight.style.top = `${topPosition}px`;
    highlight.style.display = 'block';

});

// Hide the highlight when the mouse leaves the document
document.addEventListener('mouseleave', () => {
    highlight.style.display = 'none';
    console.log('mouseleave')
});

chrome.runtime.onMessage.addListener((message: popupMessage, sender) => {
    console.log(`content script get message from ${sender}`)
    if (message.action === 'setHighlightColor' && message.value) {
        highlight.style.backgroundColor = hexToRgba(message.value, 0.4);
        console.log(`Highlight color changed to ${message.value}`);
    }
})

function hexToRgba(hex: string, alpha: number): string {
  // Remove the leading # if present
  const sanitizedHex = hex.replace(/^#/, '');
  
  // Parse the RGB values
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Return the RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
