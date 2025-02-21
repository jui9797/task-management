import { useParams } from "react-router-dom";
import useTaskById from "../hooks/useTaskById";

const Update = () => {
    const { id } = useParams()
    console.log(id)
    const [task] = useTaskById(id)
    console.log(task)
    return (
        <div className="my-5">
            <h2 className="text-center font-bold text-2xl lg:text-4xl"> Update task</h2>
        </div>
    );
};

export default Update;