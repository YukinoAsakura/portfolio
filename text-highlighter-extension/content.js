const HIGHLIGHT_TAG = "mark";

function buildCombinedRegex(patterns) {
  try {
    return new RegExp(`(${patterns.join("|")})`, "gi");
  } catch (e) {
    console.warn("Invalid regex:", patterns);
    return null;
  }
}

function highlightTextNode(node, regex, counter) {
  if (!regex) return;

  const text = node.nodeValue;
  if (!regex.test(text)) return;

  regex.lastIndex = 0;

  const span = document.createElement("span");

  span.innerHTML = text.replace(regex, (match) => {
    counter[match] = (counter[match] || 0) + 1;
    return `<mark>${match}</mark>`;
  });

  node.replaceWith(span);
}

function processDocument(root, regex, counter) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentNode?.closest("mark")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    highlightTextNode(node, regex, counter);
  }
}

function observeChanges(regex, counter) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          highlightTextNode(node, regex, counter);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          processDocument(node, regex, counter);
        }
      });
    }

    renderOverlay(counter); // 更新
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
function renderOverlay(counter) {
  let container = document.getElementById("highlight-result");

  if (!container) {
    container = document.createElement("div");
    container.id = "highlight-result";

    Object.assign(container.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      zIndex: 9999,
      background: "rgba(0,0,0,0.8)",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "12px",
      maxWidth: "200px"
    });

    document.body.appendChild(container);
  }

  const entries = Object.entries(counter);

  if (entries.length === 0) {
    container.innerHTML = "No matches";
    return;
  }

  container.innerHTML = entries
    .map(([word, count]) => `${word}: ${count}`)
    .join("<br>");
}

function applyHighlight(rules) {
  const currentUrl = location.href;
  const rule = rules.find(r => currentUrl.includes(r.url));
  if (!rule) return;

  const regex = buildCombinedRegex(rule.patterns);
  if (!regex) return;

  const counter = {}; // ←追加

  processDocument(document.body, regex, counter);
  renderOverlay(counter); // 初回表示
  observeChanges(regex, counter);
}

chrome.storage.sync.get("rules", (data) => {
  if (data.rules) applyHighlight(data.rules);
});