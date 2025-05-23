$(document).ready(function () {
  hljs.initHighlightingOnLoad();
  clickTreeDirectory();
  serachTree();
  // pjaxLoad();
  showArticleIndex();
  switchTreeOrIndex();
  scrollToTop();
  pageScroll();
});

// 页面滚动
function pageScroll() {
  var start_hight = 0;
  $(window).on('scroll', function () {
    var end_hight = $(window).scrollTop();
    var distance = end_hight - start_hight;
    start_hight = end_hight;
    var $header = $('#header');
    if (distance > 0 && end_hight > 50) {
      $header.hide();
    } else if (distance < 0) {
      $header.show();
    } else {
      return false;
    }
  })
}

// 回到顶部
function scrollToTop() {
  $("#totop-toggle-totop").on("click", function (e) {
    $("html").animate({ scrollTop: 0 }, 200);
  });
}

// 侧面目录
function switchTreeOrIndex() {
  $('#sidebar-toggle').on('click', function () {
    if ($('#sidebar').hasClass('on')) {
      scrollOff();
    } else {
      scrollOn();
    }
  });
  $('body').click(function (e) {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      var target = $(e.target);
      if (!target.is('#sidebar *')) {
        if ($('#sidebar').hasClass('on')) {
          scrollOff();
        }
      }
    }
  });
  if (window.matchMedia("(min-width: 1100px)").matches) {
    scrollOn();
  } else {
    scrollOff();
  }
  ;
}

//生成文章目录
function showArticleIndex() {
  $(".article-toc").empty();
  $(".article-toc").hide();
  $(".article-toc.active-toc").removeClass("active-toc");
  $("#tree .active").next().addClass('active-toc');

  var labelList = $("#article-content").children();
  var content = "<ul>";
  var max_level = 4;
  for (var i = 0; i < labelList.length; i++) {
    var level = 5;
    if ($(labelList[i]).is("h1")) {
      level = 1;
    } else if ($(labelList[i]).is("h2")) {
      level = 2;
    } else if ($(labelList[i]).is("h3")) {
      level = 3;
    } else if ($(labelList[i]).is("h4")) {
      level = 4;
    }
    if (level < max_level) {
      max_level = level;
    }
  }
  for (var i = 0; i < labelList.length; i++) {
    var level = 0;
    if ($(labelList[i]).is("h1")) {
      level = 1 - max_level + 1;
    } else if ($(labelList[i]).is("h2")) {
      level = 2 - max_level + 1;
    } else if ($(labelList[i]).is("h3")) {
      level = 3 - max_level + 1;
    } else if ($(labelList[i]).is("h4")) {
      level = 4 - max_level + 1;
    }
    if (level != 0) {
      $(labelList[i]).before(
        '<span class="anchor" id="_label' + i + '"></span>');
      content += '<li class="level_' + level
        + '"><i class="fa fa-circle" aria-hidden="true"></i><a href="#_label'
        + i + '"> ' + $(labelList[i]).text() + '</a></li>';
    }
  }
  content += "</ul>"

  $(".article-toc.active-toc").append(content);

  if (null != $(".article-toc a") && 0 != $(".article-toc a").length) {

    // 点击目录索引链接，动画跳转过去，不是默认闪现过去
    $(".article-toc a").on("click", function (e) {
      e.preventDefault();
      // 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
      var target = $(this.hash);
      $("body, html").animate(
        { 'scrollTop': target.offset().top },
        500
      );
    });

    // 监听浏览器滚动条，当浏览过的标签，给他上色。
    $(window).on("scroll", function (e) {
      var anchorList = $(".anchor");
      anchorList.each(function () {
        var tocLink = $('.article-toc a[href="#' + $(this).attr("id") + '"]');
        var anchorTop = $(this).offset().top;
        var windowTop = $(window).scrollTop();
        if (anchorTop <= windowTop + 100) {
          tocLink.addClass("read");
        } else {
          tocLink.removeClass("read");
        }
      });
    });
  }
  $(".article-toc.active-toc").show();
  $(".article-toc.active-toc").children().show();
}

