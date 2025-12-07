from fastapi.testclient import TestClient
from api.app.main import app
from api.app.models.user import UserCreate, UserBackground

client = TestClient(app)

def test_register_user():
    user_data = {
        "email": "test@example.com",
        "password": "securepassword",
        "background": {"software_experience": "beginner", "hardware_experience": "none"}
    }
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_user():
    # First, register a user
    user_data = {
        "email": "login_test@example.com",
        "password": "loginpassword",
        "background": {"software_experience": "intermediate", "hardware_experience": "beginner"}
    }
    client.post("/api/v1/auth/register", json=user_data)

    # Then try to log in
    form_data = {"username": "login_test@example.com", "password": "loginpassword"}
    response = client.post("/api/v1/auth/login", data=form_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_read_users_me():
    # Register and login a user
    user_data = {
        "email": "me_test@example.com",
        "password": "mepassword",
        "background": {"software_experience": "expert", "hardware_experience": "expert"}
    }
    register_response = client.post("/api/v1/auth/register", json=user_data)
    token = register_response.json()["access_token"]

    # Access /me endpoint
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == user_data["email"]
    assert response.json()["background"]["software_experience"] == user_data["background"]["software_experience"]
