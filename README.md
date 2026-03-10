Tech Stack

Frontend

Next.js (App Router)

React

Backend

Node.js

Express.js

MongoDB

Mongoose

Features
Backend

Create Events

View All Events

Check Seat Availability by Section and Row

Purchase Tickets

Prevent Double Booking

Automatic Seat Generation

Frontend

View all events

View event seat availability

Purchase tickets

Display booking success or failure

Show group discount message when booking 4 or more tickets

Project Structure
project-root
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── app
│   │   ├── page.js
│   │   └── events
│   │        └── [id]
│   │             └── page.js
│   ├── components
│   │   ├── EventCard.js
│   │   └── PurchaseForm.js
│   └── package.json
│
└── README.md
Backend Setup

Navigate to backend folder

cd backend

Install dependencies

npm install

Make .env in backend folder
given credentials on mail

Start the backend server

npm run start

Server will run on:

http://localhost:8000
Frontend Setup

Navigate to frontend folder

cd frontend

Install dependencies

npm install

Start Next.js development server

npm run start

Frontend runs on:

http://localhost:3000
