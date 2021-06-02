import { authorize, bind, preSave } from "@plumier/core"
import { val } from "@plumier/validator"
import { genericController, JwtClaims } from "plumier"
import model, { collection } from "@plumier/mongoose"
import keyGen from "uuid-apikey"

import { EntityBase } from "../../_shared/entity-base"
import { ApplicationUser } from "../application-user/application-user-entity"

export type ApplicationType = "Basic" | "Premium"

@genericController(c => {
    c.getMany().ignore()
    c.getOne().authorize("AppOwner", "AppUser")
    c.methods("Put", "Patch", "Delete").authorize("AppOwner")
})
@collection()
export class Application extends EntityBase {

    @authorize.write("Admin")
    @val.enums(["Basic", "Premium"])
    @collection.property({ default: "Basic" })
    type: ApplicationType

    @val.required()
    name: string

    @collection.ref(x => ApplicationUser, "application")
    users: ApplicationUser[]

    @authorize.readonly()
    apiKey: string

    @authorize.write("Admin")
    @collection.property({ default: false })
    active: boolean

    @preSave("post")
    async initEntity(@bind.user() user: JwtClaims) {
        const ApplicationUserModel = model(ApplicationUser)
        const appUser = await new ApplicationUserModel({ user: user.userId, role: "AppOwner" }).save()
        this.users = [appUser.id as ApplicationUser]
        this.apiKey = keyGen.create().apiKey
    }
}