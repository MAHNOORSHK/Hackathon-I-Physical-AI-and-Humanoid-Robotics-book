# Implementation Plan: RAG Chatbot

**Branch**: `002-rag-chatbot` | **Date**: 2025-12-05 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-rag-chatbot/spec.md`

## Summary

This plan details the architecture and implementation of a RAG (Retrieval-Augmented Generation) chatbot. The backend will be a Python-based FastAPI application that serves a chatbot embedded in the Docusaurus textbook. It will leverage OpenAI, Qdrant, and Neon Postgres to provide contextual answers to user questions about the book's content.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, OpenAI SDK, Qdrant client, Neon Postgres client (e.g., psycopg2-binary)
**Storage**: Neon Serverless Postgres (for conversations), Qdrant Cloud (for vectors)
**Testing**: pytest
**Target Platform**: Backend service (deployable on services like Render, Fly.io, or AWS)
**Project Type**: Web (API)
**Performance Goals**: p95 latency for chat responses < 5 seconds.
**Constraints**: Must adhere to the free tier limitations of Qdrant Cloud and Neon Serverless Postgres.
**Scale/Scope**: The service should handle up to 10 concurrent users initially.

## Project Structure

### Documentation (this feature)

```text
specs/002-rag-chatbot/
├── plan.md              # This file
└── spec.md              # The feature specification
```

### Source Code (repository root)

A new `api/` directory will be created at the repository root to house the FastAPI application. This separates the backend from the frontend `book/` project.

```text
api/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app declaration
│   ├── api/             # API endpoints/routers
│   │   └── v1/
│   │       └── chat.py
│   ├── core/            # Configuration, settings
│   │   └── config.py
│   ├── services/        # Business logic (e.g., RAG pipeline)
│   │   └── rag_service.py
│   └── models/          # Pydantic models
│       └── chat.py
├── tests/
│   ├── __init__.py
│   └── test_chat.py
├── requirements.txt
└── .env.example
```

**Structure Decision**: A dedicated `api/` directory will be used to house the FastAPI backend. This follows standard practice for separating frontend and backend concerns, making development, deployment, and scaling easier to manage.


