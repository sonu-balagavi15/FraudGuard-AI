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
// ERROR HELPER
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
        throw new Error("Login successful, but token was not received.");
      }

      localStorage.setItem("token", data.access_token);

      localStorage.setItem(
        "userName",
        data.name ||
        data.user?.name ||
        email.split("@")[0]
      );

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
        <div className="auth-logo">
          <span>🛡️</span>
        </div>

        <h1>FraudGuard</h1>

        <div className="auth-security">
          AI SECURITY
        </div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>
            Sign in to monitor suspicious transactions.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account?{" "}
          <button
            className="link-button"
            type="button"
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
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

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

      setError(
        typeof error?.message === "string"
          ? error.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🛡️</span>
        </div>

        <h1>FraudGuard</h1>

        <div className="auth-security">
          AI SECURITY
        </div>

        <div className="auth-heading">
          <h2>Create account</h2>
          <p>
            Start monitoring suspicious transactions.
          </p>
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
            minLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account →"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <button
            className="link-button"
            type="button"
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
// SIDEBAR
// ============================================================

function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-shield">
          🛡️
        </div>

        <div>
          <h1>FraudGuard</h1>
          <span>AI SECURITY</span>
        </div>
      </div>

      <div className="system-status">
        <span className="status-dot"></span>
        SYSTEM OPERATIONAL
      </div>

      <nav className="sidebar-nav">
        <button
          className={
            activePage === "dashboard"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() => setActivePage("dashboard")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className={
            activePage === "analyze"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() => setActivePage("analyze")}
        >
          <span>◉</span>
          Analyze
        </button>

        <button
          className={
            activePage === "transactions"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() =>
            setActivePage("transactions")
          }
        >
          <span>☷</span>
          Transactions
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="protection-card">
          <div className="protection-icon">
            ✦
          </div>

          <div>
            <strong>AI Protection Active</strong>
            <p>
              Your transaction monitoring
              system is active.
            </p>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// HERO
// ============================================================

function Hero({ onAnalyze, totalAnalyzed }) {
  return (
    <section className="hero-card">
      <div className="hero-grid"></div>

      <div className="live-pill">
        <span></span>
        LIVE MONITORING
      </div>

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-label">
            ✦ MACHINE LEARNING SECURITY
          </div>

          <h1>
            Monitor.
            <br />
            <span>Detect.</span>
            <br />
            Protect.
          </h1>

          <p>
            Intelligent transaction analysis
            powered by machine learning.
            <br />
            Detect suspicious activity before it
            becomes a threat.
          </p>

          <button
            className="hero-button"
            onClick={onAnalyze}
          >
            Analyze a transaction →
          </button>
        </div>

        <div className="hero-visual">
          <div className="risk-card">
            <small>RISK ENGINE</small>
            <strong>ACTIVE</strong>
          </div>

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit orbit-three"></div>

          <div className="security-core">
            <div className="core-shield">
              🛡️
            </div>
            <span>AI</span>
          </div>

          <div className="model-card">
            <small>MODEL</small>
            <strong>
              {totalAnalyzed > 0
                ? "ONLINE"
                : "READY"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] =
    useState("dashboard");

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
      const response = await fetch(
        `${API_URL}/transactions`
      );

      if (!response.ok) return;

      const data = await response.json();

      setTransactions(
        data.transactions || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const amount = Number(form.amount);
      const transactionHour = Number(
        form.transactionHour
      );
      const distanceFromHome = Number(
        form.distanceFromHome
      );
      const transactionsLast24h = Number(
        form.transactionsLast24h
      );
      const accountAgeDays = Number(
        form.accountAgeDays
      );
      const merchantRiskPercent = Number(
        form.merchantRisk
      );
      const deviceChange = Number(
        form.deviceChange
      );

      if (amount < 0) {
        throw new Error(
          "Amount cannot be negative."
        );
      }

      if (
        transactionHour < 0 ||
        transactionHour > 23
      ) {
        throw new Error(
          "Transaction hour must be between 0 and 23."
        );
      }

      if (distanceFromHome < 0) {
        throw new Error(
          "Distance cannot be negative."
        );
      }

      if (transactionsLast24h < 0) {
        throw new Error(
          "Transactions cannot be negative."
        );
      }

      if (accountAgeDays < 0) {
        throw new Error(
          "Account age cannot be negative."
        );
      }

      if (
        merchantRiskPercent < 0 ||
        merchantRiskPercent > 100
      ) {
        throw new Error(
          "Merchant Risk must be between 0 and 100."
        );
      }

      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            transaction_hour: transactionHour,
            distance_from_home:
              distanceFromHome,
            transactions_last_24h:
              transactionsLast24h,
            account_age_days:
              accountAgeDays,
            merchant_risk:
              merchantRiskPercent / 100,
            device_change: deviceChange,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Prediction failed."
          )
        );
      }

      setResult(data);

      await fetchTransactions();
    } catch (error) {
      console.error(error);

      setError(
        error?.message ||
        "Prediction failed."
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

  const totalAnalyzed =
    transactions.length;

  const fraudCount =
    transactions.filter(
      (item) =>
        item.prediction === "FRAUD"
    ).length;

  const normalCount =
    transactions.filter(
      (item) =>
        item.prediction === "NORMAL"
    ).length;

  const totalAmount =
    transactions.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const averageRisk =
    transactions.length > 0
      ? transactions.reduce(
        (sum, item) =>
          sum +
          Number(
            item.fraud_probability || 0
          ),
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

  const scrollToAnalyze = () => {
    setActivePage("analyze");

    setTimeout(() => {
      document
        .getElementById("analyze-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="topbar">
          <div>
            <span className="topbar-small">
              SECURITY CENTER
            </span>
            <h2>
              Welcome, {userName}
            </h2>
          </div>

          <div className="topbar-status">
            <span></span>
            ML ENGINE ONLINE
          </div>
        </div>

        <Hero
          onAnalyze={scrollToAnalyze}
          totalAnalyzed={totalAnalyzed}
        />

        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon purple">
              ◈
            </div>
            <div>
              <small>
                TOTAL ANALYZED
              </small>
              <strong>
                {totalAnalyzed}
              </strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon red">
              !
            </div>
            <div>
              <small>
                FRAUD DETECTED
              </small>
              <strong>
                {fraudCount}
              </strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              ✓
            </div>
            <div>
              <small>
                NORMAL
              </small>
              <strong>
                {normalCount}
              </strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon blue">
              %
            </div>
            <div>
              <small>
                AVG RISK
              </small>
              <strong>
                {averageRisk.toFixed(1)}%
              </strong>
            </div>
          </div>
        </section>

        {activePage === "analyze" ||
          activePage === "dashboard" ? (
          <section
            id="analyze-section"
            className="analysis-layout"
          >
            <div className="analysis-panel">
              <div className="section-title">
                <div>
                  <span>
                    TRANSACTION ANALYSIS
                  </span>
                  <h2>
                    Analyze a transaction
                  </h2>
                </div>

                <div className="secure-badge">
                  ● SECURE
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {result && (
                <div
                  className={
                    result.prediction ===
                      "FRAUD"
                      ? "result-box fraud-result"
                      : "result-box normal-result"
                  }
                >
                  <div className="result-big-icon">
                    {result.prediction ===
                      "FRAUD"
                      ? "⚠"
                      : "✓"}
                  </div>

                  <div>
                    <small>
                      MODEL PREDICTION
                    </small>

                    <h2>
                      {result.prediction}
                    </h2>

                    <p>
                      Fraud probability:{" "}
                      <strong>
                        {
                          result.fraud_probability
                        }
                        %
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              <form
                className="analysis-form"
                onSubmit={handlePredict}
              >
                <div className="input-group">
                  <label>
                    Transaction Amount
                  </label>

                  <div className="input-wrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      name="amount"
                      placeholder="10000"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    Transaction Hour
                  </label>

                  <input
                    type="number"
                    name="transactionHour"
                    placeholder="14"
                    min="0"
                    max="23"
                    value={
                      form.transactionHour
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Distance From Home
                  </label>

                  <input
                    type="number"
                    name="distanceFromHome"
                    placeholder="25"
                    min="0"
                    value={
                      form.distanceFromHome
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Transactions / 24h
                  </label>

                  <input
                    type="number"
                    name="transactionsLast24h"
                    placeholder="5"
                    min="0"
                    value={
                      form.transactionsLast24h
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Account Age
                  </label>

                  <input
                    type="number"
                    name="accountAgeDays"
                    placeholder="365"
                    min="0"
                    value={
                      form.accountAgeDays
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Merchant Risk %
                  </label>

                  <input
                    type="number"
                    name="merchantRisk"
                    placeholder="50"
                    min="0"
                    max="100"
                    value={
                      form.merchantRisk
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group full-input">
                  <label>
                    Device Changed?
                  </label>

                  <select
                    name="deviceChange"
                    value={
                      form.deviceChange
                    }
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
                  className="analyze-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Analyzing..."
                    : "Run AI Analysis →"}
                </button>
              </form>
            </div>

            <div className="overview-panel">
              <div className="section-title">
                <div>
                  <span>
                    SECURITY OVERVIEW
                  </span>
                  <h2>
                    Detection status
                  </h2>
                </div>
              </div>

              {transactions.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={60}
                      paddingAngle={4}
                      label
                    >
                      {chartData.map(
                        (_, index) => (
                          <Cell
                            key={index}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-overview">
                  <div className="empty-shield">
                    🛡️
                  </div>

                  <h3>
                    Protection Ready
                  </h3>

                  <p>
                    Run your first transaction
                    analysis to see security
                    statistics.
                  </p>
                </div>
              )}

              <div className="security-stats">
                <div>
                  <span>
                    TOTAL VALUE
                  </span>
                  <strong>
                    ₹
                    {totalAmount.toFixed(
                      0
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    ENGINE
                  </span>
                  <strong>
                    ONLINE
                  </strong>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activePage ===
          "transactions" && (
            <section className="transactions-panel">
              <div className="section-title">
                <div>
                  <span>
                    TRANSACTION MONITOR
                  </span>
                  <h2>
                    Recent transactions
                  </h2>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="empty-overview">
                  <div className="empty-shield">
                    ◈
                  </div>
                  <h3>
                    No transactions yet
                  </h3>
                  <p>
                    Analyze a transaction to
                    populate your history.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Hour</th>
                        <th>Merchant Risk</th>
                        <th>Prediction</th>
                        <th>Probability</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.map(
                        (transaction) => (
                          <tr
                            key={
                              transaction.id
                            }
                          >
                            <td>
                              #
                              {
                                transaction.id
                              }
                            </td>

                            <td>
                              ₹
                              {Number(
                                transaction.amount ||
                                0
                              ).toFixed(2)}
                            </td>

                            <td>
                              {
                                transaction.transaction_hour
                              }
                            </td>

                            <td>
                              {(
                                Number(
                                  transaction.merchant_risk ||
                                  0
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
                                {
                                  transaction.prediction
                                }
                              </span>
                            </td>

                            <td>
                              {
                                transaction.fraud_probability
                              }
                              %
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

        <footer className="dashboard-footer">
          <span>
            FRAUDGUARD AI • MACHINE LEARNING
            SECURITY
          </span>

          <span>
            SYSTEM STATUS:{" "}
            <b>OPERATIONAL</b>
          </span>
        </footer>
      </main>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  const token =
    localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
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
            to={
              token
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}