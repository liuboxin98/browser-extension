// import ext from "./utils/ext";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'blockDom') {
    sendResponse(block(request.seletor, request.name))
  }
  if (request.action === 'getBlockStatus') {
    getBlock()
  }
  if (request.action === 'delBlock') {
    let json = JSON.parse(localStorage.getItem('block_dom'));

    if (json) {
      let { seletor, name } = json;

      if (seletor === 'class') {
        document.querySelector(`.${name}`).style = 'display:block';
      }
      else {
        document.getElementById(`${name}`).style = 'display:block';
      }

      localStorage.removeItem('block_dom');

      sendResponse(true);
    } else {
      sendResponse(false);
    }
  }

});


function block(seletor, name) {
  if (seletor === 'class') {
    document.querySelector(`.${name}`).style = 'display:none';
  } else {
    document.getElementById(`${name}`).style = 'display:none';
  }
  saveLocal(seletor, name)
  return readLocal()
}

function saveLocal(seletor, name) {

  let local = JSON.parse(localStorage.getItem('block_dom'));

  if (local) {
    let item = local.find(item => item.seletor == seletor && item.name == name);
    if (!item) {
      local.push({ seletor, name });
    }
    localStorage.setItem('block_dom', JSON.stringify(local));
  } else {
    localStorage.setItem('block_dom', JSON.stringify([{ seletor, name }]));
  }

}

function readLocal() {
  if (JSON.parse(localStorage.getItem('block_dom'))) {
    return JSON.parse(localStorage.getItem('block_dom'));
  }
}

function Init() {
  let json = readLocal();
  if (json) {
    json.map(item => {
      block(item.seletor, item.name)
    })
  }
}


function getBlock() {
  let json = readLocal();
  if (json) {
    chrome.runtime.sendMessage({ action: 'getBlock', json });
  }
}

Init();