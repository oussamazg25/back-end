const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken'); // for creating tokens

// Add this line to use json body in your requests
app.use(express.json());

// Database connection
MongoClient.connect('mongodb://127.0.0.1:27017', {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('yourDB');
        const usersCollection = db.collection('users');

        // Register User
        app.post('/register', async (req, res) => {
            const user = req.body;
            console.log(user)
            // Check if email already exists in the database
            const existingUser = await usersCollection.findOne({email: user.email});
            if (existingUser) {
                res.status(400).json({error: 'Email already exists'});
                return;
            }

            user.password = await bcrypt.hash(user.password, 10); // hash the password before storing
            await usersCollection.insertOne(user);
            res.json(user);
        });

        // Login User
        app.post('/login', async (req, res) => {
            const user = req.body;
            console.log(user)
            const userInDb = await usersCollection.findOne({email: user.email});

            if (!userInDb) {
                res.status(400).json({error: 'User not found'});
                return;
            }

            const passwordMatch = await bcrypt.compare(user.password, userInDb.password);
            console.log(passwordMatch)
            if (!passwordMatch) {
                res.status(400).json({error: 'Invalid password'});
                return;
            }

            const token = jwt.sign({id: userInDb._id}, 'your_secret_key'); // sign a token with user id

            res.json({token});
        });

        // Listen
        app.listen(3000, () => console.log('Listening on 3000'));
    })
    .catch(console.error);

