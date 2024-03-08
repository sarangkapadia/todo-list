const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
    task: { type: String, required: true },
    status: { type: Boolean, required: true },
    dueBy: { type: Date, required: true },
    priority: { type: Number, required: true }
}, { timestamps: true });

const todoUsersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    todos: { type: [todoListSchema], required: true }
}, { timestamps: true });

const todoList = mongoose.model('TodoList', todoListSchema, 'TodoList');
const todoUsers = mongoose.model('TodoUsers', todoUsersSchema, 'TodoUsers');

module.exports = { todoList, todoUsers };