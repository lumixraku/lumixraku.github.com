var pxUnit = 'rem';
var BLOCK_SIZE = 6;
var PADDING = BLOCK_SIZE / 5;
var WRAPPER_SIZE = BLOCK_SIZE * 4 + PADDING * 5;
var wrapper;
var blockList = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var UP = 0,
    LEFT = 1,
    RIGHT = 2,
    DOWN = 3;

init();
bindEvents();


function init() {
    wrapper = document.querySelector('.wrapper');
    wrapper.style.cssText = ['width:', WRAPPER_SIZE, 'rem ;height:', WRAPPER_SIZE, 'rem'].join('');
    //其它则初始为没有值的方块
    for (var x = 1; x <= 4; x++) {
        for (var y = 1; y <= 4; y++) {
            addBlock(x, y, 0);
        }
    }
    //初始化需要添加两个数字为2的方块
    setBlock(4, 3, 2);
    setBlock(4, 4, 2);
    setBlock(4, 1, 4);

}

function bindEvents() {
    // var btns = document.querySelector('.btns');
    // btns.addEventListener('click', function(e) {
    //     var target = e.target;
    //     if (target.classList.contains('btnUp')) {
    //         swipeUp();
    //     } else if (target.classList.contains('btnDown')) {
    //         swipeDown();
    //     } else if (target.classList.contains('btnLeft')) {
    //         swipeLeft();
    //     } else if (target.classList.contains('btnRight')) {
    //         swipeRight();
    //     }
    // }, false);
    window.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 87:
                swipeUp();
                break;
            case 83:
                swipeDown();
                break;
            case 65:
                swipeLeft();
                break;
            case 68:
                swipeRight();
                break;
        }
    }, false);
    var touchStart = {
            x: 0,
            y: 0,
        },
        touchEnd = {
            x: 0,
            y: 0
        }
    window.addEventListener('touchstart', function(e) {
        touchStart.x = e.touches[0].pageX;
        touchStart.y = e.touches[0].pageY;
        e.preventDefault();
    }, false);
    window.addEventListener('touchmove', function(e) {
        touchEnd.x = e.touches[0].pageX;
        touchEnd.y = e.touches[0].pageY;
        e.preventDefault();
    }, false);
    window.addEventListener('touchend', function(e) {
        //UP DWON
        if (Math.abs(touchEnd.y - touchStart.y) > Math.abs(touchEnd.x - touchStart.x)) {
            if (touchEnd.y < touchStart.y) {
                swipeUp();
            } else {
                swipeDown();
            }
        }
        if (Math.abs(touchEnd.x - touchStart.x) > Math.abs(touchEnd.y - touchStart.y)) {
            if (touchEnd.x < touchStart.x) {
                swipeLeft();
            } else {
                swipeRight();
            }
        }
        e.preventDefault();
    }, false);
}


function newBlockELe() {
    var block = document.createElement('div');
    block.classList.add('block');
    block.style.width = BLOCK_SIZE + 'rem';
    block.style.height = BLOCK_SIZE + 'rem';
    return block;
}

function addBlock(x, y, value) {
    var pos = getPosition(x, y);
    var block = newBlockELe();
    if (value) {
        block.setAttribute('data', value);
        block.innerText = value + '';
    } else {
        block.setAttribute('data', 0);
        block.classList.add('dark');
    }
    block.style.top = pos.y + 'rem';
    block.style.left = pos.x + 'rem';
    wrapper.appendChild(block);
    blockList[x - 1][y - 1] = block;
}

function getBlockBy(x, y) {
    return blockList[x - 1][y - 1];
}

function setBlock(x, y, value) {
    var block = blockList[x - 1][y - 1];
    if (value) {
        block.setAttribute('data', value);
        block.innerText = value;
        block.classList.remove('dark');
    } else {
        block.setAttribute('data', 0);
        block.innerText = '';
        block.classList.add('dark');
    }
}
//对于up  prev就是curr上方的方块
function blockMerge(dist, curr) {
    var moved = false;
    var value = curr.getAttribute('data');
    if (curr.getAttribute('data') && curr.getAttribute('data') != '0') {
        if (dist.getAttribute('data') == '0') {
            toDark(curr);
            dist.setAttribute('data', value);
            moved = true;
            // animate(dist, curr, value).then(function(){
            //     if(dist.getAttribute('data') != '0'){
            //         dist.innerText = dist.getAttribute('data');
            //         dist.classList.remove('dark');
            //     }else{
            //         dist.classList.add('dark');
            //         dist.innerText = '';
            //     }
            // });
        } else if (dist.getAttribute('data') == curr.getAttribute('data')) {
            toDark(curr);
            moved = true;
            dist.setAttribute('data', (+dist.getAttribute('data')) * 2);
            // animate(dist, curr, value).then(function(){
            //     if(dist.getAttribute('data') != '0'){
            //         dist.innerText = dist.getAttribute('data');
            //         dist.classList.remove('dark');
            //     }else{
            //         dist.classList.add('dark');
            //         dist.innerText = '';
            //     }
            // });
        }
    }
    return moved;
}


