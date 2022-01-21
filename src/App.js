import { useState, useEffect } from 'react'
import Header from './Components/Header'
import Tasks from './Components/Tasks'
import AddTask from './Components/AddTask'

/* App is like the main class, that controls all the other classes */

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)  

  const [tasks, setTasks] = useState([])

  // async makes a function wait for a promise
  // await makes a function wait for a promise
  // a promise is a normal function, that can be successful,
  // or have an error during execution

  /**
   * promise => 
   * myFunction().then( 
   *    function(value) { code if promise is successful}
   *    function(error) { code if there is some error}
   * );
   */
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch data from tasks   
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()  
    return data   
  }

  // Fetch data from a task   
  const fetchTask = async(id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()  
    return data   
  }

  //Add Task   
  const addTask = async(task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  // Delete task        
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, 
    { 
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder   
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, 
    reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT', 
      headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => 
        task.id === id ? {...task, reminder:
        !task.reminder} : task
      )
    )   
  }

  return (
    <div>
      <h1 class="heading">
        Project 05
      </h1>
      <div className="container">
        <Header 
          onAdd={() => setShowAddTask
          (!showAddTask)}
          showAdd={showAddTask}
        /> {
          showAddTask && <AddTask onAdd={addTask}/>
        }
        {tasks.length > 0 ? (
          <Tasks tasks={tasks} onDelete=
          {deleteTask} onToggle={toggleReminder} />) : ('No Tasks To Show')}
      </div>
    </div>
  );
}

export default App;
