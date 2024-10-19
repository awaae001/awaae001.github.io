fetch('https://link.m-c.top/link/friend.json')
.then(response => response.json())
.then(jsonData => {
    function generateCardHTML(data, selector) {
        const selectType = selector === 'class' ? '.' : '#';
        return `
            <div class="card" title="${data.info}">
                <img class="ava" src="${data.avatar}" />
                <div class="card-header">
                   <div>
                      <a href="${data.link}">${data.name}</a>
                   </div>
                   <div class="info">${data.info}</div>
                </div>
             </div>
        `;
    }

    function renderCards(selector, websites) {
        const container = document.querySelector(`.${selector}`);
        if (container) {
            container.innerHTML = websites.map(data => generateCardHTML(data, selector)).join('');
        } else {
            const containerById = document.getElementById(selector);
            if (containerById) {
                containerById.innerHTML = websites.map(data => generateCardHTML(data, selector)).join('');
            }
        }
    }

    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            const group = jsonData[key];
            renderCards(group.tag, group.website);
        }
    }
})
.catch(error => Popup.show('出现问题！', '我们无法从远端服务器获取数据 - 友链区js', 'error'));