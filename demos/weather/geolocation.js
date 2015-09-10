//baidu map
var appKey = 'vLCGXZMxvFbXpcz7zSIM0KMa';
var geoPromise = new Promise(function(resolve, reject){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            resolve({
                latitude: r.point.lat,
                longitude: r.point.lng
            });
        } else {
            resolve({
                latitude:39,
                longitude:116
            });
        }
    });
    // if (navigator.geolocation) {    
    //     navigator.geolocation.getCurrentPosition(function(position){
    //         var coords = position.coords;
    //         resolve(coords);
    //     }, function(error){
    //         switch (error.code) {
    //             case error.TIMEOUT:
    //                 // alert("A timeout occured! Please try again!");
    //                 break;
    //             case error.POSITION_UNAVAILABLE:
    //                 // alert('We can\'t detect your location. Sorry!');
    //                 break;
    //             case error.PERMISSION_DENIED:
    //                 // alert('Please allow geolocation access for this to work.');
    //                 break;
    //             case error.UNKNOWN_ERROR:
    //                 // alert('An unknown error occured!');
    //                 break;
    //         };
    //         //reject(error);
    //         resolve({
    //             latitude:30,
    //             longitude:114
    //         })
    //     }, {
    //         // enableHighAcuracy: true, // true means only GPS
    //         timeout: 5000,
    //         maximumAge: 3000    
    //     });
    // } else {    
    //     alert("Your browser does not support Geolocation!");
    // }
});
module.exports = geoPromise;
