const db = require('../db/connection');

exports.selectCategories = () => {
    return db
        .query("SELECT * FROM categories")
        .then( (res) => {
            return res.rows;
        })
}

exports.selectReviews = () => { 
    return db
        .query(`
        SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count
        FROM comments
        RIGHT OUTER JOIN reviews
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC
        ;`)
        .then( (res) => {
            console.log(res.rows)
            return res.rows;
        })
}