/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-template-curly-in-string */
/**
 * This module implements a REST-inspired webservice for ChapterCache
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the user and books table.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-monopoly-service.herokuapp.com/players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 * TODO: Consider using Prepared Statements.
 *      https://vitaly-t.github.io/pg-promise/PreparedStatement.html
 *
 * This service assumes that the database connection strings and the server mode are
 * set in environment variables. See the DB_* variables used by pg-promise. And
 * setting NODE_ENV to production will cause ExpressJS to serve up uninformative
 * server error responses for all errors.
  *
 * @author: ChapterCache
 * @date: Fall 2023
 */

// Set up the database connection.

const pgp = require('pg-promise')();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Configure the server and its routes.

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get('/', readHelloMessage);
router.get('/users', readUsers);
router.get('/users/:username', readUser);
router.put('/users/:id', updateUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get('/books', readBooks);
router.get('/users/:username', readBook);
router.put('/users/:id', updateBook);
router.post('/books', createBook);
router.delete('/users/:id', deleteBook);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send('Hello, Welcome to Chapter Cache App!!');
}

function readUsers(req, res, next) {
  db.many('SELECT * FROM Users')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readUser(req, res, next) {
  db.oneOrNone('SELECT * FROM Users WHERE username=${username}', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateUser(req, res, next) {
  db.oneOrNone('UPDATE Users SET ID = ${ID}, emailAddress=${emailAddress}, name=${name}, username=${username}, passwordHash = ${passwordHash} WHERE ID=${ID} RETURNING id', req.body)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createUser(req, res, next) {
  db.one('INSERT INTO Users(ID, name, emailAddress, username, passwordHash) VALUES ( ${ID}, ${name}, ${emailAddress}, $(username), $(passwordHash)) RETURNING id', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteUser(req, res, next) {
  db.oneOrNone('DELETE FROM Users WHERE id=${id} RETURNING id', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function readBooks(req, res, next) {
  db.many('SELECT b.ID, b.title, b.author, b.isbn, b.price, b.courseName, b.date_sold, b.userID, b.front_picture, b.back_picture, u.name, u.emailAddress FROM Books b, Users u  WHERE u.ID = b.userID')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readBook(req, res, next) {
  db.oneOrNone('SELECT b.ID, b.title, b.author, b.isbn, b.price, b.courseName, b.date_sold, b.userID, b.front_picture, b.back_picture, u.name, u.emailAddress FROM Books b, Users u  WHERE u.ID = b.userID and b.id=${id}', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateBook(req, res, next) {
  db.oneOrNone('UPDATE Books SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createBook(req, res, next) {
  db.one('INSERT INTO Books(ID, title, author, isbn, courseName, userID) VALUES (${ID}, ${title}, ${author}, ${isbn}, ${coursename}, ${userID}) RETURNING id', req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteBook(req, res, next) {
  db.oneOrNone('DELETE FROM Books WHERE id=${id} RETURNING id', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}
