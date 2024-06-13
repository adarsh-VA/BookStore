import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import axios from 'axios'
import { backendUrl } from '../constants'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Cart() {
    const userId = useSelector((state) => state.user.user._id);
    const token = useSelector((state) => state.user.token);
    const [cartItems, setCartItems] = useState(null);
    const accessToken = Cookies.get('accessToken');
    const [cartId, setCartId] = useState(null);
    const SelectedLocation = Cookies.get('storeLocation');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState(null);
    const [holderName, setHolderName] = useState(null);
    const [cvv, setCvv] = useState(null);
    const [isPurchaseButtonDisabled, setIsPurchaseButtonDisabled] = useState(true);
    const navigate = useNavigate();

    function loadCartItems() {
        axios.get(`${backendUrl}/cart/all/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if(res.data){
                    setCartId(res.data._id);
                    if(res.data.items.length == 0){   
                        setCartItems(null);
                    }
                    else{
                        setCartItems(res.data.items);
                    }
                }
            })
    }

    function removeItem(itemId){
        axios.delete(`${backendUrl}/cart/remove/${userId}/${itemId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res)=>{
            if(cartItems.length == 1){
                setCartItems(null);
            }
            else{
                setCartItems(cartItems.filter(item => item._id != itemId));
            }
        })
    }

    function confirmPurchase() {
        axios.post(`${backendUrl}/orders/add-order`,{
            customer:userId, 
            books: cartItems.map(item => ({book: item.book._id,quantity: item.quantity})),
            totalPrice: (cartItems.reduce((sum, item) => sum + item.totalPrice, 0)).toFixed(2),
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            status:"Ordered",
            location: SelectedLocation
        },{
            headers: {  
                Authorization: `Bearer ${accessToken}`
            },
        })
        .then((res)=>{
            axios.post(`${backendUrl}/payments/addPayment`,
                {
                    order: res.data._id,
                    customer: userId,
                    amount: (cartItems.reduce((sum, item) => sum + item.totalPrice, 0)).toFixed(2),
                    cardNumber,
                    holderName,
                    cvv
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );
            axios.delete(`${backendUrl}/cart/remove/${userId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(()=>{
                setCartItems(null);  
                navigate('/orders');
            })
        });

    }

    useEffect(() => {
        const isFormValid = cardNumber && holderName && cvv
        setIsPurchaseButtonDisabled(!isFormValid);
    }, [cardNumber, holderName, cvv]);

    useEffect(() => {
        loadCartItems();
    }, [])

    return (
        <div className='pt-16'>
            <h1 className='text-2xl font-semibold'>Your Cart..</h1>
            {
                cartItems ? 

                <div className='flex'>
                    <div className='w-[40%]'>
                        <div className='p-10 mx-14'>
                            <h1 className='text-xl'>Your Cart Summary</h1>
                            <div className='rounded-md mt-5 ring-1 p-5'>
                                <div className='w-72 mx-auto font-semibold'>
                                    <div className='flex justify-between'>
                                        <h1>Total Items:</h1>
                                        <h1>{`${cartItems.reduce((sum, item) => sum + item.quantity, 0)}`}</h1>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h1>Total Price:</h1>
                                        <h1>$ {`${(cartItems.reduce((sum, item) => sum + item.totalPrice, 0)).toFixed(2)}`}</h1>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className='rounded-md w-72 mt-5 bg-indigo-600 px-8 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                    Order Items
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='w-[60%] p-10'>
                        <h1 className='text-xl mb-5'>Items in Cart</h1>
                        <div className='flex flex-col gap-5'>
                            {cartItems.map((item, index) => <CartItem key={index} cartItem={item} userId={userId} accessToken={token} loadCartItems={loadCartItems} removeItem={removeItem} />)}
                        </div>
                    </div>
                </div>
           : <h1 className='text-5xl mt-20'>No items in cart.....</h1> }

           {/* Modal */}
           {isPaymentModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='w-[40%] rounded-lg ring-1 p-7 bg-white'>
                        <h1 className='font-medium text-xl text-center'>Your Card Details Please.</h1>
                        <hr />
                        <div className='mt-2 space-y-2'>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    Card Number:
                                </label>
                                <input
                                    type="number"
                                    name="cardNumber"
                                    id='cardNumber'
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    Card Holder Name:
                                </label>
                                <input
                                    type="text"
                                    name="holderName"
                                    id='holderName'
                                    onChange={(e) => setHolderName(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className='flex items-center gap-2 w-full'>
                                <label htmlFor="stallType" className="text-sm w-52 float-start font-medium leading-6 text-gray-900">
                                    CVV Number:
                                </label>
                                <input
                                    type="number"
                                    name="cvv"
                                    id='cvv'
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 mx-10'>
                            <button
                                type="button"
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="flex justify-center mt-4 w-full rounded-md bg-red-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                                Cancel
                            </button>

                            <button
                                type='button'
                                onClick={() => { confirmPurchase() }}
                                disabled={isPurchaseButtonDisabled}
                                className='flex justify-center mt-4 w-full rounded-md bg-indigo-600 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed'
                            >
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
