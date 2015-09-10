var $ = require('./jquery');
//baidu map
var appKey = 'vLCGXZMxvFbXpcz7zSIM0KMa';
var geoPromise = new Promise(function(resolve, reject){
    if (navigator.geolocation) {    
        navigator.geolocation.getCurrentPosition(function(position){
            var coords = position.coords;
            resolve(coords);
        }, function(error){
            switch (error.code) {
                case error.TIMEOUT:
                    alert("A timeout occured! Please try again!");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('We can\'t detect your location. Sorry!');
                    break;
                case error.PERMISSION_DENIED:
                    alert('Please allow geolocation access for this to work.');
                    break;
                case error.UNKNOWN_ERROR:
                    alert('An unknown error occured!');
                    break;
            };
            reject(error);
        }, {
            // enableHighAcuracy: true, // true means only GPS
            timeout: 5000,
            maximumAge: 3000    
        });
    } else {    
        alert("Your browser does not support Geolocation!");
    }
});
module.exports = geoPromise.then(function(coords){
    var hourWeather = $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast',
        dataType: 'jsonp',
        data: {
            //city: city.substring(0,city.length-1)
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
            units: 'metric'
        },
        method: 'get'
    }).then(function(res) {
        return res;//jsonp之后res已经是{}了
    });
    var currentWeather = $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        dataType: 'jsonp',
        data: {
            //city: city.substring(0,city.length-1)
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
            units: 'metric'
        },
        method: 'get'
    });
    return Promise.all([hourWeather, currentWeather]);
});

    //url:'http://api.lib360.net/open/weather.json',//支持小时显示可惜不能跨域//参数为 city=xx(不要市字)
