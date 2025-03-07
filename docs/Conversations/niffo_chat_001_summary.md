# RT Inventory System - Operational Workflows Summary

## Current Process Overview

### Data Sources
- **Dispatch Register**: Contains serial numbers, dates, and reconciliation data
- **Serial No Details**: Complete inventory data from ERP
- **Reservation Sheet**: Excel file created manually from emails/WhatsApp messages

### Inventory Management Process
1. Download Dispatch Register from ERP
2. Download Serial No Details from ERP
3. Cross-reference Dispatch Register with Reservation Sheet to identify delivered vehicles
4. Check emails and WhatsApp for new reservations
5. Update two separate stock reports:
   - **Group Chat Stock**: Only available vehicles (for sales team)
   - **Executive Management Stock**: Complete inventory including reserved, cannibalized, and workshop vehicles

### Reservation Process
1. Customer shows interest and pays at least 50% of vehicle cost
2. Sales person creates PFI (Proforma Invoice)
3. Email sent requesting reservation with PFI and payment evidence attached
4. Copied to operations team and accounts team
5. Accounts confirms payment receipt
6. Operations updates reservation sheet and removes vehicle from available stock

## Key Issues & Requirements

### Pain Points
1. **Manual Tracking**: Reservation process is entirely manual via email/WhatsApp
2. **Inventory Accuracy**: Without proper reservations, stock is never accurate
3. **Branch Coordination**: Some branches (like Abuja) maintain separate reservation sheets
4. **Confirmation Delays**: Accounts sometimes delay payment confirmation replies
5. **Information Silos**: Different teams need different views of the same data

### User Requirements

#### Sales Team Needs:
- View of available stock in real-time
- View of incoming stock ("pre-sale")
- Ability to submit reservation requests with customer details

#### Operations Team Needs:
- Complete view of all stock (available, reserved, cannibalized)
- Ability to approve/manage reservations
- Branch-specific tracking
- Customer and payment tracking

#### Accounts Team Needs:
- Payment confirmation workflow
- No additional app (email notifications preferred)

### Special Cases
- **Management Reservations**: Some reservations marked as "management management" require special handling
- **Partial Payments**: System needs to track percentage paid
- **Third-party Payments**: Need to handle cases where someone pays on behalf of the customer
- **Vehicle Reassignment**: PDI may need to assign different VINs due to vehicle issues

## Proposed Solution Components

### Simplified Reservation System (Version 1.0)
- Streamlined system that handles reservations directly in the app:
  - Customer name
  - Branch
  - Reservation date
  - Vehicle details (brand, model, color)
  - Sales person
  - Remarks
  - Basic payment status (pending/confirmed)

### Payment Evidence
- "Payment Advice" can include various formats:
  - Screenshots of transfers (with sensitive balance information redacted)
  - Transfer receipts
  - Bank confirmation messages
  - Other proof of payment

### Implementation Approach (Version 1.0)

#### Streamlined Workflow
1. Sales person sees available stock in app
2. Sales person submits reservation directly in app (marking vehicles as "pending reservation")
3. App automatically sends notification email to accounts/operations with reservation details
4. Sales person attaches payment evidence via email reply (keeping sensitive info out of email thread)
5. **Email-Based Payment Confirmation:**
   * Email contains a unique secure confirmation link
   * Email sent to accounts@mikanomotors.com shared mailbox
   * Clicking the link opens a simple web page with:
     * Reservation details summary
     * Dropdown list of accounts team members
     * "Confirm Payment" button
   * Accounts team member selects their name and clicks "Confirm Payment"
   * Confirmation automatically updates reservation status
   * System logs the selected name, timestamp, IP address
   * **After confirmation is submitted:**
     * Confirmation link becomes invalid only after the confirmation button is clicked
     * Multiple people can click the link to view, but only one can successfully submit confirmation
     * System automatically sends email reply to the original thread
     * Reply includes who confirmed, when, and confirmation details
     * Email recipients include: accounts team, operations team, original sales person, and PDI team
     * Reply maintains the email thread context for future reference
   * Inventory status updated in real-time
6. System updates inventory in real-time when confirmation received

