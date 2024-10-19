document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.querySelector('.bulletin-info');
    const jsonUrl = 'https://link.m-c.top/link/info.json';  // 替换为你的JSON文件路径
    const lastMessagesQueue = [];  // 存储最近展示的三条消息
    const maxQueueSize = 3;  // 队列最大长度

    fetch(jsonUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const messages = data.messages || [];
        showRandomMessage(messages);
        setInterval(() => showRandomMessage(messages), 6000); // 每隔6秒刷新一次
    })
    .catch(error => {
        Popup.show('出现问题！', '我们无法从远端服务器获取数据 - 布告栏.js ' + error.message, 'error');
    });

    function showRandomMessage(messages) {
        // 过滤掉最近展示过的消息
        const filteredMessages = messages.filter(message => !lastMessagesQueue.includes(message));
        
        // 从剩余的消息中随机选择一条
        const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];
        
        // 更新队列
        if (lastMessagesQueue.length >= maxQueueSize) {
            lastMessagesQueue.shift();  // 移除最早的一条
        }
        lastMessagesQueue.push(randomMessage);  // 添加当前展示的消息

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
        }, 100);  // 每100ms添加一个字符
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
        }, 50);  // 每50ms删除一个字符
    }
});

// 检查当前路径是否为根路径
if (window.location.pathname === '/') {
    // 根路径下显示公告
} else {
    // 非根路径隐藏公告
    document.querySelector('.bulletin-space').style.display = 'none';
}
