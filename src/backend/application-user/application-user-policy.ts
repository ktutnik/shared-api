import { entityPolicy } from "@plumier/core";
import model from "@plumier/mongoose";
import { ApplicationUser } from "./application-user-entity";


entityPolicy(ApplicationUser)
    .register("AppOwner", async (ctx, id) => {
        const ApplicationUserModel = model(ApplicationUser)
        // get current ApplicationUser accessed data, to get the application
        const appUser = await ApplicationUserModel.findById(id).populate("application")
        // find the current login user role in the current application
        const curAppUser = await ApplicationUserModel.findOne({ application: appUser?.application.id, user: ctx.user?.userId } as any)
        return curAppUser?.role === "AppOwner"
    })
    .register("AppUser", async (ctx, id) => {
        const ApplicationUserModel = model(ApplicationUser)
        const appUser = await ApplicationUserModel.findById(id).populate("application")
        const curAppUser = await ApplicationUserModel.findOne({ application: appUser?.application.id, user: ctx.user?.userId } as any)
        return curAppUser?.role === "AppUser"
    })