import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { backendUrl } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [authors, setAuthors] = useState(null);
  const [selectedLiteratures, setSelectedLiteratures] = useState([]);
  const [literatures, setLiteratures] = useState([]);
  const [bookImage, setBookImage] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const [totalAvailability, setTotalAvailability] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState(null);
  const [modalData, setModalData] = useState(null);
  const locations = useSelector((state) => state.store.locations);
  const [availableLocations, setAvailableLocations] = useState(null);
  const accessToken = useSelector((state) => state.user.token);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [isModalAddButtonDisabled, setIsModalAddButtonDisabled] = useState(true);
  const navigate = useNavigate();

  function getAuthors() {
    axios.get(`${backendUrl}/books/all-authors`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      const transformedData = res.data.map(item => ({
        value: item._id,
        label: item.name
      }));
      setAuthors(transformedData)
    });
  }

  function getLiteratures() {
    axios.get(`${backendUrl}/books/all-literatures`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      const transformedData = res.data.map(item => ({
        value: item._id,
        label: item.name
      }));
      setLiteratures(transformedData)
    });
  }

  function handleAddBook(e) {
    e.preventDefault();
    axios.post(`${backendUrl}/books/add-book`,
      {
        name,
        price,
        authors: selectedAuthors,
        literatures: selectedLiteratures,
        image: bookImage,
        availableLocations,
        publishedDate,
        totalAvailability
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then(() => {
      navigate('/home')
    });
  }

  function handleModalSubmission() {
    const url = modalName == 'Author' ? `${backendUrl}/books/add-author` : `${backendUrl}/books/add-literature`;
    setIsModalOpen(false);
    axios.post(url,
      {
        name: modalData
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => {
      modalName == 'Author' ? getAuthors() : getLiteratures();
    });
    setModalData(null);
  }

  useEffect(() => {
    // Enable or disable the Add button based on the form validity
    const isFormValid = name && price && selectedAuthors.length > 0 && selectedLiteratures.length > 0 && publishedDate && bookImage && totalAvailability;
    setIsAddButtonDisabled(!isFormValid);

    const isModalValid = modalData;
    setIsModalAddButtonDisabled(!isModalValid);
  }, [name, price, selectedAuthors, selectedLiteratures, publishedDate, bookImage, modalData, totalAvailability]);

  useEffect(() => {
    getAuthors();
    getLiteratures();
  }, [])

  return (
    <div className='flex justify-center items-center h-screen pt-16'>
      <div className='w-[40%] rounded-lg ring-1 p-9'>
        <h1 className='font-medium text-xl'>Add a New Book here..</h1>
        <form action="" method='POST'>
          <div>
            <label htmlFor="name" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Name
            </label>
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Price
            </label>
          </div>
          <div>
            <div className="flex rounded-lg shadow-sm">
              <span className="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm ">$</span>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full rounded-e-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="authors" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Authors
            </label>
          </div>
          <div className='flex justify-between items-center'>
            <Select
              isMulti
              name="authors"
              options={authors}
              className="basic-multi-select block w-full"
              onChange={(selectedOptions) => setSelectedAuthors(selectedOptions.map(option => option.value))}
            />
            <button
              id='addAuthor'
              type='button'
              onClick={() => { setIsModalOpen(true); setModalName('Author'); }}
              className="ml-2 rounded-md bg-indigo-600 text-white shadow-sm pb-1 px-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className='text-2xl font-bold'>+</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="literatures" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Literatures
            </label>
          </div>
          <div className='flex justify-between items-center'>
            <Select
              isMulti
              name="literatures"
              options={literatures}
              className="basic-multi-select block w-full"
              onChange={(selectedOptions) => setSelectedLiteratures(selectedOptions.map(option => option.value))}
            />

            <button
              type='button'
              id='addLiterature'
              onClick={() => { setIsModalOpen(true); setModalName('Literature'); }}
              className="ml-2 rounded-md bg-indigo-600 text-white shadow-sm pb-1 px-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className='text-2xl font-bold'>+</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="availableLocation" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Available Locations:
            </label>
          </div>
          <div>
            <Select
              isMulti
              name="availableLocation"
              options={locations.map(item => ({ value: item._id, label: item.name }))}
              className="basic-multi-select block w-full"
              onChange={(selectedOptions) => setAvailableLocations(selectedOptions.map(option => option.value))}
            />
          </div>

          <div>
            <label htmlFor="bookImage" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Book Image
            </label>
          </div>
          <div>
            <input
              type="file"
              name="bookImage"
              id="bookImage"
              onChange={(e) => setBookImage(e.target.files[0])}
              className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>


          <div>
            <label htmlFor="publishedDate" className="block text-sm float-start font-medium leading-6 text-gray-900">
              Published Date
            </label>
          </div>
          <div>
            <input
              type="date"
              name="publishedDate"
              id="publishedDate"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center mt-3">
            <label htmlFor="totalAvailability" className="block w-40 text-start text-sm font-medium leading-6 text-gray-900">
              Total Availability:
            </label>

              <input
                type="number"
                name="totalAvailability"
                id="totalAvailability"
                value={totalAvailability}
                onChange={(e) => setTotalAvailability(e.target.value)}
                className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            onClick={(e) => { handleAddBook(e) }}
            disabled={isAddButtonDisabled}
          >
            Add Book
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-9 bg-white'>
            <h1 className='font-medium text-xl'>{`Add new ${modalName} here..`}</h1>
            <div>
              <label htmlFor='modalInput' className='block text-sm float-start font-medium leading-6 text-gray-900'>
                Name
              </label>
            </div>
            <div>
              <input
                type='text'
                name='modalInput'
                id='modalInput'
                onChange={(e) => setModalData(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false) }}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Cancel
              </button>

              <button
                type='submit'
                disabled={isModalAddButtonDisabled}
                className='flex justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed'
                onClick={handleModalSubmission}
              >
                {`Add ${modalName}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
