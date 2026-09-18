import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./App.css";

const API_URL = "https://fraudguard-ai-te8y.onrender.com";

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
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.access_token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>

      <div className="auth-card">
        <div className="brand-center">
          <div className="brand-shield">🛡️</div>

          <div>
            <h1>FraudGuard</h1>
            <span>AI SECURITY</span>
          </div>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">SECURE ACCESS</p>
          <h2>Welcome back</h2>
          <p>Sign in to your fraud detection dashboard.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
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

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Create account</button>
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
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>

      <div className="auth-card">
        <div className="brand-center">
          <div className="brand-shield">🛡️</div>

          <div>
            <h1>FraudGuard</h1>
            <span>AI SECURITY</span>
          </div>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">GET STARTED</p>
          <h2>Create account</h2>
          <p>Start monitoring suspicious transactions.</p>
        </div>

        <form onSubmit={handleRegister}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
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
          />

          {error && <div className="error-box">{error}</div>}

          {success && <div className="success-box">{success}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={() => navigate("/")}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    amount: "",
    transactionHour: "",
    distanceFromHome: "",
    transactionsLast24h: "",
    accountAgeDays: "",
    merchantRisk: "",
    deviceChange: "0",
  });

  // ----------------------------------------------------------
  // LOAD TRANSACTIONS
  // ----------------------------------------------------------

  const loadTransactions = async () => {
    try {
      setLoadingTransactions(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load transactions");
      }

      const data = await response.json();

      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ----------------------------------------------------------
  // FORM CHANGE
  // ----------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------
  // ANALYZE
  // ----------------------------------------------------------

  const analyzeTransaction = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setAnalyzing(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        amount: Number(form.amount),
        transaction_hour: Number(form.transactionHour),
        distance_from_home: Number(form.distanceFromHome),
        transactions_last_24h: Number(form.transactionsLast24h),
        account_age_days: Number(form.accountAgeDays),
        merchant_risk: Number(form.merchantRisk),
        device_change: Number(form.deviceChange),
      };

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data);

      setForm({
        amount: "",
        transactionHour: "",
        distanceFromHome: "",
        transactionsLast24h: "",
        accountAgeDays: "",
        merchantRisk: "",
        deviceChange: "0",
      });

      await loadTransactions();
    } catch (err) {
      setError(err.message || "Failed to fetch");
    } finally {
      setAnalyzing(false);
    }
  };

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // ----------------------------------------------------------
  // STATISTICS
  // ----------------------------------------------------------

  const stats = useMemo(() => {
    const total = transactions.length;

    const fraud = transactions.filter(
      (item) =>
        String(item.prediction || item.result || "").toUpperCase() === "FRAUD"
    ).length;

    const normal = total - fraud;

    const totalAmount = transactions.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const averageRisk =
      total > 0
        ? transactions.reduce(
          (sum, item) =>
            sum + Number(item.fraud_probability || item.probability || 0),
          0
        ) / total
        : 0;

    return {
      total,
      fraud,
      normal,
      totalAmount,
      averageRisk,
    };
  }, [transactions]);

  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const prediction = String(
        item.prediction || item.result || ""
      ).toUpperCase();

      const matchesFilter =
        filter === "ALL" ||
        (filter === "FRAUD" && prediction === "FRAUD") ||
        (filter === "NORMAL" && prediction === "NORMAL");

      const text = JSON.stringify(item).toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search]);

  // ----------------------------------------------------------
  // CHART DATA
  // ----------------------------------------------------------

  const riskChartData = useMemo(() => {
    return transactions
      .slice()
      .reverse()
      .slice(-10)
      .map((item, index) => ({
        name: `#${index + 1}`,
        risk: Number(
          item.fraud_probability || item.probability || 0
        ),
      }));
  }, [transactions]);

  const amountChartData = useMemo(() => {
    return transactions
      .slice()
      .reverse()
      .slice(-10)
      .map((item, index) => ({
        name: `#${index + 1}`,
        amount: Number(item.amount || 0),
      }));
  }, [transactions]);

  // ----------------------------------------------------------
  // RESULT RISK
  // ----------------------------------------------------------

  const resultProbability = result
    ? Number(
      result.fraud_probability ||
      result.probability ||
      0
    )
    : 0;

  const isFraud =
    result &&
    String(result.prediction || "").toUpperCase() === "FRAUD";

  return (
    <div className="dashboard-layout">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-shield">🛡️</div>

          <div>
            <h2>FraudGuard</h2>
            <span>AI SECURITY</span>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          SYSTEM OPERATIONAL
        </div>

        <nav className="sidebar-nav">

          <button className="active">
            <span>⌂</span>
            Dashboard
          </button>

          <button
            onClick={() =>
              document
                .getElementById("analyzer")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>◉</span>
            Analyze
          </button>

          <button
            onClick={() =>
              document
                .getElementById("history")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>☷</span>
            Transactions
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="security-mini">
            <div className="mini-icon">✦</div>

            <div>
              <strong>AI Protection Active</strong>
              <p>Your transaction monitoring system is active.</p>
            </div>
          </div>

          <div className="user-mini">
            <div className="avatar">
              {(user.name || "S").charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <strong>{user.name || "sonu"}</strong>
              <span>{user.email || "sonu@gmail.com"}</span>
            </div>

            <button onClick={logout}>↪</button>
          </div>

        </div>
      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="main-content">

        <div className="top-mobile">
          <div className="sidebar-brand">
            <div className="brand-shield">🛡️</div>

            <div>
              <h2>FraudGuard</h2>
              <span>AI SECURITY</span>
            </div>
          </div>

          <button onClick={logout}>↪</button>
        </div>

        {/* HERO */}

        <section className="hero-section">

          <div className="hero-copy">

            <div className="live-badge">
              <span></span>
              LIVE MONITORING
            </div>

            <p className="eyebrow">
              ✦ MACHINE LEARNING SECURITY
            </p>

            <h1>
              Monitor.
              <br />
              <span>Detect.</span>
              <br />
              Protect.
            </h1>

            <p className="hero-description">
              Intelligent transaction analysis powered by
              machine learning. Detect suspicious activity
              before it becomes a threat.
            </p>

            <button
              className="hero-button"
              onClick={() =>
                document
                  .getElementById("analyzer")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Analyze a transaction →
            </button>

          </div>

          <div className="hero-visual">

            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="security-core">
              <div className="core-shield">🛡️</div>
              <span>AI</span>
            </div>

            <div className="floating-card card-a">
              <span>RISK ENGINE</span>
              <strong>ACTIVE</strong>
            </div>

            <div className="floating-card card-b">
              <span>MODEL</span>
              <strong>98.4%</strong>
            </div>

          </div>

        </section>

        {/* ====================================================
            STATS
        ==================================================== */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">◈</div>
            <span>TOTAL ANALYZED</span>
            <strong>{stats.total}</strong>
            <small>All transactions</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">⚠</div>
            <span>FRAUD DETECTED</span>
            <strong>{stats.fraud}</strong>
            <small>
              {stats.total
                ? `${((stats.fraud / stats.total) * 100).toFixed(1)}% detection rate`
                : "0% detection rate"}
            </small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <span>SAFE TRANSACTIONS</span>
            <strong>{stats.normal}</strong>
            <small>Normal activity</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◉</div>
            <span>AVERAGE RISK</span>
            <strong>{stats.averageRisk.toFixed(1)}%</strong>
            <small>AI risk score</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">₹</div>
            <span>TOTAL AMOUNT</span>
            <strong>
              ₹{stats.totalAmount.toLocaleString("en-IN")}
            </strong>
            <small>Analyzed value</small>
          </div>

        </section>

        {/* ====================================================
            CHARTS
        ==================================================== */}

        <section className="charts-grid">

          <div className="chart-card">

            <div className="chart-header">
              <div>
                <p className="eyebrow">SECURITY ANALYTICS</p>
                <h2>Risk Trend</h2>
              </div>

              <span className="chart-live">
                ● LIVE
              </span>
            </div>

            {riskChartData.length === 0 ? (
              <div className="empty-chart">
                Analyze transactions to generate risk analytics.
              </div>
            ) : (
              <div className="chart-container">

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={riskChartData}>

                    <defs>
                      <linearGradient
                        id="riskGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.45}
                        />

                        <stop
                          offset="100%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#24243a"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#71718a"
                    />

                    <YAxis
                      stroke="#71718a"
                      domain={[0, 100]}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#9b7cff"
                      fill="url(#riskGradient)"
                      strokeWidth={3}
                    />

                  </AreaChart>
                </ResponsiveContainer>

              </div>
            )}

          </div>

          <div className="chart-card">

            <div className="chart-header">
              <div>
                <p className="eyebrow">TRANSACTION ANALYTICS</p>
                <h2>Transaction Amount</h2>
              </div>

              <span className="chart-live">
                ₹ VALUE
              </span>
            </div>

            {amountChartData.length === 0 ? (
              <div className="empty-chart">
                Analyze transactions to generate amount analytics.
              </div>
            ) : (
              <div className="chart-container">

                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={amountChartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#24243a"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#71718a"
                    />

                    <YAxis
                      stroke="#71718a"
                    />

                    <Tooltip />

                    <Bar
                      dataKey="amount"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            ANALYZER
        ==================================================== */}

        <section
          className="workspace-grid"
          id="analyzer"
        >

          <div className="analyzer-card">

            <div className="section-heading">

              <div className="section-icon">
                ✦
              </div>

              <div>
                <p className="eyebrow">AI ENGINE</p>
                <h2>Analyze Transaction</h2>
                <p>
                  Enter transaction details to calculate fraud
                  probability.
                </p>
              </div>

              <div className="online-badge">
                <span></span>
                MODEL ONLINE
              </div>

            </div>

            <form
              className="transaction-form"
              onSubmit={analyzeTransaction}
            >

              <div className="form-grid">

                <div className="field">
                  <label>Transaction Amount</label>

                  <div className="input-wrap">
                    <span>₹</span>

                    <input
                      type="number"
                      name="amount"
                      placeholder="10,000"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Transaction Hour</label>

                  <div className="input-wrap">
                    <span>◷</span>

                    <input
                      type="number"
                      name="transactionHour"
                      min="0"
                      max="23"
                      placeholder="14"
                      value={form.transactionHour}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Distance From Home</label>

                  <div className="input-wrap">
                    <span>⌖</span>

                    <input
                      type="number"
                      name="distanceFromHome"
                      placeholder="5"
                      value={form.distanceFromHome}
                      onChange={handleChange}
                      required
                    />

                    <small>KM</small>
                  </div>
                </div>

                <div className="field">
                  <label>Transactions Last 24 Hours</label>

                  <div className="input-wrap">
                    <span>↻</span>

                    <input
                      type="number"
                      name="transactionsLast24h"
                      placeholder="2"
                      value={form.transactionsLast24h}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Account Age</label>

                  <div className="input-wrap">
                    <span>◫</span>

                    <input
                      type="number"
                      name="accountAgeDays"
                      placeholder="500"
                      value={form.accountAgeDays}
                      onChange={handleChange}
                      required
                    />

                    <small>DAYS</small>
                  </div>
                </div>

                <div className="field">
                  <label>Merchant Risk</label>

                  <div className="input-wrap">
                    <span>◆</span>

                    <input
                      type="number"
                      name="merchantRisk"
                      min="0"
                      max="100"
                      placeholder="20"
                      value={form.merchantRisk}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

              </div>

              <div className="device-field">

                <div>
                  <label>Device Changed?</label>
                  <p>
                    Was this transaction made from a new device?
                  </p>
                </div>

                <div className="toggle-group">

                  <button
                    type="button"
                    className={
                      form.deviceChange === "0"
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        deviceChange: "0",
                      }))
                    }
                  >
                    No
                  </button>

                  <button
                    type="button"
                    className={
                      form.deviceChange === "1"
                        ? "toggle active"
                        : "toggle"
                    }
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        deviceChange: "1",
                      }))
                    }
                  >
                    Yes
                  </button>

                </div>

              </div>

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              <button
                className="analyze-button"
                disabled={analyzing}
              >
                {analyzing
                  ? "Analyzing..."
                  : "✦ Analyze Transaction →"}
              </button>

            </form>

          </div>

          {/* ==================================================
              RESULT
          ================================================== */}

          <div className="prediction-card">

            <div className="prediction-header">
              <div>
                <p className="eyebrow">AI PREDICTION</p>
                <h2>Risk Assessment</h2>
              </div>

              <div className="ml-badge">ML</div>
            </div>

            {!result ? (
              <div className="ready-state">

                <div className="ready-icon">
                  ✦
                </div>

                <h3>Ready for analysis</h3>

                <p>
                  Enter transaction details and run the AI model
                  to calculate fraud probability.
                </p>

                <div className="model-label">
                  ✦ Logistic Regression Model
                </div>

              </div>
            ) : (
              <div className="result-state">

                <div
                  className={
                    isFraud
                      ? "result-icon fraud"
                      : "result-icon safe"
                  }
                >
                  {isFraud ? "⚠" : "✓"}
                </div>

                <div
                  className={
                    isFraud
                      ? "result-status fraud-text"
                      : "result-status safe-text"
                  }
                >
                  {String(result.prediction || "").toUpperCase()}
                </div>

                <div className="risk-number">
                  {resultProbability.toFixed(1)}%
                </div>

                <p>Fraud Probability</p>

                <div className="risk-bar">
                  <div
                    className={
                      isFraud
                        ? "risk-fill fraud-fill"
                        : "risk-fill safe-fill"
                    }
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, resultProbability)
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="risk-labels">
                  <span>LOW RISK</span>
                  <span>HIGH RISK</span>
                </div>

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            HISTORY
        ==================================================== */}

        <section
          className="history-card"
          id="history"
        >

          <div className="history-header">

            <div>
              <p className="eyebrow">ACTIVITY</p>

              <h2>Transaction History</h2>

              <p>
                Recently analyzed transactions.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadTransactions}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="history-toolbar">

            <div className="filter-tabs">

              <button
                className={filter === "ALL" ? "selected" : ""}
                onClick={() => setFilter("ALL")}
              >
                All
              </button>

              <button
                className={filter === "FRAUD" ? "selected" : ""}
                onClick={() => setFilter("FRAUD")}
              >
                Fraud
              </button>

              <button
                className={filter === "NORMAL" ? "selected" : ""}
                onClick={() => setFilter("NORMAL")}
              >
                Normal
              </button>

            </div>

            <div className="search-box">
              ⌕
              <input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          {loadingTransactions ? (
            <div className="empty-history">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-history">

              <div className="empty-icon">
                ▣
              </div>

              <h3>No transactions found</h3>

              <p>
                Analyze a transaction to see your results here.
              </p>

            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Prediction</th>
                    <th>Fraud Probability</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTransactions.map((item, index) => {

                    const prediction = String(
                      item.prediction || item.result || "NORMAL"
                    ).toUpperCase();

                    const probability = Number(
                      item.fraud_probability ||
                      item.probability ||
                      0
                    );

                    const fraud = prediction === "FRAUD";

                    return (
                      <tr key={item.id || index}>

                        <td>
                          #{item.id || index + 1}
                        </td>

                        <td>
                          ₹
                          {Number(
                            item.amount || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={
                              fraud
                                ? "prediction-pill fraud-pill"
                                : "prediction-pill normal-pill"
                            }
                          >
                            {fraud ? "⚠ FRAUD" : "✓ NORMAL"}
                          </span>
                        </td>

                        <td>
                          <div className="probability-cell">

                            <span>
                              {probability.toFixed(1)}%
                            </span>

                            <div className="mini-bar">
                              <div
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, probability)
                                  )}%`,
                                }}
                              ></div>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="status-text">
                            ● Analyzed
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* FOOTER */}

        <footer className="footer">
          <span>
            🛡️ <strong>FraudGuard AI</strong>
          </span>

          <span>
            Machine Learning Fraud Detection System
          </span>

          <span>
            © 2026
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
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;