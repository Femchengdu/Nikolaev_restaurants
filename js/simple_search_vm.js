// Google Map Functions
// Global map variable of the city of mykoliv ukraine
var mykolaiv_map;
// Initialize the google map for the city of mykolaiv
function mykolaiv_map_init() {
    // Set the mykolaiv city coordinates could be changed to test fuctionality on other cities.
    mykolaiv_coordinates = {lat: 46.9750, lng: 31.9946};

    // Create the  mykolaiv map property object
    mykolaiv_map_properties = {zoom: 16, center: mykolaiv_coordinates, disableDefaultUI: true};

    // Create a map object with mykolaiv properties set as per google example with w3 flavor
    mykolaiv_map = new google.maps.Map(document.getElementById("mykolaivMap"), mykolaiv_map_properties);
 
    // Request for the place information below
    const request = {
        location: mykolaiv_coordinates,
        radius: '600',
        type: ['restaurant']
    };

    // The place object 
    const service = new google.maps.places.PlacesService(mykolaiv_map); //
    service.nearbySearch(request, callback);
}

// The callback function for the map
// For the result to the place search
function callback(results, status) {
   //mykolaiv_place_results;
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // Testing access to this global varriable
    const mykolaiv_place_results = results;
    // Allow knockout handle the rest including creating a marker
    ko.applyBindings(new RestaurantsViewModel(mykolaiv_place_results));
  }
}

// Function to set the address using Here map
function set_info_address (current_marker, infowindow, location_name) {
  var platform = new H.service.Platform({
    useCIT: true,
    //useHTTPS: true,
    'app_id': 'JZz8b9xx0zSJr2xoneC9',
    'app_code': '2nEwUtx8BYNKLpJLPg8c4A'
  });

  function onSuccess(result) {
    var the_address = location_name + result.response.view[0].result[0].location.address.label;
    infowindow.setContent(content = the_address);
  }

  function onError(error) {
    alert('Ooops!');
  }

  function reverseGeocode(platform) {
    var geocoder = platform.getGeocodingService(),
      reverseGeocodingParameters = {
        prox: here_coord(current_marker),
        mode: 'retrieveAddresses',
        maxresults: '1',
        jsonattributes: 1
      };
    geocoder.reverseGeocode(reverseGeocodingParameters, onSuccess, onError);
  }
  reverseGeocode(platform);
}

// Format google coordinates to Here coordinate format
function here_coord(current_marker) {
  var glat = String(current_marker.position.lat());
  var glng = String(current_marker.position.lng());
  var complte_string = glat + ',' + glng;
  return complte_string;
}

// Function to toggle
function toggleBounce(current_marker) {
  current_marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){
   current_marker.setAnimation(null); 
  }, 1000);
}

// Create markers without assigning a map yet
function createMarker(place, markers_array) {
  var placeLoc = place.geometry.location;
  var placeName = '<div><strong>' + place.name + '</strong></div>';
  var current_marker = new google.maps.Marker({
    position: placeLoc
  });
  // Add the listener for the current marker here
  current_marker.addListener('click', function() {
    // Bounce the marker on click
    toggleBounce(current_marker);
    // The info window object 
    var infowindow = new google.maps.InfoWindow();
    // Set the address from Here maps
    set_info_address (current_marker, infowindow, placeName);
    // Open and close the infowindow
    infowindow.open(mykolaiv_map, this);
    setTimeout(function(){
     // Close the infowindow after 2 seconds
     infowindow.close(mykolaiv_map, this); 
    }, 2000);
  });
  markers_array.push(current_marker);
}

// Set the markers
function set_map_marker(filtered_array, markers_array) {
  for(var i = 0; i < filtered_array.length; i++) { 
    var marker_index = filtered_array[i].restaurantIndex;
    markers_array[marker_index].setMap(mykolaiv_map);  
  }
}

// Clear the markers
function clear_map_marker(markers_array) {
  for(var i = 0; i < markers_array.length; i++) { 
    markers_array[i].setMap(null);
  }
}
// Overall viewmodel for this screen, along with initial state data
function RestaurantsViewModel(mykolaiv_place_search) {
    var self = this;
    // Hard coded place IDs from google api search
    //https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
    const default_place_ids = [
    'ChIJzxVF4XbJxUARU8AH4aHVwUg',
    'ChIJuQ5QYnrJxUARA-vHRHr89nI',
    'ChIJgcaWH3TJxUARoC1qNDVkvrI',
    'ChIJ_6xAfHrJxUARkrglsUJzaLs',
    'ChIJQYBusGXJxUARjdS3dIc52Lo'
    ];

    const mykolaiv_results = mykolaiv_place_search.filter(function(mykolaiv_resaurant){
    return default_place_ids.includes(mykolaiv_resaurant.place_id);
    });
    
    // All markers const
    const all_markers = [];
    // SearchQuery as a ko observable empty string
    self.query = ko.observable('');

    // Add address to the markers from Here Api
    showAddress = function(data, event) {
        // Test the function
        var infowindow = new google.maps.InfoWindow();
        var current_marker = all_markers[data.restaurantIndex];
        var placeName = '<div><strong>' + data.restaurantName + '</strong></div>';
        // Setting the marker info with here map
        set_info_address(current_marker, infowindow, placeName);
        // Animate the marker
        toggleBounce(current_marker);
        infowindow.open(mykolaiv_map, current_marker);
        setTimeout(function(){
         // Close the infowindow after 2 seconds
         infowindow.close(mykolaiv_map, current_marker); 
        }, 2000);
    }

    // test computed values
    self.search = ko.computed(function() {
        // Make a new data array for the search result
        self.searchedRestaurants = [];
        for(var i = 0; i < mykolaiv_results.length; i++) {
            if(mykolaiv_results[i].name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                self.searchedRestaurants.push({restaurantName: mykolaiv_results[i].name, restaurantIndex: i});
                // Create the restaurant marker and store to an array of all markers
                createMarker(mykolaiv_results[i], all_markers);
            }
        }
        // Clear all markers from the map after search
        clear_map_marker(all_markers);
        // Set current markers based off the search
        set_map_marker(self.searchedRestaurants, all_markers);
        return self.searchedRestaurants
        //return self.query().toLowerCase()
    });
}
