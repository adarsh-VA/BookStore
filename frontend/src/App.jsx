import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Welcome from './Components/Welcome';
import Home from './Components/Home';
import AddBook from './Components/AddBook';
import AdminLogin from './Components/AdminLogin';
import CustomerLogin from './Components/CustomerLogin';
import Register from './Components/Register';
import { useEffect, useState } from 'react';
import { backendUrl } from './constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setToken, setUser } from './store/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux'
import Main from './Components/Main';
import Cart from './Components/Cart';
import Orders from './Components/Orders';
import { setLocations } from './store/reducers/storeSlice';
import NotFound from './Components/NotFound';
import AdminRegister from './Components/AdminRegister';



function App() {
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");
  const userData = useSelector((state) => state.user.user);
  const [isUserFetched, setIsUserFetched] = useState(false);

  async function setUserDetails() {
    const response = await axios.get(`${backendUrl}/store/locations`);
    dispatch(setLocations(response.data));
    if (accessToken) {
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res)=>{
        const data = res.data;
        dispatch(setUser(data.data));
        dispatch(setToken(accessToken));
      })
      .catch((err)=>{
        dispatch(setUser(null));
        dispatch(setToken(null));
        Cookies.remove('accessToken');
      });
    }
    else {
      dispatch(setUser(null));
      dispatch(setToken(null));
    }
  }

  useEffect(() => {
    setUserDetails().then(() => { setIsUserFetched(true) });
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Main />,
      children: [
        {
          path: '',
          element: !userData ? <Welcome /> : <Navigate to={'/home'} />,
        },
        {
          path: '/home',
          element: userData ? <Home /> : <Navigate to={'/'} />,
        },
        {
          path: '/addBook',
          element: <AddBook />,
        },
        {
          path: '/CustomerLogin',
          element: !userData ? <CustomerLogin /> : <Navigate to={'/home'} />,
        },
        {
          path: '/AdminLogin',
          element: !userData ? <AdminLogin /> : <Navigate to={'/home'} />,
        },
        {
          path: '/register',
          element: !userData ? <Register /> : <Navigate to={'/home'} />,
        },
        {
          path: '/AdminRegister',
          element: userData && userData.is_admin ? <AdminRegister /> : <Navigate to={'/home'} />,
        },
        {
          path: '/cart',
          element: userData ? <Cart /> : <Navigate to={'/'} />,
        },
        {
          path: '/orders',
          element: userData ? <Orders /> : <Navigate to={'/'} />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);

  return (
    <div className="App text-center">
      {isUserFetched && <RouterProvider router={router} />}
    </div>
  );
}

export default App;
