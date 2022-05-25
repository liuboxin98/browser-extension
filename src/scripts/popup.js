const btnSave = document.querySelector('#btnSave');
const btnSaveFilter = document.querySelector('#btnSaveFilter');
const switchFilter = document.querySelector('#switchFilter');

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
  chrome.tabs.sendMessage(tab_id, { action: 'getFilterData' });

});


// 监听事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getBlock") {
    renderTable(request.json)
  }
  if (request.action === 'getUrlFilter') {
    renderFilterTable(request.json)
  }
});

// 保存事件
btnSave.onclick = () => {

  const tagName = document.getElementById('tagName').value;
  const optionsType = document.getElementsByName('optionsType');

  if (!tagName) {
    alert('你什么都没填哦！！！')
    return
  }

  let checked = '';
  for (var i = 0; i < optionsType.length; i++) {
    if (optionsType[i].checked) {
      checked = optionsType[i].value;
      break;
    }
  }

  // repository
  // vi. the machine doesn't exist.
  // vt. he lives in Paris.
  // get user register table
  // this.referrer
  // acknowledgment
  // spring summer autumn winter

  chrome.tabs.sendMessage(tab_id, { action: 'blockDom', seletor: checked, name: tagName }, function (response) {
    console.log(response);
    if (response) {
      renderTable(response)
      alert('屏蔽成功！')
    } else {
      alert('屏蔽失败！刷新页面试下。')
    }
  });

};

function renderTable(json) {

  let html = `<table class="table table-bordered table-striped">
                <caption>已屏蔽的元素</caption>
                <thead>
                  <tr>
                    <th>选择器</th>
                    <th>标签名</th>
                    <th>操作</th>
                  </tr>
                </thead>
              <tbody>`;

  json.map(item => {
    html += `<tr>
              <td>${item.seletor}</td>
              <td>${item.name}</td>
              <td><a class="del_dom" attr1='${item.seletor}' attr2='${item.name}'>删除</a></td>
             </tr>`
  });
  html += `</tbody></table>`;

  document.querySelector('#scroll').innerHTML = html;


  const btn = document.querySelectorAll('.del_dom');
  for (var i = 0; i < btn.length; i++) {

    console.log(btn[i]);

    btn[i].onclick = () => {
      alert('11')
      // let seletor = this.getAttribute('attr1');
      // let name = this.getAttribute('attr2');
      // delBlock(seletor, name)

    };
  }

}


function delBlock(seletor, name) {

  console.log(seletor, name);
  chrome.tabs.sendMessage(tab_id, { action: 'delBlock', seletor, name }, function (response) {
    if (response) {
      renderTable(response)
    } else {
      alert('删除失败！')
    }
  });
}

const s_b = document.querySelector('.switch-block');
const s_f = document.querySelector('.switch-filter');

s_b.onclick = function () {
  document.querySelector('.filter').style = 'display:none'
  document.querySelector('.block-dom').style = 'display:block'
}

s_f.onclick = function () {
  document.querySelector('.block-dom').style = 'display:none'
  document.querySelector('.filter').style = 'display:block'
}


btnSaveFilter.onclick = () => {
  const urlFilter = document.getElementById('urlFilter').value;

  if (!urlFilter) {
    alert('你什么都没填哦！！！')
    return
  }

  chrome.tabs.sendMessage(tab_id, { action: 'urlFilter', url: urlFilter }, function (response) {
    // if (response) {
    //   alert('屏蔽成功！')
    // } else {
    //   alert('屏蔽失败！刷新页面试下。')
    // }
  });


}

switchFilter.onclick = () => {
  localStorage.setItem('switchFilter', switchFilter.checked);

  sendFilterStatus(switchFilter.checked);

}


function sendFilterStatus(checked) {
  chrome.tabs.sendMessage(tab_id, { action: 'filterStatus', status: checked }, function (response) {
    console.log(response);
  });
}


function renderFilterTable(json) {
  console.log(json);
  let html = `<table class="table table-bordered table-striped">
                <caption>已过滤的URL</caption>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>操作</th>
                  </tr>
                </thead>
              <tbody>`;

  json.map(item => {
    html += `<tr>
              <td>${item}</td>
              <td><a class="del_dom" attr='${item}'>删除</a></td>
             </tr>`
  });
  html += `</tbody></table>`;

  document.querySelector('#filterTabel').innerHTML = html;


  const btn = document.getElementsByClassName('del_dom');

  // 解决办法
  for (var i = 0; i < btn.length; i++) {
    btn[i].onclick = function () {
      let seletor = this.getAttribute('attr');
      // delUrlFilter(seletor)
    };
  }

}









