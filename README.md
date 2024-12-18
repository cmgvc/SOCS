# Flock: Book Meeting Website for McGill School of Computer Science

Flock is a responsive meeting management platform designed to streamline scheduling between faculty and students at the McGill School of Computer Science. Built with the MERN stack (MongoDB, Express.js, React.js, and Node.js), it offers comprehensive functionalities for meeting creation, booking, management, and customization.

## Live Site
Access the website here: [Flock Live Site](http://fall2024-comp307-group04.cs.mcgill.ca:3000/)

Make sure to use http not https, and include the port (:3000) at the end of the url. If you're not on McGill campus, you must use the McGill vpn.

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
- [Detailed File Contributions](#detailed-personal-file-contribution)

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
   cd SOCS
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
<img width="1381" alt="Screenshot 2024-12-17 at 4 54 39 PM" src="https://github.com/user-attachments/assets/0ce5e1fd-fa3f-4edc-a3f0-8528dfed3ece" />

### 2. **Dashboard (Student and Faculty)**
<img width="1505" alt="Screenshot 2024-12-17 at 4 57 39 PM" src="https://github.com/user-attachments/assets/51e9ac70-2df4-4d06-b8e4-73a9233f1032" />
<img width="1499" alt="Screenshot 2024-12-17 at 4 58 03 PM" src="https://github.com/user-attachments/assets/6fe2bfee-b8eb-4a34-a40d-b39f4f4a6601" />
<img width="1498" alt="Screenshot 2024-12-17 at 4 59 10 PM" src="https://github.com/user-attachments/assets/9e339b33-c637-4c43-a82b-35e277e6a07b" />
<img width="1504" alt="Screenshot 2024-12-17 at 4 59 28 PM" src="https://github.com/user-attachments/assets/687d395b-2355-45eb-a47f-c31dc4106e72" />
<img width="1487" alt="Screenshot 2024-12-17 at 4 59 56 PM" src="https://github.com/user-attachments/assets/baab006c-a93b-403d-8ff5-c146a71b71cb" />

### 3. **Book Meeting**
<img width="1493" alt="Screenshot 2024-12-17 at 4 55 52 PM" src="https://github.com/user-attachments/assets/8b7e429a-c8b7-47d4-9dfb-d23b4815d5cd" />
<img width="1373" alt="Screenshot 2024-12-17 at 5 03 58 PM" src="https://github.com/user-attachments/assets/5a25d2c8-8fd1-459a-8c72-765b23381ca6" />


### 4. **Request Meeting**
<img width="1377" alt="Screenshot 2024-12-17 at 4 57 10 PM" src="https://github.com/user-attachments/assets/298e39fd-8dac-4135-a07a-a6f1b9502516" />

### 5. **Create Meeting (Faculty)**
<img width="1509" alt="Screenshot 2024-12-17 at 4 56 32 PM" src="https://github.com/user-attachments/assets/ba6931a2-f89b-41d3-a293-9050e7de1e86" />

### 6. **Block Availabilities (Faculty)**
<img width="1501" alt="Screenshot 2024-12-17 at 4 58 49 PM" src="https://github.com/user-attachments/assets/c4fb69b5-bdbc-4498-8341-178fd439c521" />


---

## Future Improvements
- Enhanced search and filtering options.
- Real-time notifications for booking updates.

---

## Contributors
- **Chloe Gavrilovic** - Book Meetings, Dashboard, Log Out, Navbar, Footer
- **Emily Roest** - Block Availabilities, Home Page
- **Danielle Wahrhaftig** - Create Meetings, Log In, Sign Up, User Settings
- **Jacob Weldon** - Request Alternate Meetings, Professor Look Up, Date Select Calendar Component

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
- **Jacob Weldon**
    - Backend
        - backend-flock/routes/alternateMeetings.js
    - Frontend
        - frontend-flock/src/components/date-select-calendar.jsx
        - frontend-flock/src/styles/date-select-calendar.css
        - frontend-flock/src/private/MeetingRequests.css
        - frontend-flock/src/private/MeetingRequests.jsx
        - frontend-flock/src/private/ProfLookup.css
        - frontend-flock/src/private/ProfLookup.jsx
- **Emily Roest**
    - Backend
        - backend-flock/models/Unavailability.js
        - backend-flock/routes/unavailabilities.js
        - backend-flock/server.js
    - Frontend
        - frontend-flock/src/assets/schedule.mp4
        - frontend-flock/src/components/BlockPanel.jsx
        - frontend-flock/src/components/Calendar.jsx
        - frontend-flock/src/pages/BlockCalendar.js
        - frontend-flock/src/pages/Home.js
        - frontend-flock/src/styles/BlockCalendar.css
        - frontend-flock/src/styles/BlockPanel.css
        - frontend-flock/src/styles/Calendar.css
        - frontend-flock/src/styles/home.css
        - frontend-flock/src/App.js
- **Danielle Wahrhaftig**
    - Backend
        - backend-flock/models/Availability.js
        - backend-flock/models/User.js
        - backend-flock/routes/auth.js
        - backend-flock/server.js
    - Frontend
        - frontend-flock/src/components/Login/login-form.css
        - frontend-flock/src/components/Login/LoginForm.jsx
        - frontend-flock/src/components/Login/SignupForm.jsx
        - frontend-flock/src/components/Login/signup-form.css
        - frontend-flock/src/components/CreateBooking/CreateBookingSidebar.jsx
        - frontend-flock/src/components/CreateBooking/create-booking-sidebar.css
        - frontend-flock/src/components/CreateBooking/CreateBookingCalendar.jsx
        - frontend-flock/src/components/CreateBooking/create-booking-calendar.css
        - frontend-flock/src/components/CreateBooking/DoesNotRepeat.jsx
        - frontend-flock/src/components/CreateBooking/does-not-repeat.css
        - frontend-flock/src/components/CreateBooking/RepeatWeeklyAvailability.jsx
        - frontend-flock/src/components/CreateBooking/repeat-weekly-availabiliy.css
        - frontend-flock/src/components/CreateBooking/SchedulingWindow.jsx
        - frontend-flock/src/components/CreateBooking/scheduling-window.css
        - frontend-flock/src/components/CreateBooking/DropdownMenu.jsx
        - frontend-flock/src/components/CreateBooking/dropdown-menu.css
        - frontend-flock/src/pages/Login.js
        - frontend-flock/src/pages/login.css
        - frontend-flock/src/pages/Signup.js
        - frontend-flock/src/pages/Signup.css
        - frontend-flock/src/pages/Settings.js
        - frontend-flock/src/pages/settings.css
        - frontend-flock/src/pages/CreateBooking.js
        - frontend-flock/src/pages/create-booking.css
