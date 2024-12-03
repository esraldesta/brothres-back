### Description

Brotherhood communty website

### Project setup

```bash
# install packages
$ npm install
```

### Compile and run the project

```bashc
# development
$ npm run dev
```

### Run tests

```bash
# unit tests
$ npm run test

# int tests
$ npm run test:int

```

### Project Overview

This project is built using a monolithic architecture, encompassing three primary modules: Authentication, Users, and Blogs. It utilizes PostgreSQL as the database and Google Cloud Storage for file storage. The application employs the class-validator and class-transformer libraries to validate JSON request bodies, returning detailed error messages if the provided data does not satisfy the defined schemas. Unit and integration Testing is implemented using Jest.

### Modules

Each module includes:

- **Controllers**
- **Services**: Handle business logic
- **Repositories**: Handle database interactions (located in the `shared/repositories` folder)

#### auth

The auth module uses JWT tokens for user authentication, with the Passport library handling token validation and signing. When a user signs in, an access token and a refresh token are generated. The refresh token is hashed and stored in the database, while the access token has a shorter lifespan. Users can request a new access token by sending a refresh token. If the refresh token is expired, the user must sign in again. A JWT Auth Guard and strategy are implemented in the root module to authenticate users for all APIs, while API endpoints decorated with the `Public` decorator bypass authentication.

##### Endpoints

- **Signup**: Creates a new user and saves the details to the database.
- **Signin**: Verifies credentials and returns the user profile along with an access token and refresh token.
- **Refresh**: Compares the provided refresh token with the stored token and returns a new access token if valid.
- **Signout**: Removes the refresh token from the database.
- **Profile**: Retrieves the authenticated user's basic profile information.
- **Full-profile**: Retrieves the authenticated user's complete profile information.

#### user

The User module handles updating user profiles and provides access to other users' profile data.

##### Endpoints

- **Upload-avatar**: Allows the user to upload a new avatar.
- **Founders**: Provides access to the community founders, listed in descending order of time.
- **Referals**: Lists users who joined using the user's referral token.

#### Blogs

The Blogs module handles CRUD operations for blogs as well as liking and disliking blogs.

##### Endpoints

- **id/stat**: Returns the comments and reactions count for a blog.
- **id/reaction**: Returns the reaction (like or dislike) of the authenticated user for a blog.

### Services

#### Prisma Service

Prisma is used as the ORM with PostgreSQL. Configuration and schema are in the `prisma/schema.prisma` file.

For development, PostgreSQL is configured in the `docker-compose.yml` file.

#### Cloud Storage Service

This service uploads and deletes images from GCP uckets, using the specified folder name.

APIs that accept files use the `FileUploadInterceptor`, which checks the file type and size limit. The interceptor verifies the file type and size before the API accesses the file using the `UploadedFile` decorator.

#### Track User Activities

When an authenticated user accesses an API endpoint decorated with the `TrackKey` decorator, their user ID, concatenated with another key, is stored in the database. If the user accesses the same endpoint again on the same day, the activity is not stored again.

The `VisitorTrackingInterceptor` is configured in the root module. It checks if the API is decorated with the `TrackKey` decorator. If so, the interceptor verifies whether the activity is already recorded in the database for that day and writes it to the database if not. The `TrackKey` decorator accepts two parameters: a key and a param. If a `param` is provided, the interceptor extracts its value from the request and concatenates it with the key. If the user is not authenticated, the interceptor does nothing.

If an API endpoint is marked with both the `TrackKey` and `Public` decorators, the JWT AuthGuard attempts to authenticate the user. If authentication fails, the request is allowed to pass through.

Statistics of user visits to a page (e.g., blog page, user profile) can be accessed via the root controller at the `stat/key` endpoint.

### Testing

Unit tests for services are located within their respective module folders, and common mocks functions are in the `src/__mocks__` folder. Integration tests for each module are organized in a `test` folder inside each module.

The Jest configuration for unit tests is in the `jest.json` file, and for integration tests, it's in the `jest-int.json` file.