function toDark(ele) {
    ele.setAttribute('data', 0);
    ele.innerText = '';
    ele.classList.add('dark');
}

function animate(dist, curr, value) {
    var distLeft = +parseFloat(dist.style.left).toFixed(1),
        distTop = +parseFloat(dist.style.top).toFixed(1),
        currentTop = +parseFloat(curr.style.top).toFixed(1),
        currentLeft = +parseFloat(curr.style.left).toFixed(1),
        curTop = currentTop,
        curLeft = currentLeft;
    var animate = document.createElement('div');
    animate.classList.add('animate');
    animate.classList.add('animate');
    animate.style.top = currentTop + 'rem';
    animate.style.left = currentLeft + 'rem';
    animate.innerText = value;
    wrapper.appendChild(animate);
    return new Promise(function(resolve, reject) {
        function refreshDist() {
            if (dist.getAttribute('data') != '0') {
                dist.innerText = dist.getAttribute('data');
                dist.classList.remove('dark');
            } else {
                dist.classList.add('dark');
                dist.innerText = '';
            }
        }
        var timer = setInterval(function() {
            if (distTop < currentTop) {
                curTop = curTop - 0.2;
                animate.style.top = curTop + 'rem';
                if (curTop <= distTop) {
                    clearInterval(timer);
                    animate.remove();
                    refreshDist();
                    resolve();
                }
            }
            if (distTop > currentTop) {
                curTop = curTop + 0.2;
                animate.style.top = curTop + 'rem';
                if (curTop >= distTop) {
                    clearInterval(timer);
                    animate.remove();
                    refreshDist();
                    resolve();
                }
            }
            if (distLeft < currentLeft) { // 左移
                curLeft = curLeft - 0.2;
                animate.style.left = curLeft + 'rem';
                if (curLeft <= distLeft) {
                    clearInterval(timer);
                    animate.remove();
                    refreshDist();
                    resolve();
                }
            }
            if (distLeft > curLeft) { // 右移
                curLeft = curLeft + 0.2;
                animate.style.left = curLeft + 'rem';
                if (curLeft >= distLeft) {
                    clearInterval(timer);
                    animate.remove();
                    refreshDist();
                    resolve();
                }
            }
        }, 1);
    });
}

function animateTransition(dist, curr, value) {
    var left = parseFloat(dist.style.left).toFixed(1),
        top = parseFloat(dist.style.top).toFixed(1),
        currentTop = parseFloat(curr.style.top).toFixed(1),
        currentLeft = parseFloat(curr.style.left).toFixed(1),
        curTop = currentTop,
        curLeft = currentLeft;
    var animate = document.createElement('div');
    animate.classList.add('animate');
    animate.style.top = currentTop + 'rem';
    animate.style.left = currentLeft + 'rem';
    animate.innerText = value;
    animate.style.width = '6rem';
    animate.style.height = '6rem';
    animate.style.zIndex = '99';
    animate.style.transitionProperty = 'all';
    animate.style.transitionDuration = '150ms';
    wrapper.appendChild(animate);
    //animate.addEventListener('transitionend', function(e) {
    // e.target.remove();
    setTimeout(function() {
        animate.parentElement.removeChild(animate);
        if (dist.getAttribute('data') != '0') {
            dist.innerText = dist.getAttribute('data');
        } else {
            dist.innerText = '';
        }
        if (curr.getAttribute('data') != '0') {
            curr.innerText = curr.getAttribute('data');
        } else {
            curr.innerText = '';
        }
    }, 150);
    // }, false);
    setTimeout(function() {
        animate.style.top = top + 'rem';
        animate.style.left = left + 'rem';
    }, 0);
}

function getPosition(x, y) {
    return {
        x: x * PADDING + (x - 1) * BLOCK_SIZE,
        y: y * PADDING + (y - 1) * BLOCK_SIZE
    }
}


