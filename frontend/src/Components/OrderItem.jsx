import React, { useEffect, useState } from 'react'
import { firebaseUrl } from '../constants'

export default function OrderItem({ item, user, status, orderId,  orderTime, setReturnOrderId, setIsModalOpen, setReturnItem }) {

    var [displayedAuthors, setDisplayedAuthors] = useState('modda bey');
    function calculateFifteenDaysFromOrder(orderDate) {
        const fifteenDaysInMillis = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
        const fifteenDaysFromOrder = new Date(orderDate.getTime() + fifteenDaysInMillis);
        const currentDate = new Date();

        // Calculate the difference in days
        const timeDifference = fifteenDaysFromOrder.getTime() - currentDate.getTime();
        const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

        return daysDifference;
    }

    function handleReturn() {
        setReturnItem(item);
        setReturnOrderId(orderId);
        setIsModalOpen(true);
    }

    return (
        <div className='flex p-5 ring-1 justify-between rounded-lg'>
            <div className='flex w-full justify-between'>
                <div className='flex'>
                    <div className='h-48 rounded-md shadow-[0px_3px_15px_-5px_rgb(0,0,0)]'>
                    { item.book.itemCondition == 'Used' && <h1 className='absolute z-1 font-bold bg-orange-400 rounded-lg w-16 h-7 ml-2 mt-2'>Used</h1>}
                        <img src={firebaseUrl(item.book.image)} alt="" className='h-full rounded-lg' />
                    </div>
                    <div className='ml-10 text-left my-auto space-y-2'>
                        <h1 className='font-semibold text-lg'>{item.book.name}</h1>
                        <h1>$ {item.book.price}</h1>
                        <div className='inline-flex h-7'>
                            <h3 className='font-semibold mr-2'>Quantity: </h3>
                            <h1>{item.quantity}</h1>
                        </div>
                        <h1 className='font-semibold'>Total Price for this: <span>$ {(item.book.price * item.quantity).toFixed(2)}</span></h1>
                    </div>
                </div>
                {!user.is_admin && status == 'Picked' && calculateFifteenDaysFromOrder(orderTime) >= 0 &&
                        <button
                            onClick={handleReturn}
                            className='rounded-md float-end bg-indigo-600 text-white shadow-sm h-8 px-2 hover:bg-indigo-500'
                        >
                            Return
                        </button>
                }
            </div>
        </div>
    )
}
