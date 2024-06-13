const mongoose = require('mongoose');
const User = require('./models/user.model');
const Author = require('./models/author.model');
const Location = require('./models/location.model');
const Literature = require('./models/literature.model');
const Book = require('./models/book.model');

// Connect to MongoDB
mongoose.connect('mongodb+srv://VA:08112000@cluster1.2ayqkol.mongodb.net/BookStore?retryWrites=true&w=majority&appName=Cluster1')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define the data you want to seed
const adminUserData = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin',
    gender: 'Male',
    is_admin: true,
};

const normalUserData = {
    name: 'User',
    email: 'user@gmail.com',
    password: 'user',
    gender: 'Male',
    is_admin: false,
};

const locations = [
    { name: 'New York, USA.' },
    { name: 'Dallas, Texas.' },
    { name: 'Kansas, Missouri.' }
];

const authors = [
    { name: 'J.K. Rowling' },
    { name: 'Stephen King' },
    { name: 'J.R.R. Tolkien' },
    { name: 'Agatha Christie' },
    { name: 'George Orwell' },
    { name: 'Harper Lee' },
    { name: 'Dan Brown' },
    { name: 'Leo Tolstoy' },
    { name: 'Jane Austen' },
    { name: 'Mark Twain' }
];

const Genres = [
    { name: 'Fantasy' },
    { name: 'Mystery' },
    { name: 'Science Fiction' },
    { name: 'Romance' },
    { name: 'Thriller' }
];

const famousBookNames = [
    'To Kill a Mockingbird',
    '1984',
    'Pride and Prejudice',
    'The Great Gatsby',
    'The Catcher in the Rye',
    'The Hobbit',
    'The Lord of the Rings',
    'Animal Farm',
    'The Chronicles of Narnia',
    'The Grapes of Wrath',
    'Catch-22',
    'Brave New World',
    'Moby-Dick',
    'Frankenstein',
    'Dracula',
    'The Picture of Dorian Gray',
    'The Adventures of Huckleberry Finn',
    'The Adventures of Tom Sawyer',
    'Alice\'s Adventures in Wonderland',
    'Jane Eyre'
];

function getRandomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// Helper function to get random date between Jan 2023 and Dec 2023
function getRandomDate() {
    const start = new Date('2023-01-01');
    const end = new Date('2023-12-31');
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


// Seed the database
async function seedDatabase() {
  try {
    await User.create(adminUserData);
    await User.create(normalUserData);
    await Location.insertMany(locations);
    await Author.insertMany(authors);
    await Literature.insertMany(Genres);

    const myAuthors = await Author.find();
    const myCategories = await Literature.find();
    const myLocations = await Location.find();

    const books = [];
    for (let i = 0; i < 20; i++) {
      const randomAuthorIds = [myAuthors[Math.floor(Math.random() * myAuthors.length)]._id];
      const randomCategoryIds = [myCategories[Math.floor(Math.random() * myCategories.length)]._id];
      const randomLocationIds = [myLocations[Math.floor(Math.random() * myLocations.length)]._id];
      const randomPrice = getRandomPrice(2, 5);
      const randomDate = getRandomDate();
      const imageName = `book${i + 1}.jpg`;
      const bookName = famousBookNames[i];

      const book = {
        name: bookName,
        price: randomPrice,
        image: imageName,
        authors: randomAuthorIds,
        literatures: randomCategoryIds,
        availableLocations: randomLocationIds,
        publishedDate: randomDate,
        totalAvailability: 25,
        itemCondition: 'new'
      };
      books.push(book);
    }
    await Book.insertMany(books);


  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Call the function to seed the database
seedDatabase();
