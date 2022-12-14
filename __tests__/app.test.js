const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');

afterAll( () => {
    if (db.end) db.end();
});

beforeEach( () => seed(testData) );


describe("GET /api", () => {
    test("Responds with code 200 and the message 'So far so good'", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(( {body} ) => {
                expect(body.msg).toBe("So far so good")
            })
    })
})

describe("Responds with 404 when given a bad route /not-a-route", () => {
    test("GET /not-a-route, returns 404", () => {
        return request(app)
        .get("/APIOOOOO")
        .expect(404)
    })
})


describe("GET /api/categories", () => {
    test("Responds with an array of category objects, each of which should have the properies of 'slug' and 'description'.", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(( {body} ) => {
                const {categories} = body;
                expect(categories).toBeInstanceOf(Array);
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
            })
    })
})


describe("GET /api/reviews", () => {
    test("Responds with an array of review objects, each with these properties: owner, title, review_id, category, review_img_url,  created_at, votes, designer, comment_count.", () => {
    return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(( {body} ) => {
            const {reviews} = body;
            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(13);
            reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })

    test("Responds with a key of reviews sorted by date (created_at) in descending order.", () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(( {body} ) => {
                const {reviews} = body
                expect(reviews).toBeSortedBy('created_at', {descending: true});
            })
    })

    
})

describe("Responds with 404 when given a bad route /api/not-a-route", () => {
    test("GET /api/not-route, returns 404", () => {
        return request(app)
        .get("/api/revieeewwssssss")
        .expect(404)
    })
})

describe("GET /api/reviews/:review_id", () => {
    test("Responds with a review object, containing all its properties", () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(( {body} ) => {
                const {review} = body;
                expect(review).toBeInstanceOf(Object);
                expect(review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    category: 'dexterity',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_body: 'Fiddly fun for all the family',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5
                  }
                    )
                
            })
        })
    test("Responds with 400 Bad Request when given an invalid ID", () => {
        return request(app)
            .get('/api/reviews/not')
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
    })

    test("Responds with 404 Not Found when id does not exist.", () => {
        return request(app)
            .get('/api/reviews/45634')
            .expect(404)
            .then(( {body} ) => {
                expect(body.msg).toBe("Not Found.")
            })
    })
})

describe("GET /api/reviews/:review_id/comments", () => {
    test("Responds with an array of comments for the given review_id, each with all comment's properties sorted by date (created_at) with the most recent first.", () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(( {body} ) => {
                const {comments} = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(3);
                expect(comments).toBeSortedBy('created_at', {descending: true});
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: 2
                        })
                    )
                })
            })
    })
    test("Responds with 400 Bad Request when given an invalid ID", () => {
        return request(app)
            .get('/api/reviews/HELOOO/comments')
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
    })

    test("Responds with 404 Not Found when id does not exist.", () => {
        return request(app)
            .get('/api/reviews/2452345/comments')
            .expect(404)
            .then(( {body} ) => {
                expect(body.msg).toBe("Not Found.")
            })
    })
    test("Responds with 200 and empty Array when id exists, but there are no comments connected to it.", () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(( {body} ) => {
                const {comments} = body
                expect(comments).toHaveLength(0)
            })
    })
})

