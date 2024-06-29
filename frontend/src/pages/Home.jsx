import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./home.css"
import {base} from "../../config.json"
const Home = () => {
  
  const [tasks, setTasks] = useState([])
  const [addTask, setAddTask] = useState("")
  const [updated,setUpdated] = useState(false)
  const [updateTask, setUpdateTask] = useState({});


  const fetchTasks= ()=>{
    axios.get(`${base}api/tasks`).then((response) => {
      setTasks(response.data)

    }).catch((err) => {
      console.log(err);
    })

  }
  const handleDoubleClick = (task) => {
  
    setTasks(
      tasks.map((t) =>
        t._id === task._id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
    )
    );

    axios.put(`${base}api/status/`,{
      task
    }).then((response)=>{
      console.log(response);
    }).catch((err)=>{
      console.log(err);
    })
  }
  const handleAddTask = () => {
    axios.post(`${base}api/create/`, {
      task: addTask,
      status: "pending"
    })
      .then((response) => {
        setUpdated((prev)=>!prev)
        setAddTask("")
      }, (error) => {
        console.log(error);
      });
  }

  const handleDelete=(id)=>{
    if(id){
      axios.post(`${base}api/delete`,{id}).then((response)=>{
        setUpdated((prev)=>!prev)

      }).catch((err)=>{
        console.log(err);
      })
    }
    
  }

  const handleUpdateTask=(task)=>{

    if(!task){
      return
    }
    
    if( task.status != "completed"){
      setUpdateTask(task)
    }

  }  
  const handleSubmitTask=()=>{

    if(updateTask===""){
      return 
    }
    
    axios.put(`${base}api/update/`,{
      updateTask
    }).then((response)=>{
      fetchTasks()
    }).catch((err)=>{
      console.log(err);
    })
  }

  useEffect(() => {
    fetchTasks()
  }, [updated])
  return (
    <div className='home'>
      <h1>TODO</h1>
      <div className="container">
        {tasks.map((task) => {
          return <div className="task" key={task._id}  onClick={()=>{handleUpdateTask(task)}} onDoubleClick={() => { handleDoubleClick(task) }}> <div style={{ textDecoration: task.status === "completed" ? "line-through" : "none" }}>{task.task}</div><button onClick={()=>{handleDelete(task._id)}}>Delete</button></div>
        })}
        <div>
          <input type="text" value={addTask} onChange={(e) => { setAddTask(e.target.value) }} />
          <button onClick={handleAddTask}>Add</button></div><div>
          <input type="text" value={updateTask?.task} onChange={(e)=>{ setUpdateTask({ ...updateTask, task: e.target.value })}}/>
          <button onClick={handleSubmitTask}>Update</button></div>
      </div>
    </div>
  )
}

export default Home