# GeoSpatial AI Assistant 🌍🤖

AI-powered geospatial analysis platform built with Angular, NestJS, OpenLayers and pluggable AI providers.

## Overview

GeoSpatial AI Assistant allows users to upload geospatial datasets, analyze their contents, validate data quality, visualize features on a map, and receive AI-generated recommendations.

## Features

### 📊 Geospatial File Analysis

Supported formats:

- KML
- GeoJSON

Analysis results:

- Total features
- Points
- Lines
- Polygons

---

### 🗺️ Map Viewer

Built with OpenLayers.

Capabilities:

- Display uploaded KML files
- Display uploaded GeoJSON files
- Automatic zoom to feature extent
- OpenStreetMap basemap
- Feature rendering and styling

---

### ✅ Data Quality Validation Engine

The validation engine inspects uploaded datasets and reports potential issues.

Checks include:

- Features without names
- Missing geometries
- Empty geometries
- Invalid coordinates
- Duplicated geometries

Example:

```text
Data Quality Report

Features analyzed: 3175

Warnings

⚠ Features without names: 3175
⚠ Duplicated geometries: 206
```

---

### 🤖 AI Assessment Engine

The AI assessment engine consumes:

- AnalysisResult
- ValidationResult

And generates:

- Summary
- Warnings
- Recommendations

Example:

```text
AI Assessment

Summary

The dataset contains 3175 linear features.

Warnings

- 3175 features do not have names.
- 206 duplicated geometries detected.

Recommendations

- Populate missing names.
- Review duplicated geometries.
- Consider scale-dependent rendering.
```

---

## Architecture

```text
Frontend (Angular)
        │
        ▼
AnalysisAgentService
        │
        ▼
RecommendationProvider
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Rules  OpenAI      Ollama
        │             │
        └─────┬───────┘
              ▼
          NestJS API
```

---

## AI Providers

### Rules Provider

```env
AI_PROVIDER=rules
```

Features:

- No external services
- No API keys
- Fast execution
- Ideal for development

---

### OpenAI Provider

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4o-mini
```

Status:

- ✅ Implemented
- ✅ Backend protected
- ✅ Fallback supported
- ⚠ Requires valid API credentials

---

### Ollama Provider

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Advantages:

- Local execution
- Free
- No API keys
- Privacy-friendly

---

## Technology Stack

### Frontend

- Angular
- TypeScript
- RxJS
- OpenLayers

### Backend

- NestJS
- TypeScript
- REST API
- DTO Validation
- Dependency Injection

### AI

- Rules Engine
- OpenAI Provider
- Ollama Provider

### Testing

- Jasmine
- Karma
- Jest

---

## Project Structure

```text
frontend
│
├── features
│   ├── analysis
│   ├── map-viewer
│   └── ai-assistant
│
├── core
│   └── ai
│
└── shared

backend
│
├── src
│   ├── ai
│   │   ├── controllers
│   │   ├── dto
│   │   ├── providers
│   │   └── services
│   │
│   └── app.module.ts
│
└── test
```

---

## Environment Configuration

### Backend

Create a `.env` file:

```env
PORT=3000

FRONTEND_ORIGIN=http://localhost:4200

AI_PROVIDER=rules

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

## Installation

### Frontend

```bash
cd frontend

npm install

ng serve
```

Application:

```text
http://localhost:4200
```

---

### Backend

```bash
cd backend

npm install

npm run start:dev
```

API:

```text
http://localhost:3000
```

---

## Ollama Setup

### Install Ollama

Download:

```text
https://ollama.com/download/windows
```

### Download a model

```bash
ollama pull llama3.2
```

### Verify installation

```bash
ollama list
```

### Run the model

```bash
ollama run llama3.2
```

### Configure the backend

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Restart the backend:

```bash
npm run start:dev
```

---

## Running Tests

### Frontend

```bash
cd frontend

ng test
```

Coverage:

```bash
ng test --code-coverage
```

---

### Backend

```bash
cd backend

npm test
```

---

## Current Capabilities

- ✅ KML Analysis
- ✅ GeoJSON Analysis
- ✅ OpenLayers Visualization
- ✅ Data Quality Validation
- ✅ AI Assessment Engine
- ✅ OpenAI-ready Architecture
- ✅ Ollama-ready Architecture
- ✅ Provider Pattern
- ✅ Automated Testing
- ✅ Angular + NestJS Full Stack

---

## Roadmap

### Completed

- [x] KML Support
- [x] GeoJSON Support
- [x] Analysis Dashboard
- [x] Unit Tests
- [x] OpenLayers Integration
- [x] Validation Engine
- [x] AI Assessment Engine
- [x] OpenAI Integration Architecture
- [x] Ollama Provider

### Planned

- [ ] PDF Report Export
- [ ] Analysis History
- [ ] Dataset Quality Scoring
- [ ] Multi-Agent Architecture
- [ ] Azure OpenAI Provider
- [ ] Authentication & User Profiles

---

## Author

**Edwin Stiven Oviedo Reyes**

GeoSpatial AI Assistant combines:

- Geospatial technologies
- Modern Angular architecture
- AI-assisted analysis
- Scalable backend design
- Pluggable LLM providers

🚀 Built for learning, experimentation, and real-world geospatial AI workflows.