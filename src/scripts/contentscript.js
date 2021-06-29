// import chrome from "./utils/chrome";


console.log('in content');

if (window.location.origin.includes('localhost')) {
  // document.getElementsByClassName('logo')[0].innerText = 'testttttttttttttttttt'
}

var extractTags = () => {
  var url = document.location.href;
  if (!url || !url.match(/^http/)) return;

  var data = {
    title: "",
    description: "",
    url: document.location.href
  }

  var ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle) {
    data.title = ogTitle.getAttribute("content")
  } else {
    data.title = document.title
  }

  var descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']")
  if (descriptionTag) {
    data.description = descriptionTag.getAttribute("content")
  }

  console.log(data);

  localStorage.setItem('web', JSON.stringify(data));
  return data;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }

});

chrome.runtime.sendMessage({
  action: "fromContent"
}, function (response) {
  console.clear()
  console.log('background.js said : ' + response);
});