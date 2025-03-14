# Motors Stock Manager App Flow Document

## Introduction

This document explains how the Motors Stock Manager works, providing a full picture of every key page and user journey. The system is an internal tool designed for automotive company staff who need to manage vehicle inventory, update stock levels, and handle administrative tasks in one centralized location. The main goal is to offer a secure, data-driven interface for both administrative users and sales staff. This is achieved by using role-based access control, a real-time data update system, and a design that is both mobile-friendly and optimized for dark mode. The user experience has been planned carefully, starting from secure login to performing specific actions in a clear and uncomplicated manner.

## Data Sources and Integration

The Motors Stock Manager connects with several critical data sources to ensure accurate inventory management. The system regularly imports data from the company's ERP system, including the Dispatch Register (containing serial numbers, dates, and reconciliation data) and Serial No Details (complete inventory data). This imported data is then cross-referenced with the Reservation Sheet, which tracks customer reservations. The application maintains two separate data views: the Group Chat Stock (showing only available vehicles for the sales team) and the Executive Management Stock (displaying the complete inventory including reserved, cannibalized, and workshop vehicles). This dual reporting structure ensures that sales staff only see vehicles that are actually available for purchase, while management can maintain visibility of all inventory assets regardless of status.

## Onboarding and Sign-In/Sign-Up

When a new user comes to the system, they are first greeted by a landing page that highlights the key features of Motors Stock Manager. The user can then choose to create an account if they are a new staff member, though in many internal systems the account creation can be handled centrally. For sign-up, users are asked to enter their work email and a secure password. Email domain restrictions are in place to ensure that only authorized employees can register. After a successful registration, or if the user already has an account, they proceed to a straightforward sign-in page where they enter their credentials. If a user forgets their password, a simple recovery option is available where they can initiate a password reset process by providing their registered email, and instructions are sent to help them restore access. The sign-in and sign-up flows are easy to follow, ensuring that staff members quickly gain access and begin using the dashboard.

## Main Dashboard or Home Page

Upon signing in, users arrive at the main dashboard, which serves as the central hub of the application. The landing page immediately presents a clean and data-focused layout. In the header, there are options for navigation, including access to settings, notifications, and logout. A sidebar or a top navigation bar allows users to move between different modules such as stock management, pending edits, and change logs. The content area displays a detailed table of vehicle inventory data that is dynamic and updates in real time. The interface adjusts based on whether the logged-in user is an Admin, Operations Staff, or Sales Staff. Admin users see additional tools for modifying stock, performing bulk updates, and reviewing pending changes. Operations team members see the complete inventory including reserved, cannibalized, and workshop vehicles, along with reservation management tools. Sales Staff see a simplified version that focuses on filtering, sorting, and viewing available stock and incoming inventory (pre-sale) without making any modifications to the underlying data.

### Inventory Management Interface

The inventory management interface has been enhanced with an accordion-style view for brand sections, allowing users to easily expand and collapse different vehicle brands. Each brand section displays a summary of available models and units, with a mobile-optimized layout for brand cards. The interface includes a "Add Vehicle" button that opens a modal form for adding new vehicles to the inventory.

The Add Vehicle Modal includes several key components:
- A BrandCombobox component with search functionality, allowing users to quickly find and select from existing brands or add new ones
- Model and trim input fields for specifying vehicle details
- Form validation to ensure all required information is provided
- A responsive design that works well on both desktop and mobile devices

The BrandCombobox component specifically features:
- A searchable dropdown that filters brand options as the user types
- An "Add New Brand" option that appears when no matching brands are found
- Proper keyboard navigation and accessibility features
- Event handling that works correctly within the modal context

This interface provides a streamlined workflow for inventory management, allowing staff to quickly add new vehicles to the system while maintaining data integrity.

## Reservation Management System

A cornerstone of the application is the Reservation Management System, which allows for efficient tracking of vehicle reservations throughout the customer journey. When a customer expresses interest and pays at least 50% of the vehicle cost, the sales person initiates the reservation process within the system. This begins with the sales person viewing the real-time inventory to confirm availability. They then use the Reservation Form to capture key information: customer name, branch, reservation date, vehicle details (brand, model, color), sales person information, and any special remarks. Upon form submission, the system marks the vehicle as "pending reservation" and automatically generates a notification email that includes reservation details. This email is sent to the accounts team, operations team, and any other relevant stakeholders.

The email contains a secure confirmation link that, when clicked, opens a simple web page displaying the reservation details, a dropdown to select the approver's name, and a confirmation button. After an accounts team member confirms the payment, the system logs who confirmed the payment, when it occurred, and automatically updates the reservation status to "confirmed." All confirmation details are sent as a reply to the original email thread, ensuring a complete communication history is maintained. For partial payments, the system allows the accounts team to mark the payment status accordingly, and a streamlined process exists for recording full payment once received. Throughout this process, the inventory is updated in real-time, ensuring that all users have accurate stock information at all times.

