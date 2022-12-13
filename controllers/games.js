const { selectCategories, selectReviews, selectReviewsById, selectCommentsById } = require('../models/games');


exports.getCategories = (req, res, next) => {
    selectCategories().then( (categories) => {
        res.status(200).send( {categories} );
    })
    .catch( (err) => {
        next(err);
    });
}

exports.getReviews = (req, res, next) => {
    selectReviews().then( (reviews) => {
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