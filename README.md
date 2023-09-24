# HSE Admin App

The HSE Admin App is a comprehensive web application designed specifically for school administrators to manage and organize various aspects of school administration with ease. The app streamlines the management of schedules, events, announcements, courses, and diploma programs. It offers an intuitive interface for creating and editing regular and special schedules, managing school events and announcements, and handling course-related data. Furthermore, it provides functionality to add, edit, and delete subjects and tags associated with courses, and manage diploma programs. Built with Next.js, this app is a one-stop solution for efficient school administration.

## Features

1. **Announcements Management**: Add, edit, and delete school announcements.
2. **Events Management**: Add, edit, and delete school events, including special schedules and no-school days.
3. **Main Schedules Management**: Edit existing schedules, change period details, and save or reset the schedule cache.
4. **Special Schedules Management**: Create and manage custom special schedules, including adding periods, setting lunch periods, and changing period details.
5. **Courses Management**: Add, edit, delete, and fetch course data, including course names, descriptions, requirements, additional information, and more.
6. **Subjects and Tags Management**: Add, edit, and delete subjects and tags associated with courses. Update related course documents when subjects or tags are updated or deleted.
7. **Diploma Programs Management**: View, add, edit, and delete diploma programs. Update diploma program data for the entire collection at once.

## Prerequisites

Before running the HSE Admin App, make sure you have the following environment variables set:

- `COURSES_MONGODB_URI`: The connection URI for the MongoDB instance holding course-related data.
- `SCHEDULE_MONGODB_URI`: The connection URI for the MongoDB instance holding schedule-related data.

These variables should be placed in a `.env.local` file at the root of the project.

Example:

```bash
COURSES_MONGODB_URI=mongodb://username:password@host:port/database?options
SCHEDULE_MONGODB_URI=mongodb://username:password@host:port/database?options
```

## How to run the app

HSE Admin App is built with Next.js. To run the app, follow these steps:

1. Make sure you have Node.js and npm (or yarn) installed on your machine. You can download Node.js from [the official website](https://nodejs.org/). npm comes bundled with Node.js.

2. Clone the repository:

   ```
   git clone https://github.com/yourusername/hse-admin-app.git
   ```

3. Change to the project directory:

   ```
   cd hse-admin-app
   ```

4. Install the dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn
   ```

5. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

6. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the app.

## Deploying the app

To deploy the app, you can use Vercel, the platform built by the creators of Next.js.
