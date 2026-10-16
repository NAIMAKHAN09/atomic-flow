# Atomic Flow — Habit Tracking Application

Atomic Flow is a habit-tracking application built around the idea of making routines measurable and easier to maintain.

The repository contains a React frontend and a Python FastAPI backend, with MongoDB used for data persistence.

## Current Project Scope

The backend models and API tests indicate support for:

- User authentication and sessions
- Habit creation and editing
- Habit categories and descriptions
- Habit logs and completion tracking
- Habit streaks and summary analytics
- Habit details inspired by cue, craving, response, and reward

These capabilities should be verified against the running application before being treated as a complete feature list.

## Technology Stack

**Frontend**
- React
- React Router
- Tailwind CSS
- CRACO

**Backend**
- Python
- FastAPI
- Motor
- MongoDB
- Pydantic

## Architecture

```text
User
  |
  v
React Frontend
  |
  v
FastAPI Backend
  |
  v
MongoDB
```

## Repository Structure

- `frontend/` — React application
- `backend/` — API server and data models
- `backend_test.py` — API testing script
- `auth_testing.md` — authentication test notes

## Development Setup

### Frontend

```bash
cd frontend
yarn install
yarn start
```

The frontend package defines a production build command:

```bash
yarn build
```

### Backend

Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Configure the required environment variables in a local `.env` file before starting the server. At minimum, the backend source expects `MONGO_URL` and `DB_NAME`.

The precise server launch command, required authentication configuration, and frontend API URL should be confirmed from the current project configuration before publishing a complete setup guide.

## Testing

The repository contains a backend API test script. Before relying on it, remove hard-coded test credentials, replace them with disposable test fixtures or environment variables, and document how to run tests safely.

## Security Notes

- Never commit real session tokens, database credentials, or API keys.
- Use environment variables for secrets.
- Verify authentication and authorization checks on protected endpoints.
- Use isolated test data when running tests that create or delete records.

## Future Improvements

- Document all API endpoints.
- Add reproducible setup instructions for frontend and backend.
- Add automated tests for authentication and habit tracking.
- Include screenshots and a verified demo.
- Document deployment and environment configuration.

## License

Confirm the intended project license before redistribution.
