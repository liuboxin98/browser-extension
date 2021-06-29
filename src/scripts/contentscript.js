// import ext from "./utils/ext";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'blockDom') {
    sendResponse(block(request.seletor, request.name))
  }

});


function block(seletor, name) {
  if (seletor === 'class') {
    document.querySelector(`.${name}`).style = 'display:none';
    saveLocal(seletor, name)
  } else {
    document.getElementById(`${name}`).style = 'display:none';
    saveLocal(seletor, name)
  }
  return true
}

function saveLocal(seletor, name) {
  localStorage.setItem('block_dom', JSON.stringify({ seletor, name }));
}

function readLocal() {
  if (JSON.parse(localStorage.getItem('block_dom'))) {
    var { seletor, name } = JSON.parse(localStorage.getItem('block_dom'));
    if (seletor && name) {
      block(seletor, name)

      // chrome.runtime.sendMessage({ action: 'savedBlock', seletor, name }, function (response) {
      //   console.log(response);
      // });
    }
  }
}

readLocal();