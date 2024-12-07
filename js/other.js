//博客园塔-展示/隐藏
function Showlinks() {
    var linksDiv = document.getElementById("blogLinks");
    if (linksDiv.style.maxHeight) {
        linksDiv.style.maxHeight = null;
    } else {
        linksDiv.style.maxHeight = linksDiv.scrollHeight + "px";
    }
}