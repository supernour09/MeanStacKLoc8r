

/* for about us page */
module.exports.about = function(req, res){    
    res.render('about', {
       title: 'About',
       aboutUs: 'Loc8r helps you find places to work when out and about. Perhaps with coffee,cake or a pint? Let Loc8r help you find the place you\'re looking for.'
      
      });    
  };