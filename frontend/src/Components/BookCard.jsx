import React from 'react'
import { firebaseUrl } from '../constants'
import { Link } from 'react-router-dom';

export default function BookCard({ book, addToCart, isAdmin, deleteBook, booksInCart, openExplore }) {

  const MAX_AUTHORS_TO_DISPLAY = 2;

  const authors = book.authors.map(author => author.name);

  let displayedAuthors = authors.slice(0, MAX_AUTHORS_TO_DISPLAY).join(', ');

  if (authors.length > MAX_AUTHORS_TO_DISPLAY) {
    displayedAuthors += ', ...';
  }

  function handleAddCart() {
    const data = {
      bookId: book._id,
      price: book.price
    }
    addToCart(data);
  }

  return (
    <div className='p-4 w-52 rounded-md ring-1 flex flex-col justify-between'>
      {book.itemCondition == 'Used' && <h1 className='absolute z-10 font-bold bg-orange-400 rounded-lg w-16 h-7 ml-2 mt-2'>Used</h1>}
      <div className='h-56 mb-3 rounded-md shadow-[0px_3px_15px_-5px_rgb(0,0,0)] relative'>
        <img src={firebaseUrl(book.image)} alt="" className='w-full h-full rounded-md' />
      </div>
      <h3 className='font-bold'>{book.name}</h3>
      <p className='text-sm text-zinc-500'>by {displayedAuthors}</p>
      <h4>${book.price}</h4>
      <button className='text-blue-700 underline w-full mb-3' onClick={() => openExplore(book._id)}>Explore..</button>
      {
        isAdmin ?
          <button
            onClick={() => { deleteBook(book._id) }}
            className='rounded-md bg-red-600 px-8 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500'>
            Remove
          </button>

          :

          booksInCart.indexOf(book._id) >= 0 ?
            <Link
              to={'/cart'}
              className='rounded-md bg-indigo-600 px-8 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Go to cart
            </Link>

            :
            <button
              onClick={handleAddCart}
              className='rounded-md bg-indigo-600 px-8 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Add to cart
            </button>

      }
    </div>
  )
}
