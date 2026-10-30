# GeoSpatial AI Assistant API

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `OPENAI_API_KEY` in `.env` before requesting an AI assessment. The key is read only by the backend and must never be added to the Angular application.

## Run

```powershell
npm run start:dev
```

The API listens on `http://localhost:3000`. Angular's development server proxies `/api` requests to this API.

## Endpoint

`POST /api/ai/assessment` accepts analysis counts and validation counts. It returns a JSON assessment with `summary`, `warnings`, and `recommendations`. Invalid request bodies are rejected by the global validation pipe.

The Azure OpenAI integration can be added behind `AiService` without changing the route or response contract.
