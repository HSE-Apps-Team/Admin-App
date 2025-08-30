const menuData = {
  schedule: {
    title: "Schedule Editor Menu",
    items: [
      {
        title: "Main Schedules",
        description:
          "Edit the two main schedules for the Schedule App: Royal and Gray days",
        href: "/schedule",
      },
      {
        title: "Special Schedules",
        description: "Create new schedules for special event days",
        href: "/schedule/special",
      },
      {
        title: "Events OLD",
        description: "Create new events that use special schedules",
        href: "/schedule/events",
      },
     
      {
        title: "Announcements",
        description: "Create announcements that appear on the schedule app",
        href: "/schedule/announcements",
      },
      {
        title: "Calendar",
        description: "Edit the calendar and summer clock",
        href: "/schedule/calendar",
      },
    ],
  },
  courses: {
    title: "Course Editor Menu",
    items: [
      {
        title: "Courses",
        description: "Create, edit, and delete courses",
        href: "/courses",
      },
      {
        title: "Diplomas",
        description: "Update diploma requirements and graduation information",
        href: "/courses/diploma",
      },
      {
        title: "Subjects and Tags",
        description: "Update list of subjects and credits",
        href: "/courses/subjects",
      },
    ],
  },
};

export default menuData;
