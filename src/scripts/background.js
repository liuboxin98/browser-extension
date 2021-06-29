chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "fromPopup") {
    sendResponse({
      action: "saved",
      data: document
    });
  }


});