#### Benefits of Email Confirmation Approach
* Works with shared mailbox setup
* No individual user accounts needed
* Creates digital audit trail of confirmations
* Prevents forgotten/delayed confirmations
* Reduces manual data entry for operations team
* Quick to implement for Version 1.0
* Email thread provides complete history of the reservation process

### Security Considerations
- No sensitive payment information stored in app
- Email system handles confidential attachments
- App stores only reservation status and vehicle allocation
- Access control for different levels of inventory visibility
- Confirmation links expire after 48 hours for security
- Links invalidated only after confirmation is successfully submitted
- Option to revoke and regenerate confirmation links if needed

## Branch-specific Workflows
- Abuja maintains separate reservation processes
- Special handling for management-approved reservations
- Different approval flows based on branch and customer type

## Data Management
- Need to maintain both real-time app data and Excel reports for executive management
- Vehicle status tracking across the entire lifecycle
- Integration with existing ERP export processes

## Future Enhancements (Version 2.0+)
- Accounts dashboard for payment confirmation
- Branch reservation synchronization
- Advanced reporting capabilities
- Direct ERP integration (if possible)
- Mobile app for sales team

## Addressing Implementation Gaps

### 1. Payment Rejection Flow
**Gap**: No process for dealing with incorrect or problematic payments  
**Suggestion**: Add "Reject Payment" option to confirmation page
* Include simple dropdown with common rejection reasons
* System sends rejection notification email to all parties
* Reservation marked as "Payment Rejected" in system
* Original sales person can update with new payment evidence
* Reservation remains in "pending" state until resolved

### 2. Partial Payments & Updates
**Gap**: Need way to track partial payments and completion  
**Suggestion**: Simple status transitions
* Add payment status dropdown on confirmation page: "Full Payment" or "Partial Payment"
* For partial payments, confirmation email notes "Partially Paid"
* New "Update Payment" button appears on reservation details for operations

**Full Payment Update Process**:
* When sales person receives proof of full payment:
  * They reply to the original email thread with new payment evidence
  * Email subject prefixed with "[Full Payment Completed]" for visibility
  * App sends a new confirmation link to accounts team
  * Same confirmation process occurs for the final payment
  * System updates reservation status from "Partially Paid" to "Fully Paid"
  * All updates maintain connection to the original reservation
  * History log in system shows payment progression

* Same email notification system used for payment completion
* Keeps process familiar while adding minimal complexity

### 3. Management Reservations
**Gap**: Special handling for management overrides  
**Suggestion**: Simplified approval flags
* Add "Management Approved" checkbox on reservation form
* When checked, system bypasses payment confirmation requirement
* Still logs who made the management reservation
* Alert sent to operations team for these special cases
* Maintains special process without creating separate workflows

### 4. Vehicle Reassignment
**Gap**: Need way to swap vehicles for same reservation  
**Suggestion**: "Reassign Vehicle" function
* Operations can select "Reassign Vehicle" on reservation details
* Simple form to select new vehicle from available inventory
* System maintains reservation history with reassignment note
* Email notification sent to all parties about the change in the original email thread
* Original reservation data preserved for audit purposes

### 5. Offline Contingency
**Gap**: What happens when system is unavailable  
**Suggestion**: Email fallback protocol
* Create standard "Offline Reservation" email template
* Operations processes these manually when system returns
* Standardized subject line makes these easy to find
* Simple bulk import tool for operations to process backlog
* Temporary shared tracking spreadsheet for critical outages

### 6. Data Migration Strategy
**Gap**: How to handle existing reservations  
**Suggestion**: Phased migration approach
* One-time import of active reservations by operations team
* Import only key data: customer, vehicle, date, status
* Start with most recent reservations first
* Run parallel systems for 2 weeks during transition

### 7. User Training & Adoption
**Gap**: Ensuring user acceptance and proper usage  
**Suggestion**: Multi-channel training approach
* Create short (2-3 minute) task-specific video tutorials
* Run in-person training sessions with hands-on exercises
* Develop simple one-page quick reference guides
* Designate team champions in each department
* Focus on Lagos VI branch first before national rollout

### 8. Emergency Operations Override
**Gap**: Need for manual intervention in special cases  
**Suggestion**: Admin functions within inventory app
* Add admin section to main inventory application
* Allows status changes with mandatory reason field
* All manual changes prominently marked in system
* Notification sent to management for monitoring
* Complete audit log of all manual interventions 