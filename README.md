## Task Manager

This is a Next.js project that requires environment variables for local development. Follow the steps below to get started.

### Steps to Set Up the Project

1. **Clone the repository:**
   If you haven't already cloned the project, use the following command:
   ```bash
   git clone https://github.com/Sagargajare/task-manager.git
   cd task-manager
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

## Backend Contract

```
Request:
GET /api/tasks

Response:
{
  "tasks": [
    {
      "id": 1,
      "name": "File upload feature",
      "labels": ["backend", "urgent"],
      "status": "OPEN", 
      "priority": "HIGH",
      "assignee": "john@company.com",
      "due_date": "2024-02-01T00:00:00Z",
      "created_at": "2024-01-15T13:10:13Z",
      "updated_at": "2024-01-15T13:10:13Z",
      "comment": "Initial task creation"
    }
  ],
  "pagination": {
    "total": 156,
    "has_next": true,
    "page_size": 100,
    "offset": 0
  }
}  
```

## Frontend System Design

Tech Stack:

1. React.js/Nextjs:  Frontend framework for building components and managing the UI.
2. TypeScript: For type safety, reducing runtime errors, and improving code quality.
3. Tailwind CSS: Utility-first CSS framework to style the components.
4. Zustand: For global state management (managing task statuses, task details).
5. Shadcn UI: A UI component library for building modern components.

### System Architecture

#### Component
- TaskManager: A parent component to render the tabs, search, etc.
- TaskTable: Format and Organize data in table format
- TaskForm: Manage Edit task seemlessly
- useTaskStore: A centralize store build using zustand to manage and perform various sorting, search, manupulation on data data.

