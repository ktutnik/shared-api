import dotenv from "dotenv"
import { sign } from "jsonwebtoken"
import { join } from "path"
import { JwtClaims } from "plumier"
import supertest from "supertest"
import { ApplicationType } from "../src/backend/application/application-entity"
import { User } from "../src/backend/user/user-entity"

dotenv.config({ path: join(__dirname, ".env-test") })

export function createToken(id: string, role: "User" | "Admin") {
    return sign(<JwtClaims>{ userId: id, role }, process.env.PLUM_JWT_SECRET!)
}

export const ignoreProps = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
}

export const userToken = createToken("123", "User")
export const adminToken = createToken("456", "Admin")

export async function createUser(app: any, user: Partial<User> = {}) {
    const { body } = await await supertest(app.callback())
        .post("/api/backend/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            email: user.email ?? "john.doe@gmail.com",
            password: user.password ?? "john0doe#",
            name: user.name ?? "John Doe",
            role: user.role ?? "User",
            status: user.status
        }).expect(200)
    const token = createToken(body.id, user.role ?? "User")
    return { id: body.id, token }
}

export async function createApplication(app: any, type: ApplicationType = "Basic") {
    const owner = await createUser(app)
    const { body } = await supertest(app.callback())
        .post("/api/backend/applications")
        .set("Authorization", `Bearer ${owner.token}`)
        .send({ name: "Lorem Ipsum" })
        .expect(200)
    await supertest(app.callback())
        .post(`/api/backend/applications/${body.id}/activate`)
        .set("Authorization", `Bearer ${owner.token}`)
        .send({ payment: type === "Basic" ? 5 : 20 })
        .expect(200)
    const { body: result } = await supertest(app.callback())
        .get(`/api/backend/applications/${body.id}`)
        .set("Authorization", `Bearer ${owner.token}`)
        .expect(200)
    return { app: result, owner }
}

export async function closeConnection() {
    // const con = getConnection()
    // if (con.isConnected)
    //     await con.close()
}