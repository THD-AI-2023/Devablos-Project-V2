# Devablos Project V2

This repository contains a chatbot application with both client and server components. The client uses contains chat components, while the backend handles WebSockets, security, and interactions with OpenAI's API.

## Directory Structure

```plaintext
devablos-project-v2/
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.js ✓
│   │   │   ├── ChatMessages.js ✓
│   │   │   ├── ChatWindow.js ✓
│   │   │   └── ...
│   │   ├── App.js ✓
│   │   ├── index.js ✓
│   │   └── ...
│   ├── .gitignore 
│   ├── package.json
│   ├── README.md ✓
│   └── ...
├── server/
│   ├── node_modules/
│   ├── src/
│   │   ├── api/
│   │   │   ├── openai.js
│   │   │   └── ...
│   │   ├── config/
│   │   │   ├── security.js
│   │   │   └── ...
│   │   ├── controllers/
│   │   │   ├── chatController.js
│   │   │   └── ...
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── chatService.js
│   │   │   └── ...
│   │   ├── sockets/
│   │   │   ├── chatSocket.js
│   │   │   └── ...
│   │   ├── app.js
│   │   ├── server.js
│   │   └── ...
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── ...
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

### Client Side (`client/`)
- **`node_modules/`**: Directory for Node.js modules.
- **`public/`**: Static files served by the React app, such as `index.html`.
- **`src/`**: Source code for the React app.
  - **`components/`**: React components for the chat application.
    - `ChatInput.js`: Component for chat input field.
    - `ChatMessages.js`: Component for displaying chat messages.
    - `ChatWindow.js`: Component for the chat window.
  - `App.js`: Main app component.
  - `index.js`: Entry point for React application.

### Server Side (`server/`)
- **`node_modules/`**: Directory for Node.js modules.
- **`src/`**: Source code for the server.
  - **`api/`**: Code for interacting with external APIs, like OpenAI.
    - `openai.js`: Logic for interacting with OpenAI's API.
  - **`config/`**: Configuration files.
    - `security.js`: Security-related configurations.
  - **`controllers/`**: Controllers to handle HTTP requests.
    - `chatController.js`: Controller for chat-related endpoints.
  - **`middlewares/`**: Middleware functions.
    - `authMiddleware.js`: Middleware for authentication.
  - **`models/`**: Data models.
    - `userModel.js`: User model.
  - **`routes/`**: Express routes.
    - `chatRoutes.js`: Routes for chat functionalities.
  - **`services/`**: Business logic and services.
    - `chatService.js`: Service handling chat logic.
  - **`sockets/`**: WebSocket-related code.
    - `chatSocket.js`: Logic for handling chat WebSocket connections.
  - `app.js`: Express app configuration.
  - `server.js`: Server entry point.

### Root Directory
- **`.gitignore`**: Specifies files and directories to be ignored by Git.
- **`LICENSE`**: License file for the project.
- **`README.md`**: Project description and setup instructions.
- **`package.json`**: Lists project dependencies and scripts.

## Getting Started

### Client
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

### Server
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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file for details.
