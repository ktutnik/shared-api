import { authorize, entityProvider, HttpStatusError, route, val } from "plumier";
import { getRepository } from "typeorm";
import keyGen from "uuid-apikey"
import { Application } from "./application-entity";


@route.root("applications/:pid")
export class ApplicationsController {

    // this process ideally done using some payment mechanism
    @route.post()
    async activate(@val.required() pid: number, payment: string) {
        if (payment === "lorem ipsum") {
            const repo = getRepository(Application)
            await repo.update(pid, { active: true })
        }
        else 
            throw new HttpStatusError(400, "Invalid payment")
    }

    @route.post("renew-api-key")
    @authorize.route("AppOwner")
    @entityProvider(Application, "pid")
    async renew(@val.required() pid: number) {
        const apiKey = keyGen.create().apiKey
        const repo = getRepository(Application)
        await repo.update(pid, { apiKey })
        return { apiKey }
    }
}