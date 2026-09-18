# 🛡️ FraudGuard AI

### AI-Powered Fraud Detection System

FraudGuard AI is a full-stack machine-learning web application that analyzes financial transactions and predicts whether a transaction is **FRAUD** or **NORMAL**.

The application combines a **React frontend, FastAPI backend, JWT authentication, SQLite database, and Logistic Regression machine-learning model** to provide transaction analysis, fraud probability, analytics, and transaction history.

---

## 🚀 Live Demo

🌐 **Live Application:**
https://fraudguard-ai-frontend.onrender.com

🔗 **Backend API:**
https://fraudguard-ai-te8y.onrender.com

📚 **API Documentation:**
https://fraudguard-ai-te8y.onrender.com/docs

---

## ✨ Features

* 🔐 User Registration & Login
* 🛡️ JWT-based Authentication
* 🤖 Machine Learning Fraud Detection
* 📊 Fraud Probability Prediction
* 🚨 FRAUD / NORMAL Classification
* 💰 Transaction Amount Analysis
* 🌍 Distance From Home Analysis
* 🏪 Merchant Risk Analysis
* 📱 Device Change Detection
* 📈 Transaction Statistics
* 📋 Transaction History
* 🔎 Transaction Search
* 📊 Fraud vs Normal Charts
* 🧾 Transaction Storage
* ⚡ FastAPI Backend
* ⚛️ React + Vite Frontend
* 🗄️ SQLite Database
* ☁️ Render Deployment
* 📱 Responsive Dashboard

---

## 🧠 Machine Learning

FraudGuard AI uses a **Logistic Regression** machine-learning model to classify financial transactions.

### Input Features

| Feature               | Description                                               |
| --------------------- | --------------------------------------------------------- |
| Transaction Amount    | Amount involved in the transaction                        |
| Transaction Hour      | Hour when the transaction occurred                        |
| Distance From Home    | Distance between the transaction location and user's home |
| Transactions Last 24h | Number of transactions in the previous 24 hours           |
| Account Age           | Age of the account in days                                |
| Merchant Risk         | Risk level associated with the merchant                   |
| Device Change         | Whether the transaction was made from a changed device    |

### Model Output

The model returns:

* **FRAUD** or **NORMAL**
* **Fraud Probability (%)**

Example:

```text
Prediction: FRAUD
Fraud Probability: 98.7%
```

---

## 📊 Dataset

The project uses a generated transaction dataset for demonstrating fraud-detection workflows.

Dataset statistics:

* **50,000 total transactions**
* **190 fraud transactions**
* **49,810 normal transactions**
* **Fraud rate: approximately 0.38%**

> The dataset is generated for educational and portfolio purposes and does not represent real banking data.

---

## 🏗️ Application Architecture

```text
                    ┌───────────────────┐
                    │       User        │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  React Frontend   │
                    │  Vite + Recharts  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  FastAPI Backend  │
                    │   REST API        │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐  ┌─────────────────┐
          │ Authentication  │  │ Input Validation│
          │      JWT        │  │    Pydantic     │
          └─────────────────┘  └────────┬────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Feature Scaling   │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Logistic Regression│
                              │   ML Model        │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Fraud Prediction  │
                              │ + Probability     │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ SQLite Database   │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Dashboard /       │
                              │ Transaction History│
                              └───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Recharts
* CSS

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* JWT Authentication
* SQLite

### Machine Learning

* Scikit-learn
* Pandas
* NumPy
* Joblib
* Logistic Regression

### Development & Deployment

* VS Code
* Git
* GitHub
* PowerShell
* Render

---

## 📂 Project Structure

```text
FraudGuard-AI/
│
├── data/
│   └── transactions.csv
│
├── fraud-frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── models/
│   ├── fraud_model.pkl
│   └── scaler.pkl
│
├── notebooks/
│
├── outputs/
│   ├── confusion_matrix.png
│   └── roc_curve.png
│
├── src/
│   ├── create_dataset.py
│   ├── explore_data.py
│   ├── train_model.py
│   └── evaluate_model.py
│
├── auth.py
├── database.py
├── main.py
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🔐 Authentication

FraudGuard AI provides a protected authentication flow using JWT.

The system includes:

* User registration
* User login
* Password authentication
* JWT access tokens
* Protected dashboard routes
* API authorization
* Input validation

---

## 📊 Dashboard

The dashboard provides an overview of analyzed transactions, including:

* Total transactions analyzed
* Fraud transactions
* Normal transactions
* Total transaction amount
* Average fraud risk
* ML model status
* Fraud vs Normal transaction chart
* Recent transaction history
* Transaction search and filtering
* Transaction analysis

---

## 🧪 Example Transaction

Example input:

```text
Amount:                 ₹10,000
Transaction Hour:       23
Distance From Home:     100 km
Transactions Last 24h:  8
Account Age:            30 days
Merchant Risk:          80%
Device Changed:         Yes
```

The machine-learning model analyzes the supplied features and returns a fraud classification together with a probability score.

---

## 🔄 Application Flow

```text
User
 ↓
React Frontend
 ↓
FastAPI Backend
 ↓
JWT Authentication
 ↓
Input Validation
 ↓
Feature Scaling
 ↓
Logistic Regression Model
 ↓
Fraud Prediction
 ↓
Fraud Probability
 ↓
SQLite Database
 ↓
Dashboard / Transaction History
```

---

## 📡 API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Fraud Detection

```text
POST /predict
```

### Transactions

```text
GET /transactions
GET /transactions/{transaction_id}
```

### Health Check

```text
GET /health
```

### API Root

```text
GET /
```

---

## 🧪 Model Evaluation

The project includes model evaluation outputs such as:

* Confusion Matrix
* ROC Curve

These files are available in:

```text
outputs/
```

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sonu-balagavi15/FraudGuard-AI.git
cd FraudGuard-AI
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the backend

```bash
python -m uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Run Frontend

Open another terminal:

```powershell
cd fraud-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## ☁️ Deployment

The application is deployed using **Render**.

### Frontend

```text
https://fraudguard-ai-frontend.onrender.com
```

### Backend

```text
https://fraudguard-ai-te8y.onrender.com
```

### Swagger API Documentation

```text
https://fraudguard-ai-te8y.onrender.com/docs
```

---

## 🔮 Future Improvements

Possible future improvements include:

* PostgreSQL production database
* Random Forest / XGBoost model comparison
* Real-time fraud alerts
* Email/SMS notifications
* Admin dashboard
* User profile management
* Advanced analytics
* Model performance monitoring
* Explainable AI
* SHAP-based prediction explanations
* Docker deployment
* Automated testing
* Cloud-based ML model serving

---

## ⚠️ Disclaimer

FraudGuard AI is an educational and portfolio project.

It should **not be used as a production banking security system** without additional security controls, testing, monitoring, model validation, compliance requirements, and appropriate financial-sector safeguards.

---

## 👨‍💻 Developer

**Sonu Parashuram Balagavi**

B.E. Computer Science Engineering
AGM Rural College of Engineering and Technology
Expected Graduation: 2027

### Profiles

**GitHub:**
https://github.com/sonu-balagavi15

**LinkedIn:**
https://www.linkedin.com/in/sonu-balagavi

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**FraudGuard AI — Detect suspicious transactions with Machine Learning.**
