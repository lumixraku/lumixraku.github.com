var geo = require('./geolocation');
var $ = require('./jquery');
module.exports = geo.then(function(coords){
    return  $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast',
        dataType: 'jsonp',
        data: {
            //city: city.substring(0,city.length-1)
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
            units: 'metric'
        },
        method: 'get'
    }).then(function(data) {
        data.list.forEach(function(hour){
            for(var key in hour.main){
                hour.main[key] = hour.main[key].toFixed(0);
            }
        });
        localStorage.setItem('hourData', JSON.stringify(data));
        return data;
    });
});