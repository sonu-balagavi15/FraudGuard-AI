from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3
import jwt
from datetime import datetime, timedelta


# ============================================================
# ROUTER
# ============================================================

router = APIRouter()


# ============================================================
# JWT SETTINGS
# ============================================================

SECRET_KEY = "fraudguard-secret-key-change-this"
ALGORITHM = "HS256"


# ============================================================
# PASSWORD HASHING
# ============================================================
# Using pbkdf2_sha256 avoids bcrypt compatibility problems.

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


# ============================================================
# DATABASE
# ============================================================

DATABASE = "fraud_detection.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_users_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


create_users_table()


# ============================================================
# REQUEST MODELS
# ============================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(user: RegisterRequest):

    name = user.name.strip()
    email = user.email.strip().lower()
    password = user.password

    # Validate name
    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    # Validate email
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email"
        )

    # Validate password
    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    conn = get_db()

    try:

        # Check existing user
        existing_user = conn.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Hash password
        hashed_password = pwd_context.hash(password)

        # Insert user
        cursor = conn.execute(
            """
            INSERT INTO users (
                name,
                email,
                password
            )
            VALUES (?, ?, ?)
            """,
            (
                name,
                email,
                hashed_password
            )
        )

        conn.commit()

        user_id = cursor.lastrowid

        return {
            "message": "Registration successful",
            "user_id": user_id
        }

    except HTTPException:
        raise

    except Exception as error:
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(error)}"
        )

    finally:
        conn.close()


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(user: LoginRequest):

    email = user.email.strip().lower()
    password = user.password

    conn = get_db()

    try:

        db_user = conn.execute(
            """
            SELECT *
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()

    finally:
        conn.close()

    # User doesn't exist
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Check password
    try:
        password_correct = pwd_context.verify(
            password,
            db_user["password"]
        )
    except Exception:
        password_correct = False

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # JWT payload
    token_data = {
        "user_id": db_user["id"],
        "email": db_user["email"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    # Create JWT
    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }