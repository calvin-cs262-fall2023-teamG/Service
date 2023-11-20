// const bcrypt = require('bcrypt');

// const users = [
//     { ID: 1, name: 'Hye Chan Lee', emailAddress: 'hl63@calvin.edu',
// username: 'hl63', password: '$2b$10$qi5eW2yjmfRobWxHnfk7IOFljdRoEG86a/9wZ6W0nwjDMSVdRz6AK' },
//     { ID: 2, name: 'Anwesha Pradhananga', emailAddress: 'ap45@calvin.edu',
// username: 'ap45', password: 'ChapterCache_Anwesha' },
//     { ID: 3, name: 'Si Chan Park', emailAddress: 'sp56@calvin.edu',
// username: 'sp56', password: 'ChapterCache_SiChan' },
//     { ID: 4, name: 'Faeren Madza', emailAddress: 'fhm2@calvin.edu',
// username: 'fhm2', password: 'ChapterCache_Faeren' },
//     { ID: 5, name: 'Benjamin Hart', emailAddress: 'bkh7@calvin.edu',
// username: 'bkh7', password: 'ChapterCache_Benjamin' },
// ];

// const saltRounds = 10; // Number of salt rounds, higher is more secure but slower

// users.forEach(user => {
//     bcrypt.hash(user.password, saltRounds, (err, hash) => {
//         if (err) {
//             console.error('Error hashing password:', err);
//             return;
//         }

//         // Now you can use 'hash' to insert into the database
//         console.log(`INSERT INTO Users VALUES (${user.ID}, '${user.name}',
// '${user.emailAddress}', '${user.username}', '${hash}');`);
//     });
// });
