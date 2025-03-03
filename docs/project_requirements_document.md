# Motors Stock Manager - Project Requirements Document

---

## 1. Project Overview

Motors Stock Manager is an internal web-based dashboard designed for automotive company staff to manage vehicle inventory, update stock levels, and streamline routine administrative tasks. The platform centralizes critical inventory data by providing a secure and easy-to-use interface tailored for different roles such as Admins (including Operations Managers) and Sales Staff.

This project is being built to simplify the complex task of managing vehicle stock by consolidating data, reducing manual errors, and ensuring real-time updates for all team members. The key objectives include ensuring secure, role-based access, enabling efficient bulk updates with a clear preview/confirmation step, and delivering a mobile-first, dark mode-friendly design that supports both quick decision-making and high data clarity.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**
- Implementation of standard email/password authentication with role-based access control (Admins & Sales Staff).
- A stock management system that allows:
  - Single-item and bulk updates for vehicle stock levels.
  - The ability to add/remove vehicle models, trims, and fuel types.
  - Management of vehicle statuses (Available, Display, Transit, etc.).
- A Pending Edits section that displays unsaved changes with a confirmation step before finalizing updates.
- A comprehensive Change Log which records every update with timestamps and user identifiers.
- Advanced filtering and sorting capabilities to organize inventory by brand, model, trim, fuel type, etc.
- A design that includes a mobile-friendly UI and a dark mode toggle for improved usability.
- Real-time data synchronization using Supabase real-time listeners, ensuring immediate updates without page refreshes.
- Error handling with immediate notifications and an option to undo changes within a 5-10 second window.

**Out-of-Scope:**
- Any additional authentication methods such as Single Sign-On (SSO) or Two-Factor Authentication (2FA) for now.
- Integrations with external systems such as ERP, CRM, or other databases.
- Auto-saving bulk updates without manual confirmation.
- On-premise deployment; the solution is strictly cloud-based.
- Additional user roles beyond Admin (including Ops Managers) and Sales Staff.
- Advanced approval workflows before applying updates.

---

## 3. User Flow

A new or returning user lands on a secure login page where they must enter their email and password. The system verifies that the email belongs to an approved company domain and assigns the user a role based on their credentials. Once logged in, the user is redirected to a personalized dashboard that tailors the available features according to their role.

Admins (including Operations Managers) see an interface with comprehensive stock management features, including options for individual and bulk editing of vehicle inventory. They are presented with a data-focused table, filter controls, and navigation elements that provide easy access to the Pending Edits section and Change Log. Sales Staff, on the other hand, see a read-only interface optimized for filtering and sorting vehicle inventory, ensuring they can quickly locate the information they need without the risk of accidental modifications.

---

## 4. Core Features (Bullet Points)

- **Authentication and Role-Based Access Control**
  - Standard email/password login.
  - Email domain restrictions to allow only authorized company users.
  - Role assignment: Admin (including Ops Managers) and Sales Staff.
  
- **Stock Management System**
  - Edit vehicle stock levels individually or in bulk.
  - Options to add or remove models, trims, and fuel types.
  - Ability to modify vehicle status (Available, Display, Transit, etc.).

- **Pending Edits & Change Log**
  - A Pending Edits section that collects unsaved changes.
  - A preview screen for bulk updates where changes can be confirmed or discarded.
  - A Change Log that records each update with timestamps and admin identifiers.

- **Filtering & Sorting**
  - Detailed filtering options by brand, model, trim, fuel type, and stock status.
  - Multiple sorting methods (alphabetical, newest, oldest, quantity).

- **User Interface Features**
  - Mobile-first design ensuring ease of use on smartphones and tablets.
  - Dark mode toggle for improved visual comfort.
  - Clean, minimalist layout with intuitive navigation and data-focused tables.
  
- **Error Handling & Undo Option**
  - Real-time error notifications via small banner messages.
  - A 5-10 second undo option after a change is made, allowing users to revert accidental updates.

- **Real-Time Synchronization**
  - Instant updates across sessions using Supabase real-time listeners with no need for page refreshes.

---

## 5. Tech Stack & Tools

- **Frontend:**
  - Built using Lovable’s frontend framework for rapid AI-driven web app generation.
  - Mobile-friendly design principles and component-based layout.
  
- **Backend:**
  - Lovable’s backend system integrated with Supabase.
  - Supabase Authentication for email/password login and role-based access.
  - Supabase Database for secure, scalable data storage.
  - Supabase Real-Time for live data synchronization across user sessions.
  - Supabase Storage (if needed) for any image or document storage related to vehicle models.

- **Other Tools & Integrations:**
  - Lovable’s integrated plugins and IDE support (for example, Cursor, Windsurf if needed) streamline development.
  - AI models (if applicable in future enhancements) can be integrated later for advanced analytics or predictive features.

---

## 6. Non-Functional Requirements

- **Performance:**
  - Ensure immediate synchronization of data changes across all sessions with minimal delay.
  - Fast load times across mobile and desktop platforms.

- **Security:**
  - Enforce company email restrictions on authentication.
  - Store sensitive data securely using Supabase’s built-in encryption and security protocols.

- **Usability:**
  - A simple, intuitive, data-focused interface that minimizes the learning curve.
  - Responsive design that adapts smoothly to multiple screen sizes.
  - Dark mode support to reduce eye strain in different lighting conditions.

- **Compliance:**
  - Adhere to internal company policies for data security and user privacy.
  - Ensure that audit trails via the Change Log meet accountability standards.

---

## 7. Constraints & Assumptions

- The system assumes that all staff members have access to a stable internet connection, as it is a cloud-based solution.
- Supabase services (database, authentication, and real-time listeners) are available and will be used as the primary backend.
- The tool will only allow login via company domain emails, as specified.
- No additional authentication measures (like SSO or 2FA) are planned for the initial version.
- The design is based on Lovable’s framework, with future flexibility to integrate more advanced AI-driven features if required.

---

## 8. Known Issues & Potential Pitfalls

- **Bulk Updates and Undo Functionality:**
  - Managing the state of bulk updates in a mobile-friendly interface may lead to occasional inconsistencies. Clear visual confirmation and reliable preview screens are necessary to mitigate accidental changes.
  
- **Real-Time Synchronization:**
  - Ensuring real-time updates across multiple sessions might face challenges with network latency or rate limits from Supabase. Testing under load and optimizing listener performance will be crucial.
  
- **User Role Differentiation:**
  - There is a clear need to prevent Sales Staff from accessing any modification features. Rigorous role validation and testing must be conducted to secure these boundaries.
  
- **Error Handling & Notifications:**
  - The timing for the undo option (5-10 seconds) must be strictly enforced. It is essential to communicate clearly to users when this window has expired to avoid confusion.
  
- **Mobile Optimization:**
  - Creating a smooth and fully functional mobile experience, especially for bulk update interfaces, may require additional attention to responsive design and testing on various devices.

---

This document provides a complete and unambiguous overview of Motors Stock Manager. It serves as the foundation for generating subsequent technical documents and guides the AI in understanding every aspect and requirement of the project.