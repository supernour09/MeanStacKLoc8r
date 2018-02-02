

/* Home page Page  */
module.exports.listLocations = function(req, res){    
    res.render('LocationList', { title: 'Loc8er - find place to work' ,
                                 pageHeader :{
                                   title : 'loc8r' ,
                                   strapline : 'Find places to work in :D Work hard '
                                 } });    
  };


/* Location Details Page  */
module.exports.locationDetails = function(req, res){    
  res.render('Details', { title: 'Location Details' });    
};

/* Add Review Page  */
module.exports.addReview = function(req, res){    
  res.render('Add Review', { title: 'Add Review' });    
};