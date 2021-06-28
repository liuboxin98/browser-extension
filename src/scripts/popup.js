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
      action: "perform-save",
      data: "nothing",
    },
    function (response) {
      if (response && response.action === "saved") {
        console.log(response.data);
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
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