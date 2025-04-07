document.addEventListener('DOMContentLoaded', function() {
    var fallbackImage = '/website.png';
    var timeout = 3000; // 超时时间设为3秒

    // 定义函数，处理图片的加载成功、加载失败和超时替换
    function handleImageLoading(img) {
        // console.log('检测到新图片元素:', img.src);

        // 设置超时检测
        var timer = setTimeout(function() {
            if (!img.complete || img.naturalWidth === 0) {
                // console.log('图片加载超时，替换为备用图片:', img.src);
                img.src = fallbackImage; // 超时未加载完成，替换为备用图片
            }
        }, timeout);

        // 图片加载成功
        img.addEventListener('load', function() {
            clearTimeout(timer);
            // console.log('图片加载成功:', img.src);
        });

        // 图片加载失败
        img.addEventListener('error', function() {
            clearTimeout(timer);
            // console.log('图片加载失败，替换为备用图片:', img.src);
            img.src = fallbackImage; // 加载失败，替换为备用图片
        });
    }

    // 使用 MutationObserver 监听 DOM 中的变化，确保动态加载的图片也处理
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // 检测到新添加的img标签
                if (node.tagName === 'IMG') {
                    // console.log('新图片标签添加到DOM:', node.src);
                    handleImageLoading(node); // 对新加载的img标签添加加载处理
                } 
                // 若新增的节点包含多个 img 标签
                else if (node.querySelectorAll) {
                    var imgs = node.querySelectorAll('img');
                    imgs.forEach(function(img) {
                        // console.log('新图片标签添加到DOM:', img.src);
                        handleImageLoading(img);
                    });
                }
            });
        });
    });

    // 监听整个 body，检测子节点和子树的变化
    observer.observe(document.body, { childList: true, subtree: true });
});
