  var map;
  var geoJSON;
  var request;
  var gettingData = false;
  var openWeatherMapKey = "7d5d8d10e16f1532dde20890822a8898"
  function initialize() {
    var mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(50,-50)
    
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    // Add interaction listeners to make weather requests
    google.maps.event.addListener(map, 'idle', checkIfDataRequested);
    // Sets up and populates the info window with details
    map.data.addListener('click', function(event) {
      infowindow.setContent(
       "<img src=" + event.feature.getProperty("icon") + ">"
       + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
       + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
       + "<br />" + event.feature.getProperty("weather")
       );
      infowindow.setOptions({
          position:{
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          pixelOffset: {
            width: 0,
            height: -15
          }
        });
      infowindow.open(map);
    });
  setMarkerOne();
  setMarkerTwo();
  }
  var checkIfDataRequested = function() {
    // Stop extra requests being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };
  // Get the coordinates from the Map bounds
  var getCoords = function() {
    var bounds = map.getBounds();
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest();
    getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
  };
  // Make the weather request
  var getWeather = function(northLat, eastLng, southLat, westLng) {
    gettingData = true;
    var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + openWeatherMapKey;
    request = new XMLHttpRequest();
    request.onload = proccessResults;
    request.open("get", requestString, true);
    request.send();
  };
  // Take the JSON results and proccess them
  var proccessResults = function() {
    console.log(this);
    var results = JSON.parse(this.responseText);
    if (results.list.length > 0) {
        resetData();
        for (var i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
    }
  };
  var infowindow = new google.maps.InfoWindow();
  // For each result that comes back, convert the data to geoJSON
  var jsonToGeoJson = function (weatherItem) {
    var feature = {
      type: "Feature",
      properties: {
        city: weatherItem.name,
        weather: weatherItem.weather[0].main,
        temperature: weatherItem.main.temp,
        min: weatherItem.main.temp_min,
        max: weatherItem.main.temp_max,
        humidity: weatherItem.main.humidity,
        pressure: weatherItem.main.pressure,
        windSpeed: weatherItem.wind.speed,
        windDegrees: weatherItem.wind.deg,
        windGust: weatherItem.wind.gust,
        icon: "http://openweathermap.org/img/w/"
              + weatherItem.weather[0].icon  + ".png",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      },
      geometry: {
        type: "Point",
        coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
      }
    };
    // Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });
    // returns object
    return feature;
  };
  // Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // Set the flag to finished
     gettingData = false;
  };
  // Clear data layer and geoJSON
  var resetData = function () {
    geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    map.data.forEach(function(feature) {
      map.data.remove(feature);
    });
  
  var contentEindhoven = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Eindhoven</h1>'+
            '<div id="bodyContent">'+
            
      '<p><b>Aantal inwoners</b> 227.100 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 5 meter<br /> '+
            '<b>Landingsplek aangeraden</b><br /></p>'+
            '</div>'+
            '</div>';
      
  var contentLonden = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Londen</h1>'+
            '<div id="bodyContent">'+
            
      '<p><b>Aantal inwoners</b> 8.674.713 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 245 meter<br /></p> '+
            '</div>'+
            '</div>';
      
  var contentNewYork = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">New York</h1>'+
            '<div id="bodyContent">'+
            
      '<p><b>Aantal inwoners</b> 8.550.405 inwoners<br /> ' +
            '<b>Hoogte landingsplek</b> 124 meter<br /></p> '+
            '</div>'+
            '</div>';
      

      // Array of markers
      var markers = [
        {
          coords:{lat:51.4266279,lng:5.4813194},
          content: contentEindhoven
      
        },
        {
          coords:{lat:51.509865,lng:-0.118092},
          content:contentLonden
        },
        {
          coords:{lat:40.730610,lng:-73.935242},
      content:contentNewYork
        }
      ];

      // Loop through markers
      for(var i = 0;i < markers.length;i++){
        // Add marker
        addMarker(markers[i]);
      }

      // Add Marker Function
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          //icon:props.iconImage
        });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }
  
  
  };
  google.maps.event.addDomListener(window, 'load', initialize);
  

function setMarkerOne() {
  var icon = {
    url: 'pictures/nasaLogo-570x450.png',
    scaledSize: new google.maps.Size(70, 60) // scaled size
  };
  
  var marker = new google.maps.Marker({
    position: {lat: 28.5728722, lng: -80.6489808},
    map: map,
    icon: icon,
    title: 'Hello World!'
  }); 
}

function setMarkerTwo() {
  var icon = {
    url: 'pictures/nasaLogo-570x450.png',
    scaledSize: new google.maps.Size(70, 60) // scaled size
  };
  
  var marker = new google.maps.Marker({
    position: {lat: 28.396837, lng: -80.605659},
    map: map,
    icon: icon,
    title: 'Hello World!'
  });
  
  
}