# AI Emergency Response Network

Full local prototype: React + FastAPI + SQLite + AI-assisted incident analysis + map + resource dashboard.

## Run backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

API: http://127.0.0.1:8000/docs

### Account access

- Register a Citizen account from the frontend. Citizens can submit incident reports.
- Control Officer registration requires an invite code. Configure it in the backend terminal before starting Uvicorn:
  - PowerShell: `$env:OFFICER_INVITE_CODE = "choose-a-private-code"`
  - Command Prompt: `set OFFICER_INVITE_CODE=choose-a-private-code`
- Select **Create account → Control Officer** and use that invite code to register. Officers can view incidents, resources, and update incident statuses.
- Use separate accounts for Citizens and Control Officers. Passwords are stored as PBKDF2 hashes; API access uses signed, expiring bearer tokens.
- For stable sessions between backend restarts, set a private `AUTH_SECRET` before starting Uvicorn:
  - PowerShell: `$env:AUTH_SECRET = "a-long-random-private-secret"`
  - Command Prompt: `set AUTH_SECRET=a-long-random-private-secret`
- If `AUTH_SECRET` is omitted, the backend uses a temporary random key and users must sign in again after a backend restart. Do not use demo secrets or this prototype as-is for a public production deployment.

## Run frontend in a second terminal
cd frontend
npm install
npm run dev

Open the Vite URL, normally http://localhost:5173

The Vite development server proxies `/api` requests to `http://127.0.0.1:8000`.
If the backend uses another address, set `VITE_API_PROXY_TARGET` before starting Vite.
Restart the frontend dev server after changing its Vite configuration or proxy target.

## Test text
There is a flood and my grandmother and two children are trapped inside the house.

The current AI analyzer is a local demo placeholder. For the hackathon, replace/augment it with a properly licensed open-weight model and document the model, license, evaluation and original implementation.
