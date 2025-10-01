// 友情链接功能集合 - 合并了friend.js、friend-links.js和randomlinks.js的功能
// 包含：朋友动态加载、友情链接卡片渲染、随机链接生成

// ==================== 朋友动态加载功能 ====================

let friendData = []; // 存储朋友动态数据
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
    const batch = friendData.slice(startIndex, startIndex + batchSize);

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

// ==================== 友情链接卡片渲染功能 ====================

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

function renderFriendLinks(linksData) {
    for (const key in linksData) {
        if (linksData.hasOwnProperty(key)) {
            const group = linksData[key];
            renderCards(group.tag, group.website);
        }
    }
}

// ==================== 随机链接生成功能 ====================

// Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 根据权重生成加权数组
function generateWeightedArray(data) {
    const weightedArray = [];
    Object.values(data).forEach(item => {
        const weight = parseFloat(item.Weights);
        item.website.forEach(website => {
            for (let i = 0; i < weight * 10; i++) { // 乘以10以增加权重的影响
                weightedArray.push(website);
            }
        });
    });
    return weightedArray;
}

function getRandomItems(array, count) {
    const shuffled = shuffle(array); // 使用Fisher-Yates shuffle算法打乱数组顺序
    return shuffled.slice(0, count);
}

function renderRandomLinks(data, randomLinksDiv) {
    randomLinksDiv.innerHTML = '';

    // 根据权重生成加权数组
    const weightedArray = generateWeightedArray(data);

    // 随机选择5个链接
    const randomItems = getRandomItems(weightedArray, 5);

    randomItems.forEach(item => {
        const linkElement = document.createElement('a');
        linkElement.href = item.link;
        linkElement.textContent = item.name;
        randomLinksDiv.appendChild(linkElement);
        randomLinksDiv.appendChild(document.createElement('br'));
    });
}

// ==================== 初始化和数据加载 ====================

function initializeFriendLinks() {
    // 加载朋友动态数据
    fetchWithFallback("https://cdata.neosora.cc/rss/json/moments.json", 'moments')
        .then(data => {
            if (data) {
                friendData = data;
                loadMoreData(); // 加载初始数据

                // 按钮点击事件
                const loadMoreBtn = document.getElementById('load-more-btn');
                if (loadMoreBtn) {
                    loadMoreBtn.addEventListener('click', loadMoreData);
                }
            }
        });

    // 加载友情链接数据
    fetchWithFallback('https://cdata.neosora.cc/link/friend.json', 'friend')
        .then(linksData => {
            if (linksData) {
                renderFriendLinks(linksData);

                // 初始化随机链接功能
                const regenerateButton = document.getElementById('regenerateButton');
                const randomLinksDiv = document.getElementById('randomLinks');

                if (randomLinksDiv) {
                    renderRandomLinks(linksData, randomLinksDiv);

                    if (regenerateButton) {
                        regenerateButton.addEventListener('click', () => renderRandomLinks(linksData, randomLinksDiv));
                    }
                }
            }
        });
}

// 处理CORS问题的fetch函数
function fetchWithFallback(url, type) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.warn(`无法获取${type}数据，使用备用方案:`, error.message);

            // 如果是CORS错误，使用备用数据或显示提示
            if (error.message.includes('CORS') || error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
                // 显示用户友好的提示而不是错误
                if (typeof Popup !== 'undefined') {
                    Popup.show('friend-links-combined.js', `由于浏览器限制，无法加载${type}数据。请直接访问 <a href="${url}" target="_blank">${url}</a> 查看内容。`, 'info');
                }
                return null;
            }

            // 其他类型的错误
            if (typeof Popup !== 'undefined') {
                Popup.show('friend-links-combined.js', `无法获取${type}数据: ${error.message}`, 'error');
            }
            return null;
        });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeFriendLinks);