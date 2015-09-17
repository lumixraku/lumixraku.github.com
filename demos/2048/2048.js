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
    this.getAll = function(){
        var allblocks = [];
        blocks.forEach(function(row){
            row.forEach(function(block){
                allblocks.push(block);
            });
        });
        return allblocks;
    }
    this.moveRight = function(){
        var all = this.getAll();
        all.forEach(function(item){
            item.moveRight();
        });
    }
    this.moveLeft = function(){
        var all = this.getAll();
        all.forEach(function(item){
            item.moveLeft();
        });
    }
    this.moveUp = function(){
        var all = this.getAll();
        all.forEach(function(item){
            item.moveUp();
        });
    }
    this.moveDown = function(){
        var all = this.getAll();
        all.forEach(function(item){
            item.moveDown();
        });
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
    this.element.classList.add('block');
    this.setValue= function(value){
        this.value = value;
        this.element.innerText = value;
    }

    this.getValue = function(){
        return this.value;
    }

    this.moveUp = function(){
        var self = this;
        if(self.y == 1) return;
        var blockUp = blocks.getBy(x,y-1);
        if(blockUp.getValue() == self.value){
            self.animationEle(blockUp.x, blockUp.y).then(function(){
                blockUp.value = self.value + blockUp.getValue();
                blockUp.refreshElement();
                self.value = 0;
                self.refreshElement();
            });
        }
    }
    this.moveDown = function (){
        var self = this;
        if(self.y == 4) return;
        var blockDown = blocks.getBy(x,y+1);
        if(blockDown.getValue() == self.value){
            self.animationEle(blockDown.x, blockDown.y).then(function(){
                blockDown.value = self.value + blockDown.getValue();
                blockDown.refreshElement();
                self.value = 0;
                self.refreshElement();
            });
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
        var self = this;
        if(self.x == 4) return;
        var blockRight = blocks.getBy(x+1,y);
        if(blockRight.getValue() == self.value){
            self.animationEle(blockRight.x, blockRight.y).then(function(){
                blockRight.value = self.value + blockRight.getValue();
                blockRight.refreshElement();
                self.value = 0;
                self.refreshElement();
            });
        }
    }
    this.animationEle = function(x, y){
        var self = this;
        var distpos = {}, currpos = {}, movedirection = '';
        distpos.x = x*PADDING + (x-1)*BLOCK_SIZE;
        distpos.y = y*PADDING + (y-1)*BLOCK_SIZE;
        currpos.x = +parseFloat(this.element.style.left).toFixed(1);
        currpos.y = +parseFloat(this.element.style.top).toFixed(1);
        if(distpos.x < currpos.x ) movedirection = 'left';
        if(distpos.x > currpos.x ) movedirection = 'right';
        if(distpos.y > currpos.y ) movedirection = 'down';
        if(distpos.y < currpos.y ) movedirection = 'up';
        return new Promise(function(resolve, reject){
            function step(){
                console.log('step');
                if(movedirection == 'left'){
                    if(currpos.x <= distpos.x){
                        self.element.style.left = distpos.x + 'rem';
                        resolve();
                        return ;
                    }
                    currpos.x -=0.5 ;
                    if(currpos.x > distpos.x ){
                        self.element.style.left = currpos.x + 'rem';
                    }
                }else if(movedirection == 'right'){
                    if(currpos.x >= distpos.x){
                        self.element.style.left = distpos.x + 'rem';
                        resolve();
                        return ;
                    }
                    currpos.x +=0.5 ;
                    if(currpos.x < distpos.x ){
                        self.element.style.left = currpos.x + 'rem';
                    }
                }else if(movedirection == 'down'){
                    if(currpos.y >= distpos.y){
                        self.element.style.top = distpos.y + 'rem';
                        resolve();
                        return ;
                    }
                    currpos.y +=0.5 ;
                    if(currpos.y < distpos.y ){
                        self.element.style.top = currpos.y + 'rem';
                    }
                }else if(movedirection == 'up'){
                    if(currpos.y <= distpos.y){
                        self.element.style.left = distpos.y + 'rem';
                        resolve();
                        return ;
                    }
                    currpos.y -=0.5 ;
                    if(currpos.y < distpos.y ){
                        self.element.style.left = currpos.y + 'rem';
                    }
                }
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
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
// blocks.getBy(4,1).moveLeft();
// blocks.getBy(2,3).moveRight();
// blocks.getBy(3,2).moveUp();
// blocks.getBy(2,3).moveDown();
// blocks.getBy(1,1).moveRight();
// blocks.getBy(2,1).moveRight();
// blocks.getBy(2,2).moveRight();
// setTimeout(function(){
//     blocks.getBy(3,1).moveRight();
// },2000);

blocks.moveDown();
console.log(blocks.getBy(2,1));


