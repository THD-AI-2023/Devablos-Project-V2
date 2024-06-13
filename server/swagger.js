const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Devablos Project V2 API',
    description: 'API documentation for Devablos Project V2',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || '5000'}/`,
      description: 'localhost',
    },
    {
      url: `https://${process.env.CODESPACE_NAME}-${process.env.PORT || '5000'}.app.github.dev/`,
      description: 'github.dev',
    },
    {
      url: `https://${process.env.AZURE_APP_NAME}.azurewebsites.net/`,
      description: 'Azure Deployment',
    },
  ],
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'OpenAI',
      description: 'Endpoints related to OpenAI models',
    },
    {
      name: 'OpenAI Batch',
      description: 'Endpoints related to OpenAI batch processing',
    },
    {
      name: 'API',
      description: 'General API endpoints',
    },
    {
      name: 'Users',
      description: 'Endpoints related to user management',
    },
    {
      name: 'Chat',
      description: 'Endpoints related to chat functionality',
    },
    {
      name: 'Files',
      description: 'Endpoints related to file handling',
    },
    {
      name: 'Security',
      description: 'Endpoints related to security and authentication',
    },
    {
      name: 'GPT Assistants',
      description: 'Endpoints related to assistant chat functionality'
    }
  ],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: "The header's value should be: bearer <JWT_TOKEN>",
    },
  },
  components: {}, // by default: empty object (OpenAPI 3.x)
};

swaggerAutogen(outputFile, endpointsFiles, doc);
