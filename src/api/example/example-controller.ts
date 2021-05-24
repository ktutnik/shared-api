import { authorize, bind } from "@plumier/core";
import { Context } from "koa"

export class ExampleController {


    // API to get application by provided api key
    @authorize.route("Basic", "Premium")
    app(@bind.ctx() ctx: Context) {
        return ctx.state.application
    }

    @authorize.route("Premium")
    premium() {
        return { message: "Premium" }
    }
}