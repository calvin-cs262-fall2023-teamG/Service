# ChapterCache Webservice

This is the data service application for the [CS 262 ChapterCache project,](https://github.com/calvin-cs262-fall2023-teamG/Project) that runs the [client](https://github.com/calvin-cs262-fall2023-teamG/Client) which is deployed here:

- https://chaptercachecalvincs262.azurewebsites.net/

It has the following data route URLs to fetch from database:

- `/` a hello message

- `/users` a list of users

- `/users/:username` a single player with the given ID

- `/books` a list of books

It has the following routes to create in database:

- `/users` create a new user 

- `/books` create a new book

It has the following routes to update to database:

- `/users/:id` update a user's value with id = id

- `/books/:id` update a book's value with id = id

It has the following routes to delete from database:

- `/users/:id` delete a user's record with id = id

- `/books/:id` delete a book's record with id = id  

It is based on the standard Azure App Service tutorial for Node.js.

- https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-cli

The database is relational with the schema specified in the sql/ sub-directory and is hosted on [ElephantSQL](https://www.elephantsql.com/). The database server, user and password are stored as Azure application settings so that they aren’t exposed in this (public) repo.

