// script.js

async function loadQuotes() {
  try {
    const response = await fetch('https://awaae001.top/mian.json', {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.quotes;
  } catch (error) {
    console.error('获取格言时出错:', error.message);
    return [];
  }
}

let quotes;  // 存储加载的格言数组
let currentQuoteIndex;  // 当前显示的格言索引

// 初始化加载格言数据
loadQuotes().then(data => {
  quotes = data;
  updateQuoteCount(); // 初始化显示格言总数
  changeQuote();  // 初始显示格言
});

// 函数：切换显示随机格言
function changeQuote() {
  showLoading(); // 显示加载中动画

  // 模拟异步操作（例如加载新格言），这里使用setTimeout模拟1秒后的完成
  setTimeout(() => {
    // 生成一个随机索引
    const randomIndex = Math.floor(Math.random() * quotes.length);
    updateQuote(randomIndex);
    updateQuoteCount(); // 更新格言总数显示

    hideLoading(); // 隐藏加载中动画
  }, 640);
}

// 函数：更新显示的格言
function updateQuote(index) {
  const quoteElement = document.getElementById('quote');
  quoteElement.textContent = quotes[index];
}

// 函数：更新格言总数显示
function updateQuoteCount() {
  const quoteCountElement = document.getElementById('quote-count');
  quoteCountElement.textContent = '回声指数：' + quotes.length;
}

// 函数：显示加载中动画
function showLoading() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';
}

// 函数：隐藏加载中动画
function hideLoading() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'none';
}
