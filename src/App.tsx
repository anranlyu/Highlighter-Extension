export interface popupMessage {
  action: string;
  value: string;
}

function App() {
  // const [color, setColor] = useState('#2563eb');
  // const [hight, setHight] = useState('20');

  const sendPopupMessage = (m: popupMessage) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, m);
      }
    });
  };

  const handleColorInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    sendPopupMessage({
      action: 'setColor',
      value: target.value,
    });
  };

  const handleHightInput = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

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
          value={'#2563eb'}
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
          placeholder={'20'}
          onInput={handleHightInput}
        />
      </div>
    </>
  );
}

export default App;
