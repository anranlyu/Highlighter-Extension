import { useEffect, useState } from 'react';
import ToggleSwitch from './components/toggleSwitch';
import { sendPopupMessage } from './services/sendPopupMessage';

function App() {
  const [color, setColor] = useState('#2563eb');
  const [hight, setHight] = useState('20');
  const [isEnabled, setEnable] = useState(false);

  useEffect(() => {
    console.log('useeffect is being called');
    chrome.storage.local.get(['color', 'hight', 'isEnabled'], (data) => {
      if (data.color) setColor(data.color);
      if (data.hight) setHight(data.hight);
      if (data.isEnabled) setEnable(data.isEnabled);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local
      .set({ color: color, hight: hight, isEnabled: isEnabled })
      .then(() =>
        console.log(
          `set color in local storage to ${color}, set hight in local storage to ${hight}, set isenabled in local storage to ${isEnabled}`
        )
      );
  }, [color, hight, isEnabled]);

  const handleCheckboxChange = () => {
    console.log('Switch got clicked');
    sendPopupMessage({ action: 'turn on/off highlight', value: !isEnabled });
    setEnable(!isEnabled);
  };

  const handleColorInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    setColor(target.value);
    sendPopupMessage({
      action: 'setColor',
      value: target.value,
    });
  };

  const handleHightInput = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setHight(target.value);
    sendPopupMessage({
      action: 'setHight',
      value: target.value,
    });
    target.placeholder = target.value;
  };
  return (
    <>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Highlighter
        </h5>

        <ToggleSwitch
          handleCheckboxChange={handleCheckboxChange}
          isEnabled={isEnabled}
        />

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
          value={color}
          title="Choose your color"
          onInput={handleColorInput}
        />
        <label
          htmlFor="number-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Hight:
        </label>
        <input
          type="number"
          id="number-input"
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={hight}
          value={hight}
          onInput={handleHightInput}
        />
      </div>
    </>
  );
}

export default App;
