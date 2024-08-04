document.addEventListener('DOMContentLoaded', function() {
    // 获取所有的img标签
    var images = document.getElementsByTagName('img');
    var fallbackImage = '/Rss.webp';

    // 为每个图片添加error事件监听器
    for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('error', function() {
            this.src = fallbackImage;
        });
    }
});