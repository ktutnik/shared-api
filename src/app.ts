import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import Plumier, { Configuration, ControllerFacility, LoggerFacility, WebApiFacility } from "plumier"
import { ApiKeyFacility } from "./_shared/api-key-facility"


function createApp(config?: Partial<Configuration>) {
    return new Plumier()
        .set({ ...config, rootDir: __dirname })
        .set(new WebApiFacility())
        .set(new ControllerFacility({
            controller: "./backend/**/*-+(controller|entity).+(ts|js)",
            rootPath: "/api/backend", group: "backend"
        }))
        .set(new ControllerFacility({
            controller: "./api/**/*-+(controller|entity).+(ts|js)",
            rootPath: "/api", group: "api"
        }))
        .set(new TypeORMFacility())
        .set(new JwtAuthFacility({
            globalAuthorize: "AnyUser",
        }))
        .set(new SwaggerFacility())
        .set(new LoggerFacility())
        // register our custom api key facility
        .set(new ApiKeyFacility())
        .initialize()
}

export default createApp