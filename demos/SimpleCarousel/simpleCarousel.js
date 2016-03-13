function Carousel(opt) {
  this.container = document.querySelector(opt.container || '#slides');
  this.interval = opt.interval || 2000;
  this.speed = (opt.speed || 200)+'ms';
  this.classname = opt.classname || 'item';
  this.indicator = this.container.querySelector('.indicator');
  this.itemlist = this.container.querySelector('.' + (opt.itemlist || 'itemlist'));
  this.items = this.container.querySelectorAll('.' + (this.classname || 'item'));
  this.indicator = this.container.querySelector('.indicator');
  this.count = this.items.length;
  this.width = this.items[0].offsetWidth; //200
  this.timer = null;
  this.offset = 0;
  this.indicatorNum = 0;
  this.init();
  this.bindEvents();
}
Carousel.prototype = {
  constructor: this,
  init: function() {
    var self = this;
    self.itemlist.insertBefore(self.items[self.count-1], self.items[0]);
    self.offset = 1;
    self.itemlist.style.cssText = 'transform: translateX(-' + self.width + 'px);';
    self.itemlist.style.width = (self.count) * self.width + 'px';
    self.initIndicatorElem();
  },
  next: function() {
    var self = this;
    self.offset = 2;
    self.indicatorNum++;
    self.handlePlay();
  },
  prev: function(){
    var self = this;
    self.offset = 0;
    self.indicatorNum--;
    self.handlePlay();
  },
  handlePlay: function(){
    var self = this;
    self.itemlist.style.cssText = 'transform: translateX(-' + self.width * self.offset + 'px);';
    self.itemlist.style.width = (self.count) * self.width + 'px';
    self.itemlist.style.transition = 'transform '+ self.speed +' ease';


    [].forEach.call(self.indicator.children, function(item) {
      item.classList.remove('active');
    });
    self.indicatorNum = self.indicatorNum%self.count;
    self.indicator.children[self.indicatorNum].classList.add('active');
  },
  bindEvents: function() {
    var self = this;
    self.timer = setInterval(function play(){
      self.next();
    }, self.interval);
    this.itemlist.addEventListener('transitionend', function(e) {
      console.log(e);
      //表示next()
      if(e.target.style.transform == 'translateX(-400px)'){
        self.itemlist.appendChild(self.itemlist.firstElementChild);

      }else if(e.target.style.transform == 'translateX(0px)'){
        self.itemlist.insertBefore(self.itemlist.lastElementChild, self.itemlist.firstElementChild);
      }
      //transitionend的时候是移动DOM元素  不需要动画
      self.itemlist.style.cssText = 'transform:translateX(-' + self.width * 1 + 'px); width:'+ self.count* self.width+ ';';
      self.itemlist.style.width = (self.count ) * self.width + 'px';
    }, false);
  },
  initIndicatorElem: function() {
    var self = this;
    for (var i = 1; i <= self.count; i++) {
      var item = document.createElement('i');
      item.className = 'icon';
      if (i == 1) {
        item.classList.add('active');
      }
      item.innerHTML = i;
      self.indicator.appendChild(item);
    };
  }

}
window.addEventListener('DOMContentLoaded', function() {
  carousel = new Carousel({});

}, false);


// var rotate = function() {
//      // $('#next').click();
//      moveNext();
//  }
//  var speed = 500;
//  var interval = 3000;
//  var run = setInterval(rotate, interval); /*默认滚动就是点击next按钮*/
//  var itemWidth = $('#slides li').outerWidth();
//  var leftValue = itemWidth * (-1);
//  //容器初始状态
//  $('#slides ul').css({
//      'left': leftValue
//  });
//  $('#slides li:first').before($('#slides li:last'));//初始状态  将最后一个塞到第一个之前
//  $('#prev').on('click',function(){
//      clearInterval(run);
//      movePrev();
//      run = setInterval(rotate, interval);
//  });
//  $('#next').on('click', function(){
//      clearInterval(run);
//      moveNext();
//      run = setInterval(rotate, interval);
//  });
//  $('#slides').hover(function() {
//      clearInterval(run);
//  }, function() {
//      run = setInterval(rotate, interval);
//  });
//  function movePrev(){
//      var left_indent = parseInt($('#slides ul').css('left')) + itemWidth;
//      $('#slides ul').animate({
//          'left': left_indent
//      }, speed, function() {
//          $('#slides li:first').before($('#slides li:last'));
//          $('#slides ul').css({
//              'left': leftValue
//          });
//      });
//  }
//  function moveNext(){
//      var left_indent = parseInt($('#slides ul').css('left')) - itemWidth;
//      $('#slides ul').animate({
//          'left': left_indent
//      }, speed, function() {
//          $('#slides li:last').after($('#slides li:first')); //完成一次移动  将第一个移动到最后
//          $('#slides ul').css({
//              'left': leftValue
//          });
//      });
//  }
