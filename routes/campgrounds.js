const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      Middleware = require("../middleware");

router.get('/', (req, res) => {
  Campground.find({}, (err, cg) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {pagetitle: 'List of campgrounds', style: '/index.css', camps: cg});
    }
  })
})

router.get('/new', Middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new', {pagetitle: 'Add new campground', style: '/new.css'});
})

router.post('/', Middleware.isLoggedIn, (req, res) => {
  Campground.create({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  }, (err, cg) => {
    if (err) {
      console.log(err);
    } else {
      console.log('campground created');
    }
  });
  res.redirect('/cgroundslist');
})

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec( (err, target) => {
    if (err || !target) {
      console.log(err);
      req.flash('error', 'Unable to find requested campground');
      res.redirect('back');
    } else {
      res.render('campgrounds/show', {pagetitle: target.name, style: '/show.css', target:target});
    }
  });
})

router.get('/:id/edit', Middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect(`/cgroundslist/${req.params.id}`);
    } else {
      res.render('campgrounds/edit', {pagetitle: 'Edit campground', style: '/edit.css', campg: foundCampground})
    }
  })
})


router.put('/:id', Middleware.checkCampgroundOwnership, (req, res) => {
  const updatedCG = req.body.campground;
  Campground.findOneAndUpdate( 
  {_id: req.params.id}, 
  {$set: {name: updatedCG.name, price: updatedCG.price, image: updatedCG.image, description: updatedCG.description, created: Date.now() }},
  (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/${req.params.id}/edit`);
    } else {
       res.redirect(`/cgroundslist/${req.params.id}`);
    }
  });
});

router.delete('/:id', Middleware.checkCampgroundOwnership, (req, res) => {
  Campground.deleteOne({_id: req.params.id}, (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/cgroundslist/${req.params.id}`);
    }
  res.redirect('/cgroundslist');
  })
})

module.exports = router;