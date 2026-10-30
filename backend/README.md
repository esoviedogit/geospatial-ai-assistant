# GeoSpatial AI Assistant API

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `AI_PROVIDER` to `openai` or `ollama` in `.env`. The default is `openai`; its API key is read only by the backend and must never be added to the Angular application.

For a local Ollama provider, install and start Ollama, download a model (for example `ollama pull llama3.2`), then set `AI_PROVIDER=ollama`. The defaults are `OLLAMA_BASE_URL=http://localhost:11434` and `OLLAMA_MODEL=llama3.2`.

## Run

```powershell
npm run start:dev
```

The API listens on `http://localhost:3000`. Angular's development server proxies `/api` requests to this API.

## Endpoint

`POST /api/ai/assessment` accepts analysis counts and validation counts. It returns a JSON assessment with `summary`, `warnings`, and `recommendations`. Invalid request bodies are rejected by the global validation pipe.

Both providers implement the same backend assessment contract and use the same validated DTOs and endpoint. The Azure OpenAI integration can be added behind `AiService` without changing the route or response contract.
