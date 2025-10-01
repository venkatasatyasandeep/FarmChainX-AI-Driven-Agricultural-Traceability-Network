# FarmChainX - AI-Driven Agricultural Traceability Network

FarmChainX is a full-stack application for tracking agricultural produce using AI-driven tools. The project consists of a frontend (React) and a backend (Spring Boot/Eclipse + MySQL).

## Available Scripts

### Frontend (React)

In the `frontend` directory, you can run:

#### `npm install`
Installs all dependencies.

#### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page reloads automatically when you make changes.

#### `npm run build`
Builds the app for production in the `build` folder. Optimizes the build for the best performance.

---

### Backend (Spring Boot / Eclipse)

1. Open Eclipse IDE.  
2. Import the `backend` folder as an existing Maven project.  
3. Configure MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmxchain
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

Create the database in MySQL:

CREATE DATABASE farmxchain;


Run FarmxchainAuthApplication.java as a Java Application. The backend will start on http://localhost:8080
.

Running the Full Application

Start MySQL.

Run the backend in Eclipse.

Run the frontend (npm start) in the frontend folder.

Access the app at http://localhost:3000
. The frontend communicates with backend APIs at http://localhost:8080.

Notes

Ensure ports 3000 (frontend) and 8080 (backend) are free.

The backend must be running for frontend features to work.