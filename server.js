const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// mongoose
const mongoose = require('mongoose');
const models = require('./models/todoListSchema');
const Todo = models.todoList;
const Users = models.todoUsers;


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
app.get(('/user/:id'), (req, res) => {

    res.send(`In get ${req.params.id}`);
    // find the user id from the user table
    // get the array of todo items
    // return a json response
});

// add 1 todo for a specific user
app.post('/user/:id', (req, res) => {
    console.log(req.body.username);
    res.status(200).send(`In post user/:id`);
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
    }

    // Add it to the db if username is unique
    const user = new Users({ username: req.body.username, todos: [] })
    try {
        const result = await user.save()
        res.status(200).send(result);
    } catch (err) {
        console.log("Error creating new user", err);
    }

});


app.use((req, res) => {
    res.status(404).send('404! Does not exist');
})
