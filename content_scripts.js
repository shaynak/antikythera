chrome.runtime.sendMessage({data: document.body.innerText, method: "collectText"}, function(response) {
	console.log(response.resp);
});