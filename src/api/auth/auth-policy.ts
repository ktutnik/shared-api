import { authPolicy } from "@plumier/core";


authPolicy()
    .register("Basic", ({ ctx }) => ctx.state?.subscription === "Basic" )
    .register("Premium", ({ ctx }) => ctx.state?.subscription === "Premium" )