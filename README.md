# Location-Based Service Search System

## Overview
This project is a RESTful API built with Express.js and TypeScript, allowing users to search for services based on location, name, and service type. It also provides functionality for managing favorite places.

## Features
- Search for services within a specified radius
- Add/remove services to/from favorites
- View list of favorite services
- Location-based search using Haversine formula

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

## Setup

### Option 1: Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="mysql://root:password@localhost:3306/location_services"
   PORT=3000
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```
6. Build the project:
   ```bash
   npm run build
   ```
7. Start the server:
   ```bash
   npm start
   ```

### Option 2: Docker Setup
1. Clone the repository
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build the Node.js application
   - Start a MySQL database
   - Run database migrations
   - Seed the database
   - Start the application server

3. To stop the containers:
   ```bash
   docker-compose down
   ```

4. To view logs:
   ```bash
   docker-compose logs -f
   ```

## API Endpoints

### Service Search
- **GET /services/search**
  - Query Parameters:
    - `name`: Service name (optional)
    - `type`: Service type (optional)
    - `lat`: Latitude
    - `lng`: Longitude
    - `radius`: Search radius in kilometers
  - Example: `/services/search?name=Winmart&type=supermarket&lat=10.762622&lng=106.660172&radius=1`

### Favorites Management
- **POST /favorites**
  - Body:
    ```json
    {
      "userId": 1,
      "serviceId": 1
    }
    ```
- **DELETE /favorites/:userId/:serviceId**
- **GET /favorites/:userId**

## Testing
Run tests with:
```bash
npm test
```

## Development
For development with hot-reload:
```bash
npm run dev
```

## Docker Commands Reference
- Build and start containers: `docker-compose up --build`
- Start containers in background: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild a specific service: `docker-compose up -d --build app`
- Access MySQL container: `docker-compose exec db mysql -u root -p`
- Access application container: `docker-compose exec app sh` 