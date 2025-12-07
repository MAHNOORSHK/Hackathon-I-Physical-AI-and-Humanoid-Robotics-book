---

description: "Task list for Content Translation to Urdu feature implementation"
---

# Tasks: Content Translation to Urdu

**Input**: Design documents from `/specs/005-content-translation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure is in place as per implementation plan (Docusaurus and FastAPI setup).
- [ ] T002 [P] Setup authentication check in Docusaurus to conditionally render translation button.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Define Pydantic models for `TranslationRequest` and `TranslatedContent` in `api/app/models/translate.py`.
- [ ] T004 Implement AI translation service logic in `api/app/services/ai_service.py` (or extend existing) to call an LLM for translation.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - On-Demand Translation (Priority: P2) 🎯 MVP

**Goal**: Enable logged-in users to translate chapter content to Urdu on demand.

**Independent Test**: A logged-in user can click the "Translate to Urdu" button and see the content change to Urdu text.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T005 [P] [US1] Write unit tests for `TranslateButton.tsx` in `book/src/components/`.
- [ ] T006 [P] [US1] Write integration tests for the `/v1/translate` API endpoint in `api/tests/`.
- [ ] T007 [P] [US1] Write end-to-end test for the translation user journey using a testing framework like Playwright or Cypress.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create a `TranslateButton.tsx` React component in `book/src/components/`.
- [ ] T009 [US1] Integrate `TranslateButton.tsx` into Docusaurus `DocItem` theme component (`book/src/theme/DocItem/index.js`) to display it on chapter pages.
- [ ] T010 [US1] Implement frontend logic within `TranslateButton.tsx` to send current chapter content to the backend API on button click.
- [ ] T011 [US1] Implement frontend logic to display translated content returned from the API and handle original content restoration.
- [ ] T012 [US1] Create FastAPI endpoint `/v1/translate` in `api/app/api/v1/translate.py` to receive translation requests.
- [ ] T013 [US1] Connect the FastAPI endpoint to the AI translation service (T004).
- [ ] T014 [US1] Add error handling and loading states for both frontend and backend to provide user feedback during translation.
- [ ] T015 [P] [US1] Add basic styling for the translate button and ensure proper rendering of right-to-left (RTL) Urdu text in the Docusaurus theme.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T016 [P] Update `textbook/documentation.md` and any other relevant documentation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P2)**: Can start after Foundational (Phase 2).

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation.
- Models before services.
- Services before endpoints.
- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational phase completes, user stories can start.
- All tests for a user story marked [P] can run in parallel.
- Tasks T008 and T012 (frontend component and styling) and T003 (Pydantic models) can be done in parallel with other foundational tasks if the API contract is clear.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Phase 1: Setup (T001, T002).
2. Complete Phase 2: Foundational (T003, T004).
3. Complete Phase 3: User Story 1 (T005-T015).
4. **STOP and VALIDATE**: Test User Story 1 independently.
5. Complete Phase 4: Polish (T016).

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
