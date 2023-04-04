chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize Selected Text",
    contexts: ["selection"]
  });
  
  chrome.action.onClicked.addListener(async (tab) => {
    const [tabId] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: summarizeSelectedText,
    });
    
    const summary = tabId[0].result;
    alert(summary);
  });
  
  async function summarizeSelectedText() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_API_KEY"
      },
      body: JSON.stringify({
        prompt: `Summarize the following text:\n\n${window.getSelection().toString()}`,
        max_tokens: 50
      })
    });
    
    const data = await response.json();
    const summary = data.choices[0].text.trim();
    
    return summary;
  }
  