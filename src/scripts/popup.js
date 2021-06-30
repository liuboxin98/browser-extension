const btnSave = document.querySelector('#btnSave');

var tab_id = 0;

function Init(callback) {
  chrome.tabs.getSelected(null, function (tab) {
    callback(tab)
  })
}

// 页面加载事件
Init(function (tab) {
  tab_id = tab.id;
  console.log(tab_id);

  //获取当前tab
  chrome.tabs.sendMessage(tab_id, { action: 'getBlockStatus' });
});


// 监听事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getBlock") {
    console.log(request);

    getTable(request.json)


    document.querySelector('#delBlock').onclick = () => {

      console.log('del click');
      chrome.tabs.sendMessage(tab_id, { action: 'delBlock' }, function (response) {
        console.log(response);

        if (response) {
          alert('删除成功！');
        } else {
          alert('删除失败！')
        }
      });
    };


  }
});


// 点击事件
btnSave.onclick = () => {

  const tagName = document.getElementById('tagName').value;
  const optionsType = document.getElementsByName('optionsType');

  let checked = '';
  for (var i = 0; i < optionsType.length; i++) {
    if (optionsType[i].checked) {
      checked = optionsType[i].value;
      break;
    }
  }

  chrome.tabs.sendMessage(tab_id, { action: 'blockDom', seletor: checked, name: tagName }, function (response) {
    console.log(response);
    if (response) {
      getTable(response)
      alert('屏蔽成功！')
    } else {
      alert('屏蔽失败！刷新页面试下。')
    }
  });

};

function getTable(json) {

  let html = `<table class="table table-bordered table-striped">
  <caption>已屏蔽的元素</caption>
  <thead>
    <tr>
      <th>选择器</th>
      <th>名称</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody>`;
  json.map(item => {
    html += `<tr>
              <td>${item.seletor}</td>
              <td>${item.name}</td>
              <td><a>删除</a></td>
             </tr>`
  })
  html += `</tbody></table>`;

  document.querySelector('#scroll').innerHTML = html;
}