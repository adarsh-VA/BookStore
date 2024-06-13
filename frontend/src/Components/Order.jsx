import React, { useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import axios from 'axios';
import { backendUrl } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Order({ id, items, customer, orderDate, totalItems, totalPrice, user, location, status, accessToken, setReturnOrderId, setIsModalOpen, selectedLocation, returnLocation, isOrderExpired, setReturnItem }) {

    const [orderStatus, setOrderStatus] = useState(status);
    const [expiredPayment, setExpiredPayment] = useState(status);
    const navigate = useNavigate();
    const locations = useSelector((state) => state.store.locations);
    const formattedOrderDate = new Date(orderDate).toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    function formatRemainingTime(remainingTime) {
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    function calculateFifteenDaysFromOrder(orderDate) {
        const fifteenDaysInMillis = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
        const fifteenDaysFromOrder = new Date(orderDate.getTime() + fifteenDaysInMillis);
        const currentDate = new Date();

        // Calculate the difference in days
        const timeDifference = fifteenDaysFromOrder.getTime() - currentDate.getTime();
        const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

        return daysDifference;
    }

    const orderTime = new Date(orderDate);
    const cancellationTime = new Date(orderTime.getTime() + 60 * 60 * 1000);
    const [remainingTime, setRemainingTime] = useState(cancellationTime - new Date());

    function handlePicked() {
        axios.put(`${backendUrl}/orders/modifyStatus/${id}`,
            {
                status: "Picked"
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                setOrderStatus("Picked");
            })
    }

    function handleReturn() {
        setReturnOrderId(id);
        setIsModalOpen(true);
    }

    function acceptReturn() {
        axios.delete(`${backendUrl}/orders/orderReturn/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                axios.put(`${backendUrl}/orders/modifyStatus/${id}`,
                {
                    status: "Return Successful"
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(() => {
                    setOrderStatus("Return Successful");
                    window.location.reload();
                })
            })
    }

    function cancelOrder() {
        axios.delete(`${backendUrl}/orders/cancel-order/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                navigate('/home')
            })
    }

    function getPayment(){
        axios.get(`${backendUrl}/payments/paymentByOrder/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        })
        .then((res)=>{
            setExpiredPayment(res.data);
        })
    }

    useEffect(() => {
        if (user.is_admin) {

        }
        else {
            const timer = setInterval(() => {
                const currentTime = new Date();
                const newRemainingTime = cancellationTime - currentTime;
                setRemainingTime(newRemainingTime);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [cancellationTime]);

    useEffect(()=>{
        if(isOrderExpired){
            getPayment();
        }
    },[])

    return (
        <div className='ring-1 rounded-md p-5'>
            <div className='w-96 mx-auto flex justify-between text-left gap-5 text-md font-semibold'>
                <div>
                    <h1>Total Items Ordered:</h1>
                    <h1>{isOrderExpired ? `Total Refund Price:`:`Total Price:`}</h1>
                    <h1>Ordered Date:</h1>
                    <h1>Store Location:</h1>
                    <h1>Status:</h1>
                    {user.is_admin && <h1>Customer Name:</h1>}
                    {returnLocation && <h1>Return Location:</h1>}
                    {isOrderExpired && <h1>Card Number:</h1>}
                </div>
                <div>
                    <h1>{totalItems}</h1>
                    <h1>$ {totalPrice}</h1>
                    <h1>{formattedOrderDate}</h1>
                    <h1>{locations.find(item => item._id == location).name}</h1>
                    <h1>{orderStatus}</h1>
                    {user.is_admin && <h1>{customer.name}</h1>}
                    {returnLocation && <h1>{locations.find(item => item._id == returnLocation).name}</h1>}
                    {isOrderExpired && <h1>{expiredPayment.cardNumber}</h1>}
                </div>
            </div>
            {
                !user.is_admin && status == "Return Requested" &&
                <div className='flex justify-center items-center mt-2 mb-2 gap-2 ring-1 w-[70%] mx-auto ring-yellow-600'>
                    <h1 className='text-md font-semibold'>Note: </h1>
                    <h1>Your Money will be refunded after return acceptance.</h1>
                </div>
            }


            {!user.is_admin && remainingTime > 0 && status == "Ordered" &&
                <div className='flex justify-center items-center mt-2 gap-2 ring-1 w-[70%] mx-auto ring-yellow-600'>
                    <h1 className='text-md font-semibold'>Note: </h1>
                    <h1>Your Cancellation Remaining Time is: {formatRemainingTime(remainingTime)}</h1>
                </div>
            }

            {!user.is_admin && status == "Picked" && calculateFifteenDaysFromOrder(orderTime) >= 0 &&
                <div className='flex justify-center items-center mt-2 gap-2 ring-1 w-[70%] mx-auto ring-yellow-600'>
                    <h1 className='text-md font-semibold'>Note: </h1>
                    <h1>Your return back Remaining Time is: {calculateFifteenDaysFromOrder(orderTime)} days</h1>
                </div>
            }

            <div className='flex justify-between items-center mb-2'>
                <h1 className='text-left ml-2 text-lg font-semibold'>Items:</h1>
                {!user.is_admin && remainingTime > 0 && status == "Ordered" &&
                    <button
                        onClick={cancelOrder}
                        className='rounded-md float-end bg-red-600 text-white shadow-sm h-8 px-2 hover:bg-red-500'
                    >
                        Cancel
                    </button>
                }
                {user.is_admin && orderStatus == "Ordered" &&
                    <button
                        onClick={handlePicked}
                        className='rounded-md float-end bg-indigo-600 text-white shadow-sm h-8 px-2 hover:bg-indigo-500'
                    >
                        Picked
                    </button>
                }
                {user.is_admin && orderStatus == "Return Requested" && (selectedLocation == returnLocation || selectedLocation == "All") &&
                    <button
                        onClick={acceptReturn}
                        className='rounded-md float-end bg-indigo-600 text-white shadow-sm h-8 px-2 hover:bg-indigo-500'
                    >
                        Accept Return
                    </button>
                }
                {!user.is_admin && status == 'Picked' && calculateFifteenDaysFromOrder(orderTime) >= 0 &&
                    <button
                        onClick={handleReturn}
                        className='rounded-md float-end bg-indigo-600 text-white shadow-sm h-8 px-2 hover:bg-indigo-500'
                    >
                        Return
                    </button>
                }
            </div>
            <hr className='mb-2' />
            <div className='flex flex-col gap-2'>
                {items.map((item, index) => <OrderItem key={index} item={item} user={user} status={status} orderTime={orderTime} orderId={id} setReturnOrderId={setReturnOrderId} setIsModalOpen={setIsModalOpen} setReturnItem={setReturnItem} />)}
            </div>

        </div>
    )
}
