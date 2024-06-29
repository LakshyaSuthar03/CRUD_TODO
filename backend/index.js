import express from "express";
import connectDB from "./db/connection.js"; 
import taskModel from "./db/model/taskModel.js";
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv"
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
dotenv.config()
connectDB();

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

app.post("/api/create", async (req, res) => {
  const { task, status } = req.body;

  if (!task || !status) {
    return res.status(400).send("All fields are required");
  }

  const newTask = {
    task,
    status,
  };

  try {
    const createdTask = await taskModel.create(newTask);
    res.status(201).json(createdTask);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.put("/api/status", async (req, res) => {

  const { _id, task, status } = req.body.task;

  // status == "completed" ? updatedStatus ="pending":updatedStatus="completed";
  if (!_id || !task || !status) {
    return res.status(400).send("All fields are required");
  }

  try {
    const updatedStatus = await taskModel.findByIdAndUpdate(
      _id,
      { task, status:status == "completed" ?  "pending":"completed" },
      { new: true }
    );
    res.json(updatedStatus);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.put("/api/update/",async(req,res)=>{

  const { _id, task } = req.body.updateTask;
  if (!_id || !task){
    return res.status(400).send("All fields are required");
  }
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(_id,{task:task},{ new: true })
    return res.json(updatedTask);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
})

app.post("/api/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("ID is required");
  }

  try {
    await taskModel.findByIdAndDelete(id);
    return res.status(200).send("Task deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
