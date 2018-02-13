var mongoose = require('mongoose');


//schema for locations 
//2dsphere for mangoose to know the right calculation it is circle based calculation
//for array in coords to work a coordinate pair must be entered
//into the array in the correct order: longitude then latitude
//it uses two subDocument for reviews  and opening times
var locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, "default": 0, min: 0, max: 5 },
    facilities: [String],
    coords: { type: [Number], index: '2dsphere' },
    openingTimes: [{
        days: { type: String, required: true },
        opening: String,
        closing: String,
        closed: { type: Boolean, required: true }
    }],
    reviews: [{
        author: {type: String, required: true},
        rating: { type: Number, required: true, min: 0, max: 5 },
        reviewText: {type: String, required: true},
        createdOn: { type: Date, "default": Date.now }
    }]
});



//build the model of location
mongoose.model('Location', locationSchema);









