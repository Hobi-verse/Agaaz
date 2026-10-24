This is the Agaaz sports platform for FOET, Lucknow University.

## Run the platform locally

Install dependencies in each app once:

```sh
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin-frontend
```

Set `backend/.env` with a valid `MONGODB_URI`, then start the backend, public site, and admin portal together from the repository root:

```sh
npm run dev
```

The public site runs at `http://localhost:5173`, the admin portal at `http://localhost:5174`, and the backend at `http://localhost:5000`. Press Ctrl+C to stop all three.
