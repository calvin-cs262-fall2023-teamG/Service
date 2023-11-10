--
-- This SQL script builds a monopoly database, deleting any pre-existing version.
--

-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Users;

-- Create the schema.
CREATE TABLE Users (
                      ID varchar(100) PRIMARY KEY,
                      name varchar(100) NOT NULL,
                      emailAddress varchar(50) NOT NULL,
                      username varchar(25) NOT NULL,
                      passwordHash varchar(60) NOT NULL
);

CREATE TABLE Books (
                        ID varchar(100) PRIMARY KEY,
                        title varchar(100),
                        author varchar(100),
                        isbn varchar(25),
                        price varchar(20),
                        courseName varchar(25),
                        date_sold date,
                        userID varchar(100) REFERENCES Users(ID),
                        front_picture bytea,
                        back_picture bytea
);

-- Allow users to select data from the tables.
GRANT SELECT ON Users TO PUBLIC;
GRANT SELECT ON Books TO PUBLIC;

-- Add sample records.

INSERT INTO Users VALUES (1, 'Hye Chan Lee', 'hl63@calvin.edu', 'hl63', '$2b$05$vBy.1gdKSa7s40bT639i6O3gCag2pOtctnTQddqK5Wq9S15ba11um' );
INSERT INTO Users VALUES (2, 'Anwesha Pradhananga', 'ap45@calvin.edu', 'ap45', '$2b$05$xnvEpwzZlQtiPbY3DXktY.Y2VwrV/XJmp23m8W3aGKnL6w5jqfpJ.');
INSERT INTO Users VALUES (3, 'Si Chan Park', 'sp56@calvin.edu', 'sp56', '$2b$05$ZOdqpIO3aADG5ybWOJAbEOT4Z9/ebjbYnEwpA1ltB79MGRJlcyuiO');
INSERT INTO Users VALUES (4, 'Faeren Madza', 'fhm2@calvin.edu', 'fhm2', '$2b$05$kNF.fXB.Q0AEaozwiY4nvOrK6LJrO7Bohxt5ovSHGz5woU3Oeggbe');
INSERT INTO Users VALUES (5, 'Benjamin Hart', 'bkh7@calvin.edu', 'bkh7', '$2b$05$TMWt3ISdEDRdMjsMQ8nFpO00Tf0ZhX7THQl3.Qz5XI2ASRaJP6jVq');
INSERT INTO Users VALUES (6, 'admin', 'admin@calvin.edu', 'admin', '$2b$05$NrF5nocV7ygcs7zKQjRvueP.z5JHX/4nx7mCVwquzUusSy0Fjou46' );

INSERT INTO Books VALUES (1, 'The theory of Software engineering in 262 days 262 pages', 'Anna Brink', '123456789', 100, 'cs262', '2023-05-18', 5, NULL, NULL );
INSERT INTO Books VALUES (2, 'Advanded Networking: From Ethernet to Application', 'Haley', '234567', 80, 'cs332', NULL, 2, NULL, NULL);
INSERT INTO Books VALUES (3, 'High Performance computing', 'Ben frank', '4567893', 65, 'cs374', '2023-11-6', 4, NULL, NULL);

