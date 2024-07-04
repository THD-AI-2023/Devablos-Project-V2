# Server Application for Devablos Project V2

This directory contains the Express-based backend for the Devablos Project V2. It handles API requests, WebSocket connections, and integrates with OpenAI's API for advanced functionalities.

## Features

- WebSocket and HTTPS support for real-time interactions.
- Integration with OpenAI API.
- Docker support for easy deployment and scaling.
- SSL configuration for secure communications.

## Directory Structure

```
server/
├── src/
│   ├── api/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Running Locally

```bash
npm start
```

This command starts the Express server at `http://localhost:5000`.

### Environment Variables

Set up your `.env` based on the `.env.example` file. This includes setting the OpenAI API key, OpenWeather API key, and other necessary configurations.

## Dockerization

The application is dockerized for production and development environments. See the main [README](../README.md) for Docker commands and setup details.

## API Documentation

Access the Swagger UI at `http://localhost:5000/admin` to view and interact with the API documentation.

## Contributing

Contributions to enhance functionalities or documentation are welcome. Please adhere to our [Code of Conduct](../CODE_OF_CONDUCT.md) when contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.