var express = require('express');
var router = express.Router();
var locationController = require('../controllers/locations');
var reviewController = require('../controllers/reviews');

// locations
router.get('/locations', locationController.locationsListByDistance);
router.post('/locations', locationController.locationsCreate);
router.get('/locations/:locationid', locationController.locationsReadOne);
router.put('/locations/:locationid', locationController.locationsUpdateOne);
router.delete('/locations/:locationid', locationController.locationsDeleteOne);
// reviews
router.post('/locations/:locationid/reviews', reviewController.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid',reviewController.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid',reviewController.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid',reviewController.reviewsDeleteOne);




module.exports = router;