let jsonData = []; // 存储所有 JSON 数据
let startIndex = 0; // 起始索引
const batchSize = 12; // 每次加载的数据量
const maxSummaryLength = 50; // summary 最大长度限制

// 移除 HTML 标签的函数
function removeHtmlTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

// 格式化日期的函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 加载更多数据的函数
function loadMoreData() {
    const messagesContainer = document.getElementById('messages-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // 截取下一个批次的数据
    const batch = jsonData.slice(startIndex, startIndex + batchSize);

    // 渲染批次数据到 HTML 页面中
    batch.forEach(item => {
        // 移除 HTML 标签并截取 summary，确保不超过最大长度限制
        let summaryText = removeHtmlTags(item.summary).trim();
        if (summaryText.length > maxSummaryLength) {
            summaryText = summaryText.substring(0, maxSummaryLength) + '...';
        }
        if (summaryText.length === 0) {
            summaryText = "此 summary 没有内容";
        }

        // 格式化日期
        const formattedDate = formatDate(item.published);

        // 使用模板字符串构造 HTML
        const html = `
            <div class="message">
                <div class="message-content">
                    <div class="username">
                        <a href="${item.link}">${item.title || "无标题"}</a>
                    </div>
                    <div class="text">
                        ${summaryText}
                    </div>
                </div>
                <div class="friend-meta-info">
                    <div class="message-time">
                        ${formattedDate}
                    </div>
                    <div class="author">
                        ${item.author || "未知作者"}
                    </div>
                </div>
            </div>
        `;

        // 将构造的 HTML 插入到容器中
        messagesContainer.insertAdjacentHTML('beforeend', html);
    });

    // 更新起始索引
    startIndex += batchSize;

    // 检查是否还有更多数据可加载
    if (startIndex >= jsonData.length) {
        loadMoreBtn.disabled = true; // 如果没有更多数据，则禁用按钮
    }
}

// 加载初始数据
fetch("https://link.m-c.top/rss/json/moments.json")
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        loadMoreData(); // 加载初始数据
    })
    .catch(error => {
        Popup.show('friend.js', '我们无法从远端服务器获取数据' + error, 'error');
    });

// 按钮点击事件
const loadMoreBtn = document.getElementById('load-more-btn');
loadMoreBtn.addEventListener('click', loadMoreData);
