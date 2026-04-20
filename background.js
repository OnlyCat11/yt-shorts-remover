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

        chrome.scripting.executeScript({
          target: { tabId: details.tabId, frameIds: [0] },
          func: (url) => { location.replace(url); },
          args: [targetUrl]
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
