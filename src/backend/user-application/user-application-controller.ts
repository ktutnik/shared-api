import { GenericControllerConfiguration } from "@plumier/generic-controller";
import { GenericController } from "@plumier/typeorm";
import { ApplicationUser } from "../application-user/application-user-entity";
import { Application } from "../application/application-entity";

const config: GenericControllerConfiguration = c => {
    c.setPath("users/:pid/applications/:id")
    c.methods("Put", "Post", "Patch", "Delete", "GetOne").ignore()
    c.getMany().authorize("ResourceOwner")
        .transformer(Application, x => ({ ...x.application }))
}

export class UserApplicationController extends GenericController([ApplicationUser, "user"], config) { }