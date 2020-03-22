
# Notes

- Initialized repository

# Resources

- [User Authentication with the MEAN Stack](https://www.sitepoint.com/user-authentication-mean-stack/)

# Continued Development

- `heroku local` Starts the app locally using the app's Node Express server
  - Useful for back-end testing / must use if there is no mockdata
  - port 4200 is default: http://localhost:4200
- `ng serve` Starts front-end of the app locally using Angular
  - Useful for front-end testing
  - port 4200 is default: http://localhost:4200

# Initialization

- `ng new huntley-meadows-park-map` Creates a new Angular app
- Added index.js & server/server.js for the express server
  - Gets used by heroku local to run the app using a Node Express server
- `npm i` Install packages/dependencies

# Database Design

## Table Schemas

**users**

| Key | Attribute Name     | Data Type   | Length | Description                  |
| --- | ------------------ | ----------- | ------ | ---------------------------- |
|     | id                 | serial      | n/a    | Serial ID number             |
| PK  | username           | varchar     | 15     | Unique ID for a user         |
|     | email              | varchar     | 320    | Email address                |
|     | created_time_stamp | timestamptz | n/a    | Date-time of record creation |
| FK  | permission_level   | varchar     | 15     | User permission level        |

**local_favorites**

| Key | Attribute Name     | Data Type   | Length | Description                   |
| --- | ------------------ | ----------- | ------ | ----------------------------- |
| PK  | id                 | serial      | n/a    | Serial ID number              |
| FK  | submitter_un       | varchar     | 15     | Unique ID for a user          |
|     | name               | varchar     | 70     | Short feature name            |
|     | category           | varchar     | 15     | Category of the feature       |
|     | description        | varchar     | 280    | Description of the feature    |
|     | image_url          | text        | n/a    | Description of the feature    |
|     | latitude           | number      |        |                               |
|     | longitude          | number      |        |                               |
|     | approved           | boolean     | n/a    | If a reviewer has approved it |
|     | views              | number      | ?      | Number of "read more" views   |
|     | created_time_stamp | timestamptz | n/a    | Date-time of record creation  |

**permissions** (Lookup Table)

| Key | Attribute Name | Data Type | Length | Description           |
| --- | -------------- | --------- | ------ | --------------------- |
| PK  | permission     | varchar   | 15     | User permission level |

- Admin
- Reviewer
- Submitter
- User (no account required)

<!-- 
**reacts** (Junction Table)

| Key | Attribute Name    | Data Type | Length | Description          |
| --- | ----------------- | --------- | ------ | -------------------- |
| FK  | local_favorite_id | serial    | n/a    | Serial ID number     |
| FK  | expresser_un      | varchar   | 15     | Unique ID for a user |
| FK  | react_name        | varchar   | 15     |                      |

**react_lookup**

| Key | Attribute Name | Data Type | Length | Description            |
| --- | -------------- | --------- | ------ | ---------------------- |
|     | order          | number    | 1      | Order of the reactions |
| PK  | reaction       | varchar   | 70     | Short feature name     |
 -->
