import axios from 'axios';


const axiosPublic =axios.create({
    baseURL:'https://task-management-server-koc8.onrender.com'
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;