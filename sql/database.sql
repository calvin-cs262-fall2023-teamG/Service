--
-- This SQL script builds a monopoly database, deleting any pre-existing version.
--

-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS UserBook;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Books;

-- Create the schema.
CREATE TABLE Users (
                      ID integer PRIMARY KEY,
                      name varchar(100) NOT NULL,
                      emailAddress varchar(50) NOT NULL,
                      username varchar(25) NOT NULL,
                      passwordHash varchar(60) NOT NULL
);

CREATE TABLE Books (
                        ID integer PRIMARY KEY,
                        title varchar(100),
                        author varchar(100),
                        isbn varchar(25),
                        price integer,
                        courseName varchar(25),
                        picture bytea
);

CREATE TABLE UserBook (
                            userID integer REFERENCES Users(ID),
                            bookID integer REFERENCES Books(ID),
                            buy_or_sell varchar(4)
);

-- Allow users to select data from the tables.
GRANT SELECT ON Users TO PUBLIC;
GRANT SELECT ON Books TO PUBLIC;
GRANT SELECT ON UserBook TO PUBLIC;

-- Add sample records.
INSERT INTO Users VALUES (1, 'Hye Chan Lee', 'hl63@calvin.edu', 'hl63', '$2b$10$Im8cm7iEjpHxycUOLo5z...3qHxnBO39g0HO8vqHivk.YJ/wtZW0e');
INSERT INTO Users VALUES (2, 'Anwesha Pradhananga', 'ap45@calvin.edu', 'ap45', '$2b$10$gDm.Wc2Hdj1kjsYndm3aruD2JjKltrfpO.tsbTHi.y1qcBZ9lbgGe');
INSERT INTO Users VALUES (3, 'Si Chan Park', 'sp56@calvin.edu', 'sp56', '$2b$10$F1Tnh8.rMpn12Tn4CvR.aeB.h7JW40o771DZED5QIb2duIZdPYIke');
INSERT INTO Users VALUES (4, 'Faeren Madza', 'fhm2@calvin.edu', 'fhm2', '$2b$10$Q2zgR77in77grWezqg0EhuSgdNuuDo7bCYj/CvN.YjT0CdbtzcbKq');
INSERT INTO Users VALUES (5, 'Benjamin Hart', 'bkh7@calvin.edu', 'bkh7', '$2b$10$voZc0BVpexgeFUhG6csuIuVzXMldO8i5oQODA/D6UY5itL.oUqzQ6');

INSERT INTO Books VALUES (1, 'The theory of Software engineering in 262 days 262 pages', 'Anna Brink', '123456789', 100, 'cs262' );
INSERT INTO Books VALUES (2, 'Advanded Networking: From Ethernet to Application', 'Haley', '234567', 80, 'cs332');
INSERT INTO Books VALUES (3, 'High Performance computing', 'Ben frank', '4567893', 65, 'cs374');

INSERT INTO UserBook VALUES (1, 1, 'SELL');
INSERT INTO UserBook VALUES (2, 1, 'BUY');
INSERT INTO UserBook VALUES (2, 2, 'SELL');
INSERT INTO UserBook VALUES (3, 2, 'BUY');
INSERT INTO UserBook VALUES (5, 3, 'SELL');
INSERT INTO UserBook VALUES (4, 3, 'BUY');
