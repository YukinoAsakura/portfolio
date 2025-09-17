document.getElementById("checkBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "check" }, response => {
        const resultDiv = document.getElementById("result");
        if (response && response.found && response.found.length > 0) {
          resultDiv.innerHTML = `見つかりました (${response.found.length}件):<br>${response.found.join(", ")}`;
        } else {
          resultDiv.innerText = "見つかりませんでした";
        }
      });
    });
  });
  