import { authPolicy } from "@plumier/core";


authPolicy()
    .register("Basic", ({ ctx }) => ctx.subscription === "Basic" )
    .register("Premium", ({ ctx }) => ctx.subscription === "Premium" )