function swipeUp() {
    //对于后面三排方块 每一个都检测能否上移
    for (var x = 1; x <= 4; x++) {
        for (var y = 2; y <= 4; y++) { //后三排
            var currentY = y,
                distY = y,
                step = 0,
                moved, value;
            value = getBlockBy(x, y).getAttribute('data');
            while (currentY != 1) {
                moved = blockMerge(getBlockBy(x, currentY - 1), getBlockBy(x, currentY));
                currentY--;
                if (moved) {
                    distY = currentY;
                    // step++;
                }
            }
            if (distY != y) { //表示该方块移动过 开始动画
                animate(getBlockBy(x, distY), getBlockBy(x, y), value);
            }
        }
    }
    randomAdd(UP);
}

function swipeDown() {
    for (var x = 1; x <= 4; x++) {
        for (var y = 3; y >= 1; y--) {
            var currentY = y,
                distY = y,
                step = 0,
                moved, value;
            value = getBlockBy(x, y).getAttribute('data');
            while (currentY != 4) {
                moved = blockMerge(getBlockBy(x, currentY + 1), getBlockBy(x, currentY));
                currentY++;
                if (moved) {
                    distY = currentY;
                }
            }
            if (distY != y) { //表示该方块移动过 开始动画
                animate(getBlockBy(x, distY), getBlockBy(x, y), value);
            }
        }
    }
    randomAdd(DOWN);
}

function swipeLeft() {
    for (var y = 1; y <= 4; y++) {
        for (var x = 2; x <= 4; x++) {
            var currentX = x,
                distX = x,
                step = 0,
                moved, value;
            value = getBlockBy(x, y).getAttribute('data');
            while (currentX != 1) {
                moved = blockMerge(getBlockBy(currentX - 1, y), getBlockBy(currentX, y));
                currentX--;
                if (moved) {
                    distX = currentX;
                }
            }
            if (distX != x) { //表示该方块移动过 开始动画
                animate(getBlockBy(distX, y), getBlockBy(x, y), value);
            }
        }
    }
    randomAdd(LEFT);
}

function swipeRight() {
    for (var y = 1; y <= 4; y++) {
        for (var x = 3; x >= 1; x--) {
            var currentX = x,
                distX = x,
                step = 0,
                moved, value;
            value = getBlockBy(x, y).getAttribute('data');
            while (currentX != 4) {
                moved = blockMerge(getBlockBy(currentX + 1, y), getBlockBy(currentX, y));
                currentX++;
                if (moved) {
                    distX = currentX;
                }
            }
            if (distX != x) { //表示该方块移动过 开始动画
                animate(getBlockBy(distX, y), getBlockBy(x, y), value);
            }
        }
    }
    randomAdd(RIGHT);
}

function randomAdd(type) {
    var block, randomArr = [1, 2, 3, 4],
        value, emptyList = [];
    if (type == UP) {
        emptyList = findEmpty(0, 4);
    } else if (type == DOWN) {
        emptyList = findEmpty(0, 1);
    } else if (type == LEFT) {
        emptyList = findEmpty(4, 0);
    } else if (type == RIGHT) {
        emptyList = findEmpty(1, 0);
    }
    if (!emptyList.length) {
        return;
    }
    // 如果length是4  产生0-3的随机数字
    var rindex = ~~(Math.random() * (emptyList.length));
    block = emptyList[rindex];
    if (!block) {
        debugger
        console.log(rindex);
    }
    value = Math.random() > 0.5 ? 4 : 2;
    block.setAttribute('data', value);
    var animateEle = document.createElement('div');
    animateEle.style.width = BLOCK_SIZE + 'rem';
    animateEle.style.height = BLOCK_SIZE + 'rem';
    animateEle.style.position = 'absolute';
    animateEle.style.top = block.style.top;
    animateEle.style.left = block.style.left;
    animateEle.classList.add('block');
    animateEle.innerText = block.getAttribute('data');
    var scale = 0.1;
    animateEle.style.transform = 'scale(' + scale + ')';
    wrapper.appendChild(animateEle);
    function step(){
        scale = scale + 0.03;
        animateEle.style.transform = 'scale(' + scale + ')';
        if (scale >= 1) {
            block.classList.remove('dark');
            block.innerText = value;
            animateEle.remove();
            return;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    //只有在空屋上增加新方块
    function findEmpty(x, y) {
        var emptyList = [],
            block;
        if (y) {
            var xIndex = 1;
            for (; xIndex <= 4; xIndex++) {
                block = getBlockBy(xIndex, y);
                if (block.getAttribute('data')) {
                    emptyList.push(block);
                }
            }
        } else if (x) {
            var yIndex = 1;
            for (; yIndex <= 4; yIndex++) {
                block = getBlockBy(x, yIndex);
                if (block.getAttribute('data')) {
                    emptyList.push(block);
                }
            }
        }
        return emptyList;
    }
}
