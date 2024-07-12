# Project Management Pro Setup Guide

This guide covers the necessary steps to set up the Project Management Pro application on a new machine and environment. The application consists of a frontend and a backend, each requiring specific environment variables and setup procedures.


![Setup Guide](./frontend/public/CleanShot 2024-07-12 at 13.52.24.gif)

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js (preferably version 18 as specified in the Dockerfiles).

## Step 1: Set Up Environment Variables

We have a directory `/env_examples` where you can find `env_example_backend.txt` and `env_example_frontend.txt`. Use these files as references to create your own `.env` files for both the backend and frontend.

### Backend Environment Variables

Navigate to the backend directory and create a `.env` file based on `env_example_backend.txt`:

    cp env_examples/env_example_backend.txt backend/.env

### Frontend Environment Variables

Navigate to the frontend directory and create a `.env` file based on `env_example_frontend.txt`:

    cp env_examples/env_example_frontend.txt frontend/.env

Edit the `frontend/.env` file to include any environment variables required by your Next.js application, such as API endpoints.

## Step 2: Install Dependencies

Before running the application, ensure you have all the necessary dependencies installed in both the frontend and backend directories.

### Backend Dependencies

Navigate to the backend directory and run:

cd backend  
npm install

### Frontend Dependencies

Navigate to the frontend directory and run:

cd frontend  
npm install

## Step 3: Start the Application

With all dependencies installed and environment variables set up, you can start the application using Docker Compose. This will build and run both the frontend and backend services.

docker-compose up --build

## Accessing the Application

After both the backend and frontend services are up and running, you can access the application:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API (example endpoint): [http://localhost:4000/api/projects](http://localhost:4000/api/projects)

## Additional Commands

To run backend and frontend tests, navigate to the respective directories and use the following commands:

### Backend Tests

cd backend  
npm test

### Frontend Tests

cd frontend  
npm test

Ensure you have the necessary dependencies installed by running `npm install` in both the backend and frontend directories if you're running tests outside Docker containers.
