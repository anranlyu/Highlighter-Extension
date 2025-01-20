import { useState } from 'react';

export interface popupMessage {
  action: string;
  value: string;
}

function App() {
  const [color, setColor] = useState('#2563eb');
  const handleColorInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    setColor(target.value);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id !== undefined) {
        const message: popupMessage = {
          action: 'setHighlightColor',
          value: color,
        };
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  };
  return (
    <>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Highlighter
        </h5>

        <label
          htmlFor="hs-color-input"
          className="block text-sm font-medium mb-2 dark:text-white"
        >
          Color picker
        </label>
        <input
          type="color"
          className="p-1 h-10 w-full block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
          id="hs-color-input"
          value="#2563eb"
          title="Choose your color"
          onInput={handleColorInput}
        />
      </div>
    </>
  );
}

export default App;
