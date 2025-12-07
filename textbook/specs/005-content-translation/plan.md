# Implementation Plan: Content Translation

**Branch**: `005-content-translation` | **Date**: 2025-12-05 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-content-translation/spec.md`

## Summary

This plan covers the implementation of a dynamic content translation feature. It involves adding a "Translate to Urdu" button to the Docusaurus frontend for authenticated users. This button will trigger a call to the FastAPI backend, which in turn will use an AI service (like OpenAI) to translate the chapter's content into Urdu. The goal is to make the textbook more accessible to a wider audience.

## Technical Context

**Language/Version**: Python 3.11+ (for backend), TypeScript (for frontend)
**Primary Dependencies**: FastAPI, OpenAI SDK, React
**Storage**: N/A (Translation is on-the-fly and not stored)
**Testing**: pytest (for API), Jest/React Testing Library (for UI components)
**Target Platform**: Web
**Project Type**: Full-stack feature (frontend + backend)
**Constraints**: The performance of the translation will depend on the latency of the external AI service. The feature should handle loading and error states gracefully, and also manage right-to-left (RTL) text display correctly.

## Project Structure

### Documentation (this feature)

```text
specs/005-content-translation/
├── plan.md              # This file
└── spec.md              # The feature specification
```

### Source Code (repository root)

This feature will modify both the `book/` (frontend) and `api/` (backend) directories.

#### Frontend (`book/`) additions:
```text
book/
└── src/
    ├── components/
    │   └── TranslateButton.tsx
    └── theme/
        └── DocItem/
            └── index.js       # To wrap the document and include the button
```

#### Backend (`api/`) additions:
```text
api/
└── app/
    ├── api/
    │   └── v1/
    │       └── translate.py   # Endpoint for translating content
    ├── services/
    │   └── ai_service.py      # Logic for calling the AI model (re-used or extended from personalization)
    └── models/
        └── translate.py   # Pydantic models for the request/response
```

**Structure Decision**: A new React component will be created for the "Translate" button and integrated into the Docusaurus theme. The backend will get a new, dedicated endpoint to handle the translation logic, potentially reusing or extending the AI service logic from the personalization feature.


