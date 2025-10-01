// 页面特定功能集合 - 合并了go-post.js、bulletin-info.js和site-info-main.js的功能
// 包含：随机文章跳转、公告信息显示、站点信息弹窗

// ==================== 随机文章跳转功能 ====================

let countdownTimer; // 声明全局变量用于存储定时器
let countdown = 5; // 初始倒计时时间

function showConfirmation() {
    randomArticle(); // 获取随机文章信息
    const gotoPost = document.getElementById('goto-post');
    if (gotoPost) {
        gotoPost.style.opacity = '1'; // 显示弹窗
        gotoPost.style.display = 'block'; // 确保显示状态
        startCountdown(); // 开始倒计时
    }
}

function randomArticle() {
    const jsonUrl = 'https://cdata.neosora.cc/blog/output/timeline.json';

    fetchWithFallback(jsonUrl, '随机文章')
        .then(data => {
            if (!data) return;

            // 将所有文章整合为一个数组
            let allArticles = [];
            Object.keys(data).forEach(year => {
                Object.keys(data[year]).forEach(month => {
                    data[year][month].forEach(article => {
                        allArticles.push(article);
                    });
                });
            });

            // 随机选择一篇文章
            if (allArticles.length === 0) {
                throw new Error('No articles found');
            }
            const randomIndex = Math.floor(Math.random() * allArticles.length);
            const randomArticle = allArticles[randomIndex];

            // 保留简短描述在150字以内
            const shortDescription = randomArticle.short_description.length > 150 ?
                randomArticle.short_description.substring(0, 150) + '...' :
                randomArticle.short_description;

            // 使用模板生成文章内容
            const entryHtml = `
                <div class="entry">
                    <h3>
                        <a href="${randomArticle.url}" class="time-link" target="_blank">
                            ${randomArticle.title}
                        </a>
                    </h3>
                    <div class="timelist-meta">
                        <span>
                            <i class="fa fa-clock-o"></i>
                            ${new Date(randomArticle.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span> |
                        <span>
                            <i class="fa fa-file-text-o"></i>
                            ${randomArticle.word_count}
                        </span>
                    </div>
                    <p class="short_description">
                        ${shortDescription}
                    </p>
                </div>
            `;

            // 插入文章内容到页面中
            const postInfo = document.getElementById('post-info');
            if (postInfo) {
                postInfo.innerHTML = entryHtml;
            }

            // 淡入效果
            const gotoPost = document.getElementById('goto-post');
            if (gotoPost) {
                gotoPost.style.opacity = '1';
            }
        });
}

// 开始倒计时
function startCountdown() {
    // 清除之前的定时器
    clearInterval(countdownTimer);
    // 更新按钮显示为 "确定 (5)" 到 "确定 (1)" 的倒计时
    const gotoPostYesButton = document.getElementById('goto-post-yes');
    if (gotoPostYesButton) {
        gotoPostYesButton.textContent = `确定 (${countdown})`;
        // 设置新的定时器，每秒更新倒计时数字
        countdownTimer = setInterval(() => {
            countdown--;
            if (countdown >= 1) {
                gotoPostYesButton.textContent = `确定 (${countdown})`;
            } else {
                clearInterval(countdownTimer); // 清除定时器
                // 倒计时结束后执行跳转
                const postInfo = document.getElementById('post-info');
                if (postInfo) {
                    const articleLink = postInfo.querySelector('a');
                    if (articleLink) {
                        window.location.href = articleLink.href; // 跳转到文章页面
                    }
                }
            }
        }, 1000); // 每秒更新一次
    }
}

// 重置倒计时
function resetCountdown() {
    clearInterval(countdownTimer); // 清除之前的定时器
    countdown = 5; // 重置倒计时时间
    startCountdown(); // 开始新的倒计时
}

// ==================== 公告信息显示功能 ====================

