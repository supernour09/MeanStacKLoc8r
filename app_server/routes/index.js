var express = require('express');
var router = express.Router();
var locationController = require('../controllers/LocationController');
var otherController = require('../controllers/OtherController');


/* routes for location controller functions */
router.get('/', otherController.angularApp);
router.get('/location/:locationId',locationController.locationDetails );
router.get('/location/:locationId/review/new',locationController.addReview );
router.post('/location/:locationid/review/new', locationController.doAddReview);

/* routes for other pages*/
router.get('/about',otherController.about );

module.exports = router;



