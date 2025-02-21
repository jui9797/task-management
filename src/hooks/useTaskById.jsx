

// import { useQuery } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from './useAxiosPublic';

const useTaskById = (id) => {

 const axiosPublic = useAxiosPublic()
 const {data: task = {},  refetch} =useQuery({
    queryKey:['task', id],
    queryFn: async() =>{
        
        const res = await axiosPublic.get(`/tasks/${id}`);
        return res.data;
    }
   
 })

 return [task, refetch]
    
};

export default useTaskById;