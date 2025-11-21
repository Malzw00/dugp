/**
 * @file api/index.js
 * @module API Index Router
 * @description
 * Defines the root entry point for all API versions in the application.
 * 
 * 🧭 **Purpose:**
 * - This router acts as the main gateway for all versioned API routes.
 * - It organizes API endpoints by version to ensure backward compatibility.
 * - Future versions (e.g., `v2`, `v3`) can be added easily without affecting existing routes.
 * 
 * 📂 **Structure Overview:**
 * ```
 * src/
 * └── routes/
 *     ├── api/
 *     │   ├── index.js          ← Current file
 *     │   └── v1/
 *     │       ├── index.js
 *     │       ├── projects.route.js
 *     │       ├── supervisors.route.js
 *     │       ├── students.route.js
 *     │       └── comments.route.js
 * ```
 * 
 * 🚀 **Routing Flow:**
 * - `/api` → handled by this file.
 * - `/api/v1` → forwarded to `@routes/api/v1/index.js`.
 * - `/api/v2` → can be added later for new functionality.
 * 
 * 📌 **Example Endpoints (v1):**
 * - `GET /api/v1/projects` → list all projects.
 * - `GET /api/v1/students/:id` → get student details.
 * - `POST /api/v1/comments` → create a comment.
 * 
 * 🧩 **Integration:**
 * The router is mounted in the main `server.js` as:
 * ```js
 * const apiRouter = require('@routes/api/index');
 * app.use('/api', apiRouter);
 * ```
 * 
 * 🛠 **Future Scalability:**
 * - Easily extendable to support multiple versions.
 * - Keeps routes modular and maintainable.
 * 
 * @requires express
 * @requires @routes/api/v1/index
 */

const express = require('express');
const router = express.Router();
const v1Router = require('@routes/api/v1/index');


// Mount version 1 of the API
router.use('/v1', v1Router);

module.exports = router;