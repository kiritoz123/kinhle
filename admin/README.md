# Admin Dashboard - Worship App

Quickstart:
1. Ensure backend is running (default http://localhost:4000) with admin account seeded.
2. In this folder:
   - npm install
   - npm start
3. Visit http://localhost:3000

Notes:
- Login uses POST /api/auth/login -> returns token (saved to localStorage key 'admin_token').
- All admin endpoints are under /api/admin and require Authorization: Bearer <token>.
- Charts use data from /api/admin/stats. For time-series charts, backend endpoints will be added on request.
