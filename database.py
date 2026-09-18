import sqlite3


DATABASE_NAME = "fraud_detection.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
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
    """)

    connection.commit()
    connection.close()


def save_transaction(
    amount,
    transaction_hour,
    distance_from_home,
    transactions_last_24h,
    account_age_days,
    merchant_risk,
    device_change,
    prediction,
    fraud_probability
):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
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
    """, (
        amount,
        transaction_hour,
        distance_from_home,
        transactions_last_24h,
        account_age_days,
        merchant_risk,
        device_change,
        prediction,
        fraud_probability
    ))

    connection.commit()

    transaction_id = cursor.lastrowid

    connection.close()

    return transaction_id


def get_transactions():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM transactions
        ORDER BY id DESC
    """)

    transactions = cursor.fetchall()

    connection.close()

    return [dict(transaction) for transaction in transactions]