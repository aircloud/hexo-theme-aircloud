/**
 * Created by Xiaotao.Nie on 09/04/2018.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

// Global functions and listeners
window.onresize = () => {
    // when window resize , we show remove some class that me be added
    // often for debug
    if(window.document.documentElement.clientWidth > 680){
        let aboutContent = document.getElementById('nav-content')
        aboutContent.classList.remove('hide-block')
        aboutContent.classList.remove('show-block');
    }
    // if(window.isPost){
        // reLayout()
    // }

    reHeightToc();
};

// Nav switch function on mobile
/*****************************************************************************/
const navToggle = document.getElementById('site-nav-toggle');
navToggle.addEventListener('click', () => {
    let aboutContent = document.getElementById('nav-content')
    if (!aboutContent.classList.contains('show-block')) {
        aboutContent.classList.add('show-block');
        aboutContent.classList.remove('hide-block')
    } else {
        aboutContent.classList.add('hide-block')
        aboutContent.classList.remove('show-block');
    }
})


// global search
/*****************************************************************************/

const searchButton = document.getElementById('search')
const searchField = document.getElementById('search-field')
const searchInput = document.getElementById('search-input')
const searchResultContainer = document.getElementById('search-result-container')
const escSearch = document.getElementById('esc-search')
const bgSearch = document.getElementById('search-bg')
const beginSearch = document.getElementById('begin-search')

searchField.addEventListener('mousewheel',(e) => {
    // e.preventDefault()
    e.stopPropagation()
    return false
}, false)

var searchJson;
var caseSensitive = false

searchButton.addEventListener('click', () => {
    search()
});

escSearch.addEventListener('click',() => {
    hideSearchField()
})

bgSearch.addEventListener('click',() => {
    hideSearchField()
})

beginSearch.addEventListener('click',() => {
    let keyword = searchInput.value;
    if(keyword){
        searchFromKeyWord(keyword)
    }
})

function toggleSeachField(){
    if (!searchField.classList.contains('show-flex-fade')) {
        showSearchField()
    } else {
        hideSearchField()
    }
}

function showSearchField() {
    searchInput.focus()
    searchField.classList.add('show-flex-fade');
    searchField.classList.remove('hide-flex-fade');
}

function hideSearchField(){
    window.onkeydown = null;
    searchField.classList.add('hide-flex-fade');
    searchField.classList.remove('show-flex-fade');
}

