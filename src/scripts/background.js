import chrome from "./utils/ext";


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  console.log('fromPopup');


  if (request.action === "fromPopup") {
    console.log("chromeension Type: ", "/* @echo chromeension */");
    console.log("PERFORM AJAX", request.data);

    sendResponse({
      action: "saved",
      data: document
    });
  }
  if (request.action === "fromContent") {

    setTimeout(() => {

      sendResponse(`ok`)

    }, 3000);


    return true;
  }
});