$(function(){
	movePupil();
	//changeMouse();
});

function movePupil(){
	$('.wholepart').mousemove(function(event) {
		/* Act on the event */
		//注意offset()和 position()的区别
		//offset指的是相对于窗体的偏移(没有iframe的情况下)
		//position()是相对于最近一级拥有position为absolute或者relative的父元素的偏移
		var x=event.pageX-$('.eyes .center_point').offset().left;
		var y=event.pageY-$('.eyes .center_point').offset().top;
		$('.pupil').css({
			'left': -15+(x/10),
			'top': (y<=0)?(-15+y/2):(-15+y/10)
		});
	});
}

function changeMouse(){
	$('.wholepart').mousemove(function(event) {
		/* Act on the event */
		var x=event.pageX-$('.teeth .center_point').offset().left;
		var y=event.pageY-$('.teeth .center_point').offset().top;		
		$('.mouse').css({
			'height': 175-Math.abs(x/2),
			'width': 350-Math.abs(x),
		});		
		$('.teeth').css({
			'margin-top': -Math.abs(x/2)
		});
	});
}