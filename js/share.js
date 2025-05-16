//分享和赞助是在一起的，那我就偷个懒，写在一个JS里面了


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


//分享链接的生成部分
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
            Popup.show('share.js', '我们已成功复制到你的剪贴板，去分享吧', 'prompt');
        } else {
            Popup.show('share.js', '我们无法从复制到剪贴板，请升级浏览器', 'error');
        }
    } catch (err) {
        Popup.show('share.js:err', '我们无法从复制到剪贴板，请升级浏览器', 'error');
    }

    // 移除文本区域元素
    document.body.removeChild(textarea);
}