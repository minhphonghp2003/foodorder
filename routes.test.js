const request = require("supertest");
const app = require("./app");
describe("Get Endpoints for product API", () => {
    test(`It should response the get method for /v1/product/`, async () => {
        let res = await request(app).get("/v1/product");
        expect(res.statusCode).toEqual(200);
    });
    test(`It should response the get method for /v1/product/table`, async () => {
        let res = await request(app).get("/v1/product/table");
        expect(res.statusCode).toEqual(200);
    });
    test(`It should response the get method for /v1/product/review`, async () => {
        let res = await request(app).get("/v1/product/review");
        try {
            expect(res.statusCode).toEqual(200);
        } catch (error) {
            expect(res.statusCode).toEqual(400);
        }
    });
    test(`It should response the get method for /v1/product/detail/`, async () => {
        let res = await request(app).get(
            "/v1/product/detail/81085ed9-1623-4117-826a-b795b6028f34"
        );
        expect(res.statusCode).toEqual(200);
    });
    test(`It should response the get method for /v1/product/category/all`, async () => {
        let res = await request(app).get("/v1/product/category/all");
        expect(res.statusCode).toEqual(200);
    });
    test(`It should response the get method for /v1/product/search`, async () => {
        let res = await request(app).get("/v1/product/search");
        expect(res.statusCode).toEqual(300);
    });
});
