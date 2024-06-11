# Client Directory

This directory contains the React frontend for the Devablos Project V2.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Development Process](#development-process)
- [Naming Conventions](#naming-conventions)
- [Getting Started](#getting-started)
- [Build for Production](#build-for-production)

## Directory Structure

```plaintext
client/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatInput.js
│   │   ├── ChatMessages.js
│   │   └── ChatWindow.js
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## Development Process

1. **Create a new branch from the `dev-client` branch**:
    ```bash
    git checkout dev-client
    git pull origin dev-client
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

This will start the React development server on `http://localhost:3000`.

## Build for Production

To create a production build, run:
```bash
npm run build
```

This will create a `build` directory with the production build of your React app.

## Additional Information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). For more details on available scripts and advanced configuration, please refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
