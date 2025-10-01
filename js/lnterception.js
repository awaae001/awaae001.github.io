// 外链安全检查功能
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const popupContent = document.querySelector('.popup-content');
    const websiteName = document.getElementById('website-name');
    const websiteUrl = document.getElementById('website-url');
    const cancelButton = document.getElementById('cancel-btn');
    const confirmButton = document.getElementById('confirm-btn');
    let targetUrl = '';
    const currentDomain = window.location.hostname;
    let safeDomains = [];

    function shortenUrl(url, maxLength = 64) {
        if (url.length <= maxLength) {
            return url;
        }
        const halfLength = Math.floor((maxLength - 3) / 2);
        return url.slice(0, halfLength) + '...' + url.slice(-halfLength);
    }

    function isSafeDomain(url) {
        const targetHostname = new URL(url).hostname;
        return safeDomains.some(domain => {
            return targetHostname === domain || targetHostname.endsWith('.' + domain);
        });
    }

    function loadSafeDomainList(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                safeDomains = data.safe;
            })
            .catch(error => console.error('Error fetching safe domain list:', error));
    }

    function openTargetUrl(url) {
        window.open(url, '_blank');
        hidePopup();
        targetUrl = '';
    }

    function showPopup(pageTitle, url) {
        websiteName.textContent = pageTitle;
        websiteUrl.textContent = shortenUrl(url);
        popup.style.display = 'flex';
        setTimeout(() => {
            popupContent.classList.remove('fade-out');
            popupContent.classList.add('fade-in');
        }, 100);
    }

    function hidePopup() {
        popupContent.classList.remove('fade-in');
        popupContent.classList.add('fade-out');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    function addLinkEventListener(link) {
        link.addEventListener('click', function (event) {
            const clickedUrl = link.href;
            const isSafe = isSafeDomain(clickedUrl);
            const isInternal = new URL(clickedUrl).hostname === currentDomain;

            if (isInternal) {
                return;
            }

            if (!isSafe) {
                event.preventDefault();
                targetUrl = clickedUrl;
                showPopup(document.title, targetUrl);
            }
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const links = node.querySelectorAll('a');
                            links.forEach(link => addLinkEventListener(link));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    loadSafeDomainList('/js/json/safe.json');

    document.querySelectorAll('a').forEach(link => addLinkEventListener(link));
    observeDOMChanges();

    cancelButton.addEventListener('click', function () {
        hidePopup();
        targetUrl = '';
    });

    confirmButton.addEventListener('click', function () {
        openTargetUrl(targetUrl);
    });
});