function searchFromKeyWord(keyword = ""){
    let result = [];

    let sildeWindowSize = 100;

    let handleKeyword = keyword

    if(!caseSensitive){
        handleKeyword = keyword.toLowerCase()
    }
    if(!searchJson) return -1;
    else {
        searchJson.forEach((item) => {

            if(!item.title || !item.content) return 0; // break

            let title = item.title
            let content = item.content.trim().replace(/<[^>]+>/g,"").replace(/[`#\n]/g,"");

            let lowerTitle = title,lowerContent = content;

            if(!caseSensitive){
                lowerTitle = title.toLowerCase();
                lowerContent = content.toLowerCase();
            }


            if(lowerTitle.indexOf(handleKeyword) !== -1 || lowerContent.indexOf(handleKeyword) !== -1){
                let resultItem = {}
                resultItem.title = title.replace(keyword, "<span class='red'>" + keyword + '</span>');
                resultItem.url = item.url;

                resultItem.content = [];

                let lastend = 0

                while(lowerContent.indexOf(handleKeyword) !== -1){
                    let begin = lowerContent.indexOf(handleKeyword) - sildeWindowSize / 2 < 0 ? 0 : lowerContent.indexOf(handleKeyword) - sildeWindowSize / 2
                    let end = begin + sildeWindowSize;
                    let reg = caseSensitive ?  new RegExp('('+keyword+')','g') :  new RegExp('('+keyword+')','ig')
                    resultItem.content.push("..." + content.slice(lastend + begin, lastend + end).replace(reg, "<span class='red'>$1</span>") + "...")
                    lowerContent = lowerContent.slice(end, lowerContent.length)
                    lastend += end
                }
                // resultItem.title = title.replace(keyword, "<span class='red'>" + keyword + '</span>');
                result.push(resultItem)
            }
        })
    }

    if(!result.length){
        searchResultContainer.innerHTML = `
            <div class="no-search-result">No Result</div>
        `
        return;
    }

    let searchFragment = document.createElement('ul')

    for(let item of result){
        let searchItem = document.createElement('li');
        let searchTitle = document.createElement('a');
        searchTitle.href = item.url
        searchTitle.innerHTML = item.title;
        searchItem.appendChild(searchTitle)
        if(item.content.length) {
            let searchContentLiContainer = document.createElement('ul')
            for (let citem of item.content) {
                let searchContentFragment = document.createElement('li')
                searchContentFragment.innerHTML = citem;
                searchContentLiContainer.appendChild(searchContentFragment)
            }
            searchItem.appendChild(searchContentLiContainer)
        }
        searchFragment.appendChild(searchItem)
    }
    while(searchResultContainer.firstChild){
        searchResultContainer.removeChild(searchResultContainer.firstChild)
    }
    searchResultContainer.appendChild(searchFragment)
}

function search(){

    toggleSeachField()

    window.onkeydown = (e) => {
        if (e.which === 27) {
            /** 这里编写当ESC按下时的处理逻辑！ */
            toggleSeachField()
        } else if(e.which === 13){
            // 回车按下
            let keyword = searchInput.value;
            if(keyword){
                searchFromKeyWord(keyword)
            }
        }
    }


    if(!searchJson){
        let isXml;
        let search_path = window.hexo_search_path;
        if (search_path.length === 0) {
            search_path = "search.json";
        } else if (/json$/i.test(search_path)) {
            isXml = false;
        }
        let path = window.hexo_root+ search_path;
        $.ajax({
            url: path,
            dataType: isXml ? "xml" : "json",
            async: true,
            success: function (res) {
                searchJson = isXml ? $("entry", res).map(function() {
                    return {
                        title: $("title", this).text(),
                        content: $("content",this).text(),
                        url: $("url" , this).text()
                    };
                }).get() : res;
            }
        });
    }

}

// directory function in post pages
/*****************************************************************************/
function getDistanceOfLeft(obj) {
    let left = 0;
    let top = 0;
    while (obj) {
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {
        left:left,
        top:top
    };
}

var toc = document.getElementById('toc')

var tocToTop = getDistanceOfLeft(toc).top;

function reHeightToc(){
    if(toc) { // resize toc height
        toc.style.maxHeight = ( document.documentElement.clientHeight - 10 ) + 'px';
        toc.style.overflowY = 'scroll';
    }
}

reHeightToc();

if(window.isPost){
    var result = []

    var nameSet = new Set();

    if(!toc || !toc.children || !toc.children[0]){
        // do nothing
    }
    else {
        if (toc.children[0].nodeName === "OL") {
            let ol = Array.from(toc.children[0].children)

            function getArrayFromOl(ol) {
                let result = []

                // let escape = function (item) {
                //     return item.replace(/<[^>]+>/g, "").replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[\. _]/g, '-')
                // }

                ol.forEach((item) => {
                    if (item.children.length === 1) {
                        // TODO: need change
                        let value = item.children[0].getAttribute('href').replace(/^#/,"")
                        result.push({
                            value: [value],
                            dom: item
                        })
                        nameSet.add(value)
                    }
                    else {
                        let concatArray = getArrayFromOl(Array.from(item.children[1].children))
                        nameSet.add(item.children[0].getAttribute('href').replace(/^#/,""))
                        result.push({
                            value: [item.children[0].getAttribute('href').replace(/^#/,"")].concat(concatArray.reduce((p, n) => {
                                p = p.concat(n.value)
                                return p;
                            }, [])),
                            dom: item
                        })
                        result = result.concat(concatArray)
                    }
                })
                return result
            }

            result = getArrayFromOl(ol)
        }

        var nameArray = Array.from(nameSet)

        function reLayout() {
            let scrollToTop = document.documentElement.scrollTop || window.pageYOffset // Safari is special
            if(tocToTop === 0) {
                // Fix bug that when resize window the toc layout may be wrong
                toc = document.getElementById('toc')
                toc.classList.remove('toc-fixed')
                tocToTop = getDistanceOfLeft(toc).top;
            }
            if (tocToTop <= scrollToTop + 10) {
                if (!toc.classList.contains('toc-fixed'))
                    toc.classList.add('toc-fixed')
            } else {
                if (toc.classList.contains('toc-fixed'))
                    toc.classList.remove('toc-fixed')
            }

            let minTop = 9999;
            let minTopsValue = ""

            for (let item of nameArray) {
                item = decodeURIComponent(item);
                let dom = document.getElementById(item) || document.getElementById(item.replace(/\s/g, ''))
                if (!dom) {
                    console.log('dom is null')
                    continue
                }
                let toTop = getDistanceOfLeft(dom).top - scrollToTop;

                if (Math.abs(toTop) < minTop) {
                    minTop = Math.abs(toTop)
                    minTopsValue = item
                }
                // console.log(minTopsValue, minTop)
            }

            if (minTopsValue) {
                for (let item of result) {
                    if (item.value.indexOf(encodeURIComponent(minTopsValue)) !== -1) {
                        item.dom.classList.add("active")
                    } else {
                        item.dom.classList.remove("active")
                    }
                }
            }
        }

        reLayout()

        window.addEventListener('scroll', function(e) {
            reLayout()
            // let tocDom = document.querySelector('#toc')
            // window.scrollY < 550 ? tocDom.classList.remove('toc-fixed') : tocDom.classList.add('toc-fixed')
        })
    }
}


// donate
/*****************************************************************************/
const donateButton = document.getElementById('donate-button')
const donateImgContainer = document.getElementById('donate-img-container')
const donateImg = document.getElementById('donate-img')

if(donateButton) {
    donateButton.addEventListener('click', () => {
        if (donateImgContainer.classList.contains('hide')) {
            donateImgContainer.classList.remove('hide')
        } else {
            donateImgContainer.classList.add('hide')
        }
    })

    donateImg.src = donateImg.dataset.src
}

