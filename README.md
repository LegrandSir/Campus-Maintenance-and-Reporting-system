# CampusFix - Campus Maintenance and Reporting System

## Overview
CampusFix is a centralized campus maintenance and reporting platform designed to simplify the reporting, tracking, and resolution of maintenance issues within a university environment (customized for USIU-Africa).

The system allows students and faculty to report issues such as electrical faults, plumbing problems, damaged facilities, or ICT-related concerns. Once a complaint is submitted, the system automatically routes the issue to the appropriate maintenance office, enabling faster response times and improved communication between stakeholders.

Users can monitor repair progress, receive maintenance notices, and provide feedback once issues have been resolved.

---

## Problem Statement
Students and faculty often experience difficulty reporting maintenance issues because communication channels are unclear, response times are slow, and there is limited visibility into the status of reported problems.

CampusFix addresses these challenges by providing:
* A single platform for reporting maintenance issues
* Automatic ticket routing
* Status tracking and notifications
* Administrative monitoring and reporting

---

## Objectives
* Improve maintenance issue reporting on campus
* Increase transparency in repair processes
* Enable efficient communication between users and maintenance teams
* Reduce response and resolution times
* Provide administrative oversight of maintenance operations

---

## Main Features

### User Authentication
* Secure JWT-based login system
* Role-based access control (Students, Faculty, Facility Desk)

### Ticket Management
* Submit maintenance complaints customized for campus facilities
* Assign issue category and priority
* Generate unique ticket numbers

### Issue Tracking
* Monitor repair progress via dynamic tracking progressions
* View ticket status updates in real-time
* Receive system notifications and campus alerts

### Maintenance Operations
* Interactive Kanban Board with drag-and-drop status updates
* Manage assigned tickets and update repair statuses
* Track resolution times and average response metrics

### Administrative Functions
* Manage users and offices
* Configure issue categories
* Publish campus maintenance alerts

---

## Technologies Used

**Backend**
* Python
* Flask
* Flask-SQLAlchemy & Flask-Migrate
* JWT Authentication (Flask-JWT-Extended)

**Database**
* PostgreSQL

**Frontend**
* React (Vite)
* Tailwind CSS
* Lucide React (Icons)
* React Router

**Collaboration Tools**
* GitHub (Projects & Issues)
* Figma
* Slack

---

## Project Structure

```text
Campus-Maintenance-and-Reporting-system/
│
├── backend/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── seed.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md