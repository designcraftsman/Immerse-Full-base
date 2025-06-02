# Immerse-Full-base

Immerse-Full-base is a comprehensive platform that integrates multiple modules, including a CMS, immersive 3D spaces, and an API. It is designed for educational purposes, providing tools for managing courses, students, teachers, assets, and immersive learning experiences.

## Features

### CMS Module
- **Dashboard**: Provides an overview of metrics such as students, teachers, courses, and assets.
- **User Management**: Manage students and teachers with CRUD operations.
- **Course Management**: Create, update, and delete courses.
- **Asset Management**: Manage assets used in courses.
- **Routing**: Implements dynamic routing using `react-router-dom`.

### Immersive Module
- **3D Learning Spaces**: Includes immersive environments such as labs and classrooms.
- **Interactive Components**: Allows users to interact with 3D objects like desks, projectors, and screens.
- **Session Management**: Supports lab and school sessions with real-time interactions.
- **Custom Controls**: Implements custom look controls for navigation in 3D spaces.

### API Module
- **RESTful API**: Provides endpoints for managing users, courses, assets, and sessions.
- **File Uploads**: Supports uploading files such as PDFs, videos, and 3D models.
- **Authentication**: Secure user authentication and session management.
- **CORS Configuration**: Ensures secure cross-origin resource sharing.

## Technologies Used

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Database for storing user, course, and session data.

### Frontend
- **React.js**: Frontend library for building user interfaces.
- **A-Frame**: Framework for building 3D and VR experiences.
- **Bootstrap**: Responsive design framework.
- **SASS**: CSS preprocessor for modular styling.

### Tools
- **Vite**: Build tool for fast development.
- **ESLint**: Linter for maintaining code quality.
- **Socket.io**: Real-time communication for immersive sessions.

## MVC Architecture

The project follows the Model-View-Controller (MVC) design pattern:

- **Model**: Represents the data and business logic. For example, the `models` directory in the API contains definitions for users, courses, and assets.
- **View**: Handles the user interface. The CMS and immersive modules use React components to render views dynamically.
- **Controller**: Acts as the intermediary between the Model and View. The API controllers process requests, interact with the database, and return responses.

This architecture ensures separation of concerns, making the application scalable and maintainable.

## Project Structure

```
Immerse-Full-base/
├── api/
│   ├── package.json
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── assets/
├── cms/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   ├── components/
│   │   ├── sass/
│   │   ├── css/
│   │   └── assets/
│   └── public/
├── immersive/
│   ├── package.json
│   ├── src/
│   │   ├── ImmersiveSpace.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── css/
│   └── public/
└── database2.sql
```

## How to Run

### API
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

### CMS
1. Navigate to the `cms` directory:
   ```bash
   cd cms
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Immersive Module
1. Navigate to the `immersive` directory:
   ```bash
   cd immersive
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Notes
- Ensure the database schema (`database2.sql`) is imported into your MySQL server.
- Update database credentials in the API configuration files.
- The immersive module requires WebGL support in the browser.

Let me know if you need further adjustments!# Immerse-Full-base

Immerse-Full-base is a comprehensive platform that integrates multiple modules, including a CMS, immersive 3D spaces, and an API. It is designed for educational purposes, providing tools for managing courses, students, teachers, assets, and immersive learning experiences.

## Features

### CMS Module
- **Dashboard**: Provides an overview of metrics such as students, teachers, courses, and assets.
- **User Management**: Manage students and teachers with CRUD operations.
- **Course Management**: Create, update, and delete courses.
- **Asset Management**: Manage assets used in courses.
- **Routing**: Implements dynamic routing using `react-router-dom`.

### Immersive Module
- **3D Learning Spaces**: Includes immersive environments such as labs and classrooms.
- **Interactive Components**: Allows users to interact with 3D objects like desks, projectors, and screens.
- **Session Management**: Supports lab and school sessions with real-time interactions.
- **Custom Controls**: Implements custom look controls for navigation in 3D spaces.

### API Module
- **RESTful API**: Provides endpoints for managing users, courses, assets, and sessions.
- **File Uploads**: Supports uploading files such as PDFs, videos, and 3D models.
- **Authentication**: Secure user authentication and session management.
- **CORS Configuration**: Ensures secure cross-origin resource sharing.

## Technologies Used

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Database for storing user, course, and session data.

### Frontend
- **React.js**: Frontend library for building user interfaces.
- **A-Frame**: Framework for building 3D and VR experiences.
- **Bootstrap**: Responsive design framework.
- **SASS**: CSS preprocessor for modular styling.

### Tools
- **Vite**: Build tool for fast development.
- **ESLint**: Linter for maintaining code quality.
- **Socket.io**: Real-time communication for immersive sessions.

## MVC Architecture

The project follows the Model-View-Controller (MVC) design pattern:

- **Model**: Represents the data and business logic. For example, the `models` directory in the API contains definitions for users, courses, and assets.
- **View**: Handles the user interface. The CMS and immersive modules use React components to render views dynamically.
- **Controller**: Acts as the intermediary between the Model and View. The API controllers process requests, interact with the database, and return responses.

This architecture ensures separation of concerns, making the application scalable and maintainable.

## Project Structure

```
Immerse-Full-base/
├── api/
│   ├── package.json
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── assets/
├── cms/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   ├── components/
│   │   ├── sass/
│   │   ├── css/
│   │   └── assets/
│   └── public/
├── immersive/
│   ├── package.json
│   ├── src/
│   │   ├── ImmersiveSpace.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── css/
│   └── public/
└── database2.sql
```

## How to Run

### API
1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

### CMS
1. Navigate to the `cms` directory:
   ```bash
   cd cms
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Immersive Module
1. Navigate to the `immersive` directory:
   ```bash
   cd immersive
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Notes
- Ensure the database schema (`database2.sql`) is imported into your MySQL server.
- Update database credentials in the API configuration files.
- The immersive module requires WebGL support in the browser.

Let me know if you need further adjustments!
