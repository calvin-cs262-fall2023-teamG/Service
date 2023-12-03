/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-template-curly-in-string */
/**
 * This module implements a REST-inspired webservice for ChapterCache
 * The database is hosted on ElephantSQL .
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
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');
const containerName = 'image';

const blobService = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential(),
);

const pgp = require('pg-promise')();

async function handleImageUpload(id, data) {
  try {
    const containerClient = blobService.getContainerClient(containerName);
    const blobName = id + '.txt';

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('Uploading image blob...');
    const uploadResponse = await blockBlobClient.upload(data, data.length);

    console.log('Blob uploaded successfully:', uploadResponse);
    return blobName;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function handleImageDownload(blobName) {
  try {
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    return await streamToText(downloadBlockBlobResponse.readableStreamBody);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function streamToText(readable) {
  readable.setEncoding('utf8');
  let data = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
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

router.use(express.json({ limit: '50mb' }));

router.get('/', readHelloMessage);
router.get('/users', readUsers);
router.get('/users/:username', readUser);
router.put('/users/:id', updateUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get('/books', readBooks);
router.get('/books/:title', readBook);
router.put('/books/:id', updateBook);
router.post('/books', createBook);
router.delete('/books/:id', deleteBook);

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
  db.many('SELECT b.ID, b.title, b.author, b.isbn, b.price, b.courseName, b.condition, b.date_sold, b.userID, b.front_picture, b.back_picture, u.name, u.emailAddress FROM Books b, Users u  WHERE u.ID = b.userID')
    .then(async (data) => {
      const returnData = data;
      for (let i = 0; i < returnData.length; i++) {
      // TODO: currently a string 'null' b/c of how create query is written
        if (returnData[i].front_picture !== 'null' && returnData[i].front_picture !== null && returnData[i].back_picture !== 'null' && returnData[i].back_picture !== null) {
        // eslint-disable-next-line no-await-in-loop
          returnData[i].front_picture = await handleImageDownload(returnData[i].front_picture);
          returnData[i].back_picture = await handleImageDownload(returnData[i].back_picture);
        }
      }
      returnDataOr404(res, returnData);
    })
    .catch((err) => {
      next(err);
    });
}

function readBook(req, res, next) {
  db.oneOrNone('SELECT b.ID, b.title, b.author, b.isbn, b.price, b.courseName, b.condition, b.date_sold, b.userID, b.front_picture, b.back_picture, u.name, u.emailAddress FROM Books b, Users u  WHERE u.ID = b.userID and b.id=${id}', req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateBook(req, res, next) {
  db.oneOrNone('UPDATE Books SET title = ${title}, author = ${author}, isbn = ${isbn}, courseName = ${coursename}, userID = ${userid}, price = ${price}, condition = ${condition}, date_sold = ${date_sold} WHERE ID=${ID} RETURNING id', req.body)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

async function createBook(req, res, next) {
  const frontPicture = (req.body.front_picture) ? await handleImageUpload(req.body.ID + '_front', req.body.front_picture) : [null, null];
  const backPicture = (req.body.back_picture) ? await handleImageUpload(req.body.ID + '_back', req.body.back_picture) : [null, null];

  db.one('INSERT INTO Books(ID, title, author, isbn, courseName, userID, price, condition, front_picture, back_picture) VALUES (${ID}, ${title}, ${author}, ${isbn}, ${coursename}, ${userID}, ${price}, ${condition}, \'' + frontPicture + '\', \'' + backPicture + '\') RETURNING id', req.body)
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