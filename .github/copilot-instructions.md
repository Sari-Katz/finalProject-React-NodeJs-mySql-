# AI Coding Agent Instructions

## Project Overview
This project is a full-stack application built with React (frontend) and Node.js (backend), using MySQL as the database. The architecture is divided into two main parts:

1. **Frontend (client/):**
   - Built with React and Vite for fast development.
   - Organized into components, each with its own CSS module for styling.
   - Key directories:
     - `src/components/`: Contains reusable UI components (e.g., `FoodDiary`, `Comments`, `Schedule`).
     - `src/utils/`: Utility functions for API calls and shared logic.
     - `public/`: Static assets.

2. **Backend (server/):**
   - Built with Node.js and Express.
   - Organized into controllers, routes, services, and middlewares.
   - Key directories:
     - `controllers/`: Handles HTTP requests and responses.
     - `services/`: Business logic and database interactions.
     - `routes/`: API endpoints.
     - `utils/`: Shared utilities like logging and email handling.

## Developer Workflows

### Frontend Development
- **Start the development server:**
  ```bash
  npm run dev
  ```
  Run this command in the `client/` directory to start the Vite development server.

- **Build for production:**
  ```bash
  npm run build
  ```

- **Linting:**
  ESLint is configured. Run the following to check for linting errors:
  ```bash
  npm run lint
  ```

### Backend Development
- **Start the server:**
  ```bash
  node server.js
  ```
  Run this command in the `server/` directory to start the backend server.

- **Database Initialization:**
  The database schema is initialized using `DB/DB_Intalization.js`. Ensure `DB.json` contains the correct configuration.

- **Logging:**
  Logs are stored in the `logs/` directory. Use `utils/logger.js` for consistent logging.

## Project-Specific Conventions

### Frontend
- **Component Structure:**
  - Each component resides in its own directory with the following structure:
    ```
    ComponentName/
      ComponentName.jsx
      ComponentName.module.css
    ```
  - Example: `src/components/FoodDiary/AddMealPage/`

- **Styling:**
  - Use CSS modules for scoped styles.
  - Example: `AddMealPage.module.css` for `AddMealPage.jsx`.

### Backend
- **Service Layer:**
  - Business logic resides in `services/`.
  - Example: `classService.js` handles class-related operations.

- **Error Handling:**
  - Use `middlewares/authMiddleware.js` for authentication.
  - Centralized error handling is recommended.

## Integration Points
- **Frontend-Backend Communication:**
  - API calls are made using utility functions in `src/utils/ApiUtils.js`.
  - Example: Fetching comments for a post.

- **Database:**
  - MySQL database configured in `DB/Connection.js`.
  - Ensure the database is running before starting the backend.

## External Dependencies
- **Frontend:**
  - React, Vite, CSS Modules.
- **Backend:**
  - Express, MySQL, Nodemailer (for emails).

## Examples
- **Adding a New Component:**
  1. Create a new directory under `src/components/`.
  2. Add the `.jsx` and `.module.css` files.
  3. Import and use the component in the relevant parent component.

- **Adding a New API Endpoint:**
  1. Define the route in `routes/`.
  2. Implement the logic in `controllers/`.
  3. Add business logic in `services/`.

---

For any questions or clarifications, refer to the existing codebase or consult the team.