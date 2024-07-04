# Devablos Project V2

Welcome to the Devablos Project V2, a full-stack chatbot application leveraging React for the frontend and Node.js with Express for the backend. This project integrates WebSocket for real-time interactions and uses OpenAI's API for advanced functionalities.

## Key Features

- **Real-Time Communication**: WebSocket and Secure WebSocket (WSS) integration.
- **SSL Security**: Configured SSL certificates for HTTPS communication.
- **Weather Information**: Fetch and display weather conditions using OpenWeather API.
- **Flexible Protocols**: Toggle between WebSocket and HTTPS directly from the UI.

Visit our live application at [Devablos V2](https://devablos-v2.azurewebsites.net/) to see it in action.

![image](https://github.com/THD-AI-2023/Devablos-Project-V2/assets/66517969/bff44cc1-0a48-4b75-8cb4-3526dd7b043f)

## Directory Structure

```txt
devablos-project-v2/
├── client/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── server/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── .dockerignore
├── docker-compose.yml
├── .gitignore
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js and npm

### Environment Setup

Before running the application, you need to set up the environment variables and SSL certificates:

1. **Environment Variables**:
   - Copy `.env.example` to `.env` in both the `client/` and `server/` directories.
   - Modify the `.env` files to include your specific configurations, such as API keys and other necessary settings.

2. **SSL Certificates**:
   - Use `mkcert` to create SSL certificates. If `mkcert` is not installed, [install it](https://github.com/FiloSottile/mkcert) first.
   - Run the following commands to generate certificates:

     ```bash
     mkcert -install
     mkdir -p .certs .private
     mkcert -key-file ./.private/localhost-key.pem -cert-file ./.certs/localhost.pem localhost 127.0.0.1 ::1
     ```

### Running the Application

After setting up the environment variables and SSL certificates, you can start the application using Docker Compose:

```bash
docker-compose up --build
```

This command builds the Docker images and starts the containers defined in `docker-compose.yml`. Check the services are running:

- Frontend at: `http://localhost:3000`
- Backend at: `http://localhost:5000`

## Documentation

For more details on project setup, features, and contributions, refer to the specific README files in the `client` and `server` directories:

- [Client README](client/README.md)
- [Server README](server/README.md)

## Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing to help maintain a friendly and inclusive environment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
