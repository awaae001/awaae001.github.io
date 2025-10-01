document.addEventListener("DOMContentLoaded", (event) => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/sw.js")
            .then(function (registration) {
                console.log("Service Worker 注册成功:", registration);
            })
            .catch(function (err) {
                console.log("Service Worker 注册失败:", err);
            });
    }
})