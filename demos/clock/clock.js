var borderEle = $('.border');
var hourEle = $('.hour');
var minEle = $('.min');
var secELe = $('.sec');
paintDegree();
paintArm();

setInterval(paintArm, 1000);

function paintDegree() {

    var i = 0;
    for (; i < 60; i++) {
        var ele = $('<div>');
        if (i % 5 === 0) {
            ele.addClass('big-degree');
        } else {
            ele.addClass('small-degree');
        }
        ele.css({
            'transform': 'rotate(' + i * 6 + 'deg)'
        });
        ele.appendTo(borderEle);

    }
}

function getTime(){
  var time = new Date();
  return {
    hour: time.getHours()%12,
    min: time.getMinutes(),
    sec: time.getSeconds()
  };
}

function paintArm(){
  var time = getTime();
  hourEle.css({
    'transform':'rotate(' + time.hour/12 * 360 + 'deg)'
  });
  minEle.css({
    'transform':'rotate(' + time.min/60 * 360 + 'deg)'
  });
  secELe.css({
    'transform':'rotate(' + time.sec/60 * 360 + 'deg)'
  });
  console.log(JSON.stringify(time));
}
