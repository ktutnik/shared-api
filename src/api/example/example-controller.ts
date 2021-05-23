import { authorize, bind } from "@plumier/core";
import {Context} from "koa"

export class ExampleController {

    @authorize.route("Basic", "Premium")
    list(@bind.ctx() ctx:Context) {
        return { sub: ctx.subscription }
    }

    @authorize.route("Premium")
    premium() {
        return {}
    }
}