# Location-Based Service Search System

## Overview
This project is a RESTful API built with Express.js and TypeScript, allowing users to search for services based on location, name, and service type. It also provides functionality for managing favorite places.

## Features
- Search for services within a specified radius
- Add/remove services to/from favorites
- View list of favorite services
- Location-based search using Haversine formula
- Type-safe request/response handling
- Comprehensive input validation
- Transaction-based test isolation
- Swagger API documentation
- Docker containerization

## Project Structure
```
location-service/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── types/          # TypeScript type definitions
│   ├── tests/          # Test files
│   └── utils/          # Utility functions
├── prisma/             # Database schema and migrations
├── docker/             # Docker configuration files
└── docs/              # Documentation
```

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
# Database
DATABASE_URL="mysql://root:password@localhost:3306/location_services"

# Server
PORT=3000
NODE_ENV=development

# Docker (optional)
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=location_services
```

## Setup

### Option 1: Local Development
1. Clone the repository git@github.com:huy1992nd/location-service.git
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the required environment variables
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

## API Documentation
The API documentation is available at `/api-docs` when the server is running. It provides detailed information about:
- Available endpoints
- Request/response formats
- Authentication requirements
- Example requests and responses

## API Endpoints

### Service Search
- **GET /services/search**
  - Request Body:
    ```json
    {
      "name": "string",     // optional
      "type": "string",     // optional
      "latitude": number,
      "longitude": number,
      "radius": number      // in kilometers
    }
    ```
  - Response:
    ```json
    {
      "services": [
        {
          "id": number,
          "name": "string",
          "type": "string",
          "latitude": number,
          "longitude": number,
          "address": "string"
        }
      ]
    }
    ```

### Favorites Management
- **POST /favorites**
  - Request Body:
    ```json
    {
      "userId": number,
      "serviceId": number
    }
    ```
  - Response:
    ```json
    {
      "message": "Service added to favorites"
    }
    ```
  - Status Codes:
    - 201: Created
    - 404: User or Service not found
    - 409: Service already in favorites
    - 400: Bad Request

- **DELETE /favorites/:userId/:serviceId**
  - Response:
    ```json
    {
      "message": "Service removed from favorites"
    }
    ```
  - Status Codes:
    - 200: OK
    - 404: Not Found
    - 400: Bad Request

- **GET /favorites/:userId**
  - Response:
    ```json
    {
      "services": [
        {
          "id": number,
          "name": "string",
          "type": "string",
          "latitude": number,
          "longitude": number,
          "address": "string"
        }
      ]
    }
    ```
  - Status Codes:
    - 200: OK
    - 404: User not found
    - 400: Bad Request

## Testing
The project includes comprehensive test coverage with the following features:
- Transaction-based test isolation
- Automatic test data setup and cleanup
- Validation testing
- Error handling testing

Run tests with:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
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
- Run tests in container: `docker-compose exec app npm test`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## swager document URL 
https://location-api.huynq.online/api-docs/