import bcrypt from "bcryptjs"
import { authorize, genericController, preSave, val } from "plumier"
import { collection } from "@plumier/mongoose"

import { EntityBase } from "../../_shared/entity-base"

@genericController(c => {
    c.post().authorize("Public")
    c.methods("Delete", "GetOne", "Patch", "Put").authorize("ResourceOwner")
    c.getMany().ignore()
})
@collection()
export class User extends EntityBase {
    // email will only visible by the user itself or by Admin
    @authorize.read("ResourceOwner", "Admin")
    @val.required()
    @val.unique()
    @val.email()
    email: string

    // password will not visible to anyone
    @authorize.writeonly()
    @val.required()
    password: string

    @val.required()
    name:string

    @val.enums(["User", "Admin"])
    // role only can be set by Admin
    @authorize.write("Admin")
    // role only visible to the user itself or by Admin
    @authorize.read("ResourceOwner", "Admin")
    @collection.property({ default: "User" })
    role: "User" | "Admin"

    @val.enums(["Active", "Suspended"])
    @authorize.write("Admin")
    @collection.property({ default: "Active" })
    status: "Active" | "Suspended"

    @preSave()
    async hashPassword() {
        if (this.password)
            this.password = await bcrypt.hash(this.password, await bcrypt.genSalt())
    }
}