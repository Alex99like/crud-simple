# CRUD API project! RSS

First of all clone the repository:  https://github.com/Alex99like/crud-simple `branch develop`

You can now run

```
npm run start:dev
npm run start:multi
npm run start:prod
```

to start your application

Then go to https://www.postman.com/ or https://www.insomnia.com/ and send requests:

**Get all users**: GET http://127.0.0.1:4000/api/users

**Get user by id**: GET http://127.0.0.1:4000/api/users/${idUser}

**Create new user**: POST http://127.0.0.1:4000/api/users + body raw JSON
```
{
    "username": string,
    "age": number,
    "hobbies": string[]
}
```

**Update user** -> PUT http://127.0.0.1:4000/api/users/${id} + body raw JSON

**PUT** works the same way as **PATH**, you can update it in whole or in part

```
{
    "username": string,
    "age": number,
    "hobbies": string[]
}
```

**Delete user** -> DELETE http://127.0.0.1:4000/api/users/${id}


***FYI:*** uncomment 3 lines in src/user/userService/createUser.ts and send POST request for checking 500 Internal Server Error

>
>

# Unit tests

Run tests

```
npm run test
```
