let countdownTimer; // 声明全局变量用于存储定时器
let countdown = 5; // 初始倒计时时间

function showConfirmation() {
    randomArticle(); // 获取随机文章信息
    const gotoPost = document.getElementById('goto-post');
    gotoPost.style.opacity = '1'; // 显示弹窗
    gotoPost.style.display = 'block'; // 确保显示状态
    startCountdown(); // 开始倒计时
}

function randomArticle() {
    const jsonUrl = 'https://link.m-c.top/blog/output/timeline.json';

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
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
            postInfo.innerHTML = entryHtml;

            // 淡入效果
            const gotoPost = document.getElementById('goto-post');
            gotoPost.style.opacity = '1';
        })
        .catch(error => {
            console.error('Error fetching and parsing JSON:', error);
            alert('抱歉，无法获取随机文章，请稍后重试。');
        });
}

// 开始倒计时
function startCountdown() {
    // 清除之前的定时器
    clearInterval(countdownTimer);
    // 更新按钮显示为 "确定 (5)" 到 "确定 (1)" 的倒计时
    const gotoPostYesButton = document.getElementById('goto-post-yes');
    gotoPostYesButton.textContent = `确定 (${countdown})`;
    // 设置新的定时器，每秒更新倒计时数字
    countdownTimer = setInterval(() => {
        countdown--;
        if (countdown >= 1) {
            gotoPostYesButton.textContent = `确定 (${countdown})`;
        } else {
            clearInterval(countdownTimer); // 清除定时器
            // 倒计时结束后执行跳转
            const articleUrl = document.getElementById('post-info').querySelector('a').href;
            window.location.href = articleUrl; // 跳转到文章页面
        }
    }, 1000); // 每秒更新一次
}

// 刷新按钮事件
document.getElementById('refresh').addEventListener('click', function() {
    randomArticle(); // 刷新获取随机文章信息
    resetCountdown(); // 重置倒计时
});

// 取消按钮事件
document.getElementById('goto-post-no').addEventListener('click', function() {
    const gotoPost = document.getElementById('goto-post');
    gotoPost.style.opacity = '0'; // 隐藏弹窗
    setTimeout(() => {
        gotoPost.style.display = 'none'; // 等动画结束后隐藏
    }, 300); // 300ms 是 transition 设置的时间
    clearInterval(countdownTimer); // 清除倒计时定时器
    countdown = 5; // 重置倒计时时间
});

// 确定按钮事件（跳转到文章）
document.getElementById('goto-post-yes').addEventListener('click', function() {
    const gotoPost = document.getElementById('goto-post');
    gotoPost.style.opacity = '0'; // 隐藏弹窗
    setTimeout(() => {
        gotoPost.style.display = 'none'; // 等动画结束后隐藏
    }, 300); // 300ms 是 transition 设置的时间
    clearInterval(countdownTimer); // 清除倒计时定时器
    countdown = 5; // 重置倒计时时间
    const articleUrl = document.getElementById('post-info').querySelector('a').href;
    window.location.href = articleUrl; // 跳转到文章页面
});

// 重置倒计时
function resetCountdown() {
    clearInterval(countdownTimer); // 清除之前的定时器
    countdown = 5; // 重置倒计时时间
    startCountdown(); // 开始新的倒计时
}
