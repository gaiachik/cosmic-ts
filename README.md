# Code-along exercise with [Architecture Patterns with Python](https://www.cosmicpython.com/)
>>>>...in Typescript.

A tech-book-club initiative at MADE.COM.
I'll try and make a chapter branch for each chapter of the book, in a similar way to that of how Bob and Harry structured [their code repository](https://github.com/cosmicpython/code).

## Branches
See the full list of my branches [here](https://github.com/gaiachik/cosmic-ts/branches/all)

## Requirements
* npm

## Setup & running tests
```sh
# everytime you change branch:
npm install
# To run your tests:
## except in chapter 1, where it is "npm test"
make test

# If you get weird errors, 
# do try deleting your `node_modules` folder and run step 1) again
```
_( available from chapter 2: )_
```sh
# Start local dynamoDB:
make start-db 

# create dynamo db Tables for the exercise
# do it once the prev step succeeds
make setup-db-table 

# run the express api
make start-api 

# Try out the allocate endpoint: 
# http://localhost:3456/allocate?orderid=str&qty=num&sku=str
```

```sh
# if you ever need to, you can also reset tables 
# with 
make reset-db-tables
```
