const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      Middleware = require("../middleware");

router.get('/new', Middleware.isLoggedIn, (req, res) => {
  res.render('comments/new', {pagetitle: 'Create new comment', style: '/new-comment.css', id: req.params.id});
})

router.post('/', Middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, cg) => {
    if (err) {
      console.log(err)
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          comment.author = {id: req.user._id, username: req.user.username};
          comment.save();
          cg.comments.push(comment);
          cg.save();
          req.flash('success', 'Comment added');
          res.redirect(`/cgroundslist/${cg._id}`);
        }
      });
    }
  });
})

router.get('/:comment_id/edit', Middleware.confirmCommAuthor, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err);
      res.redirect('Back');
    } else {
      res.render('comments/edit', {pagetitle: 'Edit existing comment', style: '/edit-comment.css', comment: comment, id: req.params.id});
    }
  })
})

router.put('/:comment_id', Middleware.confirmCommAuthor, (req, res) => {
  const updatedComment = req.body.comment;
  Comment.findOneAndUpdate(
    {_id: req.params.comment_id},
    {$set: {text: updatedComment.text, created: Date.now()} }, (err) => {
      if (err) {
        console.log(err);
        res.redirect(`/cgroundslist/${req.params.id}`);
      } else {
        req.flash('success', 'Comment edited');
        res.redirect(`/cgroundslist/${req.params.id}`);
      }
    })
})

router.delete('/:comment_id', Middleware.confirmCommAuthor, (req, res) => {
  Comment.deleteOne({_id: req.params.comment_id}, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect(`/cgroundslist/${req.params.id}`);
    }
  })
})

module.exports = router;