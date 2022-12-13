const express = require('express');
const app = express();

const { getCategories, getReviews, getReviewsById, getCommentsById } = require('./controllers/games');

app.get('/api', (req, res) => {
    res.status(200).send( {msg: "So far so good"} )
})

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewsById);
app.get('/api/reviews/:review_id/comments', getCommentsById);


app.use((err, req,  res, next) => {
    if (err.code === '22P02') {
        res.status(400).send( {msg: "Bad Request."} );
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