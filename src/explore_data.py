import pandas as pd

# Load dataset
df = pd.read_csv("data/transactions.csv")

print("First 5 rows:")
print(df.head())

print("\nDataset shape:")
print(df.shape)

print("\nColumn names:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nData types:")
print(df.dtypes)

print("\nClass distribution:")
print(df["is_fraud"].value_counts())

print("\nClass distribution percentage:")
print(df["is_fraud"].value_counts(normalize=True) * 100)

print("\nStatistical summary:")
print(df.describe())