# EduCore

EduCore is an online learning platform where instructors publish courses and students enroll, work through lessons and see how far along they are. It is a smaller, focused take on what Udemy and Coursera do.

This is my Sprint 13 capstone blueprint. It covers the product requirements, wireframes and database design. Development starts in Sprint 14.

- **Track:** Fullstack (Track B), individual capstone
- **Figma wireframes:** [EduCore wireframes](https://www.figma.com/design/P5Ub9lLRkLGAropagK7uxS/prodesk-project)
- **Status:** Planning done, MVP build starts next sprint

---

## The problem

Self-learners and small instructors usually end up juggling YouTube playlists, PDFs and notes. There is no single place to follow a structured course and see your progress.

EduCore is that place. An instructor builds a course out of ordered lessons. A student finds it, enrolls, ticks off lessons as they finish them and always sees a progress percentage.

## Who uses it

| Role | What they can do |
|---|---|
| Student | Sign up, log in, search and filter courses, enroll, watch lessons, mark lessons complete, see progress |
| Instructor | Everything a student can do, plus create, edit and delete their own courses and lessons |

The role is picked at sign up (the Student / Instructor toggle on the auth screen) and checked again on the server, so the UI is never the only gatekeeper.

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** JWT, passwords hashed with bcrypt
- **Hosting:** Vercel for the frontend, Render for the backend
- **Design and diagrams:** Figma, dbdiagram.io

I chose the same stack I used in Sprints 08 to 12 (React, Express, Mongoose) so that the sprints ahead go into building the product and not into learning new tools.

## Core features

**Must have (MVP, Sprint 14)**
1. Register and log in, with student or instructor role
2. JWT-protected API with role-based access
3. Course catalog with search and category filter
4. Course page with lesson list and video player
5. Enroll in a course

**Full feature set (Sprint 15)**
6. Mark lessons complete and track progress per course
7. "Continue Learning" section on the dashboard
8. Instructors create, edit and soft-delete their courses
9. Instructors add, edit, reorder and remove lessons

**Polish (Sprints 16 and 17)**
10. Loading, empty and error states everywhere
11. Fully responsive layout
12. One AI-powered feature, finalised in Sprint 16
13. CI/CD and live deployment

**Deliberately left out:** payments, certificates, reviews, live classes, discussion forums, direct video uploads (lessons use video links) and dark mode. These are version 2 ideas. Keeping the list short is what makes the five-week timeline realistic.

## Wireframes

The Figma file has three screens, each in desktop (1440 px) and mobile (375 px):

- **Auth:** login form, Student / Instructor toggle, sign up link and a tagline panel that is hidden on mobile
- **Dashboard:** navbar with search, "Continue Learning" cards with progress bars, category chips and the "All Courses" grid
- **Course Details:** video player, title and description, and a lesson list with completion state and overall progress

The look is light and clean: one indigo accent (`#4F46E5`), Inter font, rounded cards and the same navbar on every screen. On mobile the course grid becomes a single column and the lesson list sits below the video.

## Database design

![EduCore ERD](docs/erd.png)

The diagram source is in [`docs/erd.dbml`](docs/erd.dbml). Paste it into [dbdiagram.io](https://dbdiagram.io) to open or edit it.

There are five collections:

| Collection | What it holds | Relations |
|---|---|---|
| `users` | Student and instructor accounts | One instructor has many courses. One student has many enrollments |
| `courses` | Catalog entries | Belongs to one instructor, has many lessons |
| `lessons` | Ordered lessons of a course | Belongs to one course |
| `enrollments` | A student joining a course | One per student and course pair |
| `progress` | Lessons an enrollment has completed | One per enrollment and lesson pair |

A few decisions behind the schema:

- **Progress is calculated, not stored.** Completed lessons divided by total lessons, worked out when needed. A stored percentage would go out of date the moment an instructor adds or removes a lesson.
- **Courses are soft-deleted** with a `deleted_at` field, so students who already enrolled keep their history.
- **Lessons have a `position` field**, so ordering and drag-to-reorder can come later without changing the schema.
- **Ratings on the course cards are seeded values** in the MVP. A real review system is out of scope.

## Planned API

Every route sits under `/api`. Routes marked (auth) need a valid JWT.

| Area | Routes | Who |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | Public |
| Auth | `GET /auth/me` (auth) | Any user |
| Courses | `GET /courses?search=&category=`, `GET /courses/:id` | Public |
| Courses | `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id` (auth) | Instructor who owns it |
| Lessons | `GET /courses/:id/lessons` (auth) | Enrolled student or owner |
| Lessons | `POST /courses/:id/lessons`, `PUT /lessons/:id`, `DELETE /lessons/:id` (auth) | Instructor who owns it |
| Enrollment | `POST /courses/:id/enroll`, `GET /enrollments/me` (auth) | Student |
| Progress | `POST /lessons/:id/complete`, `GET /enrollments/:id/progress` (auth) | Enrolled student |

## Project structure

```
prodesk-capstone-EduCore/
├── client/          React + Vite app
│   └── src/
│       ├── pages/        Auth, Dashboard, CourseDetails
│       ├── components/   Navbar, CourseCard, LessonList, ProgressBar
│       └── api/          fetch helpers
├── server/          Express API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/       auth, role check, error handler
├── docs/            erd.dbml, erd.png
├── Prompts.md
└── README.md
```

## Roadmap

| Sprint | Focus |
|---|---|
| 13 | PRD, wireframes, database design (this repo) |
| 14 | MVP: auth, catalog, course page, enroll |
| 15 | Instructor CRUD, lesson progress, dashboard |
| 16 | AI feature, UX polish, responsive pass |
| 17 | CI/CD, deployment, go-live |

## AI usage

I used AI tools while planning, mainly to talk through scope, pick a UI direction and generate reference mockups that I then rebuilt in Figma. Every prompt is logged in [Prompts.md](Prompts.md).

## Author

Wanshika Rajput
GitHub: [@WanshikaRajput](https://github.com/WanshikaRajput)
