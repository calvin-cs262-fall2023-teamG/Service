# ChapterCache Webservice

This is the data service application for the [CS 262 ChapterCache project,](https://github.com/calvin-cs262-fall2023-teamG/Project) which is deployed here:

- https://chaptercachecalvin.azurewebsites.net/

It has the following data route URLs:

- `/` a hello message

- `/users` a list of users

- `/users/:username` a single player with the given ID

- `/books` a list of books

It is based on the standard Azure App Service tutorial for Node.js.

- https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-cli

The database is relational with the schema specified in the sql/ sub-directory and is hosted on [ElephantSQL](https://www.elephantsql.com/). The database server, user and password are stored as Azure application settings so that they aren’t exposed in this (public) repo.

