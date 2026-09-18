from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import joblib
import numpy as np
from auth import router as auth_router


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="FraudGuard AI API",
    version="1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://fraudguard-ai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# AUTH ROUTES
# ============================================================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# DATABASE
# ============================================================

DATABASE = "fraud_detection.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_transactions_table():
    conn = get_db()

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            transaction_hour INTEGER NOT NULL,
            distance_from_home REAL NOT NULL,
            transactions_last_24h INTEGER NOT NULL,
            account_age_days INTEGER NOT NULL,
            merchant_risk REAL NOT NULL,
            device_change INTEGER NOT NULL,
            prediction TEXT NOT NULL,
            fraud_probability REAL NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()


create_transactions_table()


# ============================================================
# LOAD ML MODEL + SCALER
# ============================================================

MODEL_PATH = "models/fraud_model.pkl"
SCALER_PATH = "models/scaler.pkl"

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    print("Fraud ML model loaded successfully.")
    print("Scaler loaded successfully.")
    print("Model:", type(model).__name__)

except Exception as error:
    model = None
    scaler = None

    print("WARNING: Could not load fraud model/scaler.")
    print(error)


# ============================================================
# REQUEST MODEL
# ============================================================

class TransactionRequest(BaseModel):
    amount: float
    transaction_hour: int
    distance_from_home: float
    transactions_last_24h: int
    account_age_days: int
    merchant_risk: float
    device_change: int


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "FraudGuard AI API is running",
        "status": "online"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }


# ============================================================
# PREDICT FRAUD
# ============================================================

@app.post("/predict")
def predict(data: TransactionRequest):

    # --------------------------------------------------------
    # CHECK MODEL
    # --------------------------------------------------------

    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Fraud ML model or scaler is not loaded."
        )

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if data.amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Amount cannot be negative."
        )

    if data.transaction_hour < 0 or data.transaction_hour > 23:
        raise HTTPException(
            status_code=400,
            detail="Transaction hour must be between 0 and 23."
        )

    if data.distance_from_home < 0:
        raise HTTPException(
            status_code=400,
            detail="Distance from home cannot be negative."
        )

    if data.transactions_last_24h < 0:
        raise HTTPException(
            status_code=400,
            detail="Transactions in last 24 hours cannot be negative."
        )

    if data.account_age_days < 0:
        raise HTTPException(
            status_code=400,
            detail="Account age cannot be negative."
        )

    if data.merchant_risk < 0 or data.merchant_risk > 1:
        raise HTTPException(
            status_code=400,
            detail="Merchant risk must be between 0 and 1."
        )

    if data.device_change not in [0, 1]:
        raise HTTPException(
            status_code=400,
            detail="Device change must be 0 or 1."
        )

    # --------------------------------------------------------
    # CREATE 7 FEATURES
    # --------------------------------------------------------

    features = np.array(
        [[
            data.amount,
            data.transaction_hour,
            data.distance_from_home,
            data.transactions_last_24h,
            data.account_age_days,
            data.merchant_risk,
            data.device_change
        ]]
    )

    # --------------------------------------------------------
    # SCALE FEATURES
    # --------------------------------------------------------

    try:
        features_scaled = scaler.transform(features)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Feature scaling failed: {str(error)}"
        )

    # --------------------------------------------------------
    # MODEL PREDICTION
    # --------------------------------------------------------

    try:
        prediction_value = model.predict(features_scaled)[0]

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Model prediction failed: {str(error)}"
        )

    # --------------------------------------------------------
    # CONVERT PREDICTION
    # --------------------------------------------------------

    if prediction_value in [1, "1", True]:
        prediction = "FRAUD"
    else:
        prediction = "NORMAL"

    # --------------------------------------------------------
    # FRAUD PROBABILITY
    # --------------------------------------------------------

    try:
        probabilities = model.predict_proba(features_scaled)[0]
        classes = list(model.classes_)

        if 1 in classes:
            fraud_index = classes.index(1)

        elif "1" in classes:
            fraud_index = classes.index("1")

        else:
            fraud_index = 1 if len(probabilities) > 1 else 0

        fraud_probability = round(
            float(probabilities[fraud_index] * 100),
            2
        )

    except Exception:
        fraud_probability = (
            100.0
            if prediction == "FRAUD"
            else 0.0
        )

    # --------------------------------------------------------
    # SAVE TRANSACTION
    # --------------------------------------------------------

    try:
        conn = get_db()

        cursor = conn.execute(
            """
            INSERT INTO transactions (
                amount,
                transaction_hour,
                distance_from_home,
                transactions_last_24h,
                account_age_days,
                merchant_risk,
                device_change,
                prediction,
                fraud_probability
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data.amount,
                data.transaction_hour,
                data.distance_from_home,
                data.transactions_last_24h,
                data.account_age_days,
                data.merchant_risk,
                data.device_change,
                prediction,
                fraud_probability
            )
        )

        conn.commit()

        transaction_id = cursor.lastrowid

        conn.close()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save transaction: {str(error)}"
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "id": transaction_id,
        "prediction": prediction,
        "fraud_probability": fraud_probability
    }


# ============================================================
# GET ALL TRANSACTIONS
# ============================================================

@app.get("/transactions")
def get_transactions():

    conn = get_db()

    rows = conn.execute(
        """
        SELECT
            id,
            amount,
            transaction_hour,
            distance_from_home,
            transactions_last_24h,
            account_age_days,
            merchant_risk,
            device_change,
            prediction,
            fraud_probability
        FROM transactions
        ORDER BY id DESC
        """
    ).fetchall()

    conn.close()

    transactions = []

    for row in rows:
        transactions.append({
            "id": row["id"],
            "amount": row["amount"],
            "transaction_hour": row["transaction_hour"],
            "distance_from_home": row["distance_from_home"],
            "transactions_last_24h": row["transactions_last_24h"],
            "account_age_days": row["account_age_days"],
            "merchant_risk": row["merchant_risk"],
            "device_change": row["device_change"],
            "prediction": row["prediction"],
            "fraud_probability": row["fraud_probability"]
        })

    return {
        "transactions": transactions
    }


# ============================================================
# GET SINGLE TRANSACTION
# ============================================================

@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: int):

    conn = get_db()

    row = conn.execute(
        """
        SELECT *
        FROM transactions
        WHERE id = ?
        """,
        (transaction_id,)
    ).fetchone()

    conn.close()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found."
        )

    return dict(row)