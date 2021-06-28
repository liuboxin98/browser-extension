import chrome from "./utils/ext";
import storage from "./utils/storage";

// debugger

var popup = document.getElementById("app");
storage.get("color", function (resp) {
  var color = resp.color;
  if (color) {
    popup.style.backgroundColor = color;
  }
});


var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
};


var optionsLink = document.querySelector(".js-options");

optionsLink.addEventListener("click", function (e) {
  e.preventDefault();
  // chrome.tabs.create({ 'url': chrome.chromeension.getURL('options.html') });

  chrome.tabs.getSelected(null, function (tab) {
    //获取当前tab
    console.log(tab);
  });

  chrome.runtime.sendMessage({
      action: "fromPopup",
      data: "nothing",
    },
    function (response) {
      if (response && response.action === "saved") {
        console.log(response.data);
        renderMessage("Your message send success!");
      } else {
        renderMessage("Sorry, message send fail.");
      }
    }
  );

  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id, {
        action: "process-page",
      },
      function (response) {
        console.log(response);
      }
    );
  });
});



chrome.history.search({
  'text': '', // Return every history item....
  'startTime': (new Date).getTime() - 1000 * 60 * 60 * 24 * 7 // that was accessed less than one week ago.
}, function (res) {
  console.log(res);

})