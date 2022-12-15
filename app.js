const express = require('express');
const app = express();

app.use(express.json())

const { getCategories, getReviews, getReviewsById, getCommentsById, postComments, patchReviewsById, getUsers } = require('./controllers/games');

app.get('/api', (req, res) => {
    res.status(200).send( {msg: "So far so good"} )
})

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments', getCommentsById);
app.post('/api/reviews/:review_id/comments', postComments);

app.patch('/api/reviews/:review_id', patchReviewsById);

app.get('/api/users', getUsers);

app.use((err, req,  res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send( {msg: "Bad Request."} );
    } else if (err.code === '23503') {
        res.status(404).send( {msg: "Not Found."} );
    } else {
        next(err);
    }
});

app.use((err, req,  res, next) => {
    if (err.msg !== undefined) {
        res.status(err.status).send( {msg: err.msg} );
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send( { msg: "Internal Server Error."} );
})

module.exports = app;