// ページ上に表示されるテキストのみを検索し、ハイライトして件数を返す
async function checkAndHighlight() {
    try {
      // targets.json を取得
      const response = await fetch(chrome.runtime.getURL("targets.json"));
      const targetData = await response.json();
  
      const currentURL = window.location.href;
      let regexList = targetData['default'];
  
      // URL prefix 一致で検索ワード切替
      for (const key in targetData) {
        if (key !== "default" && currentURL.startsWith(key)) {
          regexList = targetData[key];
          break;
        }
      }
  
      // 正規表現配列に変換
      const compiledRegexList = regexList.map(pat => new RegExp(pat, "g"));
  
      const results = [];
  
      // 再帰的にテキストノードを走査してハイライト
      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue;
          compiledRegexList.forEach(regex => {
            if (regex.test(text)) {
              // ハイライト用 span を作成
              const span = document.createElement("span");
              span.innerHTML = text.replace(regex, match => `<mark class="highlight">${match}</mark>`);
              node.parentNode.replaceChild(span, node);
              results.push(text);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(node);
          // 非表示・スクリプト・スタイル・ハイライト済みは除外
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            ["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.tagName) ||
            node.classList.contains("highlight")
          ) return;
  
          [...node.childNodes].forEach(walk);
        }
      }
  
      walk(document.body);
  
      return results;
  
    } catch (err) {
      console.error("targets.jsonの読み込みに失敗しました:", err);
      return [];
    }
  }
  
  // ポップアップから呼び出すためのリスナー
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "check") {
      checkAndHighlight().then(foundItems => {
        sendResponse({ found: foundItems });
      });
      return true; // 非同期応答を許可
    }
  });
  