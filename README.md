# GigFlow - Freelance Marketplace

**Live Deployment:** [https://gig-flow-phi.vercel.app](https://gig-flow-phi.vercel.app)

GigFlow is a modern, real-time freelance marketplace connecting clients with skilled professionals. Built with the MERN stack (MongoDB, Express, React, Node.js), it features seamless user authentication, gig management, and real-time bidding updates.

## Features

- **User Authentication**: Secure Signup and Login using JWT and HTTP-only cookies.
- **Gig Management**: Browse, create, and manage freelance gigs.
- **Real-time Bidding**: Instant updates on gig bids using WebSockets (Socket.io).
- **Modern UI**: Responsive and clean interface built with React, Tailwind CSS, and Lucide Icons.
- **Robust Backend**: RESTful API built with Express and MongoDB with input validation.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, JWT
- **Validation**: Joi (Backend), React Hook Form (Frontend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)

### Backend Setup

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=8080
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```

4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:8080`.

### Frontend Setup

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
