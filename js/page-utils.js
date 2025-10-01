// 页面工具集合 - 合并了wordCount.js和img-reback.js的功能
// 包含：字数统计、阅读时间计算、图片加载错误处理

// ==================== 字数统计和阅读时间功能 ====================

async function fetchWordCount() {

    if (!window.location.href.includes('/posts/')) {
        console.log("非文章页面");

        // 判断是否是文章列表页
        if (!window.location.href.includes('.html')) {
            const articleinfo = document.getElementsByClassName('article_information');

            // 隐藏文章信息
            Array.from(articleinfo).forEach(element => {
                element.style.display = "none";
            });
            return
        }
        return
    } else {
        try {
            /**
            * 检查指定区域的字数
            * @param {string} elementId - 需要统计字数的元素ID
            */

            const articleinfo = document.getElementsByClassName('article_information');
            const wordCountSpan = document.getElementById('word_count'); // 渲染位置
            const readTimeSpan = document.getElementById('read_time'); // 阅读时间渲染位置

            (function checkWordCount(elementId) {
                const element = document.getElementById(elementId);
                const textContent = element.textContent || element.innerText || "";
                const wordCount = textContent.replace(/\s+/g, "").length;

                const readTime = Math.ceil(wordCount / 500);

                if (wordCountSpan) {
                    wordCountSpan.textContent = wordCount;
                }
                if (readTimeSpan) {
                    readTimeSpan.textContent = readTime;
                }
                console.log(`发现文章！文章字数: ${wordCount}`);

                if (!wordCount) {
                    console.log("没有找到有效的文章");
                    Array.from(articleinfo).forEach(element => {
                        element.style.display = "none";
                    });
                }

            })("article-content");

        }
        catch (error) {
            console.error(`发生错误: ${error}`, "但我也不知道问题在哪里", error);
        }
    }
}

// ==================== 图片加载错误处理功能 ====================

function initializeImageErrorHandling() {
    var fallbackImage = '/website.png';
    var timeout = 3000; // 超时时间设为3秒

    // 定义函数，处理图片的加载成功、加载失败和超时替换
    function handleImageLoading(img) {
        // 设置超时检测
        var timer = setTimeout(function() {
            if (!img.complete || img.naturalWidth === 0) {
                img.src = fallbackImage; // 超时未加载完成，替换为备用图片
            }
        }, timeout);

        // 图片加载成功
        img.addEventListener('load', function() {
            clearTimeout(timer);
        });

        // 图片加载失败
        img.addEventListener('error', function() {
            clearTimeout(timer);
            img.src = fallbackImage; // 加载失败，替换为备用图片
        });
    }

    // 使用 MutationObserver 监听 DOM 中的变化，确保动态加载的图片也处理
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // 检测到新添加的img标签
                if (node.tagName === 'IMG') {
                    handleImageLoading(node); // 对新加载的img标签添加加载处理
                }
                // 若新增的节点包含多个 img 标签
                else if (node.querySelectorAll) {
                    var imgs = node.querySelectorAll('img');
                    imgs.forEach(function(img) {
                        handleImageLoading(img);
                    });
                }
            });
        });
    });

    // 监听整个 body，检测子节点和子树的变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 处理页面中已存在的图片
    document.querySelectorAll('img').forEach(function(img) {
        handleImageLoading(img);
    });
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 初始化字数统计功能
    fetchWordCount();

    // 初始化图片错误处理功能
    initializeImageErrorHandling();
});