const btnSave = document.querySelector('#btnSave');

btnSave.onclick = () => {

  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, function (tabs) {
    var activeTab = tabs[0];

    const tagName = document.getElementById('tagName').value;
    const optionsType = document.getElementsByName('optionsType');

    let checked = '';
    for (var i = 0; i < optionsType.length; i++) {
      if (optionsType[i].checked) {
        checked = optionsType[i].value;
        break;
      }
    }

    let data = {
      action: 'blockDom',
      seletor: checked,
      name: tagName
    }

    chrome.tabs.sendMessage(activeTab.id, data, function (response) {
      console.log(response);
      if (response) {
        alert('屏蔽成功！')
      }
    });
  });


};



// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "savedBlock") {
//     console.log(request);
//     let { seletor, name } = request;
//     let htm = `<p><a onclick="delBlock(${seletor},${name})">${seletor} ${name}<a/></p>`;
//     document.querySelector('#scroll').innerHTML = htm;
//   }
// });

// function delBlock(seletor, name) {
//   console.log(seletor, name);
// }