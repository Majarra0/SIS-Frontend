# Student Information System Frontend

A React + Vite frontend for the Student Information System with a built-in mock API mode so designers, QA, and stakeholders can use the UI without a backend.

## Quick start
1. Install dependencies: `npm ci`
2. Copy `.env.example` to `.env` and adjust values (see below).
3. Run locally: `npm run dev`
4. Lint (optional): `npm run lint`

## API modes
- `VITE_API_MODE=real` (default): calls the backend at `VITE_API_BASE_URL` (defaults to `http://localhost:8000/api`).
- `VITE_API_MODE=mock`: uses in-browser mock data with no backend calls.
- Legacy flag: `VITE_USE_MOCKS=true` is also honored.

### Mock credentials
- Admin: `admin` / `admin123`
- Faculty: `faculty` / `password`
- Physics faculty: `physics` / `password`
- Students: `student`, `student2`, `student3` (all use `password`)

Mock data lives in `src/api/mocks/data.js` and is served through adapters in `src/api/mocks/mockApi.js`. See `docs/mocking.md` for details.

## Docker
Build and run with your preferred mode:
```bash
docker build -t sis-frontend --build-arg VITE_API_MODE=mock .
docker run -p 4173:4173 sis-frontend
```
Override the backend URL at build time if needed:
`docker build -t sis-frontend --build-arg VITE_API_MODE=real --build-arg VITE_API_BASE_URL=https://api.example.com/api .`

The container serves the production build via `npm run preview` on port `4173`.

## Useful paths
- `src/api/apiConfig.js` — mode detection and helpers (pagination, search, mock id storage).
- `src/api/mocks/mockApi.js` — mock implementations for auth, users, departments, courses, enrollment, attendance, and grading.
- `backend.txt` — API endpoint reference for the real backend.

## Contributing
- Keep new environment variables prefixed with `VITE_` so Vite exposes them to the client.
- When adding new API calls, mirror them in `mockApi.js` so mock mode stays feature-complete.
- Run `npm run lint` before submitting changes.
