import { entityPolicy } from "@plumier/core";
import { getRepository } from "typeorm";
import { ApplicationUser } from "../application-user/application-user-entity";
import { Application } from "./application-entity";


entityPolicy(Application)
    .register("AppOwner", async (ctx, id) => {
        const repo = getRepository(ApplicationUser)
        const appUser = await repo.findOne({ where: { user: ctx.user?.userId, application: id } })
        return appUser?.role === "AppOwner"
    })
    .register("AppUser", async (ctx, id) => {
        const repo = getRepository(ApplicationUser)
        const appUser = await repo.findOne({ where: { user: ctx.user?.userId, application: id } })
        return appUser?.role === "AppUser"
    })