function pjaxLoad() {
  $(document).pjax('#menu a', '#content',
    { fragment: '#content', timeout: 8000 });
  $(document).pjax('#tree a', '#content',
    { fragment: '#content', timeout: 8000 });
  $(document).pjax('#index a', '#content',
    { fragment: '#content', timeout: 8000 });
  $(document).on({
    "pjax:complete": function (e) {
      $("pre code").each(function (i, block) {
        hljs.highlightBlock(block);
      });
      // 添加 active
      $("#tree .active").removeClass("active");
      var title = $("#article-title").text().trim();
      if (title.length) {
        var searchResult = $("#tree li.file").find(
          "a:contains('" + title + "')");
        if (searchResult.length) {
          $(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass(
            "fa-plus-square-o");
          $("#tree ul").css("display", "none");
          if (searchResult.length > 1) {
            var categorie = $("#article-categories span:last a").html();
            if (typeof categorie != "undefined") {
              categorie = categorie.trim();
              searchResult = $("#tree li.directory a:contains('" + categorie
                + "')").siblings().find("a:contains('" + title + "')");
            }
          }
          searchResult[0].parentNode.classList.add("active");
          showActiveTree($("#tree .active"), true)
        }
        showArticleIndex();
      }
      wrapImageWithFancyBox();
    }
  });
}

// 搜索框输入事件
function serachTree() {
  // 解决搜索大小写问题
  jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

  $("#search-input").on("input", function (e) {
    e.preventDefault();

    // 获取 inpiut 输入框的内容
    var inputContent = e.currentTarget.value;

    // 没值就收起父目录，但是得把 active 的父目录都展开
    if (inputContent.length === 0) {
      $(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass(
        "fa-plus-square-o");
      $("#tree ul").css("display", "none");
      if ($("#tree .active").length) {
        showActiveTree($("#tree .active"), true);
      } else {
        $("#tree").children().css("display", "block");
      }
    }
    // 有值就搜索，并且展开父目录
    else {
      $(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass(
        "fa-minus-square-o");
      $("#tree ul").css("display", "none");
      var searchResult = $("#tree li").find(
        "a:contains('" + inputContent + "')");
      if (searchResult.length) {
        showActiveTree(searchResult.parent(), false)
      }
    }
  });

  $("#search-input").on("keyup", function (e) {
    e.preventDefault();
    if (event.keyCode == 13) {
      var inputContent = e.currentTarget.value;

      if (inputContent.length === 0) {
      } else {
        window.open(searchEngine + inputContent + "%20site:" + homeHost,
          "_blank");
      }
    }
  });
}

// 点击目录事件
function clickTreeDirectory() {
  // 判断有 active 的话，就递归循环把它的父目录打开
  var treeActive = $("#tree .active");
  if (treeActive.length) {
    showActiveTree(treeActive, true);
  }

  // 点击目录，就触发折叠动画效果
  $(document).on("click", "#tree a[class='directory']", function (e) {
    // 用来清空所有绑定的其他事件
    e.preventDefault();

    var icon = $(this).children(".fa");
    var iconIsOpen = icon.hasClass("fa-minus-square-o");
    var subTree = $(this).siblings("ul");

    icon.removeClass("fa-minus-square-o").removeClass("fa-plus-square-o");

    if (iconIsOpen) {
      if (typeof subTree != "undefined") {
        subTree.slideUp({ duration: 100 });
      }
      icon.addClass("fa-plus-square-o");
    } else {
      if (typeof subTree != "undefined") {
        subTree.slideDown({ duration: 100 });
      }
      icon.addClass("fa-minus-square-o");
    }
  });
}

// 循环递归展开父节点
function showActiveTree(jqNode, isSiblings) {
  if (jqNode.attr("id") === "tree") {
    return;
  }
  if (jqNode.is("ul")) {
    jqNode.css("display", "block");

    // 这个 isSiblings 是给搜索用的
    // true 就显示开同级兄弟节点
    // false 就是给搜索用的，值需要展示它自己就好了，不展示兄弟节点
    if (isSiblings) {
      jqNode.siblings().css("display", "block");
      jqNode.siblings("a").css("display", "inline");
      jqNode.siblings("a").find(".fa-plus-square-o").removeClass(
        "fa-plus-square-o").addClass("fa-minus-square-o");
    }
  }
  jqNode.each(function () {
    showActiveTree($(this).parent(), isSiblings);
  });
}

function scrollOn() {
  var $sidebar = $('#sidebar'),
    $content = $('#content'),
    $header = $('#header'),
    $footer = $('#footer'),
    $togglei = $('#sidebar-toggle i');

  $togglei.addClass('fa-close');
  $togglei.removeClass('fa-arrow-right');
  $sidebar.addClass('on');
  $sidebar.removeClass('off');

  if (window.matchMedia("(min-width: 1100px)").matches) {
    $content.addClass('content-on');
    $content.removeClass('content-off');
    $header.addClass('header-on');
    $header.removeClass('off');
    $footer.addClass('header-on');
    $footer.removeClass('off');
  }
}

function scrollOff() {
  var $sidebar = $('#sidebar'),
    $content = $('#content'),
    $header = $('#header'),
    $footer = $('#footer'),
    $togglei = $('#sidebar-toggle i');

  $togglei.addClass('fa-arrow-right');
  $togglei.removeClass('fa-close');
  $sidebar.addClass('off');
  $sidebar.removeClass('on');

  $content.addClass('content-off');
  $content.removeClass('content-on');
  $header.addClass('off');
  $header.removeClass('header-on');
  $footer.addClass('off');
  $footer.removeClass('header-on');
}

document.getElementById('footer-toggle-tocommet').addEventListener('click', function() {
  var commentElement = document.getElementById('comment');
  if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth' });
  } else {
      var modal = document.getElementById('myModal');
      modal.style.display = "block";
      setTimeout(function() {
          modal.style.display = "none";
          window.location.href = '/link/commit/';
      }, 3000); // 3秒后关闭模态框并跳转到留言板
  }
});

/**
 * 根据屏幕宽度调整按钮文字和宽度
 */
function adjustButtonLabel() {
    var button = document.getElementById('footer-toggle-tocommet');
    var buttonText = button.querySelector('.button-text');
    if (window.innerWidth < 460) {
        buttonText.style.display = 'none';
        button.style.width = '45px'; // 与高度一致，保持圆形按钮
    } else if (window.innerWidth < 900) {
        buttonText.style.display = 'inline';
        buttonText.textContent = '评论区';
        button.style.width = '80px'; // 根据内容调整宽度
    } else {
        buttonText.style.display = 'inline';
        buttonText.textContent = '前往评论区';
        button.style.width = 'auto'; // 根据内容调整宽度
    }
}

// 初始调整
adjustButtonLabel();

// 在窗口大小变化时调整
window.addEventListener('resize', adjustButtonLabel);

const CONFIG = {
  highlight: {
    highlightCopy: true, // 是否启用复制按钮
    highlightLang: true, // 是否显示语言指示器
    highlightHeightLimit: 300, // 代码块高度限制
    plugin: 'highlight.js', // 使用的插件 ('highlight.js' 或 'prismjs')
  },
  site: {
    isHighlightShrink: false, // 是否折叠代码块
  },
  copy: {
    success: 'OK！我们已将内容复制到您的剪贴板', // 复制成功提示
    noSupport: '抱歉，我们无法复制到你的剪贴板，请检查控制台', // 不支持复制提示
  }
};

// 代码高亮工具函数
const addHighlightTool = () => {
  const highLight = CONFIG.highlight;
  if (!highLight) return;

  const { highlightCopy, highlightLang, highlightHeightLimit, plugin } = highLight;
  const isHighlightShrink = CONFIG.site.isHighlightShrink;
  const isShowTool = highlightCopy || highlightLang || isHighlightShrink !== undefined;
  const $figureHighlight = plugin === 'highlight.js' ? document.querySelectorAll('figure.highlight') : document.querySelectorAll('pre[class*="language-"]');

  if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length)) return;

  const isPrismjs = plugin === 'prismjs';
  const highlightShrinkClass = isHighlightShrink === true ? 'closed' : '';
  const highlightShrinkEle = isHighlightShrink !== undefined ? '<i class="fa fa-caret-down expand"></i>' : '';
  const highlightCopyEle = highlightCopy ? '<div class="copy-notice"></div><i class="	fa fa-clone copy-button"></i>' : '';

  const alertInfo = (text) => {
    console.log(text);
  };

  const copy = ctx => {
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      document.execCommand('copy');
      Popup.show("main.js", CONFIG.copy.success, 'prompt');
    } else {
      Popup.show('main.js', CONFIG.copy.noSupport, 'error');
    }
  };

  // 点击事件处理函数
  const highlightCopyFn = ele => {
    const $buttonParent = ele.parentNode;
    $buttonParent.classList.add('copy-true');
    const selection = window.getSelection();
    const range = document.createRange();
    const preCodeSelector = isPrismjs ? 'pre code' : 'table .code pre';
    range.selectNodeContents($buttonParent.querySelectorAll(`${preCodeSelector}`)[0]);
    selection.removeAllRanges();
    selection.addRange(range);
    copy(ele.lastChild);
    selection.removeAllRanges();
    $buttonParent.classList.remove('copy-true');
  };

  const highlightShrinkFn = ele => {
    ele.classList.toggle('closed');
  };

  const highlightToolsFn = function (e) {
    const $target = e.target.classList;
    if ($target.contains('expand')) highlightShrinkFn(this);
    else if ($target.contains('copy-button')) highlightCopyFn(this);
  };

  const expandCode = function () {
    this.classList.toggle('expand-done');
  };

  const createEle = (lang, item, service) => {
    const fragment = document.createDocumentFragment();

    if (isShowTool) {
      const hlTools = document.createElement('div');
      hlTools.className = `highlight-tools ${highlightShrinkClass}`;
      hlTools.innerHTML = highlightShrinkEle + lang + highlightCopyEle;
      hlTools.addEventListener('click', highlightToolsFn);
      fragment.appendChild(hlTools);
    }

    if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
      const ele = document.createElement('div');
      ele.className = 'code-expand-btn';
      ele.innerHTML = '<i class="fas fa fa-caret-down"></i>';
      ele.addEventListener('click', expandCode);
      fragment.appendChild(ele);
    }

    if (service === 'hl') {
      item.insertBefore(fragment, item.firstChild);
    } else {
      item.parentNode.insertBefore(fragment, item);
    }
  };

  if (isPrismjs) {
    $figureHighlight.forEach(item => {
      if (highlightLang) {
        const langName = item.getAttribute('data-language') || 'Code';
        const highlightLangEle = `<div class="code-lang">${langName}</div>`;
        btf.wrap(item, 'figure', { class: 'highlight' });
        createEle(highlightLangEle, item);
      } else {
        btf.wrap(item, 'figure', { class: 'highlight' });
        createEle('', item);
      }
    });
  } else {
    $figureHighlight.forEach(item => {
      if (highlightLang) {
        let langName = item.getAttribute('class').split(' ')[1];
        if (langName === 'plain' || langName === undefined) langName = 'Code';
        const highlightLangEle = `<div class="code-lang">${langName}</div>`;
        createEle(highlightLangEle, item, 'hl');
      } else {
        createEle('', item, 'hl');
      }
    });
  }
};

addHighlightTool();

