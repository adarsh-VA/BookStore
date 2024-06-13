import React, { useEffect, useState } from 'react'
import { backendUrl } from '../constants';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../store/reducers/authSlice';
import Cookies from 'js-cookie';

export default function Register() {

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [gender, setGender] = useState('Male');
    const [error, setError] = useState(null);
    const [isRegisterButtonDisabled, setIsRegisterButtonDisabled] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    function handleRegister(e) {
        e.preventDefault();
        if (password != confirmPassword) {
            setError("Confirm password doesn't match. Please try again later.");
        }
        else {
            axios.post(`${backendUrl}/users/register`,
                {
                    name,
                    email,
                    password,
                    gender
                },
                { withCredentials: true }
            ).then((res) => {
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));
                Cookies.set('accessToken', res.data.token, { expires: 5 });
                navigate('/home');
            })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        setError('User already exists');
                    } else {
                        setError('An unexpected error occurred. Please try again later.');
                    }
                });
        }
    }

    useEffect(() => {
        // Enable or disable the Add button based on the form validity
        const isFormValid = name && email && password && confirmPassword && gender;
        setIsRegisterButtonDisabled(!isFormValid);
    }, [name, email, password, confirmPassword, gender]);

    return (
        <div className='flex flex-col justify-center items-center h-screen pt-10'>
            {error &&
                <div class="bg-red-100 border border-red-400 flex gap-1 w-[40%] text-red-700 px-4 py-3 mb-2 rounded relative" role="alert">
                    <strong class="font-bold">Error: </strong>
                    <span class="block sm:inline"> {error}</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg class="fill-current h-6 w-6 text-red-500" onClick={() => setError(null)} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            }
            <div className='w-96 rounded-lg ring-1 p-9'>
                <h1 className='text-xl mb-3'>Register your account</h1>
                <form className="h-100" action="" method="POST">
                    <div className="flex items-center justify-between">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                        </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                    </div>
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Gender
                        </label>
                    </div>
                    <div>
                        <select
                            name='gender'
                            onChange={(e) => setGender(e.target.value)}
                            class="block w-full p-2 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                            <option value="Male" selected>Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>


                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                    </div>
                    <div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="confirm-password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={(e) => handleRegister(e)}
                        disabled={isRegisterButtonDisabled}
                        className="flex w-full justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}
