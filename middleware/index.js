const Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      
middlewareObj    = {
        
  checkCampgroundOwnership: function (req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
          console.log(err);
          req.flash('error', 'Unable to find requested campground')
          res.redirect('back');
        } else {
          if (foundCampground.author.id.equals(req.user._id)) {
            return next();
          }
          req.flash('error', 'Campground must be created by you');
          res.redirect('back');
        }
      });
    } else {
      req.flash('error', 'You need to be logged in to do that');
      res.redirect('/login');
    }
  },
  
  confirmCommAuthor: function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
          console.log(err);
          req.flash('error', 'Unable to find requested comment')
          res.redirect('back');
        } else {
          if (foundComment.author.id.equals(req.user._id)) {
            return next();
          }
          req.flash('error', "You didn't created this comment");
          res.redirect('back');
        }
      });
    } else {
      req.flash('error', 'You need to be logged in to do that');
      res.redirect('/login');
    }
  },
  
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
  
};

module.exports = middlewareObj;