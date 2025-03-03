# Implementation Plan for Motors Stock Manager

This plan outlines the step-by-step implementation of the Motors Stock Manager dashboard. Below is a phase-by-phase guide with specific actions, file paths, and validations. Each step references the corresponding section from the provided documents.

---

## Phase 1: Environment Setup

1. **Initialize Git Repository**
   - Action: Create a new Git repository and initialize two branches: `main` and `dev`.
   - File/Command: Run `git init` and `git checkout -b dev` in the project root.
   - Reference: PRD Section 1 (Project Overview)

2. **Setup Directory Structure**
   - Action: Create directories for the frontend and backend components.
   - File Paths: Create `/frontend/` and `/backend/` folders in the project root.
   - Reference: PRD Section 1 (Project Overview) & Backend Structure Document

3. **Configure Supabase Credentials**
   - Action: Create a configuration file for Supabase credentials.
   - File Path: Create `/config/supabase.env` with variables for Supabase URL, API key, etc.
   - Reference: PRD Section 5 (Tech Stack & Tools) & Backend Structure Document

4. **Validation**
   - Action: Check that the directory structure is correct and that configuration files have been created.
   - Command: List directories with `tree -L 2` and verify `/config/supabase.env` exists.

---

## Phase 2: Frontend Development

5. **Setup Frontend Project Structure**
   - Action: Initialize the frontend project in `/frontend/` using Lovable’s frontend setup.
   - File Path: Ensure `/frontend/src/` exists to hold pages and components.
   - Reference: Frontend Guidelines Document

6. **Create Login Page Component**
   - Action: Develop the login page to enforce email/domain restrictions using standard email/password authentication.
   - File Path: Create `/frontend/src/pages/Login.js`.
   - Reference: PRD Section 3 (User Flow) & Q&A: Authentication

7. **Implement Dashboard Landing Page**
   - Action: Create a landing page that redirects users based on their assigned role (Admin or Sales Staff).
   - File Path: Create `/frontend/src/pages/Dashboard.js`.
   - Reference: PRD Section 3 (Dashboard Landing and Role-Based Redirect)

8. **Develop Stock Table Component for Admins**
   - Action: Build a data-focused table component for displaying and editing vehicle inventory.
   - File Path: Create `/frontend/src/components/StockTable.js`.
   - Reference: PRD Section 4 (Stock Management System)

9. **Create Bulk Update Preview Component**
   - Action: Build a component that displays a preview of pending bulk updates for admin review before final confirmation.
   - File Path: Create `/frontend/src/components/BulkPreview.js`.
   - Reference: PRD Section 4 & App Flow (Bulk Update Preview and Confirmation)

10. **Implement Pending Edits Component**
    - Action: Develop a component to show a list of unsaved changes along with a notification badge.
    - File Path: Create `/frontend/src/components/PendingEdits.js`.
    - Reference: PRD Section 4 (Pending Edits & Change Log)

11. **Build Change Log Component**
    - Action: Create a component that logs all updates with timestamps and admin identifiers.
    - File Path: Create `/frontend/src/components/ChangeLog.js`.
    - Reference: PRD Section 4 (Pending Edits & Change Log)

12. **Design Filtering and Sorting Controls**
    - Action: Build UI components for filtering (by brand, model, trim, fuel type, stock status) and sorting options (alphabetical, newest, oldest, quantity).
    - File Path: Create `/frontend/src/components/Filters.js`.
    - Reference: PRD Section 4 (Filtering & Sorting)

13. **Integrate Dark Mode Toggle**
    - Action: Develop and integrate a dark mode toggle that minimizes the usage of the company’s red brand color to only contexts that do not conflict with UI error cues.
    - File Path: Create `/frontend/src/components/DarkModeToggle.js`.
    - Reference: PRD Section 4 (User Interface Enhancements)

14. **Ensure Mobile-First Design**
    - Action: Apply responsive design principles to ensure all UI components work seamlessly on mobile devices.
    - File: Update CSS and responsive settings in `/frontend/src/styles/main.css`.
    - Reference: PRD Section 4 (Dark Mode & Mobile-Optimized UI)

15. **Validation**
    - Action: Run local development server and manually navigate through the login, dashboard, and inventory pages to verify UI components render and respond correctly.
    - Command: Use Lovable's local server command (as per internal documentation) to start the project.

---

## Phase 3: Backend Development

16. **Setup Lovable Backend Structure**
    - Action: Initialize the backend project using Lovable’s backend tooling.
    - File Path: Confirm the `/backend/` folder contains `routes/`, `controllers/`, and `services/` directories.
    - Reference: Backend Structure Document

17. **Create Authentication Endpoint**
    - Action: Develop an API endpoint to handle user login, enforcing email domain restrictions and role assignment.
    - File Path: Create `/backend/routes/auth.js`.
    - Reference: PRD Section 1 (Authentication and Role-Based Access Control) & Q&A: Authentication

18. **Validation**
    - Action: Test the authentication endpoint using Postman with allowed and disallowed email domains.
    - Command: Run a `POST` request to `/api/auth/login` and confirm role assignment.

