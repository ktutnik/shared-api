import { authorize, entityProvider, route, val } from "plumier";
import { getRepository } from "typeorm";
import keyGen from "uuid-apikey"
import { Application } from "./application-entity";


@route.root("applications/:pid")
export class ApplicationsController {

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