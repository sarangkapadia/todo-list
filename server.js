const express = require('express');
const app = express();

// mongoose
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

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
app.get(('/user/id:'), (req, res) => {

});

app.use((req, res) => {
    res.status(404).send('404! Does not exist');
})
