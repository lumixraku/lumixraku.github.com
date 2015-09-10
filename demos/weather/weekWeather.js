var geo = require('./geolocation');
var $ = require('./jquery');
module.exports = geo.then(function(coords){
    return  $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily',
        dataType: 'jsonp',
        data: {
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
            cnt: 7,
            units: 'metric'
        },
        method: 'get'
    }).then(function(data){
        data.list.forEach(function(day){
            for(var key in day.temp){
                day.temp[key] = day.temp[key].toFixed(0);
            }
        });
        localStorage.setItem('weekData', JSON.stringify(data));
        return data;
    });
});