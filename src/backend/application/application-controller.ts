import { authorize, entityProvider, HttpStatusError, route, val } from "plumier";
import model from "@plumier/mongoose";
import keyGen from "uuid-apikey"
import { Application } from "./application-entity";


@route.root("applications/:pid")
export class ApplicationsController {

    // this process ideally done using some payment mechanism
    @route.post()
    async activate(@val.required() pid: string, @val.enums([5, 20]) payment: number) {
        const ApplicationModel = model(Application)
        // $5 only basic
        if (payment === 5) {
            await ApplicationModel.findByIdAndUpdate(pid, { active: true, type: "Basic" })
        }
        // $20 for premium
        else if (payment === 20) {
            await ApplicationModel.findByIdAndUpdate(pid, { active: true, type: "Premium" })
        }
        else
            throw new HttpStatusError(400, "Invalid payment")
    }

    @route.post("renew-api-key")
    @authorize.route("AppOwner")
    @entityProvider(Application, "pid")
    async renew(@val.required() pid: number) {
        const apiKey = keyGen.create().apiKey
        const ApplicationModel = model(Application)
        await ApplicationModel.findByIdAndUpdate(pid, { apiKey })
        return { apiKey }
    }
}