## Special Reservation Workflows

The system accommodates several special reservation scenarios that require unique handling. For management-approved reservations (often marked as "management management"), the application includes a streamlined override option that bypasses standard payment confirmation requirements while still maintaining audit logs. When a vehicle needs to be reassigned due to quality issues or other reasons, the operations team can use the Vehicle Reassignment function to select a new vehicle from available inventory while preserving the original reservation history and notifying all relevant parties of the change. The system also handles cases where payments are made by third parties on behalf of customers, allowing for special notation and appropriate documentation to be maintained.

For rejected payments, the confirmation interface includes a "Reject Payment" option with a dropdown for common rejection reasons. If selected, the system sends a rejection notification to all parties, marks the reservation as "Payment Rejected," and allows the sales person to submit updated payment evidence. The reservation remains in a pending state until the payment issues are resolved. This careful attention to exception handling ensures that the system can accommodate the full range of real-world business scenarios encountered by the automotive sales team.

## Branch-Specific Operations

The application is designed to accommodate the different operational approaches across company branches. Implementation begins with the Lagos VI branch as the pilot location, with features specifically tailored to their processes. The system allows for branch-specific views and workflows, recognizing that branches like Abuja may maintain their own reservation processes initially. As adoption increases at the pilot location, the system will be gradually rolled out nationally with appropriate customizations for each branch's unique requirements. For each branch, the system offers appropriate filters and data views, ensuring that staff members only see inventory relevant to their location while still allowing for inter-branch transfers and visibility when needed. This phased approach ensures successful adoption while respecting the operational independence of different locations.

## Detailed Feature Flows and Page Transitions

After the login process, the user's role determines their journey within the application. For Admin users, the journey begins on a dashboard that displays a comprehensive table of vehicle inventory. Here, the user has the ability to click on individual vehicle entries to open a detailed view where they can adjust stock levels. When bulk updates are needed, the Admin can select several entries by simply clicking on rows within the table. This selection navigates to a bulk update page where the user can enter new data for several entries simultaneously. Before finalizing the changes, a bulk update preview screen is displayed. On this screen, all pending changes are clearly summarized so that the Admin can manually approve or discard each modification. Later on, an area is dedicated to Pending Edits where the system shows a badge with the number of unsaved updates. This section is closely integrated with a Change Log that captures all updates with clear timestamps and the names of the administrators who made the changes. 

For Operations team members, the interface provides comprehensive tools for reservation management, stock reconciliation, and reporting. They can view all inventory regardless of status, manage reservations, and access administrative functions for overriding standard workflows when necessary. Each reservation can be tracked from initial request through payment confirmation to final delivery, with a complete audit trail of all actions taken.

For Sales Staff, the flow after login leads to an interface optimized for data viewing. They are not given options to modify the records. Instead, their view is focused on extensive filtering options to search by brand, model, trim, or fuel type, and a sorting feature which organizes data by criteria such as alphabetical order or stock quantity. Sales staff can also see incoming inventory (pre-sale) to inform customers about future availability. When they need to reserve a vehicle, they use a streamlined reservation form that initiates the approval workflow described earlier. Navigation between these pages is streamlined by clear buttons and labels, ensuring that all pages are connected and that the user can always return to the main dashboard with ease.

### Add Vehicle Workflow

The Add Vehicle workflow has been implemented with a focus on user efficiency and data accuracy. When a user clicks the "Add Vehicle" button, a modal opens with a form containing the following key components:

1. **Brand Selection**: The BrandCombobox component allows users to:
   - Search through existing brands with real-time filtering
   - Select a brand from the dropdown list
   - Add a new brand if the desired one doesn't exist
   - Clear their selection if needed

2. **Model Input**: After selecting a brand, users can specify the vehicle model.

3. **Trim Selection**: Users can select or specify the trim level for the vehicle.

4. **Additional Details**: Fields for other vehicle specifications such as color, year, and features.

5. **Submit Controls**: Buttons to submit the form or cancel the operation.

The form includes validation to ensure all required fields are completed before submission. When the form is submitted, the system creates a new vehicle entry in the inventory database, making it available for the Add Units workflow where specific unit quantities can be specified.

## Email Integration and Notification System

A critical component of the application is its seamless email integration for payment confirmations and workflow notifications. When a reservation is submitted, the system automatically generates notification emails to relevant parties. For payment confirmations, the system sends emails with secure verification links to the accounts team's shared mailbox. These links lead to a simple web interface where accounts team members can view reservation details, select their name from a dropdown, and confirm the payment. After confirmation, the system automatically sends an email reply to the original thread with confirmation details, and the link becomes inactive to prevent duplicate confirmations.

