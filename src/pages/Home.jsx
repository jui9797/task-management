import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
// import ThemeToggle from "../components/ThemeToggle";
import DarkLight from "../components/DarkLight";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });


const Home = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const handleLogout = () => {
    logOut();
    console.log("logout successful");
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'User logout successfully.',
      showConfirmButton: false,
      timer: 1500
    });
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const res = await axiosPublic.get("/tasks");
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  }

  // Load tasks
  useEffect(() => {
    fetchData()
    socket.on("newTask", (data) => {
        console.log(data);
        fetchData();
        });
        return () => {
            socket.off("newTask");
        }
  }, []);

  // Group tasks by category
  const groupedTasks = tasks.reduce((groups, task) => {
    const category = task.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {});




// delete task
const handleDelete = (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await axiosPublic.delete(`/tasks/${id}`);
            // console.log(res.data);
            socket.emit("newTask");
            if (res.data.deletedCount > 0) {
                // refetch to update the ui
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `task has been deleted`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }


        }
    });
}

  return (
    <div className="my-4 h-screen">
      {/* Nav */}
      <div className="flex justify-between items-center w-11/12 mx-auto p-4">
        <h2 className="text-xl lg:text-2xl font-bold dark:text-pink-600">TaskZen</h2>
        <div className="flex items-center">
          <DarkLight />
          <button onClick={handleLogout} className="btn bg-black text-white dark:bg-pink-600 border-none">Logout</button>
        </div>
      </div>
      <hr />

      {/* Banner */}
      <div>
        <div className="hero h-2/4 lg:h-1/2 lg:py-8">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold dark:text-white">Boost Your Productivity, One Task at a Time!</h1>
              <p className="py-6 dark:text-white">
                Stay organized, meet deadlines, and accomplish more with ease. Manage your tasks effortlessly—anytime, anywhere.
              </p>
              <button className="btn bg-black text-white dark:bg-pink-600 border-none">
                <Link to="/addTask">Add Task</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <section className="my-10 p-4 bg-fuchsia-200 dark:bg-gray-900 dark:text-white">
        <h3 className="text-xl font-semibold mb-8 text-center">Task List</h3>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : Object.keys(groupedTasks).length === 0 ? (
          <p className="text-gray-500">No tasks added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(groupedTasks).map((category) => (
              <div key={category} className="mb-8 border-2 p-2">
                <h4 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">{category}</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {groupedTasks[category].map((task, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-500 h-[250px]">
                      <h4 className="text-xl font-bold text-gray-800">{task.title}</h4>
                      <div className="h-20 overflow-y-auto">
                      <p className="text-sm text-gray-600 text-wrap">{task.description || "No description available."}</p>
                      </div>
                      
                      <p className="text-xs text-gray-600  mt-2">Category: <span className="font-semibold">{task.category}</span></p>
                      <p className="text-xs text-gray-600">Created: {new Date(task.timestamp).toLocaleString()}</p>
                      <button className="btn mr-4 bg-amber-300"><Link to={`/update/${task._id}`}>update</Link></button>
                      <button onClick={()=>handleDelete(task._id)} className="btn bg-red-400">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
