

import supertest from "supertest"
import createApp from "../src/app"
import { closeConnection, createApplication, createUser, ignoreProps } from "./helper"

afterEach(async () => {
    await closeConnection()
})

describe("Example API", () => {
    it("Should able to access basic plan with basic application", async () => {
        const plum = await createApp({ mode: "production" })
        const { app } = await createApplication(plum)
        const { body } = await supertest(plum.callback())
            .get("/api/example/app")
            .set("x-api-key", app.apiKey)
            .expect(200)
        expect(body).toMatchSnapshot({ ...ignoreProps, apiKey: expect.any(String) })
    })
    it("Should able to access premium plan with premium application", async () => {
        const plum = await createApp({ mode: "production" })
        const { app } = await createApplication(plum, "Premium")
        const { body } = await supertest(plum.callback())
            .get("/api/example/premium")
            .set("x-api-key", app.apiKey)
            .expect(200)
        expect(body).toMatchSnapshot()
    })
    it("Should not able to access premium plan with basic application", async () => {
        const plum = await createApp({ mode: "production" })
        const { app } = await createApplication(plum, "Basic")
        await supertest(plum.callback())
            .get("/api/example/premium")
            .set("x-api-key", app.apiKey)
            .expect(403)
    })
})