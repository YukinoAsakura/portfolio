const textarea = document.getElementById("jsonInput");
const saveBtn = document.getElementById("save");

chrome.storage.sync.get("rules", (data) => {
  textarea.value = JSON.stringify({ rules: data.rules || [] }, null, 2);
});

saveBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(textarea.value);
    parsed.rules.forEach(rule => {
      rule.patterns.forEach(p => new RegExp(p));
    });
    chrome.storage.sync.set({ rules: parsed.rules });
    alert("保存しました");
  } catch (e) {
    alert("JSON or 正規表現が不正です");
  }
});