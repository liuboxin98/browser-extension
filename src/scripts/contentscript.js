// import ext from "./utils/ext";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === 'blockDom') {
    sendResponse(block(request.seletor, request.name))
  }
  if (request.action === 'getBlockStatus') {
    getBlock()
  }
  if (request.action === 'getFilterData') {
    getUrlFilterData()
  }
  if (request.action === 'delBlock') {

    let data = delBlock(request.seletor, request.name);
    if (data) {
      sendResponse(data);
    } else {
      sendResponse(false);
    }
  }
  if (request.action === 'urlFilter') {
    setUrlFilter(request.url)
  }
  if (request.action === 'filterStatus') {
    localStorage.setItem('filterStatus', request.status)
    filter_status = request.status;
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




// ----------------

function setUrlFilter(url) {
  let local = JSON.parse(localStorage.getItem('url_filter'));
  if (local) {
    let item = local.find(item => item == url);
    if (!item) {
      local.push(url);
      localStorage.setItem('url_filter', JSON.stringify(local));
    }
  } else {
    localStorage.setItem('url_filter', JSON.stringify([url]));

  }
}

function getUrlFilterData() {
  let json = JSON.parse(localStorage.getItem('url_filter'));
  if (json) {
    chrome.runtime.sendMessage({ action: 'getUrlFilter', json });
  }
}

function filterInit() {
  var filter_status = false;

  let status = JSON.parse(localStorage.getItem('filterStatus'));
  if (status) {
    filter_status = status
  }

  let urls = JSON.parse(localStorage.getItem('url_filter'))

  let str = ''
  if (urls) {
    urls.map(url => {
      str += ` -site:${url}`
    })
  }

  const btnBaiduSearch = document.querySelector('#su');

  try {
    btnBaiduSearch.onclick = () => {
      const inputBaiduSearch = document.querySelector('#kw');
      if (filter_status) {

        if (!inputBaiduSearch.value.includes(str)) {
          inputBaiduSearch.value += str;
        }
      } else {
        inputBaiduSearch.value = inputBaiduSearch.value.replace(str, '');
      }
    }
  }
  catch (error) { }
}

filterInit();