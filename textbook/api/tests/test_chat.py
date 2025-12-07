from fastapi.testclient import TestClient
from api.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Textbook API"}

def test_query_chatbot():
    response = client.post(
        "/api/v1/query",
        json={"query": "What is ROS 2?"}
    )
    assert response.status_code == 200
    assert "response" in response.json()

def test_query_chatbot_with_context():
    response = client.post(
        "/api/v1/query_context",
        json={"query": "What is this?", "context": "ROS 2 is a middleware."}
    )
    assert response.status_code == 200
    assert "response" in response.json()
