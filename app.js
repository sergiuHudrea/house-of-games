const express = require('express');
const app = express();

app.use(express.json())

const { getCategories, getReviews, getReviewsById, getCommentsById, postComments, patchReviewsById, getUsers, deleteByCommentId} = require('./controllers/games');



app.get('/api', (req, res) => {
    res.status(200).send( {
        "GET /api": {
          "description": "serves up a json representation of all the available endpoints of the api"
        },
        "GET /api/categories": {
          "description": "serves an array of all categories",
          "queries": [],
          "exampleResponse": {
            "categories": [
              {
                "description": "Players attempt to uncover each other's hidden role",
                "slug": "Social deduction"
              }
            ]
          }
        },
        "GET /api/reviews": {
          "description": "serves an array of all reviews",
          "queries": ["category", "sort_by", "order"],
          "exampleResponse": {
            "reviews": [
              {
                "title": "One Night Ultimate Werewolf",
                "designer": "Akihisa Okui",
                "owner": "happyamy2016",
                "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                "category": "hidden-roles",
                "created_at": 1610964101251,
                "votes": 5
              }
            ]
          }
        },
        "GET /api/reviews/:review_id": {
            "description": "serves an object containing the review corresponding to the review_id introduced",
            "queries": ["review_id"],
            "exampleResponse": {
              "review": 
                {   
                  "review_id": 2,
                  "title": "Jenga",
                  "category": "dexterity",
                  "designer": "Leslie Scott",
                  "owner": "philippaclaire9",
                  "review_body": "Fiddly fun for all the family",
                  "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  "created_at": 1610964101251,
                  "votes": 5,
                  "comment_count": "3"
                }  
            }
          },
          "PATCH /api/reviews/:review_id": {
            "description": "serves an object containing the updated review corresponding to the review_id introduced, with the votes altered depending on the inputted object",
            "queries": ["review_id"],
            "exampleInput": { 
                "inc_votes": -3
            },
            "exampleResponse": {
              "review": 
                {   
                  "review_id": 2,
                  "title": "Jenga",
                  "category": "dexterity",
                  "designer": "Leslie Scott",
                  "owner": "philippaclaire9",
                  "review_body": "Fiddly fun for all the family",
                  "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  "created_at": 1610964101251,
                  "votes": 2,
                }  
            }
          },
          "GET /api/reviews/:review_id/comments": {
            "description": "serves an array containing the comments corresponding to the review_id introduced",
            "queries": ["review_id"],
            "exampleResponse": {
              "comments":[
                {   
                  "comment_id": 2,
                  "votes": 13,
                  "created_at": 1610964545410,
                  "author": "mallionaire",
                  "body": "My dog loved this game too!",
                  "review_id": 3
                }
                ]  
            }
          },
          "POST /api/reviews/:review_id/comments": {
            "description": "serves an object containing the a new comment corresponding to the review_id introduced, accepts as input an object containing the username and body of the new comment",
            "queries": ["review_id"],
            "exampleInput": { 
                "username": "mallionaire",
                "body": "That looks pretty fun!"
            },
            "exampleResponse": {
              "comment": 
                {   
                  "comment_id": 7,
                  "votes": 0,
                  "created_at": 1610964545410,
                  "author": "mallionaire",
                  "body": "That looks pretty fun!",
                  "review_id": 3
                }  
            }
          },
          "GET /api/users": {
            "description": "serves an array of all users",
            "queries": [],
            "exampleResponse": {
              "users": [
                {
                    "username": "philippaclaire9",
                    "name": "philippa",
                    "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                  }
              ]
            }
          },
          "DELETE /api/comments/:comment_id": {
            "description": "deletes the comment corresponding the inputted comment_id",
            "queries": ["comment_id"]
          }
      } )
})

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments', getCommentsById);
app.post('/api/reviews/:review_id/comments', postComments);

app.patch('/api/reviews/:review_id', patchReviewsById);

app.get('/api/users', getUsers);

app.delete('/api/comments/:comment_id', deleteByCommentId);

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