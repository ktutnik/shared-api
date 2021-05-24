import supertest from "supertest"
import createApp from "../src/app"
import { closeConnection, createApplication, createUser, ignoreProps } from "./helper"

afterEach(async () => {
    await closeConnection()
})

describe("User Application", () => {
    it("Should able to list all user application", async () => {
        const plum = await createApp({ mode: "production" })
        const { app, owner } = await createApplication(plum)
        const { body } = await supertest(plum.callback())
            .post("/api/backend/applications")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({ name: "Ipsum Lorem" })
            .expect(200)
        await supertest(plum.callback())
            .post(`/api/backend/applications/${body.id}/activate`)
            .set("Authorization", `Bearer ${owner.token}`)
            .send({ payment: 20 })
            .expect(200)
        const { body:result } = await supertest(plum.callback())
            .get(`/api/backend/users/${app.id}/applications`)
            .set("Authorization", `Bearer ${owner.token}`)
            .expect(200)
        expect(result[0]).toMatchSnapshot({...ignoreProps, apiKey: expect.any(String)})
        expect(result[1]).toMatchSnapshot({...ignoreProps, apiKey: expect.any(String)})
    })
})