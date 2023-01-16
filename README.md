# CRUD API project! RSS

First of all clone the repository:  https://github.com/Alex99like/crud-simple `branch develop`

You can now run

```
npm run start:dev //running in dev mode
npm run start:multi // ranning balancer
npm run start:prod //assembly production
```

to start your application

Then go to https://www.postman.com/ or https://www.insomnia.com/ and send requests:

**Get all users**: GET http://localhost:4000/api/users
Return Data 

```
Array<{
    "id": string
    "username": string,
    "age": number,
    "hobbies": string[]
}>
```

**Get user by id**: GET http://localhost:4000/api/users/${idUser} 

Return Data

```
    "id": string
    "username": string,
    "age": number,
    "hobbies": string[]
```

**Create new user**: POST http://localhost:4000/api/users + body raw JSON
```
{
    "username": string,
    "age": number,
    "hobbies": string[]
}
```

Return New User

```
    "id": string
    "username": string,
    "age": number,
    "hobbies": string[]
```


**Update user** -> PUT http://localhost:4000/api/users/${id} + body raw JSON

Return Update User

```
    "id": string
    "username": string,
    "age": number,
    "hobbies": string[]
```

**PUT** works the same way as **PATH**, you can update it in whole or in part

you can change one field or all at once

```
{
    "username": string,
    "age": number,
    "hobbies": string[]
}
```

**Delete user** -> DELETE http://localhost:4000/api/users/${id}

Return Status Code 204 + empty body

**errors are returned in the format**
```
{ error: 'message error' } { errors: 'message errors' }
```

***FYI:*** in src/service/User.ts there are commented out throw Error() to check 500 Internal Server Error

>
>

# Unit tests

Run tests

```
npm run test
```
