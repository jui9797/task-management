import { useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
    const axiosPublic = useAxiosPublic()
    const navigate = useNavigate()
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    if(title.length > 50){
      alert("Title cannot be longer than 50 characters!");
      return;
    }

    // validate description
    if (description.length > 200) {
        alert("Description cannot be longer than 200 characters!");
        return;
      }

    // Create a new task object
    const newTask = {
      id: Date.now(),
      title,
      description,
      timestamp: new Date().toISOString(),
      category,
    };
    // console.log(newTask)
    // store task
    try {
        // Send the task to the backend using Axios
        const res = await axiosPublic.post("/tasks", newTask);
        if (res.data.insertedId) {
            setTasks([...tasks, newTask]); // Update state with new task
    
            // Show SweetAlert confirmation
            Swal.fire({
              icon: "success",
              title: "Task Added!",
              text: "Your task has been successfully added.",
              timer: 2000,
              showConfirmButton: false
            });
    
            // Reset form fields
            setTitle("");
            setDescription("");
            setCategory("To-Do");
            // navigate to home
            navigate('/home')
          }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    };
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Task</h2>
      
      {/* Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            maxLength="50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Description:</label>
          <textarea
            className="w-full p-2 border rounded"
           
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Category:</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>

      
    </div>
  );
};

export default AddTask;
