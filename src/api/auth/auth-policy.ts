import { authPolicy } from "@plumier/core";


authPolicy()
    .register("Basic", ({ ctx }) => ctx.state?.application?.type === "Basic" )
    .register("Premium", ({ ctx }) => ctx.state?.application?.type === "Premium" )