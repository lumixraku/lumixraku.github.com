$(document).ready(function() {
    var rotate = function() {
        // $('#next').click();
        moveNext();
    }
    var speed = 500;
    var interval = 3000;
    var run = setInterval(rotate, interval); /*默认滚动就是点击next按钮*/
    var itemWidth = $('#slides li').outerWidth();
    var leftValue = itemWidth * (-1);
    //容器初始状态
    $('#slides ul').css({
        'left': leftValue
    });
    $('#slides li:first').before($('#slides li:last'));//初始状态  将最后一个塞到第一个之前
    $('#prev').on('click',function(){
        clearInterval(run);
        movePrev();
        run = setInterval(rotate, interval);
    });
    $('#next').on('click', function(){
        clearInterval(run);
        moveNext();
        run = setInterval(rotate, interval);
    });
    $('#slides').hover(function() {
        clearInterval(run);
    }, function() {
        run = setInterval(rotate, interval);
    });
    function movePrev(){
        var left_indent = parseInt($('#slides ul').css('left')) + itemWidth;
        $('#slides ul').animate({
            'left': left_indent
        }, speed, function() {
            $('#slides li:first').before($('#slides li:last'));
            $('#slides ul').css({
                'left': leftValue
            });
        });
    }
    function moveNext(){
        var left_indent = parseInt($('#slides ul').css('left')) - itemWidth;
        $('#slides ul').animate({
            'left': left_indent
        }, speed, function() {
            $('#slides li:last').after($('#slides li:first')); //完成一次移动  将第一个移动到最后
            $('#slides ul').css({
                'left': leftValue
            });
        });
    }
});
