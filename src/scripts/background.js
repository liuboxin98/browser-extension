import chrome from "./utils/ext";


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  console.log('perform-save');

  if (request.action === "perform-save") {
    console.log("chromeension Type: ", "/* @echo chromeension */");
    console.log("PERFORM AJAX", request.data);

    sendResponse({
      action: "saved",
      data: document
    });
  }
});