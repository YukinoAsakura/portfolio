// ページ内検索とハイライトを行う関数
async function checkAndHighlight() {
    try {
      const response = await fetch(chrome.runtime.getURL('targets.json'));
      const targetData = await response.json();
  
      const currentURL = window.location.href; // URL全体
      let regexList = targetData['default'];   // デフォルト
  
      // prefix一致で検索ワードを切り替え
      for (const key in targetData) {
        if (key !== "default" && currentURL.startsWith(key)) {
          regexList = targetData[key];
          break; // 最初にマッチしたものだけを使用
        }
      }
  
      const bodyHTML = document.body.innerHTML;
      let newHTML = bodyHTML;
      const foundItems = [];
  
      regexList.forEach(pattern => {
        const regex = new RegExp(pattern, "gi");
        let match;
        while ((match = regex.exec(bodyHTML)) !== null) {
          foundItems.push(match[0]);
        }
        newHTML = newHTML.replace(regex, match => `<mark style="background:yellow;">${match}</mark>`);
      });
  
      document.body.innerHTML = newHTML;
  
      return foundItems;
    } catch (err) {
      console.error("targets.jsonの読み込みに失敗しました", err);
      return [];
    }
  }
  
  // ポップアップから呼び出せるようにリスナーを登録
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "check") {
      checkAndHighlight().then(foundItems => {
        sendResponse({ found: foundItems });
      });
      return true; // 非同期応答を許可
    }
  });
  