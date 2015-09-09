var weatherInfo = {};
var $ = require('./jquery');
var _ = require('./underscore');
var currentPromise = require('./currentWeather');
var hourForecastPromise = require('./hourForecast');
var weekPromise = require('./weekWeather');
init();

currentPromise.then(function(data){
    renderCurrent(data);
});

hourForecastPromise.then(function(data){
    renderHour(data);
});
weekPromise.then(function(data){
    renderWeekTemp(data);
    renderWeekState(data);
})
function getIcon(state){
    var iconclass = '';
    state = state.toLowerCase();
    switch(state){
        case 'clear':
        iconclass = 'icon-sun';
        break;
        case 'cloud':
        iconclass = 'icon-cloudy';
        break;
        case 'rain':
        iconclass = 'icon-rain';
        break;
        default:
        iconclass = 'icon-sun';
    };
    return iconclass;
}

function formatAMPM(time){
    var time = new Date(time*1000);
    time = time.getHours();
    if(time > 12){
        time = time -12 + 'PM';
    }else{
        time += 'AM';
    }
    return time;
}
function init(){
    var cWrapper  = $('.canvas-wrapper');
    var canvas = $('#weekcanvas')[0];
    canvas.width =cWrapper[0].clientWidth * window.devicePixelRatio;
    canvas.height = cWrapper[0].clientHeight * window.devicePixelRatio;
    var currentData, weekData, hourData;
    if(localStorage.getItem('currentData')){
        currentData = JSON.parse(localStorage.getItem('currentData'));
        renderCurrent(currentData);
        renderMore(currentData);
    }
    if(localStorage.getItem('weekData')){
        weekData = JSON.parse(localStorage.getItem('weekData'));
        renderWeekTemp(weekData);
        renderWeekState(weekData);
    }
    if(localStorage.getItem('hourData')){
        hourData = JSON.parse(localStorage.getItem('hourData'));
        renderHour(hourData);
    }
    currentPromise.then(function(data){
        renderCurrent(data);
        renderMore(data);
    });
}


function renderCurrent(data){
    $('.todayTemp').text(data.main.temp);
    $('.weatherstate').text(data.weather[0].main);
    $('.location').text(data.name);
}

function renderHour(data){
    data.list = data.list.slice(0, 11);
    data.list.forEach(function(item){
        item.clock = formatAMPM(item.dt);
        item.weather[0].iconClass = getIcon(item.weather[0].main);
    });
    var temp = $('#hours').html();
    var templateFun = _.template(temp);
    var html = templateFun(data);
    $('.hourtemp-wrapper .hours').html(html);
}
function renderWeekTemp(weekData){
    var weekEdgeValue = findMaxMin(weekData);
    var canvas = $('#weekcanvas')[0];
    var MAX=0, MIN=1;
    var weekMaxArr = getWeekMaxMin(weekData,MAX);
    var weekMinArr = getWeekMaxMin(weekData, MIN);
    draw(canvas, weekMinArr, weekMaxArr, weekEdgeValue.min, weekEdgeValue.max);
    function draw(canvas, weekMinArr, weekMaxArr, weekMin, weekMax){
        var padding = 25;
        var ctx = canvas.getContext('2d');
        var range = canvas.height - padding*2;
        var unit = range/(weekMax - weekMin);
        var topPoint = 0 + padding;
        var colCount = 7;//列数
        var xSeries = (function(){
            var colWidth = canvas.width/colCount;
            var xSer = [];
            for (var i = 0; i < colCount; i++) {
                xSer.push(i * colWidth + colWidth/2);
            }
            return xSer;
        })();
        var yMaxSeries = (function(){
            var yMaxPoint = [];
            weekMaxArr.forEach(function(dayMax){
                yMaxPoint.push((weekMax - dayMax) * unit + topPoint);
            });
            return yMaxPoint;
        })();
        var yMinSeries = (function(){
            var yMinPoint = [];
            weekMinArr.forEach(function(dayMin){
                yMinPoint.push((weekMax - dayMin) * unit + topPoint)
            });
            return yMinPoint;
        })();
        //draw;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        yMaxSeries.reduce(function(prey, cury, i){
            ctx.beginPath();
            ctx.moveTo(xSeries[i-1], prey);
            ctx.lineTo(xSeries[i], cury);
            ctx.stroke();
            return cury;//作为下一次的prey
        });
        yMinSeries.reduce(function(prey, cury, i){
            ctx.beginPath();
            ctx.moveTo(xSeries[i-1], prey);
            ctx.lineTo(xSeries[i], cury);
            ctx.stroke();
            return cury;
        });
        yMaxSeries.forEach(function(y,i){
            canvasText(ctx, xSeries[i],y, weekMaxArr[i], MAX);
        });
        yMinSeries.forEach(function(y,i){
            canvasText(ctx, xSeries[i],y, weekMinArr[i], MIN);
        })
        function canvasText(ctx, x, y, value, type){
            ctx.font="12px Verdana";
            if(type == MAX){
                ctx.fillText(value, x - 5, y - 15);
            }else{
                ctx.fillText(value, x - 5, y + 15);
            }
        }
    }
    function findMaxMin(data){
        var min,max;
        min = data.list[0].temp.min;
        max = data.list[0].temp.max;
        data.list.forEach(function(day){
            if(day.temp.min < min){
                min = day.temp.min;
            }
            if(day.temp.max > max){
                max = day.temp.max;
            }
        });
        return {
            min: min,
            max: max
        }
    }
    function getWeekMaxMin(data, type){
        var arr = [];
        data.list.forEach(function(day){
            if(type == MAX){
                arr.push(day.temp.max);
            }else{
                arr.push(day.temp.min);
            }
        });
        return arr;
    }
}

function renderWeekState(weekData){
    var oFragState = document.createDocumentFragment();
    var oFrageDay = document.createDocumentFragment();
    var DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekData.list.forEach(function(day){
        var divState = document.createElement('div');
        var divDay = document.createElement('div');
        divState.className = 'day-state';
        // divState.innerText = day.weather[0].main;
        divState.classList.add(getIcon(day.weather[0].main));
        oFragState.appendChild(divState);
        divDay.className = 'day-day';
        divDay.innerText = DAY[new Date(day.dt*1000).getDay()];
        oFrageDay.appendChild(divDay);
    });
    $('.week-state-wrapper').empty();
    $('.day-state-wrapper').empty();
    $('.week-state-wrapper').append(oFragState);
    $('.day-state-wrapper').append(oFrageDay);
}

function renderMore(data){
    data.list = [];
    data.list.push({
        infoKey:'Sunrise',
        infoValue: formatAMPM(data.sys.sunrise)
    },{
        infoKey:'Sunset',
        infoValue: formatAMPM(data.sys.sunset)
    },{
        infoKey:'wind speed',
        infoValue: data.wind.speed
    },{
        infoKey: 'Humidity',
        infoValue: data.main.humidity
    },{
        infoKey: 'Pressure',
        infoValue: data.main.pressure
    });
    var templateFun = _.template($('#moreInfo').html());
    $('.more-info-wrapper').html(templateFun(data));

}








