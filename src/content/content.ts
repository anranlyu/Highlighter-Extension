console.log('content script has been injected');

import { popupMessage } from '../App';
import './content.css'
// Create the highlight element
const getOrCreateHighlightElement = () => {
  let highlightElement = document.querySelector('.highlight') as HTMLDivElement;
  if (!highlightElement) {
    highlightElement = document.createElement('div');
    highlightElement.className = 'highlight';
    document.body.appendChild(highlightElement);
  }
  return highlightElement;
};


chrome.storage.local.get(['color', 'hight'], (result) => {
    console.log(`get color:${result.color} and hight:${result.hight} from storage`);
    const highlightElement = getOrCreateHighlightElement();

    if (result.color) {
        highlightElement.style.backgroundColor = hexToRgba(result.color, 0.4);
    }

    if (result.hight) {
        highlightElement.style.height = `${result.hight}px`;
    }
});

// Update the highlight position based on cursor and scroll position
document.addEventListener('mousemove', (event) => {
    const highlight = getOrCreateHighlightElement();

    const hight = +highlight.style.height.slice(0, -2);


    const { clientY } = event;

    // Account for scroll position to ensure correct placement
    const topPosition = clientY + window.scrollY -hight/2;

    // Set the position of the highlight line
    highlight.style.top = `${topPosition}px`;
    highlight.style.display = 'block';

});

// Hide the highlight when the mouse leaves the document
document.addEventListener('mouseleave', () => {
    const highlight = getOrCreateHighlightElement();
    highlight.style.display = 'none';
    console.log('mouseleave')
});

chrome.runtime.onMessage.addListener(({ action, value }: popupMessage, sender) => {
    const highlight = getOrCreateHighlightElement();
    console.log(`content script get ${value} from ${sender}`)
    if (action === 'setColor' && value) {
        highlight.style.backgroundColor = hexToRgba(value, 0.4);
        console.log(`Highlight color changed to ${value}`);
    }
    if (action === 'setHight' && value) {
        highlight.style.height = `${value}px`
        console.log(`Highlight hight changed to ${highlight.style.height}`);
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
