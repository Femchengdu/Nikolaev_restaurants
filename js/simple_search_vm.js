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
        radius: '300',
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
function RestaurantsViewModel() {
    var self = this;

    // Hard coded catalog data - should come from the Google
    self.availableRestaurants = [
        { restaurantName: "Starhorod (Restaurant)", description: "cash only" },
        { restaurantName: "Grand Pomodori (Restaurant)", description: "cozy" },
        { restaurantName: "Zapichok (Pizza)", description: "cozy" },
        { restaurantName: "Yakitoriya (Japanese)", description: "cozy" },
        { restaurantName: `Kaliforniys\'ka Respublika Ta Bar Nahori (Restaurant)`, description: "Late-night food" },
        { restaurantName: "Celentano (Pizza)", description: "cozy-casual" },
        { restaurantName: "Ropponhi I Terasa (Restaurant)", description: "Cash-only" }
    ];  

    // SearchQuery as a ko observable empty string
    self.query = ko.observable('');

    // test computed values
    self.search = ko.computed(function() {
        // Make a new data array for the search result
        self.searchedRestaurants = [];
        for(var restaurant in self.availableRestaurants) {
            if(self.availableRestaurants[restaurant].restaurantName.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                self.searchedRestaurants.push(self.availableRestaurants[restaurant]);
                console.log(self.availableRestaurants[restaurant].restaurantName);
            }
        }
        return self.searchedRestaurants
        //return self.query().toLowerCase()
    })
}

//ko.applyBindings(new RestaurantsViewModel());