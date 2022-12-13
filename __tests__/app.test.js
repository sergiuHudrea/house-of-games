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
                        review_body: expect.any(String)
                        })
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