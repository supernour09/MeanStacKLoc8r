var express = require('express');
var router = express.Router();
var locationController = require('../controllers/LocationController');
var otherController = require('../controllers/OtherController');


/* routes for location controller functions */
router.get('/', locationController.listLocations);
router.get('/location',locationController.locationDetails );
router.get('/location/review/new',locationController.addReview );

/* routes for other pages*/
router.get('/about',otherController.about );

module.exports = router;



