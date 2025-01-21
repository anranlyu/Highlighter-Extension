console.log('content script has been injected');


import { popupMessage } from '../services/sendPopupMessage';
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

chrome.storage.local.get(['color', 'height', 'isEnabled'], (result) => {
    console.log(`get color:${result.color} and height:${result.height} and isEnabled:${result.isEnabled} from storage`);
    const highlightElement = getOrCreateHighlightElement();

    if (result.color) {
        highlightElement.style.backgroundColor = hexToRgba(result.color, 0.4);
    }

    if (result.height) {
        highlightElement.style.height = `${result.height}px`;
    }

    if (result.isEnabled !== undefined) {
        highlightElement.style.visibility = result.isEnabled ?  'visible' : 'hidden';
    }
});

// Update the highlight position based on cursor and scroll position
document.addEventListener('mousemove', (event) => {
    const highlight = getOrCreateHighlightElement();

    const height = +highlight.style.height.slice(0, -2);


    const { clientY } = event;

    // Account for scroll position to ensure correct placement
    const topPosition = clientY + window.scrollY -height/2;

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
    const highlightElement = getOrCreateHighlightElement();
    console.log(`content script get ${value} from ${sender}`)
    if (action === 'setColor' && value) {
        highlightElement.style.backgroundColor = hexToRgba(value as string, 0.4);
        console.log(`Highlight color changed to ${value}`);
    }
    if (action === 'setHeight' && value) {
        highlightElement.style.height = `${value}px`
        console.log(`Highlight height changed to ${highlightElement.style.height}`);
    }
    if (action === 'turn on/off highlight') {
        highlightElement.style.visibility = value ?  'visible' : 'hidden';
        
        console.log('get toggle switch message')
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
