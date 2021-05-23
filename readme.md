# Shared API Example

Show case on how to create a third party API secured with api key. 

## Workflow 
1. User register to use the shared API using Backend api `/api/backend/users`
2. User then need to create an Application using `/api/backend/application`. There are two type of Application: Basic and Premium. User creating the application automatically assigned as Owner. 
3. By default application has its own API KEY used to access the shared API. Application owner can re-create a new API KEY using `/api/backend/applications/:pid/renew-api-key`
4. The owner of application can assign (share) more users to the application using `/api/backend/application/{appId}/users`. App user has limited access to the application and application user. Owner mostly has all access
5. User can access shared API by attaching the api key on every request header `x-api-key`

## Architecture 
Api separated into two. See `app.ts` file on how to configure each group using `ControllerFacility`
* Backend under `/api/backend` the source code can be found on `src/backend`
* Shared API under `/api` the source code can be found on `src/api`

## Swagger 
Since the API grouped into two, each group has their own swagger:
* Backend `localhost:8000/swagger/backend` 
* Shared API `localhost:8000/swagger/api` 