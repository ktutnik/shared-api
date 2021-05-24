import { meta } from "@plumier/core";
import { genericController } from "@plumier/generic-controller";
import { val } from "@plumier/validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../_shared/entity-base";
import { Application } from "../application/application-entity";
import { User } from "../user/user-entity";

function transformer(x: any): User {
    return { ...x.user }
}

@Entity()
export class ApplicationUser extends EntityBase {

    @val.required()
    @ManyToOne(x => User)
    user: User

    @genericController(c => {
        c.setPath("applications/:pid/users/:id")
        c.mutators().authorize("AppOwner")
        c.accessors().authorize("AppOwner", "AppUser")
            .transformer(User, transformer)
    })
    @ManyToOne(x => Application)
    application: Application

    @Column({ default: "AppUser" })
    role: "AppOwner" | "AppUser"
}