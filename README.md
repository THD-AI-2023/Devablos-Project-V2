# Devablos Project V2

This repository contains a chatbot application with both client and server components. The client uses React for the frontend, while the backend, built with Node.js and Express, handles WebSockets, security, and interactions with OpenAI's API.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Client Setup](#client-setup)
- [Server Setup](#server-setup)
- [Creating SSL Certificates](#creating-ssl-certificates)
- [Running with Docker](#running-with-docker)
- [Contributing](#contributing)
- [License](#license)

## Directory Structure

```plaintext
devablos-project-v2/
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore 
│   ├── package.json
│   └── README.md
├── server/
│   ├── node_modules/
│   └── src/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── .certs/
│   └── localhost.pem
├── .private/
│   └── localhost-key.pem
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

## Client Setup

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

## Server Setup

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add necessary configurations (e.g., OpenAI API key).

4. Start the Node.js server:
    ```bash
    npm start
    ```

## Creating SSL Certificates

1. Use `mkcert` to create SSL certificates:
    ```bash
    # Unix-like Environment Script:
    mkcert -install
    mkdir -p .certs .private
    mkcert -key-file ./.private/localhost-key.pem -cert-file ./.certs/localhost.pem localhost 127.0.0.1 ::1
    ```

    ```bash
    # PowerShell Script:
    mkcert -install
    New-Item -ItemType Directory -Path .certs, .private
    mkcert -key-file .\.private\localhost-key.pem -cert-file .\.certs\localhost.pem localhost 127.0.0.1 ::1\
    ```

2. Ensure the certificate files are placed in the correct directories:
    ```plaintext
    Devablos-Project-V2/
    ├── .certs/
    │   └── localhost.pem
    ├── .private/
    │   └── localhost-key.pem
    ```

## Running with Docker

1. Ensure Docker is installed and running on your machine.

2. Navigate to the project root directory and run:
    ```bash
    docker-compose down
    docker-compose up --build
    ```

## Contributing

We welcome pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
