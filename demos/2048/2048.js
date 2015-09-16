var pxUnit = 'rem';
var BLOCK_SIZE = 6;
var PADDING = BLOCK_SIZE/5;
var WRAPPER_SIZE = BLOCK_SIZE*4 + PADDING*5;
var wrapper;

init();
function init(){
    wrapper = document.querySelector('.wrapper');
    wrapper.style.cssText = ['width:',WRAPPER_SIZE,'rem ;height:',WRAPPER_SIZE, 'rem'].join('');
}

function Blocks(){
    var blocks = [];
    this.init = function(){
        for (var i = 0; i < 4; i++) {
            blocks[i] = [];
            for (var j = 0; j < 4; j++) {
                var block = new Block(2, i+1 ,j+1 );
                blocks[i][j] = block;
                wrapper.appendChild(block.refreshElement());
            }
        }
    }
    this.getBy = function (x, y){
        return blocks[x-1][y-1];
    }
    this.setBy = function(x,y,block){
        blocks[x-1][y-1] = block;
    }
    // this.add = function(x, y, ablock){
    //     blocks[x+1].push(ablock);
    // }
}
//x横  y纵
function Block(value, x,y){
    this.value = value;
    this.x = x;
    this.y = y;
    this.element = document.createElement('div');
    this.element.classList.add('block');;
    this.setValue= function(value){
        this.value = value;
        this.element.innerText = value;
    }

    this.getValue = function(){
        return this.value;
    }

    this.moveUp = function(){
        if(this.y == 1) return;
        var blockUp = blocks.getBy(x,y-1);
        if(blockUp.getValue() == this.value){
            blockUp.value = this.value + blockUp.getValue();
            blockUp.refreshElement();
            this.value = 0;
            this.refreshElement();
        }
    }
    this.moveDown = function (){
        if(this.y == 4) return;
        var blockDown = blocks.getBy(x,y+1);
        if(blockDown.getValue() == this.value){
            blockDown.value = this.value + blockDown.getValue();
            blockDown.refreshElement();
            this.value = 0;
            this.refreshElement();
        }
    }
    this.moveLeft = function(){
        var self = this;
        if(self.x == 1) return;
        var blockLeft = blocks.getBy(x-1,y);
        if(blockLeft.getValue() == self.value){
            self.animationEle(blockLeft.x, blockLeft.y).then(function(){
                blockLeft.value = self.value + blockLeft.getValue();
                blockLeft.refreshElement();
                self.value = 0;
                self.refreshElement();
            });
        }
    }
    this.moveRight = function(){
        if(this.x == 4) return;
        var blockRight = blocks.getBy(x+1,y);
        if(blockRight.getValue() == this.value){
            blockRight.value = this.value + blockRight.getValue();
            blockRight.refreshElement();
            this.value = 0;
            this.refreshElement();
        }
    }
    this.animationEle = function(x, y){
        var self = this;
        var distpos = {}, currpos = {}, movedirection = '';
        distpos.x = x*PADDING + (x-1)*BLOCK_SIZE;
        distpos.y = y*PADDING + (y-1)*BLOCK_SIZE;
        currpos.x = parseFloat(this.element.style.left);
        currpos.y = parseFloat(this.element.style.top);
        if(distpos.x < currpos.x){
            movedirection = 'left';
        }
        if(distpos.x > currpos.x){
            movedirection = 'right';
        }
        if(distpos.y > currpos.y){
            movedirection = 'down';
        }
        if(distpos.y < currpos.y){
            movedirection = 'up';
        }
        if(movedirection == 'left'){
            return new Promise(function(resovle, reject){
                function step(){
                    console.log(currpos.x + '---' + distpos.x);
                    if(currpos.x <= distpos.x) {
                        resovle();
                        return;
                    };
                    currpos.x = currpos.x - 0.6;
                    self.element.style.cssText = ['left:',currpos.x, 'rem;top:',currpos.y,'rem;','height:', BLOCK_SIZE,'rem;width:',BLOCK_SIZE,'rem;'].join('');
                    requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }
    }

    this.refreshElement = function(){
        this.element.style.cssText = getCorrdinateCssText(this.x,this.y);
        if(this.value == 0){
            this.element.innerText = '';
            this.element.classList.add('darkblock');

        }else{
            this.element.innerText = this.value+'';
            this.element.classList.remove('darkblock');
        }
        return this.element;
    }

    function getCorrdinateCssText(x,y){
        var pos = {};
        pos.x = x*PADDING + (x-1)*BLOCK_SIZE;
        pos.y = y*PADDING + (y-1)*BLOCK_SIZE;
        return ['left:',pos.x, 'rem;top:',pos.y,'rem;','height:', BLOCK_SIZE,'rem;width:',BLOCK_SIZE,'rem;'].join('');
    }

}

blocks = new Blocks();
blocks.init();
blocks.getBy(4,1).moveLeft();
// blocks.getBy(1,1).moveRight();
// blocks.getBy(2,1).moveRight();
console.log(blocks.getBy(2,1));


