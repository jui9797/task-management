
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';

import useAxiosPublic from '../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
// import signupPhoto from '../../src/assets/Mobile login-rafiki.png'
import Social from './Social';

const Signup = () => {

    const axiosPublic =useAxiosPublic()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate()
    const onSubmit = data =>{
        // console.log(data)
        createUser(data.email, data.password)
            .then(result =>{
                const loggedUser = result.user;
                // console.log(loggedUser);

                updateUserProfile(data.name, data.photoURL)
                .then(() => {
                    const userInfo ={
                        name:data.name,
                        email:data.email,
                        photoURL: data.photoURL,
                        
                      }
                    //   add user in database
                      axiosPublic.post('/users', userInfo)
                      .then(res=>{
                        if(res.data.insertedId || res.data.message === 'user already exist'){
                            reset()
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'User created successfully.',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate('/home');
                        }
                      })
                    //   console.log('user profile info updated', userInfo)
                      
                })
                .catch(error => console.log(error))
            })
    }

    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold lora">Sign up now!</h1>
                        {/* img */}
                        
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lora">
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text"  {...register("name", { required: true })} name="name" placeholder="Name" className="input input-bordered" />
                                {errors.name && <span className="text-red-600">Name is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo URL</span>
                                </label>
                                <input type="text"  {...register("photoURL", { required: true })} placeholder="Photo URL" className="input input-bordered" />
                                {errors.photoURL && <span className="text-red-600">Photo URL is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email"  {...register("email", { required: true })} name="email" placeholder="email" className="input input-bordered" />
                                {errors.email && <span className="text-red-600">Email is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password"  {...register("password", {
                                    required: true,
                                    
                                    minLength: 6,
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/

                                })} placeholder="password" className="input input-bordered" />
                                {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                                
                                {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be more than 6 characters</p>}
                                {errors.password?.type === 'pattern' && <p className="text-red-600">Password must have one Uppercase, one lowercase and one special character.</p>}
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <input className="btn bg-blue-400 text-white" type="submit" value="Sign Up" />
                            </div>
                        </form>
                        <Social></Social>
                        <p className='ml-4 py-2'><small>Already have an account <Link to="/"><span className='text-blue-600 font-bold'>Login</span></Link></small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;