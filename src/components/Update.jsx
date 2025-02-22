import { useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
import useTaskById from "../hooks/useTaskById";  // ✅ Hook should be called at the top level
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Update = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate()
    
    // ✅ Call hook at the top level
    const [task] = useTaskById(id);  // ✅ Correct way to use a custom hook

    // Handle form submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;

        const updatedTask = { title, description, category };
        // console.log(updatedTask);

        try {
            const res = await axiosPublic.patch(`/tasks/${id}`, updatedTask);
            console.log( "updated",res.data)
            if (res.data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Task updated successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => navigate("/home"));
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Show loading state if task is not loaded
    if (!task) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="my-5 max-w-lg mx-auto">
            <h2 className="text-center font-bold text-2xl lg:text-4xl">Update Task</h2>

            {/* Update Form */}
            <form onSubmit={handleUpdate} className="mb-6">
                <div className="mb-4">
                    <label className="block font-medium">Title:</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full p-2 border rounded"
                        maxLength="50"
                        defaultValue={task?.title}  // ✅ Use optional chaining to prevent errors
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium">Description:</label>
                    <textarea
                        name="description"
                        className="w-full p-2 border rounded"
                        defaultValue={task?.description}  // ✅ Use optional chaining
                        placeholder="Enter task description (optional)"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium">Category:</label>
                    <select name="category" className="w-full p-2 border rounded" defaultValue={task?.category}>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Update Task
                </button>
            </form>
        </div>
    );
};

export default Update;
