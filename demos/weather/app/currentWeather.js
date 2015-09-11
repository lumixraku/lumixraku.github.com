var geo = require('./geolocation');
var $ = require('./lib/jquery');
module.exports = geo.then(function(coords){
    return $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        dataType: 'jsonp',
        data: {
            //city: city.substring(0,city.length-1)
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
            units: 'metric'
        },
        method: 'get'
    }).then(function(data){
        for(var key in data.main){
            data.main[key] = data.main[key].toFixed(0);
        }
        localStorage.setItem('currentData', JSON.stringify(data));
        return data;
    });
});