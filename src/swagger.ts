import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Location-Based Service Search API',
      version: '1.0.0',
      description: 'API for searching and managing location-based services',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The service ID',
            },
            name: {
              type: 'string',
              description: 'The name of the service',
            },
            type: {
              type: 'string',
              description: 'The type of service',
            },
            latitude: {
              type: 'number',
              format: 'float',
              description: 'The latitude coordinate',
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'The longitude coordinate',
            },
            address: {
              type: 'string',
              description: 'The address of the service',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 