# CampusFix - Campus Maintenance and Reporting System

## Overview

CampusFix is a centralized campus maintenance and reporting platform designed to simplify the reporting, tracking, and resolution of maintenance issues within a university environment.

The system allows students and faculty to report issues such as electrical faults, plumbing problems, damaged facilities, or ICT-related concerns. Once a complaint is submitted, the system automatically routes the issue to the appropriate maintenance office, enabling faster response times and improved communication between stakeholders.

Users can monitor repair progress, receive maintenance notices, and provide feedback once issues have been resolved.

---
## Problem Statement

Students and faculty often experience difficulty reporting maintenance issues because communication channels are unclear, response times are slow, and there is limited visibility into the status of reported problems.

CampusFix addresses these challenges by providing:

-A single platform for reporting maintenance issues
-Automatic ticket routing
-Status tracking and notifications
-Administrative monitoring and reporting

---

## Objectives

-Improve maintenance issue reporting on campus
-Increase transparency in repair processes
-Enable efficient communication between users and maintenance teams
-Reduce response and resolution times
-Provide administrative oversight of maintenance operations

---

## Main Features

### User Authentication
-Secure login system
-Role-based access control

### Ticket Management
-Submit maintenance complaints
-Assign issue category and priority
-Generate unique ticket numbers

### Issue Tracking
-Monitor repair progress
-View ticket status updates
-Receive notifications

### Maintenance Operations
-Manage assigned tickets
-Update repair status
-Track resolution times

### Administrative Functions
-Manage users
-Manage offices
-Configure issue categories
-Publish campus maintenance alerts

---

### Technologies Used

### Backend
-Python
-Flask
-SQLAlchemy
-Flask-Migrate
-JWT Authentication

### Database
-PostgreSQL

### Frontend
-React

### Collaboration Tools
-GitHub
-GitHub Projects
-GitHub Issues
-Figma
-Slack

---

## Project Structure

``` text
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
└── README.md
```

## Current Progress

The project is currently under active development as part of the SWE3020B Software Quality Assurance and Security course.

### Completed

- Repository setup and project organization
- Backend folder structure implementation
- Database configuration and migrations
- Model creation and database design
- API route organization
- GitHub project management setup
- Initial project documentation

### In Progress

- Dashboard development
- Frontend implementation using React
- Authentication and authorization features
- Ticket management endpoints
- Maintenance notification functionality
- Testing and quality assurance

### Planned

- User feedback functionality
- Performance testing
- Final system integration
- Deployment preparation
- Project demonstration and evaluation

## Project Status

Sprint 1 is focused on establishing the system architecture, implementing core backend functionality, developing the frontend interface, creating project documentation, and preparing the foundation for future features.

## License

This project was developed for academic purposes as part of the SWE3020B Software Quality Assurance and Security coursework.
