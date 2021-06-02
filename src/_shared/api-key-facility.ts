import { ActionResult, CustomMiddleware, DefaultFacility, HttpStatusError, Invocation, PlumierApplication } from "plumier"
import model from "@plumier/mongoose"

import { Application } from "../backend/application/application-entity"

declare module "koa" {
    interface DefaultState {
        application?: Application
    }
}

/**
 * This middleware checks for x-api-key header and
 * assign current application subscription type (Basic or Premium) 
 * into ctx.user 
 */
class ApiKeyMiddleware implements CustomMiddleware {
    async execute(invocation: Invocation): Promise<ActionResult> {
        const key = invocation.ctx.request.header["x-api-key"]
        // if no api key provided just continue the request
        if (!key) return invocation.proceed()
        // if provided multiple api key just return HTTP 400 response
        if (Array.isArray(key)) throw new HttpStatusError(400, "Multiple API KEY is not supported")
        const ApplicationModel = model(Application)
        const app = await ApplicationModel.findOne({ apiKey: key })
        // attach the application subscription type in ctx.subscription property
        invocation.ctx.state.application = app as Application
        return invocation.proceed()
    }
}

export class ApiKeyFacility extends DefaultFacility {
    setup(app: Readonly<PlumierApplication>): void {
        // add security scheme for Swagger authentication dialogs
        app.config.openApiSecuritySchemes.apiKey = { type: "apiKey", in: "header", name: "x-api-key" }
        // register api key middleware 
        app.use(new ApiKeyMiddleware())
    }
}