import { authorize, bind, preSave } from "@plumier/core"
import { val } from "@plumier/validator"
import { genericController, JwtClaims } from "plumier"
import { Column, Entity, getRepository, OneToMany } from "typeorm"
import keyGen from "uuid-apikey"

import { EntityBase } from "../../_shared/entity-base"
import { ApplicationUser } from "../application-user/application-user-entity"

export type ApplicationType = "Basic" | "Premium"

@genericController(c => {
    c.getMany().ignore()
    c.getOne().authorize("AppOwner", "AppUser")
    c.methods("Put", "Patch", "Delete").authorize("AppOwner")
})
@Entity()
export class Application extends EntityBase {

    @authorize.write("Admin")
    @val.enums(["Basic", "Premium"])
    @Column({ default: "Basic" })
    type: ApplicationType

    @val.required()
    @Column()
    name: string

    @OneToMany(x => ApplicationUser, x => x.application)
    users: ApplicationUser[]

    @authorize.readonly()
    @Column()
    apiKey: string

    @authorize.write("Admin")
    @Column({ default: false })
    active: boolean

    @preSave("post")
    async initEntity(@bind.user() user: JwtClaims) {
        const repo = getRepository(ApplicationUser)
        const appUser = await repo.save({ user: { id: user.userId }, role: "AppOwner" })
        this.users = [{ id: appUser.id } as ApplicationUser]
        this.apiKey = keyGen.create().apiKey
    }
}