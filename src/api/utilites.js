import axios from "axios";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

// Create a socket instance
const socket = io("https://task-management-server-koc8.onrender.com", { transports: ["websocket"] });

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
                const res = await axios.delete(`https://task-management-server-koc8.onrender.com/tasks/${id}`);

                if (res.data.deletedCount > 0) {
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

export default handleDelete;
