const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');


afterAll( () => {
    if (db.end) db.end();
});

beforeEach( () => seed(testData) );

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

    test("GET /api/not-route, returns 404", () => {
        return request(app)
        .get("/api/sdasds")
        .expect(404)
    })
})


describe.only("GET /api/reviews", () => {
    test("it works!", () => {
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
})