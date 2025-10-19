
# hitlist prototype

This is a minimal prototype of the MUSIC CHART EDITOR (BRAVO90 style).
It includes a static frontend (BRAVO90 preview + editor) and a tiny Express backend.

## Quick start (local)

1. Install Node.js (v16+ recommended).
2. Unzip the package.
3. In the `backend` folder run:
   ```
   npm install
   npm start
   ```
4. Open http://localhost:3000 in your browser — frontend is served by the backend.
   - `index.html` is the public BRAVO90 preview
   - `editor.html` is the editor-hybrid prototype

## Deploying to Render / Vercel

- Frontend (`/frontend`) can be deployed on Vercel or GitHub Pages.
- Backend (`/backend`) can be deployed to Render — set startup command `npm start`.

NOTE: This prototype's `/api/metadata` endpoint returns placeholders. To enable real metadata filling,
connect Spotify/Apple APIs and implement server-side calls with credentials.
