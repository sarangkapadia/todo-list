const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// redis
const redis = require('redis');
let redisClient = null;

const redisSetup = async () => {

    redisClient = redis.createClient({
        password: 'xZNWvUWxSbTswJnpfrfps08t4fC9apv8',
        socket: {
            host: 'redis-12500.c331.us-west1-1.gce.cloud.redislabs.com',
            port: 12500
        }
    });

    redisClient.on('error', err => console.log('Redis Client Error', err));

    try {
        const data = await redisClient.connect();
        console.log("redisClient connected");
    } catch (err) {
        console.log("Failure connecting redis client", err);
    }
}

redisSetup();

// mongoose
const mongoose = require('mongoose');
const Users = require('./models/todoListSchema');

const dbconnect = async () => {
    const databaseName = 'Todo';
    const uri = `mongodb+srv://sarangksk:sarmongodb83@clustertodo.ms3dfbo.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=ClusterTodo`;
    try {
        await mongoose.connect(uri);
        console.log('Success connecting to MongoDB', databaseName);
        app.listen(port, () => console.log(`Listening on port ${port}`));
    } catch (err) {
        console.log('Error Conncecting to MongoDB', err);
    }
}

dbconnect();

// express Apis

// get all todos for a specific user
app.get(('/user/:id'), async (req, res) => {
    const query = {
        username: req.params.id
    };
    try {
        const result = await Users.findOne(query);
        res.status(200).send(result?.todos);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

// rate limit algo
const timeWindowInSeconds = 60;
const requestLimit = 3;

// 3 req / min allowed per user
const fixedWindowLimiter = async (username) => {
    const count = await redisClient.INCR(username);
    if (count === 1) {
        console.log(`expire key:${username} ${count}`);
        redisClient.EXPIRE(username, timeWindowInSeconds);
    }

    console.log(username, count);
    if (count > requestLimit)
        return true; // 429!
    return false; // 200
}

// requirement 3req/min
// bucket size = 3
// token refresh time = 1 min
// 1 token per 20s
const tokenBucketLimiter = async (username) => {
    let entry = await redisClient.hGetAll(username);
    console.log(entry);
    if (Object.keys(entry).length === 0) {
        // first entry
        console.log("New entry");
        await redisClient.hSet(username, { "token_count": requestLimit, "timestamp": Date.now() })
        return false; //200
    } else {
        const now = Date.now();
        const numRefills = (now - parseInt(entry.timestamp)) / (20 * 1000);
        entry.timestamp = now;
        const newTokenCount = Math.floor(parseInt(entry.token_count) + numRefills);
        console.log('new token count = ', newTokenCount, numRefills);
        entry.token_count = Math.min(newTokenCount, requestLimit);
        console.log(entry, numRefills);
    }
    if (entry.token_count > 0) {

        entry.token_count--;
        console.log('now decrement', entry);
        await redisClient.hSet(username, entry);
        return false; //200
    }
    return true; //429
}

// sliding window log counter
const slidingWinodwLogCounter = (username) => {

}

// add 1 todo for a specific user
app.put('/user/:id', async (req, res) => {
    const query = {
        username: req.params.id
    };
    const exceeded = await tokenBucketLimiter(req.params.id)
    // decide if the rate limit requirements allow this
    if (exceeded)
        return res.status(429).send('Too many requests');

    try {
        let result = await Users.findOne(query);
        const todos = [...result.todos, req.body];
        result.todos = todos;
        result = await result.save();
        res.status(200).send(result);
    } catch (err) {
        console.log('Error updating record', err);
        res.status(400).send(err);
    }
});

// add a new user
app.post('/create/user', async (req, res) => {
    try {
        const exists = await Users.exists({ username: req.body.username })
        if (exists != null) {
            const taken = `Username ${req.body.username} is already taken`;
            res.status(400).send(taken);
            return;
        }
    } catch (err) {
        console.log("Error searching for document", err);
        res.status(400).send(err);
        return;
    }

    // Add it to the db if username is unique
    const user = new Users({ username: req.body.username, todos: [] })
    try {
        const result = await user.save()
        res.status(200).send(result);
    } catch (err) {
        console.log("Error creating new user", err);
        res.status(400).send(err);
    }

});

// mark a todo as done ( active: false )
// app.put('/todo/:id', async (req, res) => {
//     try {
//         const result = await Users.findById(req.params.id);
//         return res.status(200).send(result);
//     } catch (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// });

app.use((req, res) => {
    res.status(404).send('404! Does not exist');
})
