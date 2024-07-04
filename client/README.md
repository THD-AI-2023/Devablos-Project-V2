# Client Application for Devablos Project V2

This directory contains the React-based frontend for the Devablos Project V2. It provides an interactive user interface for real-time chat functionalities using WebSockets.

## Features

- Real-time communication with the backend.
- Toggle between HTTPS and WebSocket communication.
- Responsive design for optimal user experience across devices.

## Directory Structure

```txt
client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   ├── App.js
│   ├── index.js
│   └── styles/
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

This command starts the React development server at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This will create a `build` directory with a production build of the app, which you can serve using a web server.

## Environment Variables

Make sure to set up your `.env` file based on the `.env.example` provided.

## Dockerization

Refer to the main [README](../README.md) for instructions on running the client within a Docker container.

## Contributing

See the main project's [README](../README.md) for the contributing guidelines.
