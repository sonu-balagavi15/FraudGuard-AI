import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import "./App.css";

const API_URL = "https://fraudguard-ai-te8y.onrender.com";

// ============================================================
// HELPER
// ============================================================

function getErrorMessage(data, fallback = "Something went wrong.") {
  if (!data) return fallback;

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join(", ");
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return fallback;
}

// ============================================================
// LOGIN
// ============================================================

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Invalid email or password.")
        );
      }

      if (!data.access_token) {
        throw new Error("Login successful, but access token was not received.");
      }

      localStorage.setItem("token", data.access_token);

      const userName =
        data.name ||
        data.user?.name ||
        email.split("@")[0];

      localStorage.setItem("userName", userName);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        typeof error?.message === "string"
          ? error.message
          : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-icon">🛡️</div>

        <h1>FraudGuard</h1>
        <p className="brand-subtitle">AI SECURITY</p>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to monitor suspicious transactions.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// REGISTER
// ============================================================

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Registration failed.")
        );
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      let message = "Registration failed.";

      if (error?.message) {
        message =
          typeof error.message === "string"
            ? error.message
            : JSON.stringify(error.message);
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-icon">🛡️</div>

        <h1>FraudGuard</h1>
        <p className="brand-subtitle">AI SECURITY</p>

        <div className="auth-heading">
          <h2>Create account</h2>
          <p>Start monitoring suspicious transactions.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );

  const [form, setForm] = useState({
    amount: "",
    transactionHour: "",
    distanceFromHome: "",
    transactionsLast24h: "",
    accountAgeDays: "",
    merchantRisk: "",
    deviceChange: "0",
  });

  const [result, setResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("History error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const amount = Number(form.amount);
      const transactionHour = Number(form.transactionHour);
      const distanceFromHome = Number(form.distanceFromHome);
      const transactionsLast24h = Number(form.transactionsLast24h);
      const accountAgeDays = Number(form.accountAgeDays);
      const merchantRiskPercent = Number(form.merchantRisk);
      const deviceChange = Number(form.deviceChange);

      if (Number.isNaN(amount) || amount < 0) {
        throw new Error("Amount must be 0 or greater.");
      }

      if (
        Number.isNaN(transactionHour) ||
        transactionHour < 0 ||
        transactionHour > 23
      ) {
        throw new Error("Transaction hour must be between 0 and 23.");
      }

      if (
        Number.isNaN(distanceFromHome) ||
        distanceFromHome < 0
      ) {
        throw new Error("Distance from home must be 0 or greater.");
      }

      if (
        Number.isNaN(transactionsLast24h) ||
        transactionsLast24h < 0
      ) {
        throw new Error(
          "Transactions in last 24 hours must be 0 or greater."
        );
      }

      if (
        Number.isNaN(accountAgeDays) ||
        accountAgeDays < 0
      ) {
        throw new Error("Account age must be 0 or greater.");
      }

      if (
        Number.isNaN(merchantRiskPercent) ||
        merchantRiskPercent < 0 ||
        merchantRiskPercent > 100
      ) {
        throw new Error(
          "Merchant Risk must be between 0 and 100."
        );
      }

      const merchantRisk = merchantRiskPercent / 100;

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          transaction_hour: transactionHour,
          distance_from_home: distanceFromHome,
          transactions_last_24h: transactionsLast24h,
          account_age_days: accountAgeDays,
          merchant_risk: merchantRisk,
          device_change: deviceChange,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Prediction failed.")
        );
      }

      setResult(data);

      await fetchTransactions();
    } catch (error) {
      console.error("Prediction error:", error);

      setError(
        typeof error?.message === "string"
          ? error.message
          : "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  const totalAnalyzed = transactions.length;

  const fraudCount = transactions.filter(
    (item) => item.prediction === "FRAUD"
  ).length;

  const normalCount = transactions.filter(
    (item) => item.prediction === "NORMAL"
  ).length;

  const totalAmount = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const averageRisk =
    transactions.length > 0
      ? transactions.reduce(
        (sum, item) =>
          sum + Number(item.fraud_probability || 0),
        0
      ) / transactions.length
      : 0;

  const chartData = [
    {
      name: "Fraud",
      value: fraudCount,
    },
    {
      name: "Normal",
      value: normalCount,
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>🛡️ FraudGuard</h1>
          <p>AI SECURITY</p>
        </div>

        <div className="header-right">
          <span>Welcome, {userName}</span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="hero-section">
          <div>
            <h2>Fraud Detection Dashboard</h2>
            <p>
              Analyze transactions using your machine learning
              fraud detection model.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div>
              <p>Total Analyzed</p>
              <h3>{totalAnalyzed}</h3>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🚨</span>
            <div>
              <p>Fraud Detected</p>
              <h3>{fraudCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <p>Normal</p>
              <h3>{normalCount}</h3>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div>
              <p>Total Amount</p>
              <h3>₹{totalAmount.toFixed(0)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📈</span>
            <div>
              <p>Avg. Fraud Risk</p>
              <h3>{averageRisk.toFixed(2)}%</h3>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🤖</span>
            <div>
              <p>Model</p>
              <h3>ML</h3>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel prediction-panel">
            <div className="panel-header">
              <h2>Analyze Transaction</h2>
              <p>Enter transaction details below.</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {result && (
              <div
                className={`prediction-result ${result.prediction === "FRAUD"
                    ? "fraud-result"
                    : "normal-result"
                  }`}
              >
                <div className="result-icon">
                  {result.prediction === "FRAUD"
                    ? "🚨"
                    : "✅"}
                </div>

                <div>
                  <p>Prediction</p>
                  <h2>{result.prediction}</h2>
                  <strong>
                    Fraud Probability:{" "}
                    {result.fraud_probability}%
                  </strong>
                </div>
              </div>
            )}

            <form
              className="transaction-form"
              onSubmit={handlePredict}
            >
              <div className="form-row">
                <div>
                  <label>Amount (₹)</label>

                  <input
                    type="number"
                    name="amount"
                    placeholder="10000"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label>Transaction Hour</label>

                  <input
                    type="number"
                    name="transactionHour"
                    placeholder="14"
                    value={form.transactionHour}
                    onChange={handleChange}
                    min="0"
                    max="23"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Distance From Home (km)</label>

                  <input
                    type="number"
                    name="distanceFromHome"
                    placeholder="5"
                    value={form.distanceFromHome}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label>Transactions Last 24h</label>

                  <input
                    type="number"
                    name="transactionsLast24h"
                    placeholder="3"
                    value={form.transactionsLast24h}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Account Age (days)</label>

                  <input
                    type="number"
                    name="accountAgeDays"
                    placeholder="365"
                    value={form.accountAgeDays}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label>Merchant Risk (%)</label>

                  <input
                    type="number"
                    name="merchantRisk"
                    placeholder="50"
                    value={form.merchantRisk}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div>
                <label>Device Changed?</label>

                <select
                  name="deviceChange"
                  value={form.deviceChange}
                  onChange={handleChange}
                >
                  <option value="0">
                    No
                  </option>

                  <option value="1">
                    Yes
                  </option>
                </select>
              </div>

              <button
                className="analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "Analyze Transaction →"}
              </button>
            </form>
          </div>

          <div className="panel chart-panel">
            <div className="panel-header">
              <h2>Transaction Overview</h2>
              <p>Fraud vs normal transactions.</p>
            </div>

            {transactions.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <div>📊</div>
                <p>No transactions analyzed yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel history-panel">
          <div className="panel-header">
            <h2>Recent Transactions</h2>
            <p>Your latest fraud analysis results.</p>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-history">
              No transactions available.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Hour</th>
                    <th>Distance</th>
                    <th>Merchant Risk</th>
                    <th>Prediction</th>
                    <th>Fraud Probability</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>#{transaction.id}</td>

                      <td>
                        ₹
                        {Number(
                          transaction.amount || 0
                        ).toFixed(2)}
                      </td>

                      <td>
                        {transaction.transaction_hour}
                      </td>

                      <td>
                        {transaction.distance_from_home} km
                      </td>

                      <td>
                        {(
                          Number(
                            transaction.merchant_risk || 0
                          ) * 100
                        ).toFixed(1)}
                        %
                      </td>

                      <td>
                        <span
                          className={
                            transaction.prediction ===
                              "FRAUD"
                              ? "badge fraud-badge"
                              : "badge normal-badge"
                          }
                        >
                          {transaction.prediction}
                        </span>
                      </td>

                      <td>
                        {transaction.fraud_probability}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to={token ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}