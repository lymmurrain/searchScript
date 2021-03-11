var script = document.createElement("script")
script.src = "https://s3.pstatp.com/cdn/expire-1-M/jquery/3.3.1/jquery.min.js"
var head = document.getElementsByTagName("head")[0]
head.appendChild(script)


searchBox = document.createElement('div')
searchBox.id = "searchBox"
searchBox.innerHTML = '    <input type="text" id="searchText" autocomplete="off" placeholder="欢迎使用">' +
    '    <div id="result"></div>'
document.body.insertBefore(searchBox, document.body.firstElementChild)
// document.body.appendChild(searchBox)
templateBox = document.createElement('div')
templateBox.id = "template"
templateBox.innerHTML = '    <div class="question"></div>' +
    '    <div class="answer"></div>' +
    '    <div class="msg"></div>'

document.body.appendChild(templateBox)

var style = document.createElement("style");

style.type = "text/css";

try {

    style.appendChild(document.createTextNode("    #searchBox {\n" +
        "        opacity: 0.7;\n" +
        "        font-size: 14px;\n" +
        "        user-select: none;\n" +
        "        -moz-user-select: none;\n" +
        "        -webkit-user-select: none;\n" +
        "        width: 400px;\n" +
        "        height: 600px;\n" +
        "        overflow-y: auto;\n" +
        "        position: fixed;\n" +
        "        z-index: 999;\n" +

        "        -ms-user-select: none;\n" +
        "    }\n" +
        "    #searchText{\n" +
        "        width: 100%;\n" +
        "        background-color: black;\n" +
        "        font-size: 16px;\n" +
        "        border:0px;\n" +
        "        height:28px;\n" +
        "        color:white;\n" +
        "    }\n" +
        "\n" +
        "    .msg {\n" +
        "        color: #0e9aef;\n" +
        "    }\n" +
        "\n" +
        "    .question {\n" +
        "        color: red;\n" +
        "\n" +
        "    }\n"))

} catch (ex) {

    style.styleSheet.cssText = "    #searchBox {\n" +
        "        opacity: 0.3;\n" +
        "        font-size: 3px;\n" +
        "        user-select: none;\n" +
        "        -moz-user-select: none;\n" +
        "        -webkit-user-select: none;\n" +
        "        width: 400px;\n" +
        "        background-color: cornflowerblue;\n" +
        "        -ms-user-select: none;\n" +
        "    }\n" +
        "    #searchText{\n" +
        "        width: 100%;\n" +
        "        background-color: cornflowerblue;\n" +
        "        border:0px;\n" +
        "        height:30px;\n" +
        "    }\n" +
        "\n" +
        "    .msg {\n" +
        "        color: #0e9aef;\n" +
        "    }\n" +
        "\n" +
        "    .question {\n" +
        "        color: red;\n" +
        "\n" +
        "    }\n";//针对IE

}

head.appendChild(style);

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
// searchBox = document.getElementById('searchBox')
searchBox.onmousedown = function (event) {
    var bar = document.getElementById("searchBox");
    var rex = event.clientX - bar.offsetLeft;
    var rey = event.clientY - bar.offsetTop;
    document.onmousemove = function (e) {
        xX = e.clientX;
        yY = e.clientY;
        bar.style.left = (xX - rex) + "px";
        bar.style.top = (yY - rey) + "px";
    }
}
document.onmouseup = function () {
    document.onmousemove = null;
}

document.oncopy = searchCopy

function search(searchText, num) {
    url = 'http://159.75.21.104:81/api/answer/';
    if (!searchText) {
        document.getElementById('result').innerHTML = ''
        searchText = $('#searchText')[0].value;
    }
    $.ajax({
        url: url,
        data: {
            q: searchText,
        },
        success: function (res) {
            if (JSON.stringify(res) !== "{}") {
                for (x in res) {
                    newBox = document.getElementById('template').cloneNode(deep = true)
                    newBox.id = ''
                    newBox.classList.add('resultBox')
                    if (num === undefined) {
                        newBox.children[0].innerText = res[x]['question']
                    } else {
                        newBox.children[0].innerText = num + '. ' + res[x]['question']
                    }

                    const answer = res[x]['answer']
                    if (answer[0] instanceof Object) {
                        answerNum = answer.length
                        for (i in answer) {
                            p = document.createElement('p')
                            p.innerHTML = answer[i]['content']
                            newBox.children[1].appendChild(p)
                        }
                        newBox.children[2].innerText = '本题' + '答案 ' + answerNum + ' 个'
                    } else {
                        answerNum = answer.length
                        if (answer) {
                            for (i in answer) {
                                p = document.createElement('p')
                                p.innerHTML = answer[i]
                                newBox.children[1].appendChild(p)
                            }
                            newBox.children[2].innerText = '本题' + '答案 ' + answerNum + ' 个'

                        }

                    }
                    document.getElementById('result').appendChild(newBox);

                }
            } else {
                newBox = document.getElementById('template').cloneNode(deep = true)
                newBox.id = ''
                newBox.classList.add('resultBox')
                newBox.children[0].innerText = searchText
                p = document.createElement('p')
                p.innerHTML = '两个都没找到欸，可能是网络问题，稍后再试。'
                newBox.children[1].appendChild(p)
                document.getElementById('result').appendChild(newBox);
            }
        }

    })
}

function searchCopy() {
    var selection;
    selection = window.getSelection().toString();
    $('#searchText')[0].value = selection
    search()
}

document.onkeydown = function (event) {
    if (event.keyCode == 13) {
        search()
    }
}

async function searchAuto() {
    if (window.location.host === "onlineexamh5new.zhihuishu.com" && $('.subject_describe').length) {
        const allJq = $('.subject_describe')
        let curDOM = ''
        let i = 0
        while (i < allJq.length) {
            curDOM = allJq[i]
            text = curDOM.innerText
            console.log(text)
            console.log(i)
            search(text, i + 1)
            i++
            await sleep(3000)
        }
    }
}

searchAuto()

