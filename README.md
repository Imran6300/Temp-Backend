# Live Temperature Monitoring Sensor Backend

This repository contains the backend server for a live temperature monitoring system. It handles sensor data ingestion, storage, and real-time dashboard updates using Node.js, Express, MongoDB (via Mongoose), and Socket.IO for WebSocket communication. The system allows sensors to send temperature data via POST requests and provides a dashboard endpoint to retrieve aggregated or latest data. Real-time updates are pushed to connected clients via WebSockets.

## Features

- **Real-time Data Ingestion**: Accept temperature data from sensors via API.
- **Data Storage**: Store temperature readings in a MongoDB database.
- **Dashboard Access**: Retrieve temperature data for visualization.
- **Live Updates**: Use WebSockets to broadcast new temperature readings to connected clients in real-time.
- **Scalable Deployment**: Deployed on Railway.app for production use.

## Tech Stack

- **Node.js**: Runtime environment.
- **Express.js**: Web framework for handling HTTP requests.
- **Mongoose**: ODM for MongoDB to manage temperature data models.
- **Socket.IO**: For real-time, bidirectional communication.
- **MongoDB**: Database for storing temperature readings (configure your own connection string).
- Other dependencies: As listed in `package.json` (e.g., body-parser, cors).

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/your-username/temp-backend.git
   cd temp-backend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000  # Or your preferred port
   MONGO_URI=mongodb://localhost:27017/tempdb  # Replace with your MongoDB connection string
   ```
   For production, use a secure MongoDB Atlas URI or similar.

4. **Start the Server**:
   ```
   npm start
   ```
   The server will run on `http://localhost:3000` (or the specified PORT).

## Usage

### API Endpoints

- **POST /api/sensor/data**: Send temperature data from sensors.
  - **Request Body** (JSON):
    ```
    {
      "temperature": 25.5,
      "timestamp": "2023-10-01T12:00:00Z"  // Optional; defaults to current time
    }
    ```
  - **Response**: 201 Created on success.
  - **Production URL**: `https://temp-backend-production-4599.up.railway.app/api/sensor/data`

- **GET /api/dashboard**: Retrieve the latest or aggregated temperature data for the dashboard.
  - **Query Parameters** (optional):
    - `limit`: Number of recent readings to return (e.g., `?limit=10`).
    - `from`: Start timestamp for range query (e.g., `?from=2023-10-01T00:00:00Z`).
    - `to`: End timestamp for range query.
  - **Response**: JSON array of temperature readings.
  - **Production URL**: `https://temp-backend-production-4599.up.railway.app/api/dashboard`

### Real-time Updates with WebSockets

- Connect to the WebSocket server at `/` (e.g., `ws://localhost:3000`).
- Listen for the `newTemperature` event to receive live updates.
- Example Client (using Socket.IO):
  ```javascript
  const io = require('socket.io-client');
  const socket = io('http://localhost:3000');

  socket.on('newTemperature', (data) => {
    console.log('New temperature:', data);
  });
  ```

### File Structure

The project is structured as a standard Node.js/Express application with separation of concerns:

```
TempProject
├── back
│   ├── controllers
│   │   ├── dashboard.controller.js  # Handles logic for dashboard data retrieval
│   │   └── sensor.controller.js     # Handles logic for sensor data ingestion
│   ├── models
│   │   └── temperature.model.js     # Mongoose schema for temperature data
│   ├── node_modules                 # Installed dependencies (git-ignored)
│   ├── routes
│   │   ├── dashboard.routes.js      # Routes for dashboard API
│   │   └── sensor.routes.js         # Routes for sensor data API
│   ├── sockets
│   │   └── socket.js                # WebSocket setup and event handlers
├── package-lock.json                # Lockfile for dependencies
├── package.json                     # Project metadata and dependencies
└── server.js                        # Main entry point; sets up Express server, routes, and Socket.IO
```

- **controllers/**: Contains business logic for handling requests (e.g., validating input, interacting with models).
- **models/**: Defines database schemas (e.g., Temperature model with fields like value and timestamp).
- **routes/**: Defines API endpoints and maps them to controllers.
- **sockets/**: Manages WebSocket connections and broadcasts events.
- **server.js**: Initializes the app, connects to MongoDB, sets up middleware, routes, and starts the server.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.
