import axios from 'axios'
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { backendUrl } from '../constants';
import Order from './Order';

export default function Orders() {
  const accessToken = Cookies.get('accessToken');
  const userData = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locations = useSelector((state) => state.store.locations);
  const [selectedReturnLocation, setSelectedReturnLocation] = useState(Cookies.get('storeLocation'));
  const [selectedLocation, setSelectedLocation] = useState(Cookies.get('storeLocation'));
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnItem, setReturnItem] = useState(null);


  function saveReturnLocation() {
    if(returnItem && orders.find(item => item._id == returnOrderId).books.length > 1){
      itemReturn();
    }
    else{
      axios.put(`${backendUrl}/orders/modifyReturnLocation/${returnOrderId}`,
        {
          returnLocation: selectedReturnLocation
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      .then(() => {
        axios.put(`${backendUrl}/orders/modifyStatus/${returnOrderId}`,
          {
              status: "Return Requested"
          },
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
        loadOrders();
        setIsModalOpen(false);
        setReturnOrderId(null);
      })
    }
  }

  function itemReturn(){
    axios.post(`${backendUrl}/orders/itemReturn/${returnOrderId}`,
    {
      item: returnItem,
      returnLocation: selectedReturnLocation
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(()=>{
      loadOrders();
      setIsModalOpen(false);
      setReturnOrderId(null);
      setReturnItem(null);
    });
  }

  function loadOrders() {
    var apiURL = userData.is_admin ? `${backendUrl}/orders/` : `${backendUrl}/orders/${userData._id}`;
    if (userData.is_admin) {
      if (selectedLocation !== "All") {
        apiURL += `/byLocation/${selectedLocation}`;
      }
    }

    axios.get(apiURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(res => {
        var myOrders = [];
        var myReturns = [];

        res.data.forEach(item => {
          if (item.status == "Return Successful" || item.status.includes("Cancelled")) {
            myReturns.push(item);
          }
          else {
            myOrders.push(item);
          }
        });
        setOrders(myOrders);
        setReturns(myReturns);
      })
  }

  useEffect(() => {
    loadOrders();
  }, [selectedLocation])

  return (
    <div className='pt-16 h-full mb-3'>
      {userData.is_admin &&
        <div className='flex justify-end items-center mr-5'>
          <div className='flex items-center w-80'>
            <h1 className='w-full'>Sort by Location: </h1>
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e.target.value); Cookies.set('storeLocation', e.target.value); }}
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
              <option value="All" selected>All</option>
              {locations.map((item) => <option value={item._id}>{item.name}</option>)}
            </select>
          </div>
        </div>
      }
      <div className='flex p-5 justify-between'>
        <div className='w-[45%] mx-auto '>
          <h1 className='mt-5 text-2xl font-semibold'>{userData.is_admin ? `Customer Orders..` : `Your Orders..`}</h1>
          {orders.length > 0 ?
            <div className='mt-9 mx-auto flex flex-col gap-12'>

              {orders.map((order, index) => <Order key={index} id={order._id} items={order.books} customer={order.customer} orderDate={order.orderDate} totalItems={order.totalItems} totalPrice={order.totalPrice} location={order.location._id} user={userData} status={order.status} accessToken={accessToken} setReturnOrderId={setReturnOrderId} setIsModalOpen={setIsModalOpen} selectedLocation={selectedLocation} returnLocation={order.returnLocation ? order.returnLocation._id : null} setReturnItem={setReturnItem}></Order>)}
            </div>
            : <h1 className='text-5xl mt-20'>No Orders..</h1>}
        </div>
        <div className='w-[45%] mx-auto'>
          <h1 className='mt-5 text-2xl font-semibold'>{userData.is_admin ? `Customer Returns..` : `Your Returns / Cancellations..`}</h1>
          {returns.length > 0 ?
            <div className='mt-9 mx-auto flex flex-col gap-12'>

              {returns.map((order, index) => <Order key={index} id={order._id} items={order.books} customer={order.customer} orderDate={order.orderDate} totalItems={order.totalItems} totalPrice={order.totalPrice} location={order.location._id} user={userData} status={order.status} accessToken={accessToken} setReturnOrderId={setReturnOrderId} setIsModalOpen={setIsModalOpen} selectedLocation={selectedLocation} returnLocation={order.returnLocation ? order.returnLocation._id : null} isOrderExpired={true}></Order>)}
            </div>
            : <h1 className='text-5xl mt-10'>No Returns / Cancellations..</h1>}
        </div>
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='w-[40%] rounded-lg ring-1 p-9 bg-white'>
            <h1 className='font-medium text-xl'>Please Select a Store to return..</h1>
            <hr />
            <div className='flex items-center justify-center gap-2 mt-5'>
              <label htmlFor='modalInput' className='block text-sm float-start font-medium leading-6 text-gray-900'>
                Store:
              </label>
              <select
                onChange={(e) => setSelectedReturnLocation(e.target.value)}
                id="country"
                name="country"
                value={selectedReturnLocation}
                autoComplete="country-name"  // Use camelCase for autoComplete
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {locations.map((item) => <option value={item._id}>{item.name}</option>)}
              </select>

            </div>
            <div className='flex justify-end gap-2'>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false) }}
                className="flex justify-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Close
              </button>
              <button
                type='button'
                onClick={saveReturnLocation}
                className='flex justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
