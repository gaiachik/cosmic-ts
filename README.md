# Code-along exercise with [Architecture Patterns with Python](https://www.cosmicpython.com/)
>>>>...in Typescript.

I am plying with the idea as part of a tech-book-club at MADE.COM.
I'll try and make a chapter branch for each chapter of the book, in a similar way to that of how Bob and Harry structured [their code repository](https://github.com/cosmicpython/code).

## Branches
See the full list of my branches [here](https://github.com/gaiachik/cosmic-ts/branches/all)

## Requirements
* npm

## Setup & running tests
1) Do run `npm install` everytime you change branch.
2) To run your tests, use `npm test`.

If you get weird errors, do try deleting your `node_modules` folder and run step 1) again

_(this is  available from chapter 2:)_
```sh
make start-db // Starts local dynamoDB:
make setup-db-table // first time table setup (if you ever need to, because it's a playground, you can also reset tables with make reset-db-tables
make start-api // run the express api

Try out the allocate endpoint: 
http://localhost:3456/allocate?orderid=str&qty=num&sku=str
```
