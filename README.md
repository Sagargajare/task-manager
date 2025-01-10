## Task Manager

This is a Next.js project that requires environment variables for local development. Follow the steps below to get started.

### Steps to Set Up the Project

1. **Clone the repository:**
   If you haven't already cloned the project, use the following command:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - You should have a `.env` file in the project. This file contains environment variables for the project.
   - Create a `.env.local` file from `.env` for local development by running:
     ```bash
     cp .env .env.local
     ```

4. **Customize environment variables:**
   Create `.env.local` and add 
   - `NEXT_PUBLIC_API_URL`

5. **Start the development server:**
   Run the following command to start the development server:
   ```bash
   npm run dev
   ```
   This will start the Next.js app on `http://localhost:3000`.

6. **Build the project for production:**
   To build the project for production, use:
   ```bash
   npm run build
   ```

7. **Run the production server:**
   After building the project, you can start the production server with:
   ```bash
   npm start
   ```

## Additional Notes
- The `.env.local` file is ignored by Git (via `.gitignore`), so it won't be pushed to version control. Ensure that any sensitive environment variables are correctly set in your `.env.local`.
