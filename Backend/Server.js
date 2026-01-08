const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Task = require('./Models/Task')

const app = express();
app.use(cors());
app.use(express.json()); 
//Data base connectivity
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Db connect  Successfully"))
  .catch(err => console.error("Connection Error:", err));


//  all tasks show
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 }); 
        res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//   Create a new task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "Validation Error: Title and Due Date are required" });
  }
});

//  Update task status
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true } 
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Remove a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Run ${PORT}`));