19. **Develop Inventory Retrieval Endpoint**
    - Action: Build an API endpoint to fetch vehicle inventory data.
    - File Path: Create `/backend/routes/inventory.js` and implement a `GET /api/inventory` endpoint.
    - Reference: PRD Section 4 (Stock Management System)

20. **Create Single Vehicle Stock Update Endpoint**
    - Action: Build an API endpoint for updating individual vehicle stock details.
    - File Path: In `/backend/routes/inventory.js`, add a `PUT /api/inventory/:vehicleId` endpoint.
    - Reference: PRD Section 4 (Stock Management System)

21. **Implement Bulk Update Endpoint**
    - Action: Develop an API endpoint to handle bulk updates of vehicle stock with a preview confirmation step (manual confirmation required).
    - File Path: In `/backend/routes/inventory.js`, add a `PUT /api/inventory/bulk-update` endpoint.
    - Reference: PRD Section 4 (Bulk Update with Preview)

22. **Set Up Pending Edits and Change Log Endpoints**
    - Action: Create endpoints for retrieving pending edits and the change log.
    - File Path: Create `/backend/routes/changeLog.js` with endpoints for fetching change logs and pending edits.
    - Reference: PRD Section 4 (Pending Edits & Change Log)

23. **Validation of Backend Endpoints**
    - Action: Use `curl` or Postman to verify that the authentication, inventory, bulk update, and change log endpoints return expected responses.
    - Command: Send requests to `/api/auth/login`, `/api/inventory`, `/api/inventory/bulk-update`, and `/api/changeLog`.

---

## Phase 4: Integration

24. **Configure API Service in Frontend**
    - Action: Create a service file to handle all API calls (login, fetch inventory, stock update, bulk update) from the frontend.
    - File Path: Create `/frontend/src/services/api.js`.
    - Reference: App Flow Document

25. **Implement Role-Based Redirection**
    - Action: Update the login page to redirect users based on the returned role (Admin vs. Sales Staff) after authentication.
    - File Path: Modify `/frontend/src/pages/Login.js` to include role-checking logic.
    - Reference: PRD Section 3 (User Flow)

26. **Integrate Supabase Real-Time Listeners**
    - Action: Implement real-time listeners in the frontend to synchronize inventory and change log updates automatically.
    - File Path: Create `/frontend/src/services/realtime.js` and use Supabase realtime APIs.
    - Reference: PRD Section 4 (Real-Time Synchronization)

27. **Link Stock Table with Update Endpoints**
    - Action: In the StockTable component, add API calls (via the API service) for updating individual stock entries and initiating bulk updates.
    - File Path: Update `/frontend/src/components/StockTable.js` to include calls to `/api/inventory/:vehicleId` and `/api/inventory/bulk-update`.
    - Reference: PRD Section 4 (Stock Management System)

28. **Implement Bulk Update Workflow**
    - Action: Enable the workflow such that when an admin selects multiple records in StockTable, a bulk update preview is shown via the BulkPreview component.
    - File Path: Update interactions in `/frontend/src/components/BulkPreview.js` to call the bulk update endpoint and display pending changes.
    - Reference: App Flow (Bulk Update Preview and Confirmation)

29. **Integrate Notification and Undo Feature**
    - Action: Develop a Notification component to display update success messages along with an Undo option active for 5-10 seconds.
    - File Path: Create `/frontend/src/components/Notification.js` and integrate it within update workflows.
    - Reference: PRD Section 4 (Error Handling & Undo Feature)

30. **Validation of Integration**
    - Action: Manually test logging in, role-based redirection, inventory fetching, individual and bulk updates, and verify real-time synchronization.
    - Command: Run the frontend in development mode and simulate concurrent changes.

---

## Phase 5: Deployment

31. **Prepare Deployment Configuration**
    - Action: Set up the Lovable cloud deployment configuration, ensuring environment variables (e.g., Supabase credentials) are present.
    - File Path: Verify `/config/supabase.env` and include deployment configuration files as per Lovable documentation.
    - Reference: PRD Section 7 (Non-Functional Requirements) & Tech Stack: Lovable Deployment

32. **Deploy Frontend Assets**
    - Action: Use Lovable’s frontend build process to deploy the static assets in the `/frontend/` directory to the cloud.
    - Reference: PRD Section 7 (Deployment Requirements)

33. **Deploy Backend Endpoints**
    - Action: Deploy the backend services from the `/backend/` directory using Lovable’s backend deployment tools.
    - Reference: PRD Section 7 (Deployment Requirements)

34. **Validation of Deployment**
    - Action: Perform end-to-end testing on the deployed environment ensuring login, inventory updates, real-time synchronization, and all core functionalities work as expected.
    - Command: Use internal testing tools and manual verification to confirm system stability.

---

This completes the step-by-step implementation plan for Motors Stock Manager. Each step has been detailed with file paths, commands, and document references to ensure clarity and adherence to project requirements.