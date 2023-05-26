# ChatApp

### Features
- Register User
- Login User
- Join Room
- Chat in Room

### Installation

- Install NPM packages
```
npm install
```

### API Endpoints and CRUD operations

#### Register User
- method: POST
```
http://localhost:3000/signup
   ```
- Schema for user registration:
```
{
  name: String,
  password: String
}
```

#### Login User
- method: POST
```
http://localhost:3000/login
   ```
- Schema for user registration:
```
{
  name: String,
  password: String
}
```

#### Run application
```
node index.js
```