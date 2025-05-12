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
│   ├── models/         # Data models
│   ├── tests/          # Test files
│   ├── interceptors/   # Request/Error interceptors
│   ├── utils/          # Utility functions (logger, etc.)
│   ├── app.ts          # Application entry point
│   └── swagger.ts      # API documentation setup
├── prisma/             # Database schema and migrations
├── logs/              # Application logs
│   ├── error.log      # Error level logs
│   └── combined.log   # All application logs
├── .github/            # GitHub workflows and configurations
├── docker/             # Docker configuration files
├── Dockerfile          # Docker build instructions
├── docker-compose.yml  # Docker services configuration
├── jest.config.js      # Jest testing configuration
└── tsconfig.json       # TypeScript configuration
```

## Design database
https://dbdiagram.io/d/6821fc665b2fc4582f39d49b


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
1. Clone the repository:
   ```bash
   git clone git@github.com:huy1992nd/location-service.git
   cd location-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="mysql://root:password@localhost:3306/location_services"

   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. Start MySQL database:
   ```bash
   # If using Docker
   docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=location_services -p 3306:3306 -d mysql:8

   # Or start your local MySQL service
   # For macOS:
   brew services start mysql
   # For Ubuntu:
   sudo service mysql start
   ```

5. Initialize the database:
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed the database with sample data
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   # Development mode with hot-reload
   npm run dev

   # Or build and start in production mode
   npm run build
   npm start
   ```

7. Run tests:
   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm run test:watch

   # Run tests with coverage report
   npm run test:coverage
   ```

8. Access the application:
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api-docs
   - Prisma Studio (Database GUI): http://localhost:5555 (run `npm run prisma:studio` to start)

### Development Commands Reference
```bash
# Start development server with hot-reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Database commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed the database
npm run prisma:studio      # Open Prisma Studio

# Testing commands
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

### Troubleshooting
1. **Database Connection Issues**:
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database port (default: 3306)

2. **Port Already in Use**:
   - Change PORT in `.env`
   - Or kill the process using the port:
     ```bash
     # Find process using port 3000
     lsof -i :3000
     # Kill the process
     kill -9 <PID>
     ```

3. **Prisma Issues**:
   - Clear Prisma cache: `rm -rf node_modules/.prisma`
   - Regenerate Prisma client: `npm run prisma:generate`

4. **TypeScript Errors**:
   - Clear TypeScript cache: `rm -rf dist`
   - Rebuild: `npm run build`

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