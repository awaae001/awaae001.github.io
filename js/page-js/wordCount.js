async function fetchWordCount() {
    const articleTitle = document.getElementById('article-title').innerText; // 获取标题
    const wordCountSpan = document.getElementById('word_count'); // 渲染位置
    const readTimeSpan = document.getElementById('read_time'); // 阅读时间渲染位置
    const jsonUrl = "https://link.m-c.top/blog/output/timeline.json"; // JSON 文件 URL

    try {
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
                    readTime = `${estimatedMinutes} `;
                    break;
                }
            }
            if (wordCount !== "未找到") break;
        }

        // 渲染字数和阅读时间到页面
        wordCountSpan.textContent = wordCount;
        readTimeSpan.textContent = readTime;
    } catch (error) {
        console.error("加载或处理 JSON 文件时出错:", error);
        wordCountSpan.textContent = "加载失败";
        // wordCountSpan.style.display = "none";
        readTimeSpan.textContent = "无法计算";
        // readTimeSpan.style.display = "none";
    }
}

// 执行函数
fetchWordCount();
