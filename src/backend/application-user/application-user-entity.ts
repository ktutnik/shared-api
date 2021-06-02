import { meta } from "@plumier/core";
import { genericController } from "@plumier/generic-controller";
import { val } from "@plumier/validator";
import { collection } from "@plumier/mongoose";
import { EntityBase } from "../../_shared/entity-base";
import { Application } from "../application/application-entity";
import { User } from "../user/user-entity";

function transformer(x: any): User {
    return { ...x.user }
}

@collection()
export class ApplicationUser extends EntityBase {

    @val.required()
    @collection.ref(x => User)
    user: User

    @genericController(c => {
        c.setPath("applications/:pid/users/:id")
        c.mutators().authorize("AppOwner")
        c.accessors().authorize("AppOwner", "AppUser")
            .transformer(User, transformer)
    })
    @collection.ref(x => Application)
    application: Application

    @collection.property({ default: "AppUser" })
    role: "AppOwner" | "AppUser"
}