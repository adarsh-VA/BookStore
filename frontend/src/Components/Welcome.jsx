import React from 'react'
import { Link } from 'react-router-dom'
import { firebaseUrl } from '../constants'

export default function Welcome() {
  return (
    <div className="h-screen pt-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className='flex justify-between items-center p-10 h-full'>
        <div className='w-[50%] text-center'>
          <h1 className='text-7xl mb-5'>Welcome to Book Store Management</h1>
          <p className='text-lg text-white mb-3'>We Sell Books. Please LogIn to continue...</p>
          <Link
            className="rounded-md px-5 py-1 ml-2 text-lg font-semibold text-black shadow-sm ring-1 ring-inset ring-black hover:bg-black hover:text-white"
            to={'/CustomerLogin'}
          >
            Customer LogIn
          </Link>
          <Link
            className="rounded-md px-5 py-1 ml-2 text-lg font-semibold text-black shadow-sm ring-1 ring-inset ring-black hover:bg-black hover:text-white"
            to={'/AdminLogin'}
          >
            Admin LogIn
          </Link>

          {/* <p className="mt-4 text-center text-sm text-white">
            Not a member?{' '}
            <Link to={'/register'} className="font-semibold leading-6 text-gray-900 hover:text-gray-950 hover:underline">
              Register
            </Link>
          </p> */}
        </div>
        <div className='w-[50%]'>
          <img src={firebaseUrl('bookVector.png')} alt="" className='h-[70vh] mx-auto' />
        </div>
      </div>
    </div>
  )
}
