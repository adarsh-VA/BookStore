// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { addBook, editBook, deleteBook, addAuthor, addLiterature, allBooks, allAuthors, allLiteratures, booksByLocation, booksByLiterature, booksByLiteratureandLocation } = require('../controllers/book.controller');
const verifyToken  = require('../middlewares/auth');
const upload = require('../middlewares/multer');

router.use(verifyToken);

// Book routes
router.post('/add-book', upload.single("image"), addBook);
router.get('/all-books', allBooks);
router.get('/booksByLocation/:locationId', booksByLocation);
router.get('/booksByLiteratureAndLocation/:literatureId/:locationId', booksByLiteratureandLocation);
router.get('/booksByLiterature/:literatureId', booksByLiterature);
router.get('/all-authors',allAuthors);
router.get('/all-literatures',allLiteratures);
router.put('/edit-book/:id', editBook);
router.delete('/delete-book/:id', deleteBook);
router.post('/add-author', addAuthor);
router.post('/add-literature', addLiterature);

module.exports = router;
