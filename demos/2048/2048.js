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
test();


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

function test() {
    var btns = document.querySelector('.btns');
    btns.addEventListener('click', function(e) {
        var target = e.target;
        if (target.classList.contains('btnUp')) {
            swipeUp();
        } else if (target.classList.contains('btnDown')) {
            swipeDown();
        } else if (target.classList.contains('btnLeft')) {
            swipeLeft();
        } else if (target.classList.contains('btnRight')) {
            swipeRight();
        }
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
        block.innerText = value + '';
    } else {
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
        block.innerText = value;
        block.classList.remove('dark');
    } else {
        block.innerText = '';
        block.classList.add('dark');
    }
}
//对于up  prev就是curr上方的方块
function blockMerge(dist, curr) {
    if (curr.innerText) {
        if (dist.innerText == '') {
            animate(dist, curr);
            dist.innerText = curr.innerText;
            dist.classList.remove('dark');
            toDark(curr);
        } else if (dist.innerText == curr.innerText) {
            animate(dist, curr);
            dist.innerText = (+dist.innerText) * 2;
            toDark(curr);
        }
    }
}

function toDark(ele) {
    ele.innerText = '';
    ele.classList.add('dark');
}

function animate(dist, curr) {
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
    animate.innerText = curr.innerText;
    animate.style.width = '6rem';
    animate.style.height = '6rem';
    animate.style.zIndex = '99';
    wrapper.appendChild(animate);
    animate.addEventListener('transitionend', function(e) {
        e.target.remove();
    }, false);
    setTimeout(function() {
        animate.style.transitionProperty = 'all';
        animate.style.transitionDuration = '100ms';
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
            var currentY = y;
            while (currentY != 1) {
                blockMerge(getBlockBy(x, currentY - 1), getBlockBy(x, currentY));
                currentY--;
            }
        }
    }
    randomAdd(UP);
}

function swipeDown() {
    for (var x = 1; x <= 4; x++) {
        for (var y = 3; y >= 1; y--) {
            var currentY = y;
            while (currentY != 4) {
                blockMerge(getBlockBy(x, currentY + 1), getBlockBy(x, currentY));
                currentY++;
            }
        }
    }
    randomAdd(DOWN);
}

function swipeLeft() {
    for (var y = 1; y <= 4; y++) {
        for (var x = 2; x <= 4; x++) {
            var currentX = x;
            while (currentX != 1) {
                blockMerge(getBlockBy(currentX - 1, y), getBlockBy(currentX, y));
                currentX--;
            }
        }
    }
    randomAdd(LEFT);
}

function swipeRight() {
    for (var y = 1; y <= 4; y++) {
        for (var x = 3; x >= 1; x--) {
            var currentX = x;
            while (currentX != 4) {
                blockMerge(getBlockBy(currentX + 1, y), getBlockBy(currentX, y));
                currentX++;
            }
        }
    }
    randomAdd(RIGHT);
}

function randomAdd(type) {
    var block, randomArr = [1, 2, 3, 4];
    if (type == UP) {
        block = getBlockBy(Math.ceil(Math.random() * 4), 4);
    } else if (type == DOWN) {
        block = getBlockBy(Math.ceil(Math.random() * 4), 1);
    } else if (type == LEFT) {
        block = getBlockBy(4, Math.ceil(Math.random() * 4));
    } else if (type == RIGHT) {
        block = getBlockBy(1, Math.ceil(Math.random() * 4));
    }
    block.style.transform = 'scale(0.1)';
    block.innerText = Math.random() > 0.5 ? 4 : 2;
    block.classList.remove('dark');
    block.style.opacity = '0.5';
    setTimeout(function() {
        block.style.transitionProperty = 'all';
        block.style.transitionDuration = '1s';
        block.style.transform = 'scale(1.0)';
        block.style.opacity = '1';
    }, 0);

}
