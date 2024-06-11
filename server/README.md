# Server Directory

This directory contains the Express backend for the Devablos Project V2.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Development Process](#development-process)
- [Naming Conventions](#naming-conventions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Build for Production](#build-for-production)

## Directory Structure

```plaintext
server/
├── node_modules/
├── src/
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── views/
│   ├── bin/
│   ├── public/
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Development Process

1. **Create a new branch from the `dev-server` branch**:
    ```bash
    git checkout dev-server
    git pull origin dev-server
    git checkout -b feature/github-username/feature-name
    ```

2. **Make your changes and commit them**:
    ```bash
    git add .
    git commit -m "Add description of the feature"
    ```

3. **Push your branch to the repository**:
    ```bash
    git push origin feature/github-username/feature-name
    ```

4. **Create a Pull Request (PR)**:
    - Go to the repository on GitHub.
    - You should see a prompt to compare & pull request your recently pushed branch.
    - Create a PR and assign a reviewer.

## Naming Conventions

- Branch names should follow the structure: `feature/github-username/feature-name`.
- Commit messages should be descriptive of the changes made.

## Getting Started

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Start the development server**:
    ```bash
    npm start
    ```

This will start the Express server on `http://localhost:5000`.

## Environment Variables

Create a `.env` file in the root of the `server` directory and add necessary configurations, such as the OpenAI API key.

## Build for Production

To create a production build, ensure all dependencies are installed and the server is properly configured.
