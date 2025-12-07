# Feature Specification: RAG Chatbot for Textbook

**Feature Branch**: `002-rag-chatbot`  
**Created**: 2025-12-05  
**Status**: Draft  
**Input**: User description: "read the file @documentation.md and structure the full project"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - General Questions (Priority: P1)

As a reader, I want to ask questions about the book's content in a chat interface and receive accurate answers, so that I can quickly clarify concepts without leaving the textbook website.

**Why this priority**: This is the primary function of the RAG chatbot and provides the most immediate value to the user.

**Independent Test**: The chatbot can be opened on the website, a question about the book's content can be submitted, and a relevant answer is received.

**Acceptance Scenarios**:

1. **Given** I am reading the online textbook, **When** I open the chat widget and ask "What is ROS 2?", **Then** I should receive a summary explaining ROS 2 based on the book's content.
2. **Given** the chatbot is open, **When** I ask a question that is not in the book, **Then** the chatbot should respond that it does not have information on that topic.

---

### User Story 2 - Contextual Questions (Priority: P2)

As a reader, I want to highlight a specific paragraph or section of the text and ask a targeted question about it, so that I can get a highly contextual clarification.

**Why this priority**: This provides a more advanced and powerful way for users to interact with the content, improving the learning experience.

**Independent Test**: A user can select text on a page, a "ask about this" button appears, and clicking it allows the user to ask a question specifically about the selected text.

**Acceptance Scenarios**:

1. **Given** I have selected a paragraph about URDF files, **When** I click the contextual question button and ask "What is this for?", **Then** the chatbot should provide an answer specifically explaining URDF files based on the selected text.



## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST provide a chat interface embedded within the Docusaurus website.
- **FR-002**: The backend MUST be implemented using the FastAPI framework in Python.
- **FR-003**: The system MUST use the OpenAI Agents or ChatKit SDK for its core logic.
- **FR-004**: The system MUST connect to a Neon Serverless Postgres database for conversation history.
- **FR-005**: The system MUST use the Qdrant Cloud (Free Tier) for vector storage and retrieval of the book's content.
- **FR-006**: A data pipeline MUST be created to chunk the book's content, generate embeddings (using an OpenAI model), and store them in Qdrant.
- **FR-007**: The frontend chat widget MUST communicate with the FastAPI backend via HTTP requests.

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a single chat session, containing multiple messages.
- **Message**: A single entry in a conversation, sent by either the user or the chatbot.
- **DocumentChunk**: A piece of text from the book stored in the vector database.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The chat widget is present on all pages of the Docusaurus site.
- **SC-002**: A user can send a message and receive a response from the FastAPI backend with less than 5-second latency for a typical query.
- **SC-003**: When asked a question about the book's content, the chatbot's response is accurate and directly supported by the text in the book, with a 90% accuracy rate in testing.
- **SC-004**: The system correctly handles out-of-scope questions by indicating that the topic is not covered in the book.
- **SC-005**: Conversation history is successfully persisted in the Neon Postgres database.
