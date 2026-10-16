# Atomic Flow — Habit Tracking Application

Atomic Flow is a habit-tracking web application built around making routines easier to record, review, and maintain. The repository contains a React frontend and a Python FastAPI backend that persists data in MongoDB.

## Project Capabilities

The source code defines flows and data models for:

- User sessions and authentication callbacks
- Creating and updating habits
- Habit categories and descriptions
- Habit logs and completion records
- Habit-related summaries and analytics
- Habit planning based on cue, craving, response, and reward

This list reflects the repository's code structure; verify each flow in a running environment before presenting it as production-ready functionality.

## Technology Stack

**Frontend**
- React
- React Router
- CRACO and React Scripts
- Tailwind CSS and reusable UI components

**Backend**
- Python
- FastAPI
- Motor and MongoDB
- Pydantic
- Uvicorn

## Architecture

```text
Browser
   |
   v
React frontend
   |
   v
FastAPI REST API
   |
   v
MongoDB
```

## Repository Structure

- `frontend/` — React application and UI
- `backend/server.py` — FastAPI application and API routes
- `backend/requirements.txt` — Python dependencies
- `backend_test.py` — backend API test script
- `auth_testing.md` — authentication test notes

## Run Locally

### Frontend

From the repository root:

```bash
cd frontend
yarn install
yarn start
```

Create a production build with:

```bash
yarn build
```

### Backend

From the repository root:

```bash
cd backend
pip install -r requirements.txt
```

Create a local `.env` file in the `backend/` directory with the required MongoDB settings:

```dotenv
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
```

Start the FastAPI development server from the `backend/` directory:

```bash
uvicorn server:app --reload
```

The frontend's API base URL and the external authentication/session configuration may require additional setup depending on your local environment. Do not commit credentials or real session tokens.

## Testing

A backend test script and authentication test notes are present in the repository. Confirm their current configuration and required test environment before running them; this README does not claim that the full test suite has been executed.

## Potential Next Steps

- Document API routes and expected request/response formats.
- Add repeatable tests for habit creation, logging, and analytics.
- Document frontend/backend configuration in one place.
- Add screenshots and a verified demo.
- Document deployment steps and known limitations.

## License

Confirm the intended license before redistributing the project.
