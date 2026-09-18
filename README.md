\# 🛡️ FraudGuard AI



\### AI-Powered Fraud Detection \& Security Dashboard



FraudGuard AI is a full-stack machine learning application that analyzes financial transactions and identifies potentially fraudulent activity using machine learning.



The system provides real-time fraud probability analysis, transaction history, analytics, charts, and a secure authentication system.



\---



\## 🚀 Features



\* 🔐 User Registration \& Login

\* 🔑 JWT Authentication

\* 🤖 Machine Learning Fraud Detection

\* 📊 Fraud Probability Analysis

\* 🚨 Fraud / Normal Classification

\* 💰 Transaction Amount Analysis

\* 📈 Risk Analytics Dashboard

\* 📉 Interactive Charts

\* 🔎 Transaction Search

\* 🧾 Transaction History

\* 🛡️ Protected Dashboard

\* ⚡ FastAPI Backend

\* ⚛️ React Frontend

\* 🗄️ SQLite Database

\* 📱 Responsive UI



\---



\## 🧠 Machine Learning



FraudGuard AI uses a \*\*Logistic Regression\*\* machine learning model to classify transactions.



\### Input Features



The model analyzes:



\* Transaction Amount

\* Transaction Hour

\* Distance From Home

\* Transactions in Last 24 Hours

\* Account Age

\* Merchant Risk

\* Device Change



\### Output



The model returns:



\* `FRAUD`

\* `NORMAL`

\* Fraud Probability



Example:



```text

Prediction: FRAUD

Fraud Probability: 98.7%

```



\---



\## 📊 Dataset



The project includes a generated transaction dataset containing:



\* \*\*50,000 total transactions\*\*

\* \*\*190 fraud transactions\*\*

\* \*\*49,810 normal transactions\*\*

\* Fraud rate: approximately \*\*0.38%\*\*



The dataset is designed for demonstrating fraud-detection workflows and is not intended to represent real banking data.



\---



\## 🏗️ Project Architecture



```text

FraudGuard AI

│

├── Backend

│   ├── FastAPI

│   ├── JWT Authentication

│   ├── SQLite Database

│   └── Machine Learning Model

│

├── Machine Learning

│   ├── Dataset Generation

│   ├── Data Processing

│   ├── Feature Scaling

│   └── Logistic Regression

│

└── Frontend

&#x20;   ├── React

&#x20;   ├── React Router

&#x20;   ├── Recharts

&#x20;   └── Vite

```



\---



\## 🛠️ Tech Stack



\### Frontend



\* React

\* React Router

\* Recharts

\* Vite

\* JavaScript

\* CSS



\### Backend



\* Python

\* FastAPI

\* Uvicorn

\* Pydantic

\* JWT

\* SQLite



\### Machine Learning



\* Scikit-learn

\* Pandas

\* NumPy

\* Joblib

\* Logistic Regression



\### Development Tools



\* VS Code

\* Git

\* GitHub

\* PowerShell



\---



\## 📁 Project Structure



```text

Fraud-Detection-System/

│

├── data/

│

├── models/

│   ├── fraud\_model.pkl

│   └── scaler.pkl

│

├── notebooks/

│

├── outputs/

│

├── src/

│   └── create\_dataset.py

│

├── fraud-frontend/

│   ├── public/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── main.jsx

│   │   └── index.css

│   ├── package.json

│   └── vite.config.js

│

├── auth.py

├── database.py

├── main.py

├── fraud\_model.joblib

├── requirements.txt

├── README.md

└── .gitignore

```



\---



\## ⚙️ Backend Setup



\### 1. Clone the repository



```bash

git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd Fraud-Detection-System

```



\### 2. Create virtual environment



```bash

python -m venv venv

```



\### 3. Activate virtual environment



Windows PowerShell:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



\### 4. Install dependencies



```bash

pip install -r requirements.txt

```



\### 5. Start the backend



```bash

python -m uvicorn main:app --reload

```



Backend will run at:



```text

http://127.0.0.1:8000

```



API documentation:



```text

http://127.0.0.1:8000/docs

```



\---



\## ⚛️ Frontend Setup



Open another terminal.



```bash

cd fraud-frontend

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



Frontend will run at:



```text

http://localhost:5173

```



\---



\## 🔌 API Endpoints



| Method | Endpoint             | Description             |

| ------ | -------------------- | ----------------------- |

| POST   | `/auth/register`     | Register a new user     |

| POST   | `/auth/login`        | Login                   |

| POST   | `/predict`           | Analyze transaction     |

| GET    | `/transactions`      | Get transaction history |

| GET    | `/transactions/{id}` | Get transaction         |

| GET    | `/health`            | API health check        |

| GET    | `/`                  | API status              |



\---



\## 🔍 Transaction Analysis



Users can enter transaction information through the dashboard.



Example:



```text

Amount: ₹50,000

Transaction Hour: 2

Distance From Home: 500 km

Transactions Last 24h: 15

Account Age: 20 days

Merchant Risk: 95

Device Change: Yes

```



The machine learning system analyzes these features and returns a fraud prediction with a probability score.



\---



\## 📈 Dashboard



The FraudGuard AI dashboard provides:



\* Total transactions analyzed

\* Fraud transactions

\* Normal transactions

\* Average fraud risk

\* Total transaction amount

\* Risk trend visualization

\* Transaction amount visualization

\* Recent transaction history

\* Search and filtering

\* Real-time transaction analysis



\---



\## 🔐 Security



The project includes:



\* JWT-based authentication

\* Protected dashboard routes

\* Password hashing

\* API authorization

\* CORS configuration

\* Input validation



> This project is intended for educational and portfolio purposes and should not be used as a production banking security system without additional security, testing, monitoring, and compliance controls.



\---



\## 🎯 Project Goal



The goal of FraudGuard AI is to demonstrate how \*\*machine learning, backend APIs, authentication, databases, and modern frontend technologies\*\* can be combined to build a fraud-detection application.



\---



\## 🚀 Future Improvements



Possible future improvements include:



\* Advanced ML models

\* Random Forest / XGBoost comparison

\* Real-time fraud alerts

\* Email notifications

\* Advanced user roles

\* Admin dashboard

\* PostgreSQL production database

\* Model performance monitoring

\* Explainable AI

\* SHAP-based prediction explanations

\* Cloud deployment

\* Docker support

\* Automated testing



\---



\## 👨‍💻 Developer



\*\*Sonu Parashuram Balagavi\*\*



B.E. Computer Science Engineering



AGM Rural College of Engineering and Technology



Expected Graduation: 2027



\### Profiles



GitHub:

https://github.com/sonu-balagavi15



LinkedIn:

https://www.linkedin.com/in/sonu-balagavi



\---



\## 📌 Project Status



\*\*Status: Completed — Local Development\*\*



The application has been tested locally with:



\* Backend API

\* Frontend dashboard

\* User authentication

\* Machine learning prediction

\* Transaction storage

\* Fraud detection

\* Charts and analytics



The next stage is GitHub publication and cloud deployment.



