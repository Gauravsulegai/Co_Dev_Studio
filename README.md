# Co-Dev-Studio

### Overview

Co-Dev-Studio is a full-stack, real-time chat application designed as a collaborative hub for developers. The project's mission is to provide a seamless and efficient communication platform, particularly for teams working together during hackathons or on intensive coding projects. It features dynamic, persistent chat rooms, a live member list, typing indicators, and message pinning, all wrapped in a sleek, developer-focused dark-themed UI.

### Our Approach: A Decoupled, Real-time Architecture

The application is built on a modern, decoupled architecture to ensure scalability and maintainability.

1.  **Frontend (Next.js & React):** A high-performance frontend built with Next.js provides a fast, server-rendered user experience. All UI components are built with React and styled with Tailwind CSS for a responsive, utility-first design. Real-time communication is handled by the `socket.io-client` library, which connects to our backend WebSocket server.

2.  **Backend (Node.js & Express):** A dedicated backend server built with Node.js and Express handles all business logic. It manages the WebSocket connections using Socket.IO, processes chat messages, and interacts with the database. This decoupled approach allows the frontend to focus solely on the user interface while the backend manages data and real-time events.

3.  **Real-time Engine (Socket.IO):** At the core of the application is Socket.IO, which enables bidirectional, low-latency communication. The backend uses event-based listeners (`join-room`, `send-message`, `typing-start`, etc.) to manage the state of each chat room and broadcast updates to all connected clients in real-time.

4.  **Database (MongoDB):** All chat messages and room data (like pinned messages) are persisted in a MongoDB Atlas database. This ensures that the chat history is not lost when a user refreshes the page or rejoins a room, providing a seamless and continuous user experience.

This architecture ensures that the application is robust, scalable, and provides the instantaneous feedback required for a modern chat application.

### Libraries & Tech Stack

* **Frontend:** **Next.js**, **React**, **Tailwind CSS**, **Socket.IO Client**
* **Backend:** **Node.js**, **Express.js**, **Socket.IO**
* **Database:** **MongoDB** with **Mongoose**, hosted on **MongoDB Atlas**
* **Deployment:** **Vercel** (Frontend) & **Render** (Backend)

### Submission Requirements Checklist

-   [x] **GitHub Project**: Complete and functional solution repository.
-   [x] **Live Deployed Application**: The project will be deployed and live.
-   [x] **README.md**: This file.

### Local Setup and Run Commands

**Prerequisites**: Node.js and npm must be installed and running.

1.  **Clone the Repository**:
    ```bash
    git clone <your-github-repository-url>
    cd co-dev-studio
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

4.  **Run the Application**:

    You will need two separate terminals running simultaneously. Before running, create a `.env` file in the `backend/` directory with your `MONGO_URI`.

    * **Terminal 1 (Backend)**:
        ```bash
        cd backend
        npm run dev
        ```

    * **Terminal 2 (Frontend)**:
        ```bash
        # From the root co-dev-studio directory
        npm run dev
        ```
    The application will be available at `http://localhost:3000`.

### Validation Checklist

-   [x] **Real-time messaging works across multiple clients**: Yes.
-   [x] **Chat history is persistent and reloads on join**: Yes.
-   [x] **Live member list updates correctly**: Yes.
-   [x] **Typing indicator functions as expected**: Yes.
-   [x] **Message pinning is functional and syncs across clients**: Yes.
-   [x] **Application is fully responsive**: Yes.

---
### My Contribution

This project was a solo endeavor, showcasing my abilities in full-stack development, real-time application architecture, and modern UI/UX implementation.

* **[Gaurav SK] - Full-Stack Developer & Architect**
    * Designed and implemented the end-to-end architecture, including the Next.js frontend and the Node.js backend.
    * Developed the real-time chat engine using Socket.IO, including features like room management, typing indicators, and live user lists.
    * Integrated the MongoDB database with Mongoose to ensure persistent chat history and data management.
    * Built the entire user interface from scratch using React and Tailwind CSS, focusing on a sleek, responsive, and user-friendly design.
    * Managed the complete development lifecycle from initial setup to final deployment.