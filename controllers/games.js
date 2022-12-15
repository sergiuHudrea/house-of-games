const { selectCategories, selectReviews, selectReviewsById, selectCommentsById, insertComments, updateReviewsById, selectUsers, removeByCommentId } = require('../models/games');


exports.getCategories = (req, res, next) => {
    selectCategories().then( (categories) => {
        res.status(200).send( {categories} );
    })
    .catch( (err) => {
        next(err);
    });
}

exports.getReviews = (req, res, next) => {
    const {category, sort_by, order} = req.query
    selectReviews(category, sort_by, order).then( (reviews) => {
        res.status(200).send( {reviews} );
    })
    .catch( (err) => {
        next(err);
    })
}

exports.getReviewsById = (req, res, next) => {
    const {review_id} = req.params;
    selectReviewsById(review_id).then( (review) => {
        res.status(200).send( {review} );
    })
    .catch( (err) => {
        next(err);
    })
}

exports.getCommentsById = (req ,res, next) => {
    const {review_id} = req.params;
    const promises = [selectCommentsById(review_id), selectReviewsById(review_id)];

    Promise.all(promises)
        .then( ([comments]) => {
        res.status(200).send( {comments} );
    })
    .catch( (err) => {
        next(err);
    })
}

exports.postComments = (req, res, next) => {
    const {review_id} = req.params;
  
    insertComments(review_id, req.body)
        .then( (comment) => {
            res.status(201).send({comment})
        })
        .catch((err) => {
            next(err);
        })
}

exports.patchReviewsById = (req, res, next) => {
    const {review_id} = req.params;

    updateReviewsById(review_id, req.body)
        .then( (review) => {
            res.status(200).send( {review} );
        })
        .catch( (err) => {
            next(err);
        })
}

exports.getUsers = (req, res, next) => {
    selectUsers().then( (users) => {
        res.status(200).send( {users} );
    })
    .catch( (err) => {
        next(err);
    });
}

exports.deleteByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    removeByCommentId(comment_id).then( (comment) => {
        res.send(204);
    })
    .catch( (err) => {
        next(err);
    })
}