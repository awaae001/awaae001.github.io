async function fetchWordCount() {
    const jsonUrl = "https://link.m-c.top/blog/output/timeline.json"; // JSON 文件 URL

    if (! window.location.href.includes('/posts/')) {
        console.log("非文章页面");
    } else {
        try {
            const articleTitle = document.getElementById('article-title').innerText; // 获取标题
            const articleinfo = document.getElementsByClassName('article_information');
            const wordCountSpan = document.getElementById('word_count'); // 渲染位置
            const readTimeSpan = document.getElementById('read_time'); // 阅读时间渲染位置
            // 加载 JSON 文件
            const response = await fetch(jsonUrl);
            const data = await response.json();

            // 遍历 JSON 查找文章
            let wordCount = "未找到";
            let readTime = "无法计算";
            for (const year in data) {
                for (const month in data[year]) {
                    const articles = data[year][month];
                    const foundArticle = articles.find(article => article.title === articleTitle);
                    if (foundArticle) {
                        wordCount = foundArticle.word_count; // 获取字数
                        // 假设平均阅读速度为200字/分钟
                        const estimatedMinutes = Math.ceil(wordCount / 1000);
                        readTime = `${estimatedMinutes}`;
                        break;
                    }
                }
                if (wordCount !== "未找到") break;
            }

            // 渲染字数和阅读时间到页面
            wordCountSpan.textContent = wordCount;
            readTimeSpan.textContent = readTime;

            if (wordCount === "未找到") {
                // 隐藏 article_information 的所有元素
                Array.from(articleinfo).forEach(element => {
                    element.style.display = "none";
                });
            }
        } catch (error) {
            Popup.show('WordCount.js', '远程服务器好像回家了过年了', 'error');
            wordCountSpan.textContent = "加载失败";
            readTimeSpan.textContent = "无法计算";
            Array.from(articleinfo).forEach(element => {
                element.style.display = "none";
            });
        }
    }
}

// 执行函数
fetchWordCount();