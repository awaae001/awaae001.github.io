// Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 根据权重生成加权数组
function generateWeightedArray(data) {
    const weightedArray = [];
    Object.values(data).forEach(item => {
        const weight = parseFloat(item.Weights);
        item.website.forEach(website => {
            for (let i = 0; i < weight * 10; i++) { // 乘以10以增加权重的影响
                weightedArray.push(website);
            }
        });
    });
    return weightedArray;
}

function getRandomItems(array, count) {
    const shuffled = shuffle(array); // 使用Fisher-Yates shuffle算法打乱数组顺序
    return shuffled.slice(0, count); 
}

function renderRandomLinks(data, randomLinksDiv) {
    randomLinksDiv.innerHTML = '';

    // 根据权重生成加权数组
    const weightedArray = generateWeightedArray(data);

    // 随机选择5个链接
    const randomItems = getRandomItems(weightedArray, 5);

    randomItems.forEach(item => {
        const linkElement = document.createElement('a');
        linkElement.href = item.link;
        linkElement.textContent = item.name;
        randomLinksDiv.appendChild(linkElement);
        randomLinksDiv.appendChild(document.createElement('br'));
    });
}

fetch('https://link.m-c.top/link/friend.json')
.then(response => response.json())
.then(data => {
    const regenerateButton = document.getElementById('regenerateButton');
    const randomLinksDiv = document.getElementById('randomLinks');

    renderRandomLinks(data, randomLinksDiv);
    regenerateButton.addEventListener('click', () => renderRandomLinks(data, randomLinksDiv));
})
.catch(error => {
    console.error('Error fetching data:', error);
    // 在UI上显示错误信息
    const randomLinksDiv = document.getElementById('randomLinks');
    randomLinksDiv.innerHTML = 'Error fetching data. Please try again later.';
});
