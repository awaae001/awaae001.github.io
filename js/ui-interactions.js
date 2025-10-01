// UI交互功能集合 - 合并了share.js和other.js的功能
// 包含：分享功能、赞助对话框、链接显示/隐藏

// ==================== 分享和赞助功能 ====================

var openSupportDialogBtn = document.getElementById('openSupportDialogBtn()');
var closeSupportDialogBtn = document.getElementById('closeSupportDialogBtn()');
var generateAndCopyLinkBtn = document.getElementById('generateAndCopyLinkBtn()');

// 赞助的 显示/隐藏 部分
function openSupportDialog() {
    document.getElementById('support-dialog').style.display = 'block';
}

function closeSupportDialog() {
    document.getElementById('support-dialog').style.display = 'none';
}

// 分享链接的生成部分
function generateAndCopyLink() {
    var blogNameElement = document.getElementById('title');
    // 提取博客名
    var blogName = blogNameElement.innerText.trim();
    var postTitleElement = document.getElementById('article-title');

    // 提取纯文本标题内容
    var postTitle = postTitleElement.innerText.trim();
    var postUrl = window.location.href; // 获取当前文章链接

    // 构建分享文本
    var shareText = blogName + ' - ' + postTitle + ' - ' + postUrl;
    var textarea = document.createElement('textarea');
    textarea.value = shareText;
    document.body.appendChild(textarea);
    textarea.select();

    // 尝试执行复制操作
    try {
        var successful = document.execCommand('copy');
        if (successful) {
            // 复制成功时显示弹窗提示
            Popup.show('ui-interactions.js', '我们已成功复制到你的剪贴板，去分享吧', 'prompt');
        } else {
            Popup.show('ui-interactions.js', '我们无法从复制到剪贴板，请升级浏览器', 'error');
        }
    } catch (err) {
        Popup.show('ui-interactions.js:err', '我们无法从复制到剪贴板，请升级浏览器', 'error');
    }

    // 移除文本区域元素
    document.body.removeChild(textarea);
}

// ==================== 博客园塔链接功能 ====================

// 博客园塔-展示/隐藏
function Showlinks() {
    var linksDiv = document.getElementById("blogLinks");
    if (linksDiv.style.maxHeight) {
        linksDiv.style.maxHeight = null;
    } else {
        linksDiv.style.maxHeight = linksDiv.scrollHeight + "px";
    }
}

// ==================== 初始化事件监听器 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 为赞助按钮添加事件监听器
    const openSupportBtn = document.getElementById('openSupportDialogBtn');
    const closeSupportBtn = document.getElementById('closeSupportDialogBtn');
    const generateLinkBtn = document.getElementById('generateAndCopyLinkBtn');

    if (openSupportBtn) {
        openSupportBtn.addEventListener('click', openSupportDialog);
    }

    if (closeSupportBtn) {
        closeSupportBtn.addEventListener('click', closeSupportDialog);
    }

    if (generateLinkBtn) {
        generateLinkBtn.addEventListener('click', generateAndCopyLink);
    }
});