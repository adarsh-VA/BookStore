import React, { useEffect, useState } from 'react'
import BookCard from './BookCard'
import { backendUrl, firebaseUrl } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setBooks } from '../store/reducers/bookSlice';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  //const accessToken = useSelector((state)=> state.user.token);
  const accessToken = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.list);
  const userData = useSelector((state) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToExplore, setBookToExplore] = useState(null);
  const [storeLocation, setStoreLocation] = useState(Cookies.get('storeLocation'));
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLiterature, setSelectedLiterature] = useState("All");
  const locations = useSelector((state) => state.store.locations);
  const [cartItems, setCartItems] = useState([]);
  const [literature, setLiterature] = useState([]);

  const navigate = useNavigate();

  function addToCart(data) {
    axios.post(`${backendUrl}/cart/add`, {
      user: userData._id,
      bookId: data.bookId,
      quantity: 1,
      totalPrice: data.price,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    })
      .then((res) => {
        navigate('/cart');
      });
  }

  function deleteBook(bookId) {
    axios.delete(`${backendUrl}/books/delete-book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
    dispatch(setBooks(books.filter(book => book._id != bookId)));
  }

  function loadBooks() {
    if (storeLocation) {
      var bookUrl = '';
      if (storeLocation == "All" && selectedLiterature == "All") {
        bookUrl = `${backendUrl}/books/all-books`;
      }
      else if (storeLocation != "All" && selectedLiterature == "All") {
        bookUrl = `${backendUrl}/books/booksByLocation/${storeLocation}`
      }
      else {
        bookUrl = `${backendUrl}/books/booksByLiteratureAndLocation/${selectedLiterature}/${storeLocation}`;
      }

      // Fetch books from API
      axios.get(bookUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          // Dispatch setBooks action to update the Redux store
          axios.get(`${backendUrl}/books/all-literatures`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              setLiterature(res.data)
            });

          axios.get(`${backendUrl}/cart/all/${userData._id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              if (res.data) {
                if (res.data.items.length == 0) {
                  setCartItems([]);
                }
                else {
                  setCartItems(res.data.items.map(item => item.book._id));
                }
              }
              else {
                setCartItems([]);
              }
              dispatch(setBooks(response.data));
            })

        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });
    }
  }

  function saveLocation() {
    if (storeLocation) {
      if (storeLocation == "All") {
        Cookies.set('storeLocation', storeLocation);
        setSelectedLocation(storeLocation)
      }
      else {
        Cookies.set('storeLocation', locations.filter(item => item._id == storeLocation)[0]._id);
        setSelectedLocation(locations.filter(item => item._id == storeLocation)[0].name);
      }
    }
    else {
      if (userData.is_admin) {
        Cookies.set('storeLocation', "All");
        setStoreLocation("All");
        setSelectedLocation("All");
      }
      else {
        Cookies.set('storeLocation', locations[0]._id);
        setStoreLocation(locations[0]._id);
        setSelectedLocation(locations[0].name);
      }
    }
    setIsModalOpen(false);
    if (!userData.is_admin) {
      axios.delete(`${backendUrl}/cart/remove/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }
    loadBooks();
  }

  function openExplore(bookId) {
    setIsBookModalOpen(true);
    setBookToExplore(books.find(book => book._id == bookId));
  }

  useEffect(() => {
    const cookieVal = Cookies.get('storeLocation');
    if (cookieVal) {
      if (cookieVal == "All") {
        setSelectedLocation(cookieVal);
      }
      else {
        setSelectedLocation(locations.filter(item => item._id == storeLocation)[0].name);
      }
      loadBooks();
    }
    else {
      setIsModalOpen(true);
    }
  }, [dispatch, selectedLocation]);

  useEffect(() => {
    if (typeof storeLocation !== "undefined") {
      if (storeLocation == "All" && selectedLiterature == "All") {

        axios.get(`${backendUrl}/books/all-books`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            dispatch(setBooks(res.data));
          })
      }
      else if (selectedLiterature == "All") {

        axios.get(`${backendUrl}/books/booksByLocation/${storeLocation}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            dispatch(setBooks(res.data));
          })
      }
      else if (storeLocation == "All") {
        axios.get(`${backendUrl}/books/booksByLiterature/${selectedLiterature}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            dispatch(setBooks(res.data));
          })
      }
      else {
        axios.get(`${backendUrl}/books/booksByLiteratureAndLocation/${selectedLiterature}/${storeLocation}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            dispatch(setBooks(res.data));
          })

      }
    }
  }, [selectedLiterature]);

  return (
    <div className='pt-20 p-10'>
      {
        storeLocation &&

        <>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center w-80'>
              <h1 className='w-full'>Sort by Literatures: </h1>
              <select
                id="literature"
                name="literature"
                value={selectedLiterature}
                onChange={(e) => setSelectedLiterature(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                <option value="All" selected>All</option>
                {literature.map((item,index) => <option key={index} value={item._id}>{item.name}</option>)}
              </select>
            </div>
            <div className='flex items-center gap-3'>
              <h1><span className='font-semibold'>Selected Store:</span> {selectedLocation}</h1>
              <button
                onClick={() => { setIsModalOpen(true) }}
                className='flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Change Store
              </button>
            </div>
          </div>
          <hr />
          <div className='flex flex-wrap gap-9 mx-28 mt-10 justify-center'>
          {books.filter((book) => book.totalAvailability > 0).map((book, index) => (
            <BookCard
              key={index}
              book={book}
              addToCart={addToCart}
              isAdmin={userData.is_admin}
              deleteBook={deleteBook}
              booksInCart={cartItems}
              openExplore={openExplore}
            />
          ))}
          </div>
        </>
      }

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-9 bg-white'>
            <h1 className='font-medium text-xl'>Please Select Store to continue..</h1>
            <hr />
            <div className='flex items-center justify-center gap-2 mt-5'>
              <label htmlFor='modalInput' className='block text-sm float-start font-medium leading-6 text-gray-900'>
                Store:
              </label>
              <select
                onChange={(e) => setStoreLocation(e.target.value)}
                id="country"
                name="country"
                value={storeLocation}
                autoComplete="country-name"  // Use camelCase for autoComplete
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {userData.is_admin && <option value="All" selected>All</option>}
                {locations.map((item) => <option value={item._id}>{item.name}</option>)}
              </select>

            </div>
            {!userData.is_admin && <h1 className='mt-2 text-red-500'><span className='font-semibold'>Note:</span> Everytime you change location your cart will be refreshed.</h1>}
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false) }}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Close
              </button>
              <button
                type='button'
                onClick={saveLocation}
                className='flex justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isBookModalOpen && (

        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='w-[25%] rounded-lg ring-1 p-9 bg-white'>
            <h1 className='font-medium text-xl'>Book details..</h1>
            <hr />
            <div className='flex flex-col mt-3'>
              <div className='h-48 mb-3 shadow-[0px_3px_15px_-5px_rgb(0,0,0)] mx-auto'>
                <img src={firebaseUrl(bookToExplore.image)} alt="" className='w-full h-full rounded-md' />
              </div>
              <h3 className='font-bold'>{bookToExplore.name}</h3>
              <p className='text-sm text-zinc-500'>by {bookToExplore.authors.map(author => author.name).join(', ')}</p>
              <h4>${bookToExplore.price}</h4>
              <h3><span className='font-semibold'>Literatures: </span>{bookToExplore.literatures.map(Literature => Literature.name).join(', ')}</h3>
              <h3><span className='font-semibold'>Published Date: </span> {new Date(bookToExplore.publishedDate).toLocaleDateString('en-US')}</h3>
              <h3><span className='font-semibold'>Available Locations: </span> {bookToExplore.availableLocations.map(location => location.name).join(', ')}</h3>
              <h3><span className='font-semibold'>Total Availability: </span> {bookToExplore.totalAvailability}</h3>
              <h3><span className='font-semibold'>Item Condition: </span> {bookToExplore.itemCondition}</h3>
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => { setIsBookModalOpen(false) }}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
