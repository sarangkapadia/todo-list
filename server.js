const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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

// add 1 todo for a specific user
app.put('/user/:id', async (req, res) => {
    const query = {
        username: req.params.id
    };
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
