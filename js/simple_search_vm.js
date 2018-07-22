// Google Map Functions
// Global map variable of the city of mykoliv ukraine
var mykolaiv_map;
// Initialize the google map for the city of mykolaiv
function mykolaiv_map_init() {
    // Set the mykolaiv city coordinates could be changed to test fuctionality on other cities.
    mykolaiv_coordinates = {lat: 46.9750, lng: 31.9946};

    // Create the  mykolaiv map property object
    mykolaiv_map_properties = {zoom: 16, center: mykolaiv_coordinates};

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
    })
    
    // SearchQuery as a ko observable empty string
    self.query = ko.observable('');

    // test computed values
    self.search = ko.computed(function() {
        // Make a new data array for the search result
        self.searchedRestaurants = [];
        for(var i = 0; i < mykolaiv_results.length; i++) {
            if(mykolaiv_results[i].name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                self.searchedRestaurants.push({restaurantName: mykolaiv_results[i].name, restaurantIndex: i});
            }
        }
        return self.searchedRestaurants
        //return self.query().toLowerCase()
    });
}
