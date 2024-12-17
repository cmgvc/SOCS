# Flock: Book Meeting Website for McGill School of Computer Science

Flock is a responsive meeting management platform designed to streamline scheduling between faculty and students at the McGill School of Computer Science. Built with the MERN stack (MongoDB, Express.js, React.js, and Node.js), it offers comprehensive functionalities for meeting creation, booking, management, and customization.

## Live Site
Access the website here: [Flock Live Site](http://fall2024-comp307-group04.cs.mcgill.ca:3000/)

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Site Overview](#site-overview)
- [User Roles](#user-roles)
- [Key Functionalities](#key-functionalities)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)

---

## Features
- **User Authentication**: Sign up, log in, log out, and manage user settings.
- **Faculty-Student Integration**: Faculty can create availabilities, and students (and faculty) can book meetings.
- **Responsive Design**: Optimized for use on different device sizes.
- **Email Notifications**: Automated confirmation emails upon successful booking.
- **Dashboard**: Personalized dashboard to manage meetings.
- **Availability Management**: Faculty can create, block, and manage meeting slots.
- **Meeting Booking System**: Supports 1-on-1 and group bookings with automatic availability updates.
- **Request Alternate Meetings**: Students can propose specific meeting times for faculty review.

---

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer

---

## Setup
To run Flock locally:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Flock
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd frontend-flock
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
    MONGODB_URI=mongodb://localhost:27017/Flock
    JWT_SECRET=jK9y47H&sk2x!dZP03tX$lwk1m!Y^92NzVhx9-18s@*qLB
    PORT=5001
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=mcgill.cs.noreply@gmail.com
    EMAIL_PASS=cclc qpsr alhc llwg
     ```

4. **Run the Application**:
   ```bash
   # Run the backend
   cd backend-flock
   node server.js

   # Run the frontend
   cd frontend-flock
   npm start
   ```

5. **Access the Site**:
   Visit `http://localhost:3000` in your browser.

---

## Site Overview
Upon accessing Flock, users are greeted with:
1. **Home Page**:
   - Displays the platform's key functionalities.
   - Includes a demo video showcasing features.
   - Navigation bar for easy access to all pages.
   - Footer for links to related McGill websites.

2. **Navigation Bar**:
   - **Logged Out**: Access to "Sign In", "Sign Up", "Book Meeting", and redirects for the dashboard.
   - **Logged In**: Additional faculty-exclusive pages, including "Create Booking" and "Block Availabilities".

---

## User Roles
### 1. **Non-Faculty Users** (Students):
- **Book Meetings** using provided URLs.
- **View Dashboard** for upcoming, past, and requested meetings.
- **Request Alternate Meetings** for specific professors.
- **Cancel Meetings** from their dashboard.
- **Sign In / Sign Up** to manage bookings and receive confirmations.

### 2. **Faculty Members**:
- **Create Availabilities** for meetings (weekly recurring or specific dates).
- **Block Off Times** when unavailable for meetings.
- **Manage Created Meetings**:
   - View participants.
   - Cancel meetings and their time slots.
- **Accept/Decline Meeting Requests** submitted by students.
- **Book into Other Faculty Meetings** (excluding their own).
- **View Dashboard** with advanced filters and "My Availabilities".

---

## Key Functionalities
### 1. **Meeting Creation (Faculty)**
- Faculty can create meetings (e.g., COMP307 Office Hours).
- Generate a shareable **meeting URL** for students.
- Set **weekly recurring** or **specific-date availabilities**.

### 2. **Meeting Booking (Students)**
- Use a valid meeting URL to view and book time slots.
- 1-on-1 slots disappear once fully booked unless canceled.
- Confirmation email sent upon successful booking.

### 3. **Dashboard**
- Students:
   - View "Upcoming Meetings", "Past Meetings", and "Requested Meetings".
   - Cancel upcoming meetings.
- Faculty:
   - View created meetings and their participants.
   - Filter meetings (e.g., personal bookings or all bookings).
   - Accept or decline requested meetings.
   - View "Past Meetings" and "My Availabilities" with booking URLs.

### 4. **Block Availabilities (Faculty)**
- Block off times when unavailable to prevent bookings or requested meetings.

### 5. **Request Alternate Meetings (Students)**
- Submit a custom time and date request for a faculty member.
- Faculty can accept or decline these requests.

### 6. **Email Notifications**
- Confirmation emails are sent for all bookings.
- Users without accounts must provide an email address to receive booking details.

---

## How It Works
1. **Faculty Workflow**:
   - Log in > Create Meeting > Share URL > Manage bookings and requests.
2. **Student Workflow**:
   - Obtain URL > Book Meeting > View Dashboard > Cancel/Manage bookings.
3. **Email Flow**:
   - Booking confirmation > Notification upon booking success.
4. **Dashboard Management**:
   - Sorted by Upcoming, Past, and Requested meetings.
   - Easy-to-use filters for faculty users.

---

## Screenshots
### 1. **Home Page**
*Image of homepage with demo video and key features.*

### 2. **Dashboard (Student)**
*Image showing upcoming, past, and requested meetings.*

### 3. **Book Meeting**
*Image showing book meeting page for recurring and non-recurring meetings.*

### 4. **Request Meeting**
*Image showing request meeting page for a specific faculty member.*

### 5. **Create Meeting (Faculty)**
*Image of meeting creation page with options for recurring slots.*

### 6. **Block Availabilities (Faculty)**
*Image showing the block availability feature.*

---

## Future Improvements
- Add calendar integration (e.g., Google Calendar).
- Enhanced search and filtering options.
- Real-time notifications for booking updates.

---

## Contributors
- **Chloe Gavrilovic** - Book Meetings, Dashboard, Log Out, Navbar, Footer
- **Emily Roest** - Block Availabilities, Home Page
- **Danielle Wahrhaftig** - Create Meetings, Log In, Sign Up, User Settings
- **Jacob Weldon** - Request Alternate Meetings

---

## Contact
For questions or feedback, please contact: [chloe.gavrilovic@mail.mcgill.ca](mailto:chloe.gavrilovic@mail.mcgill.ca), [emily.roest@mail.mcgill.ca](mailto:emily.roest@mail.mcgill.ca), [danielle.wahrhaftig@mail.mcgill.ca](mailto:danielle.wahrhaftig@mail.mcgill.ca), [jacob.weldon@mail.mcgill.ca](mailto:jacob.weldon@mail.mcgill.ca), 

___
## Detailed Personal File Contribution
- **Chloe Gavrilovic** 
    - Backend
        - backend-flock/models/Availability.js
        - backend-flock/models/User.js
        - backend-flock/routes/availabilities.js
        - backend-flock/routes/auth.js
        - backend-flock/routes/meetings.js
        - backend-flock/routes/faculty.js
        - backend-flock/server.js
    - Frontend
        - frontend-flock/components/BookMeeting (booking-calendar.css, booking-page.css, BookingCalendar.js, BookingPage.js, meeting-modal.css, MeetingModal.js)
        - frontend-flock/components/Footer.js
        - frontend-flock/components/MeetingCard.js
        - frontend-flock/components/Navbar.js
        - frontend-flock/pages/BookMeeting.js
        - frontend-flock/pages/Dashboard.js 
        - frontend-flock/styles/BookMeeting.css
        - frontend-flock/styles/Dashboard.css
        - frontend-flock/styles/Footer.css
        - frontend-flock/styles/Navbar.css
        - frontend-flock/App.js
        - frontend-flock/index.css