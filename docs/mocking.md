# Mock data and API mode

The frontend can run entirely against in-browser mock data so designers, QA, and demos do not need the backend.

## Switching modes
- `VITE_API_MODE=mock` (recommended) forces the app to use the mock adapters.
- `VITE_API_MODE=real` (default) keeps requests pointing at `VITE_API_BASE_URL`.
- Legacy: `VITE_USE_MOCKS=true` is still honored as a shortcut.

## Mock credentials
Use any of the accounts below when running in mock mode:
- Admin: `admin` / `admin123`
- Faculty: `faculty` / `password`
- Physics faculty: `physics` / `password`
- Students: `student`, `student2`, or `student3` (all use `password`)

## Where the data lives
- `src/api/apiConfig.js` decides whether to use mock or live requests.
- `src/api/mocks/data.js` contains the seed data for departments, users, courses, offerings, and enrollments.
- `src/api/mocks/mockApi.js` mirrors the real API surface (auth, users, departments, courses, enrollment, attendance, grading) and returns the mock data with light filtering and pagination.

Edits are in-memory only; refreshing the page restores the original dataset. Feel free to tweak `data.js` to add more sample records that fit your testing needs.
