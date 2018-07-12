// Class to represent a row or model in the search
function googlModel(initial, values) {
    var self = this;   
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

ko.applyBindings(new RestaurantsViewModel());