For payment rejections, a similar process allows the accounts team to indicate issues with the payment evidence, prompting the sales person to provide updated information. All email communications maintain the original email thread, creating a complete history of the reservation process that can be referenced by any team member. This approach leverages the existing email workflows familiar to the team while adding structure, accountability, and automation. Confirmation links expire after 48 hours for security, and the system provides options to revoke and regenerate links if needed. This email-based approach was specifically chosen to minimize disruption to the accounts team's existing workflow while still providing the benefits of a digital system.

## Settings and Account Management

Once a user is inside the dashboard, they have access to a user settings area where they can manage their personal information. This includes options to update their password, change contact details, and set personal preferences such as switching between light and dark mode. The settings page is accessible from a clear and simple menu in the header or sidebar, ensuring that users can make adjustments without disrupting their workflow. In addition to personal settings, there is a section where users can manage notification settings and review account activity. For users who need to update subscription or access rights, especially in an internal use case like this one, the corresponding sections are clearly marked. After making changes, users can effortlessly return to the main dashboard to continue their tasks without any extra steps.

## Reporting and Management Views

The system provides comprehensive reporting capabilities tailored to different user roles. For executive management, detailed reports show the complete inventory status across all branches, including reserved vehicles, cannibalized parts, and workshop items. These reports can be filtered by various criteria such as branch, vehicle type, status, and date range. Operations team members can generate detailed reservation reports, tracking payment status and customer information. The reporting engine allows for both standardized reports and custom queries, ensuring that stakeholders at all levels can access the information they need for decision-making. All reports can be exported to Excel format for further analysis or distribution, maintaining compatibility with existing reporting workflows while adding the benefits of real-time data accuracy.

## Error States and Alternate Paths

The application has been built to handle errors and alternate flows gracefully. If a user enters incorrect login information, clear error messages appear, prompting them to try again or use the forgot password option. When invalid data is entered during stock updates or bulk edits, the system immediately highlights the error with notification banners that explain the issue in simple language. In case of a lost connection or data synchronization error, the interface displays a banner alert and automatically attempts to refresh the session once connectivity is re-established. When an update is made, a small notification banner provides immediate feedback along with an undo option that is available for 5-10 seconds. For offline scenarios, the system includes fallback protocols such as standardized email templates that can be processed once the system is back online. These safeguards ensure that even when errors occur, the user is never left confused, and the system always guides them back into a normal flow.

## Data Management and Integration

The application carefully manages data across various sources and destinations. It imports data from the ERP system, maintains its own database for real-time updates, and exports data in formats compatible with existing executive reporting requirements. The system tracks each vehicle throughout its lifecycle, from initial stock entry through reservation, payment, delivery, and any special statuses like cannibalization or workshop repair. Historical data is preserved to allow for trend analysis and audit requirements. The database implementation initially uses MCP in Cursor for rapid development, with a planned migration path to direct Supabase integration if needed as the system scales. This approach balances immediate development needs with long-term scalability requirements. Role-based access controls ensure that sensitive data is only visible to authorized users, with audit logging for all data modifications.

## Conclusion and Overall App Journey

From the moment a staff member accesses the application via a landing page, they experience a well-organized and secure workflow. The journey begins with a simple sign-up or login process that strictly enforces company domain restrictions. Depending on whether the user is an Admin, Operations Staff, or Sales Staff, they are directed to an interface that enhances their specific needs, whether it is in-depth inventory management and editing for Admin users, comprehensive reservation management for Operations team members, or a detailed, filterable view of available inventory for Sales Staff. The reservation system streamlines what was previously a manual process, using email integration to maintain familiar workflows while adding structure and automation. Every action from bulk updates and real-time data synchronization to error handling and undo capabilities has been thoughtfully integrated into the overall design. The system's ease of navigation, combined with clear notification and settings options, ensures that internal staff can manage vehicle inventory with confidence, clarity, and efficiency.

## Implementation Progress (March 2025)

As of March 2025, significant progress has been made on the inventory management interface:

- The dashboard with brand filtering and accordion view has been completed
- The BrandCombobox component has been fully implemented with search functionality and "Add New Brand" capability
- Work is underway on the Add Vehicle Modal form fields, with the brand selection component completed
- Next steps include implementing the Model and Trim input fields, followed by the Add Units Modal
- The system is being prepared for MCP database integration to store and retrieve inventory data

The implementation follows a component-first approach, ensuring that each UI element is thoroughly tested and documented before integration into the larger system. This approach has already yielded benefits in terms of code quality and maintainability, particularly with complex components like the BrandCombobox that require sophisticated event handling and state management.
