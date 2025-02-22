import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import DarkLight from "../components/DarkLight";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { io } from "socket.io-client";
// import handleDelete from "../api/utilites";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TouchSensor } from "@dnd-kit/core";
import axios from "axios";

const socket = io("https://task-management-server-koc8.onrender.com", { transports: ["websocket"] });

const Home = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logOut();
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "User logout successfully.",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/");
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
  };

  useEffect(() => {
    fetchData();
    socket.on("newTask", (data) => {
      fetchData();
    });
    return () => {
      socket.off("newTask");
    };
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

  // DND Setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    const overTask = tasks.find((task) => task._id === over.id);

    if (!activeTask || !overTask) return;

    // If tasks are in the same category, reorder them
    if (activeTask.category === overTask.category) {
      const oldIndex = tasks.findIndex((t) => t._id === active.id);
      const newIndex = tasks.findIndex((t) => t._id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
    } 
    // If moving to a different category, update the category
    else {
      const updatedTasks = tasks.map((task) =>
        task._id === active.id ? { ...task, category: overTask.category } : task
      );
      setTasks(updatedTasks);

      // Update category in the database
      try {
        await axiosPublic.patch(`/tasks/${active.id}`, { category: overTask.category });
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    }
  };

  // delete
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
            try {
                const res = await axiosPublic.delete(`/tasks/${id}`);

                if (res.data.deletedCount > 0) {
                    // Update tasks state
                    setTasks((prevTasks) => prevTasks.filter(task => task._id !== id));

                    // Emit event using the correct socket instance
                    socket.emit("newTask");

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Task has been deleted`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    });
};


  return (
    <div className=" h-screen">
      <div className="flex justify-between items-center w-11/12 mx-auto p-4">
        <h2 className="text-xl lg:text-2xl font-bold dark:text-pink-600">
          TaskZen
        </h2>
        <div className="flex items-center">
          <DarkLight />
          <button
            onClick={handleLogout}
            className="btn bg-black text-white dark:bg-pink-600 border-none"
          >
            Logout
          </button>
        </div>
      </div>
      <hr />

      <div>
        <div className="hero h-2/4 lg:h-1/2 lg:py-8">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold dark:text-white hover:text-pink-600">
                Boost Your Productivity, One Task at a Time!
              </h1>
              <p className="py-6 dark:text-white">
                Stay organized, meet deadlines, and accomplish more with ease.
                Manage your tasks effortlessly—anytime, anywhere.
              </p>
              <button className="btn bg-black text-white dark:bg-pink-600 border-none">
                <Link to="/addTask">Add Task</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-center pb-4 bg-fuchsia-200 dark:bg-gray-900 dark: dark:text-white">Task</h2>
      <section className=" p-4 bg-fuchsia-200 dark:bg-gray-900 dark:text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : Object.keys(groupedTasks).length === 0 ? (
          <p className="text-gray-500">No tasks added yet.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            {Object.keys(groupedTasks).map((category) => (
              <SortableContext
                key={category}
                items={groupedTasks[category].map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mb-8 border-2 p-2">
                  <h4 className="text-2xl text-center text-gray-800 mb-4 font-bold dark:text-white">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedTasks[category].map((task, index) => (
                      <TaskCard key={task._id} task={task} handleDelete={handleDelete}/>
                    ))}
                  </div>
                </div>
              </SortableContext>
            ))}
          </DndContext>
        )}
      </section>
      </div>
    </div>
  );
};

// Task Card Component (Draggable)
const TaskCard = ({ task, handleDelete  }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-500 h-[250px] cursor-move"
    >
      <h4 className="text-xl font-bold text-gray-800">{task.title}</h4>
      <div className=" h-24">
      <p className="text-sm text-gray-600">{task.description || "No description available."}</p>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Category: <span className="font-semibold">{task.category}</span>
      </p>
      <Link to={`/update/${task._id}`} className="btn mr-4 bg-amber-300">
        Update
      </Link>
      <button onMouseDown={() => handleDelete(task._id)} className="btn bg-red-400">
        Delete
      </button>
    </div>
  );
};

export default Home;
