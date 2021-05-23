import { genericController } from "@plumier/generic-controller";
import { val } from "@plumier/validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../_shared/entity-base";
import { Application } from "../application/application-entity";
import { User } from "../user/user-entity";

@Entity()
export class ApplicationUser extends EntityBase{

    @val.required()
    @ManyToOne(x => User)
    user:User

    @genericController(c => {
        c.setPath("application/:pid/users/:id")
        c.mutators().authorize("AppOwner")
        c.accessors().authorize("AppOwner", "AppUser")
    })
    @ManyToOne(x => Application)
    application:Application

    @val.required()
    @Column()
    role: "AppOwner" | "AppUser"
}