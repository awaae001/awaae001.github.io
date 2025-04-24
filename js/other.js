//博客园塔-展示/隐藏
function Showlinks() {
    var linksDiv = document.getElementById("blogLinks");
    if (linksDiv.style.maxHeight) {
        linksDiv.style.maxHeight = null;
    } else {
        linksDiv.style.maxHeight = linksDiv.scrollHeight + "px";
    }
}


// document.addEventListener('DOMContentLoaded', () => {
//     const contentElement = document.querySelector('#article-content');
//     if (contentElement) {
//         const textContent = contentElement.innerText || contentElement.textContent;
//         const wordCount = textContent.trim().length;

//         console.log(`留言板区域字数为: ${wordCount}`);
//     } else {
//         console.error('未找到 #article-content 区域');
//     }
// });
