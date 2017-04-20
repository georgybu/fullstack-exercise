const express = require('express');
const router = express.Router();

router.get('/comments', (req, res) => {
  const Comment = require('../dal/comment');
  
  const query = {
    $project: {
      updatedAt: 1,
      comment: 1,
      email: 1,
      ratings: 1,
      rating: {$avg: "$ratings"}
    }
  };
  
  Comment.aggregate([query, {$sort : { _id : 1 }}]).then((comments) => {
    res.json(comments);
  });
  
});

router.post('/ratings', (req, res) => {
  const Comment = require('../dal/comment');
  
  if (!req.body.commentId) {
    res.send(400);
  }
  if (!req.body.newRating) {
    res.send(400);
  }
  if (([1,2,3,4,5].indexOf(req.body.newRating)) === -1) {
    res.send(400);
  }
  
  Comment.findByIdAndUpdate(
    req.body.commentId,
    {$push: {"ratings": req.body.newRating}},
    {safe: true, upsert: false},
    (err, model) => {
      if (err) {
        res.send(500)
      } else {
        res.json({ updated: model._id});
      }
    }
  );
});

module.exports = router;
