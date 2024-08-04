document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.querySelector('.bulletin-info');
    const jsonUrl = 'https://link.m-c.top/link/info.json';  // 替换为你的JSON文件路径

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const messages = data.messages;
            showRandomMessage(messages);
            setInterval(() => showRandomMessage(messages), 6000); // 每隔6秒刷新一次
        });

    function showRandomMessage(messages) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        slideOutEffect(messageElement, () => typeWriterEffect(messageElement, randomMessage));
    }

    function typeWriterEffect(element, message) {
        element.textContent = message;
        element.style.animation = 'none';
        element.offsetHeight; /* 触发重绘 */
        element.style.animation = 'typewriter 2s steps(' + message.length + ') 1s forwards';
    }

    function slideOutEffect(element, callback) {
        element.style.animation = 'slideOutUp 1s forwards';
        setTimeout(() => {
            callback();
            element.style.animation = 'none';
        }, 1000);
    }
});

// 检查当前路径是否为根路径
if (window.location.pathname === '/') {
    // 根路径下显示公告
} else {
    // 非根路径隐藏公告
    document.querySelector('.bulletin-space').style.display = 'none';
}