import numpy as np
import pandas as pd

np.random.seed(42)

# Number of transactions
n = 50000

# Generate transaction features
amount = np.random.lognormal(mean=3.5, sigma=1.0, size=n)
transaction_hour = np.random.randint(0, 24, n)
distance_from_home = np.random.exponential(scale=20, size=n)
transactions_last_24h = np.random.poisson(lam=3, size=n)
account_age_days = np.random.randint(30, 3000, n)
merchant_risk = np.random.uniform(0, 1, n)
device_change = np.random.binomial(1, 0.08, n)

# Create a fraud probability
risk_score = (
    0.8 * (amount > 200).astype(int)
    + 1.2 * (distance_from_home > 50).astype(int)
    + 1.0 * (transactions_last_24h > 8).astype(int)
    + 1.5 * (merchant_risk > 0.8).astype(int)
    + 1.2 * device_change
    + 0.8 * ((transaction_hour <= 4) | (transaction_hour >= 23)).astype(int)
)

# Convert risk score to probability
fraud_probability = 0.002 + 0.015 * (
    1 / (1 + np.exp(-risk_score + 3))
)

# Generate fraud labels
is_fraud = np.random.binomial(1, fraud_probability)

# Create dataframe
df = pd.DataFrame({
    "amount": amount,
    "transaction_hour": transaction_hour,
    "distance_from_home": distance_from_home,
    "transactions_last_24h": transactions_last_24h,
    "account_age_days": account_age_days,
    "merchant_risk": merchant_risk,
    "device_change": device_change,
    "is_fraud": is_fraud
})

# Save dataset
df.to_csv("data/transactions.csv", index=False)

print("Dataset created successfully!")
print(f"Total transactions: {len(df)}")
print(f"Fraud transactions: {df['is_fraud'].sum()}")
print(f"Fraud percentage: {df['is_fraud'].mean() * 100:.2f}%")
print("\nClass distribution:")
print(df["is_fraud"].value_counts())