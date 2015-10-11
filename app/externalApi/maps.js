​function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 34.0500, lng: -118.2500}
  });
  var geocoder = new google.maps.Geocoder();
    findCurrentLocation(map);
    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('zipCode').innerHTML.trim();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      var infoWindow = new google.maps.InfoWindow({
        map: resultsMap,
        position: results[0].geometry.location,
        content:('Your Treasure!')
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function findCurrentLocation(map){
  var infoWindow = new google.maps.InfoWindow({map: map});
                // Try HTML5 geolocation.
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };

                      infoWindow.setPosition(pos);
                      infoWindow.setContent('Arrgh this be You');
                      map.setCenter(pos);
                    }, function() {
                      handleLocationError(true, infoWindow, map.getCenter());
                    });
                  } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                  }


  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  };

}
