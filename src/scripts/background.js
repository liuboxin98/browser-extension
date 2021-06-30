chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "fromPopup") {
    sendResponse({
      action: "saved",
      data: document
    });
  }
  if (request.action === 'savedBlock') {

    let { seletor, name } = request;

    chrome.runtime.sendMessage({ action: 'savedBlockFromBg', seletor, name }, function (response) {
      console.log(response);
    });

    sendResponse('bg ok!');

  }


});