chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    rules: [
      {
        url: "example.com",
        patterns: ["重要", "エラー\\d+", "(注意|警告)"]
      }
    ]
  });
});