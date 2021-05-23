import { entityPolicy } from "@plumier/core";
import { getRepository } from "typeorm";
import { ApplicationUser } from "./application-user-entity";


entityPolicy(ApplicationUser)
    .register("AppOwner", async (ctx, id) => {
        const repo = getRepository(ApplicationUser)
        // get current ApplicationUser accessed data, to get the application
        const appUser = await repo.findOne(id, { relations: ["application"] })
        // find the current login user role in the current application
        const curAppUser = await repo.findOne({ where: { application: appUser?.application.id, user: ctx.user?.userId } })
        return curAppUser?.role === "AppOwner"
    })
    .register("AppUser", async (ctx, id) => {
        const repo = getRepository(ApplicationUser)
        const appUser = await repo.findOne(id, { relations: ["application"] })
        const curAppUser = await repo.findOne({ where: { application: appUser?.application.id, user: ctx.user?.userId } })
        return curAppUser?.role === "AppUser"
    })