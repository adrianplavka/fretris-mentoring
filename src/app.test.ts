
import * as request from 'supertest';

import { app } from './app';

describe("Server", () => {
    it("GET '/bundle.js': should return 200 for public bundle", (done) => {
        return request(app)
            .get("/bundle.js")
            .expect(200)
            .end((err, res) => {
                expect(res.type).toBe("application/javascript");
                done();
            })
    });

    it("GET '/': should return 200 w/ Accept: 'text/html'", () => {
        return request(app)
            .get("/")
            .set({ Accept: "text/html" })
            .expect(200);
    });
});