function initializeBulletin() {
    const messageElement = document.querySelector('.bulletin-info');
    if (!messageElement) return;

    const jsonUrl = 'https://cdata.neosora.cc/link/info.json';
    const lastMessagesQueue = [];
    const maxQueueSize = 3;
    let messages = [];
    let intervalId;

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            messages = data.messages || [];
            if (document.visibilityState === 'visible') {
                showRandomMessage(messages);
                startMessageRotation();
            }
        })
        .catch(error => {
            Popup.show('page-features.js', '我们无法从远端服务器获取数据' + error.message, 'error');
        });

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // 页面可见时，开始消息切换
            showRandomMessage(messages);
            startMessageRotation();
        } else {
            // 页面不可见时，暂停消息切换
            stopMessageRotation();
        }
    });

    function startMessageRotation() {
        stopMessageRotation();
        intervalId = setInterval(() => showRandomMessage(messages), 6000);
    }

    function stopMessageRotation() {
        if (intervalId) clearInterval(intervalId);
    }

    function showRandomMessage(messages) {
        const filteredMessages = messages.filter(message => !lastMessagesQueue.includes(message));
        if (filteredMessages.length === 0) return;

        const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];

        if (lastMessagesQueue.length >= maxQueueSize) {
            lastMessagesQueue.shift();
        }
        lastMessagesQueue.push(randomMessage);

        deleteTextEffect(messageElement, () => typeWriterEffect(messageElement, randomMessage));
    }

    function typeWriterEffect(element, message) {
        element.textContent = '';
        let index = 0;
        const interval = setInterval(() => {
            element.textContent += message[index];
            index++;
            if (index === message.length) {
                clearInterval(interval);
            }
        }, 100);
    }

    function deleteTextEffect(element, callback) {
        let message = element.textContent;
        let index = message.length;
        const interval = setInterval(() => {
            element.textContent = message.substring(0, index - 1);
            index--;
            if (index === 0) {
                clearInterval(interval);
                callback();
            }
        }, 50);
    }

    // 根据路径控制公告显示/隐藏
    if (window.location.pathname === '/') {
        // 根路径下显示公告
    } else {
        // 非根路径隐藏公告
        const bulletinSpace = document.querySelector('.bulletin-space');
        if (bulletinSpace) {
            bulletinSpace.style.display = 'none';
        }
    }
}

// ==================== 站点信息弹窗功能 ====================

function opensiteinfo() {
    const siteinfoPage = document.getElementById('siteinfo-page');
    const overlay = document.getElementById('overlay');

    if (siteinfoPage) {
        siteinfoPage.style.display = 'block';
    }
    if (overlay) {
        overlay.style.display = 'block';
    }
}

function closesiteinfo() {
    const siteinfoPage = document.getElementById('siteinfo-page');
    const overlay = document.getElementById('overlay');

    if (siteinfoPage) {
        siteinfoPage.style.display = 'none';
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ==================== 初始化事件监听器 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 初始化公告功能
    initializeBulletin();

    // 随机文章功能事件监听器
    const refreshBtn = document.getElementById('refresh');
    const gotoPostNoBtn = document.getElementById('goto-post-no');
    const gotoPostYesBtn = document.getElementById('goto-post-yes');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            randomArticle(); // 刷新获取随机文章信息
            resetCountdown(); // 重置倒计时
        });
    }

    if (gotoPostNoBtn) {
        gotoPostNoBtn.addEventListener('click', function() {
            const gotoPost = document.getElementById('goto-post');
            if (gotoPost) {
                gotoPost.style.opacity = '0'; // 隐藏弹窗
                setTimeout(() => {
                    gotoPost.style.display = 'none'; // 等动画结束后隐藏
                }, 300); // 300ms 是 transition 设置的时间
            }
            clearInterval(countdownTimer); // 清除倒计时定时器
            countdown = 5; // 重置倒计时时间
        });
    }

    if (gotoPostYesBtn) {
        gotoPostYesBtn.addEventListener('click', function() {
            const gotoPost = document.getElementById('goto-post');
            if (gotoPost) {
                gotoPost.style.opacity = '0'; // 隐藏弹窗
                setTimeout(() => {
                    gotoPost.style.display = 'none'; // 等动画结束后隐藏
                }, 300); // 300ms 是 transition 设置的时间
            }
            clearInterval(countdownTimer); // 清除倒计时定时器
            countdown = 5; // 重置倒计时时间
            const postInfo = document.getElementById('post-info');
            if (postInfo) {
                const articleLink = postInfo.querySelector('a');
                if (articleLink) {
                    window.location.href = articleLink.href; // 跳转到文章页面
                }
            }
        });
    }
});