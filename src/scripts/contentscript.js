// import ext from "./utils/ext";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'blockDom') {
    sendResponse(block(request.seletor, request.name))
  }
  if (request.action === 'getBlockStatus') {
    getBlock()
  }
  if (request.action === 'delBlock') {

    let data = delBlock(request.seletor, request.name);
    if (data) {
      sendResponse(data);
    } else {
      sendResponse(false);
    }
  }

});


function block(seletor, name) {
  try {
    if (seletor === 'class') {
      document.querySelector(`.${name}`).style = 'display:none !important';
    } else {
      document.getElementById(`${name}`).style = 'display:none !important';
    }
  } catch (error) {
    console.log(error);
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

function getBlock() {
  let json = readLocal();
  if (json) {
    chrome.runtime.sendMessage({ action: 'getBlock', json });
  }
}

function delBlock(seletor, name) {
  let json = readLocal()
  if (json) {

    if (seletor === 'class') {
      document.querySelector(`.${name}`).style = 'display:block';
    }
    else {
      document.getElementById(`${name}`).style = 'display:block';
    }

    let newdata = json.filter(item => item.seletor !== seletor || item.name !== name);

    localStorage.setItem('block_dom', JSON.stringify(newdata));

    return newdata;
  } else {
    return false
  }
}

function Init() {
  let json = readLocal();
  if (json) {
    setTimeout(() => {
      json.map(item => {
        block(item.seletor, item.name)
      })
    }, 1000);

  }
}

Init();