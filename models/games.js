const db = require('../db/connection');

exports.selectCategories = () => {
    return db
        .query("SELECT * FROM categories")
        .then( (res) => {
            return res.rows;
        })
}

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => { 
    const validCategory = ["euro game", "dexterity", "social deduction", "children's games"]
    const validSortBy = ['created_at', 'category','title', 'designer', 'owner', 'review_img_url', 'review_body', 'votes', 'review_id'];

    if(!validSortBy.includes(sort_by) || !['asc', 'desc'].includes(order)){
        return Promise.reject({status: 400, msg:'Invalid order query'})
    }

    let queryStr = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count
    FROM comments
    RIGHT OUTER JOIN reviews
    ON reviews.review_id = comments.review_id`
    let queryValue = [];
    if (category !== undefined && validCategory.includes(category)) {
        queryValue.push(category);
        queryStr += ` WHERE category = $1`    
    } else if (category !== undefined && !validCategory.includes(category)) {
        return Promise.reject({status: 404, msg:'Not Found.'})
    }
    
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
    return db
        .query(queryStr, queryValue)
        .then( (res) => {
            return res.rows;
        })
}

exports.selectReviewsById = (review_id) => {
    return db
        .query(`SELECT owner, title, reviews.review_id, reviews.review_body, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count
                FROM comments
                RIGHT OUTER JOIN reviews
                ON reviews.review_id = comments.review_id
                WHERE reviews.review_id = $1
                GROUP BY reviews.review_id;`, [review_id])
        .then( (res) => {
            if (res.rowCount === 0) {
                return Promise.reject( {status: 404, msg: "Not Found."})
            }
            return res.rows[0];
        })
}

exports.selectCommentsById = (review_id) => {
    return db
        .query(`SELECT * FROM comments
                WHERE review_id = $1
                ORDER BY created_at DESC;`, [review_id])
        .then( (res) => {
            return res.rows;
        })
}

exports.insertComments = (review_id, newComment) => {
    const {username, body} = newComment;
    return db
        .query("INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING * ;", [body, review_id, username])
        .then((res) => {
            return res.rows[0];
        })
}

exports.updateReviewsById = (review_id, updates) => {
    const {inc_votes} = updates;
    return db
        .query(`UPDATE reviews 
                SET votes = votes + $1
                WHERE review_id = $2
                RETURNING *`, [inc_votes, review_id])
        .then( (res) => {
            if (res.rowCount === 0) {
                return Promise.reject( {status: 404, msg: "Not Found."})
            }
            return res.rows[0];
        })
}

exports.selectUsers = () => {
    return db
        .query("SELECT * FROM users")
        .then( (res) => {
            return res.rows;
        })
}

exports.removeByCommentId = (comment_id) => {
    return db.query(`DELETE FROM comments 
                    WHERE comment_id = $1 
                    ;`, [comment_id])
        .then((res) => {
            if (res.rowCount === 0) {
                return Promise.reject({status: 404, msg: 'Not found.'})
            }
            return res.rows[0];
        })
}