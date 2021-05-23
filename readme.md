# Shared API Example

Show case on how to create a third party API secured with api key. 

## Workflow 
1. User register to use the shared API using Backend api `/api/backend/users`
2. User then need to create an Application using `/api/backend/application`. There are two type of Application: Basic and Premium. User creating the application automatically assigned as Owner. 
3. Application by default is not active, user need to activate using payment by calling `/api/backend/applications/:pid/activate` this is just a simple process, ideally should be connected with payment gateway and done with hook.
4. By default application has default API KEY used to access the shared API. Application owner can re-create a new API KEY using `/api/backend/applications/:pid/renew-api-key`
5. The owner of application can assign (share) more users to the application using `/api/backend/application/{appId}/users`. App user has limited access to the application and application user. Owner mostly has all access
6. User can access shared API by attaching the api key on every request header `x-api-key`

## Architecture 
Api separated into two. See `app.ts` file on how to configure each group using `ControllerFacility`
* Backend under `/api/backend` the source code can be found on `src/backend`
* Shared API under `/api` the source code can be found on `src/api`

The main idea of securing the Shared API is on `ApiKeyMiddleware` on `_shared/api-key-facility.ts`. The middleware intercept all request and check for `x-api-key` header. If found it get the type of the application subscription associated and store it on `ctx.state.subscription`. 

Furthermore, the `ctx.state.subscription` value used to secure each shared API routes by registering an authorization policy on `api/auth-policy.ts` which is `Basic` and `Premium`. Each policy then used to secure shared api routes using `@authorize.route("Basic")` or `@authorize.route("Premium")`

## Swagger 
Since the API grouped into two, each group has their own swagger:
* Backend `localhost:8000/swagger/backend` 
* Shared API `localhost:8000/swagger/api` 