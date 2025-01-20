

export interface popupMessage {
  action: string;
  value: string | boolean;
}

export const sendPopupMessage = (m: popupMessage) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, m);
      }
    });
};