describe("POST /api/reviews/:review_id/comments", () => {
    test("status:201, responds with a newly added comment to the database", () => {
        const newComment = {
            username: "mallionaire",
            body: "That looks pretty fun!"
        }
        return request(app)
            .post('/api/reviews/3/comments')
            .send(newComment)
            .expect(201)
            .then(( {body} ) => {
                expect(body.comment).toEqual({
                        author: "mallionaire",
                        body: "That looks pretty fun!",
                        comment_id: 7,
                        created_at: expect.any(String),
                        review_id: 3,
                        votes: 0
                })
            })
    })
    test("Responds with status:201 even if we give extra properties to the comment.", () => {
        const newComment = {
            username: "mallionaire",
            body: "That looks pretty fun!",
            age: 55

        }
        return request(app)
            .post('/api/reviews/3/comments')
            .send(newComment)
            .expect(201)
            .then(( {body} ) => {
                expect(body.comment).toEqual({
                        author: "mallionaire",
                        body: "That looks pretty fun!",
                        comment_id: 7,
                        created_at: expect.any(String),
                        review_id: 3,
                        votes: 0
                })
            })
    })
    test('Responds with 400 Bad Request when body fails schema validation (it is null when it shouldn\'t).', () => {
        const newComment = {
            username: "mallionaire",
            body: null
        };
        return request(app)
            .post('/api/reviews/2/comments')
            .send(newComment)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe('Bad Request.')
            })
    })
    test('Responds with 400 Bad Request there are missing keys', () => {
        const newComment = {
            username: "mallionaire",
        };
        return request(app)
            .post('/api/reviews/3/comments')
            .send(newComment)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe('Bad Request.')
            })
    })
    test('Responds with 400 Bad Request when sent an empty object', () => {
        const newComment = {};
        return request(app)
            .post('/api/reviews/3/comments')
            .send(newComment)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe('Bad Request.')
            })
    })
    test("Responds with 400 Bad Request when given an invalid ID", () => {
        const newComment = {
            username: "mallionaire",
            body: "That looks pretty fun!"
        }
        return request(app)
            .post('/api/reviews/NOT_WHAT_IT_SHOULD_BE/comments')
            .send(newComment)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
})
    test("Responds with 404 Not Found when id does not exist.", () => {
        const newComment = {
            username: "mallionaire",
            body: "That looks pretty fun!"
        }
        return request(app)
            .post('/api/reviews/2452345/comments')
            .send(newComment)
            .expect(404)
            .then(( {body} ) => {
                expect(body.msg).toBe("Not Found.")
            })

})
    test("Responds with 404 Not Found when given an username which doesn't exist", () => {
        const newComment = {
            username: "BATMAN",
            body: "That looks pretty fun!"
        }
        return request(app)
            .post('/api/reviews/2/comments')
            .send(newComment)
            .expect(404)
            .then(( {body} ) => {
                expect(body.msg).toBe("Not Found.")
            })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
    test('Responds with 200 and an updated review when decreasing votes.', () => {
        const vote_updates = {
            inc_votes: -10
        };
        return request(app)
            .patch('/api/reviews/2')
            .send(vote_updates)
            .expect(200)
            .then(( {body} ) => {
                const {review} = body;
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_body: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: -5
                        })
                    )
                
            })
    })
    test('Responds with 200 and an updated review when increasing votes.', () => {
        const vote_updates = {
            inc_votes: 5
        };
        return request(app)
            .patch('/api/reviews/2')
            .send(vote_updates)
            .expect(200)
            .then(( {body} ) => {
                const {review} = body;
                expect(review).toEqual(
                    expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: 10
                    })
                  
                    )
                
            })
    })
    test('Responds with 200 and updated votes even when given extra keys in the object.', () => {
        const vote_updates = {
            inc_votes: 5,
            age: 87
        };
        return request(app)
            .patch('/api/reviews/2')
            .send(vote_updates)
            .expect(200)
            .then(( {body} ) => {
                const {review} = body;
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_body: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: 10
                        })
                    )
                
            })
    })
    test("Responds with 400 Bad Request when given an invalid ID", () => {
        const vote_updates = {
            inc_votes: 5
        };
        return request(app)
            .patch('/api/reviews/HELLOO')
            .send(vote_updates)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
    })
    test("Responds with 404 Not Found when id does not exist.", () => {
        const vote_updates = {
            inc_votes: 5
        };
        return request(app)
            .patch('/api/reviews/45234')
            .send(vote_updates)
            .expect(404)
            .then(( {body} ) => {
                expect(body.msg).toBe("Not Found.")
            })
    })
    test('Responds with 400 Bad Request when sent an empty object', () => {
        const vote_updates = {};
        return request(app)
            .patch('/api/reviews/2')
            .send(vote_updates)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
    })
    test('Responds with 400 Bad Request when body fails schema validation (input string when required INT).', () => {
        const vote_updates = {
            inc_votes: "NOT_A_VOTE"
        };
        return request(app)
            .patch('/api/reviews/2')
            .send(vote_updates)
            .expect(400)
            .then(( {body} ) => {
                expect(body.msg).toBe("Bad Request.")
            })
    })

    
})