import React, { useState } from 'react'
import { backendUrl, firebaseUrl } from '../constants'
import axios from 'axios';

export default function CartItem({ cartItem, userId, accessToken, loadCartItems, removeItem }) {

    const price = cartItem.book.price;
    const [quantity, setQuantity] = useState(cartItem.quantity);
    const [totalItemPrice, setTotalPrice] = useState(cartItem.totalPrice);

    function reduceQuantity() {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
            setTotalPrice(price * (quantity - 1));
            updateCartItem(quantity - 1, price * (quantity - 1));
        }
    }

    function increaseQuantity() {
        if (quantity < 30) {
            setQuantity((prevQuantity) => prevQuantity + 1);
            setTotalPrice(price * (quantity + 1));
            updateCartItem(quantity + 1, price * (quantity + 1));
        }
    }

    function updateCartItem(quant, tp) {
        axios.put(`${backendUrl}/cart/modifyQuantity`,
            {
                userId,
                bookId: cartItem.book._id,
                quantity: quant,
                totalPrice: tp.toFixed(2)
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(() => {
                loadCartItems();
            })
    }

    return (
        <div className='flex p-5 ring-1 justify-between rounded-lg'>
            <div className='flex'>
                <div className='h-52 rounded-md shadow-[0px_3px_15px_-5px_rgb(0,0,0)]'>
                    <img src={firebaseUrl(cartItem.book.image)} alt="" className='h-full rounded-lg' />
                </div>
                <div className='ml-10 text-left my-auto space-y-2'>
                    <h1 className='font-semibold text-lg'>{cartItem.book.name}</h1>
                    <p className='text-md text-zinc-400'>by dasd</p>
                    <h1 className=''>$ {`${cartItem.book.price}`}</h1>
                    <div className='inline-flex h-7'>
                        <h3 className='font-semibold mr-2'>Quantity: </h3>
                        <button
                            onClick={reduceQuantity}
                            className='rounded-l-md bg-indigo-600 text-white shadow-sm pb-1 w-6 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        >
                            <span className='font-bold'>-</span>
                        </button>
                        <input type="text"
                            readOnly
                            className='w-8 p-1 text-center focus:ring-0'
                            value={quantity}
                        />
                        <button
                            onClick={increaseQuantity}
                            className='rounded-r-md bg-indigo-600 text-white shadow-sm pb-1 w-6 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        >
                            <span className='font-bold'>+</span>
                        </button>
                    </div>
                    <h1>Total Price for this: <span>$ {`${totalItemPrice.toFixed(2)}`}</span></h1>
                </div>
            </div>
            <button
                onClick={() => { removeItem(cartItem._id) }}
                className='rounded-md float-end bg-red-600 text-white shadow-sm h-8 px-2 hover:bg-red-500'
            >
                Remove
            </button>
        </div>
    )
}
