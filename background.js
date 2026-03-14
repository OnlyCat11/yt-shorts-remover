const convertShortsToNormal = (details) => {

  if (details.frameId !== 0) return;

  const url = details.url;

  if (url && url.includes("/shorts/")) {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      const shortsIndex = pathSegments.indexOf('shorts');
      const videoId = pathSegments[shortsIndex + 1];

      if (videoId) {
        const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;

        chrome.tabs.get(details.tabId, (tab) => {
          if (chrome.runtime.lastError) return;

          if (tab && tab.url.includes("/shorts/")) {
            chrome.tabs.update(details.tabId, { url: targetUrl });
          }
        });
      }
    } catch (error) {
      console.error("URL 변환 중 오류 발생:", error);
    }
  }
};

chrome.webNavigation.onHistoryStateUpdated.addListener(convertShortsToNormal, {
  url: [{ hostSuffix: "youtube.com", pathContains: "/shorts/" }]
});

chrome.webNavigation.onBeforeNavigate.addListener(convertShortsToNormal, {
  url: [{ hostSuffix: "youtube.com", pathContains: "/shorts/" }]
});
