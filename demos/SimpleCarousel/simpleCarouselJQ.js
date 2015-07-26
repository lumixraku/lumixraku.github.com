;(function($){
    $.fn.Carousel = function (cfg) {
        cfg = $.extend(cfg, {});
        //PS 在$.fn.xx 的函数中  this就是一个JQ对象
        //为了链式使用  还需要返回当前的JQ对象
        //一定要用 .each
        //因为jQ选择器  $('.carousel') 得到的结果可能不是一个元素对象
        //如果有多个对象的话  很多操作会影响
        //比如 $(this).find('.' + itemName).length; 的道德值就不对
        return this.each(function(){
            var self = $(this);
            var speed = cfg && cfg.speed || 500;
            var interval = cfg && cfg.interval || 6000;
            var itemName = cfg && cfg.itemName || 'item';
            var itemWidth = self.outerWidth();
            var originLeft = itemWidth * (-1);
            var childCount = $(this).find('.' + itemName).length;
            var run = null;
            //规定item的宽度
            self.find('.item').css('width', itemWidth);
            //添加按钮
            var btnWrapper = $([
                "<div class=\"buttons\">",
                "<a href=\"#\" class=\"btn prev\">",
                "",
                "</a>",
                "<a href=\"#\" class=\"btn next\">",
                "",
                "</a>",
                "</div>"
            ].join(""));
            if(!('ontouchstart' in self)){
                self.append(btnWrapper);
            }

            self.find('.items').css('width', itemWidth * childCount);
            //容器初始状态
            self.find('.items').css('left', itemWidth * (-1));
            //最后一个塞到第一个之前
            self.find('.item:first').before(self.find('.item:last'));

            run = setInterval(rotate, interval);
            self.find('.items').hover(function () {
                clearInterval(run);
            }, function () {
                run = setInterval(rotate, interval);
            });
            //Prev Next点击且动画完成后再开始计时
            self.on('click', '.btn', function (e) {
                clearInterval(run);
                var target = $(e.target);
                if (target.hasClass('prev')) {
                    movePrev(1);
                } else {
                    moveNext(1);
                }
            });
            var touchstartX;
            var touchNowX;
            self.on('touchstart', function(e){
                e.preventDefault();
                touchstartX = e.originalEvent.touches[0].clientX;
            })
            self.on('touchmove', function(e){
                e.preventDefault();
                touchNowX = e.originalEvent.touches[0].clientX;
                self.find('.items').css('left', originLeft + (touchNowX - touchstartX));
            });
            self.on('touchend', function(e){
                e.preventDefault();
                if(Math.abs(touchNowX - touchstartX) > (itemWidth/3)){
                    if(touchNowX - touchstartX < 0){
                        moveNext();
                    }else{
                        movePrev()
                    }
                }else {
                    putBack();
                }
            })

            function putBack(){
                self.find('.items').animate({
                    'left': originLeft
                });
            }

            function rotate() {
                moveNext();
            }

            function movePrev(cleared) {
                var left_indent = parseInt(self.find('.items').css('left')) + itemWidth;
                left_indent = 0;
                self.find('.items').animate({
                    'left': left_indent
                }, speed, function () {
                    self.find('.items').css({
                        'left': originLeft
                    });
                    self.find('.item:first').before(self.find('.item:last'));
                    changeIndicator('prev');
                    if(cleared){
                        run = setInterval(rotate, interval);
                    }
                });
            }

            function moveNext(cleared) {
                var left_indent = parseInt(self.find('.items').css('left')) - itemWidth;
                left_indent = - itemWidth *2;
                self.find('.items').animate({
                    'left': left_indent
                }, speed, function () {
                    self.find('.item:last').after(self.find('.item:first')); //完成一次移动  将第一个移动到最后
                    self.find('.items').css({
                        'left': originLeft
                    });
                    changeIndicator('next');
                    if(cleared){
                        run = setInterval(rotate, interval);
                    }
                });
            }

            function changeIndicator(type){
                var active = self.find('.indi.active');
                var lastIdx = self.find('.indi:last').index();
                var first = 0;
                active.removeClass('active');
                if(type == 'next'){
                    //判断元素相等 还可以这么用
                    //active.get(0) ===  last.get(0)//这里last是最后一个元素的JQ对象
                    if(active.index() == lastIdx){
                        self.find('.indi:first').addClass('active');
                    }else{
                        active.next().addClass('active');
                    }
                }else if( type === 'prev'){
                    if(active.index() == first){
                        self.find('.indi:last').addClass('active');
                    }else{
                        self.find('.indi:last').prev().addClass('active');
                    }
                }

            }
        });

    }
})(jQuery);


