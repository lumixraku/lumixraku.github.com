function Carousel(opt) {
  this.container = document.querySelector(opt.container || '#slides');
  this.interval = opt.interval || 4000;
  this.speed = (opt.speed || 200) + 'ms';
  this.classname = opt.classname || 'item';
  this.itemlist = this.container.querySelector('.' + (opt.itemlist || 'itemlist'));
  this.items = this.container.querySelectorAll('.' + (this.classname || 'item'));
  this.indicator = this.container.querySelector('.indicator');
  this.count = this.items.length;
  this.width = this.items[0].offsetWidth; //200
  this.offset = 0;
  this.timer = null;
  this.init();
  this.bindEvents();
}
Carousel.prototype = {
  constructor: this,
  init: function() {
    var self = this;
    var copyItem = self.itemlist.firstElementChild.cloneNode(true);
    self.itemlist.appendChild(copyItem);
    self.itemlist.style.width = (self.count + 1) * self.width + 'px';
    self.initIndicatorElem();
  },
  next: function() {
    var self = this;
    self.offset += 1;
    offsetValue = self.offset * self.width;
    self.handleOffset();
  },
  playTo: function(idx) {
    var self = this;
    self.offset = idx - 1;
    self.handleOffset();
  },
  handleOffset: function() {
    var self = this;
    var offsetValue = self.offset * self.width;
    self.itemlist.style.cssText = 'transform: translateX(-' + offsetValue + 'px);';
    self.itemlist.style.width = (self.count + 1) * self.width + 'px';
    self.itemlist.style.transition = 'transform ' + self.speed + ' ease';

    [].forEach.call(self.indicator.children, function(item) {
      item.classList.remove('active');
    });
    self.indicator.children[self.offset % self.count].classList.add('active');

  },
  bindEvents: function() {
    var self = this;
    self.timer = setInterval(function play() {
      self.next();
    }, self.interval);
    this.itemlist.addEventListener('transitionend', function(e) {
      if (self.offset == self.count) {
        //12341
        //和上面不同 这里是隐藏式移动元素  木有transition
        self.itemlist.style.cssText = 'transform:translateX(0px); width:' + (self.count + 1) * self.width + 'px;';
        self.offset = 0;
      }
    }, false);
    this.indicator.addEventListener('click', function(e) {
      var target = e.target;
      self.playTo(~~target.innerHTML);
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
