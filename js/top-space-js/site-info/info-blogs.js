const postsUrl = 'https://link.m-c.top/blog/output/timeline.json';
const commentsUrl = 'https://talk.m-c.top/api/v2/stats/site_comment?site_name=%E5%91%93%E8%AF%AD%E6%A2%A6%E8%BD%A9';

// 获取JSON数据并处理文章信息
fetch(postsUrl)
    .then(response => response.json())
    .then(data => {
        let totalPosts = 0;
        let totalWords = 0;

        // 遍历数据计算总文章数和总字数
        for (const year in data) {
            for (const month in data[year]) {
                totalPosts += data[year][month].length;
                totalWords += data[year][month].reduce((sum, post) => sum + post.word_count, 0);
            }
        }

        // 将结果输出到指定的HTML元素中
        document.getElementById('all-posts').textContent = totalPosts;
        document.getElementById('all-words').textContent = totalWords;
    })
    .catch(error => {
        Popup.show('info-blogs.js', '我们无法从远端服务器获取数据', 'error');
    });

// 获取评论数并处理
fetch(commentsUrl)
    .then(response => response.json())
    .then(data => {
        const totalComments = data.data;

        // 确保 all-comments 元素存在后再设置其文本内容
        const commentsElement = document.getElementById('all-commets');
        if (commentsElement) {
            commentsElement.textContent = totalComments;
        } else {
            Popup.show('出现问题！', '从远端服务器获取的数据存在问题！', 'error');
        }
    })
    .catch(error => {
        Popup.show('出现问题！', '我们无法从远端服务器获取数据 - artalkApi', 'error');
    });