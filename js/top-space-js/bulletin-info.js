document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.querySelector('.bulletin-info');
    const jsonUrl = 'https://link.m-c.top/link/info.json';
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
            Popup.show('出现问题！', '我们无法从远端服务器获取数据 - 布告栏.js ' + error.message, 'error');
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
});

if (window.location.pathname === '/') {
    // 根路径下显示公告
} else {
    // 非根路径隐藏公告
    document.querySelector('.bulletin-space').style.display = 'none';
}
