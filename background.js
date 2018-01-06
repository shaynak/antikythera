chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
  if (response.method == "collectText") {
    txt = response.data;
  }
  sendResponse({resp: "got"});
});