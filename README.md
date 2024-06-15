<div align='center'>
  <h1>Bookstore Management</h1>
</div>

A bookstore management app where users can buy and return books, featuring admin and user logins, full CRUD operations, and all typical bookstore application features.

**Deployed on Vercel:** https://bookstore-va.vercel.app/

**Test Logins**
- *Customer Login:* user@gmail.com / user
- *Admin Login:* admin@gmail.com / admin

## Features

- Robust authorization and authentication for secure access.
- Comprehensive support for both customers and administrators.
- Store location selection for convenient book purchases.
- Book sorting by genres with easy addition to cart.
- Flexible return policy allowing book returns within one week at any store location.
- Centralized administration for managing all purchases and returns across locations.


## Tech Stack

**Client:** React, Redux Toolkit, React Router, TailwindCSS.

**Server:** Node, Express, MongoDB, Multer, JsonWebTokens.


## Installation & Setup

Install both backend and frontend with npm

```bash
  cd 'folder name'
  npm install
```

After installation, a file named `seeds.js` will populate default books data. Run this file with node in the backend directory. Before the run makesure that you have MongoDB installed.

```bash
  node src/seeds.js
```

Now time to run both backend and frontend on different terminals.

Backend run command.
```bash
  cd backend
  npm run dev
```
Frontend run command.
```bash
  cd frontend
  npm start
```
