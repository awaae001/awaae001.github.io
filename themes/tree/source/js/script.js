// 获取欢迎容器
// 获取欢迎容器和内容区域
const welcomeContainer = document.getElementById("welcome-container");
const content = document.getElementById("content");

let scrolled = false;

window.addEventListener("scroll", () => {
    if (!scrolled && window.scrollY > 100) {
        scrolled = true;
        hideWelcome(); // 调用隐藏欢迎页面的函数
    } else if (scrolled && window.scrollY <= 100) {
        scrolled = false;
        showWelcome(); // 调用显示欢迎页面的函数
    }
});

function hideWelcome() {
    welcomeContainer.style.opacity = 0; // 设置透明度为0，隐藏欢迎页面
    content.style.opacity = 1; // 设置内容区域透明度为1，显示内容
}

function showWelcome() {
    welcomeContainer.style.opacity = 1; // 设置透明度为1，显示欢迎页面
    content.style.opacity = 0; // 设置内容区域透明度为0，隐藏内容
}
