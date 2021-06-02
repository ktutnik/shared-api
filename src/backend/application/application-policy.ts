import { entityPolicy } from "@plumier/core";
import model from "@plumier/mongoose";
import { ApplicationUser } from "../application-user/application-user-entity";
import { Application } from "./application-entity";


entityPolicy(Application)
    .register("AppOwner", async (ctx, id) => {
        const ApplicationUserModel = model(ApplicationUser)
        const appUser = await ApplicationUserModel.findOne({ user: ctx.user?.userId, application: id } as any)
        return appUser?.role === "AppOwner"
    })
    .register("AppUser", async (ctx, id) => {
        const ApplicationUserModel = model(ApplicationUser)
        const appUser = await ApplicationUserModel.findOne({ user: ctx.user?.userId, application: id } as any)
        return appUser?.role === "AppUser"
    })