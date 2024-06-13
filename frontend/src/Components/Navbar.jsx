import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useSelector, useDispatch } from 'react-redux'
import { backendUrl, firebaseUrl } from '../constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, setToken } from '../store/reducers/authSlice';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const accessToken = useSelector((state) => state.user.token);
  const userData = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleSignOut() {
    Cookies.remove('storeLocation');
    axios.delete(`${backendUrl}/cart/remove/${userData._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        axios.post(
          `${backendUrl}/users/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        ).then(() => {
          Cookies.remove("accessToken");
          navigate('/');
          dispatch(setUser(null));
          dispatch(setToken(null));
        })
      })

  }

  return (
    <Disclosure as="nav" className="fixed w-full bg-gray-800 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center justify-center">
                <h1 className='text-white text-xl'>Book Store Management</h1>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <Link to={'/home'} className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>Home</Link>
                  </div>
                </div>
              </div>
              <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {userData && userData.is_admin &&
                  <Link
                    to={'/addBook'}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add New Book
                  </Link>
                }
                {/* {
                    !userData &&

                    <Link
                    to={'/login'}
                    className="rounded-md px-3 py-2 ml-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-950"
                  >
                    LogIn
                  </Link>
                } */}


                {
                  userData &&

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full items-center bg-gray-800 text-sm ring-1 p-1 ring-white  focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-6 w-6 rounded-full"
                          src={firebaseUrl('avatar.png')}
                          alt=""
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-1 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>

                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {
                          userData.is_admin ?

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={'/orders'}
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Customer Orders
                                </Link>
                              )}
                            </Menu.Item>
                            :
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={'/cart'}
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Your Cart
                                </Link>
                              )}
                            </Menu.Item>
                        }
                        {!userData.is_admin &&
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={'/orders'}
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 w-full text-sm text-gray-700')}
                              >
                                Your Orders
                              </Link>
                            )}
                          </Menu.Item>
                        }
                        {userData.is_admin &&
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={'/adminRegister'}
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 w-full text-sm text-gray-700')}
                              >
                                Add Admin
                              </Link>
                            )}
                          </Menu.Item>
                        }
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 w-full py-2 text-sm text-gray-700')}
                              onClick={handleSignOut}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                }
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
