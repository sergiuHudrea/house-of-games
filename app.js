const express = require('express');
const app = express();

const { getCategories } = require('./controllers/games');



app.get('/api/categories', getCategories);


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