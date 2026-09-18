import pandas as pd
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from sklearn.metrics import roc_curve, auc

# Load dataset
df = pd.read_csv("data/transactions.csv")

# Features and target
X = df.drop("is_fraud", axis=1)
y = df["is_fraud"]

# Same split used during training
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Load model and scaler
model = joblib.load("models/fraud_model.pkl")
scaler = joblib.load("models/scaler.pkl")

# Scale test data
X_test_scaled = scaler.transform(X_test)

# Predictions
y_pred = model.predict(X_test_scaled)
y_probability = model.predict_proba(X_test_scaled)[:, 1]

# Create outputs directory if needed
import os
os.makedirs("outputs", exist_ok=True)

# -------------------------
# Confusion Matrix
# -------------------------

cm = confusion_matrix(y_test, y_pred)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Normal", "Fraud"]
)

display.plot()
plt.title("Fraud Detection Confusion Matrix")
plt.savefig("outputs/confusion_matrix.png")
plt.show()

# -------------------------
# ROC Curve
# -------------------------

fpr, tpr, thresholds = roc_curve(
    y_test,
    y_probability
)

roc_auc = auc(fpr, tpr)

plt.figure()
plt.plot(
    fpr,
    tpr,
    label=f"ROC-AUC = {roc_auc:.4f}"
)

plt.plot(
    [0, 1],
    [0, 1],
    linestyle="--"
)

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("Fraud Detection ROC Curve")
plt.legend()

plt.savefig("outputs/roc_curve.png")
plt.show()

print("Evaluation completed successfully!")
print("Saved:")
print("outputs/confusion_matrix.png")
print("outputs/roc_curve.png")