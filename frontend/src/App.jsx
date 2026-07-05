import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = ({ user }) => {
  return (
    <div className="card">
      <h2>Welcome, {user?.name || 'User'}</h2>
      <p>Role: {user?.role || 'patient'}</p>
      <p>This dashboard is ready for admin, doctor, and patient workflows.</p>
    </div>
  );
};

const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || 'Authentication failed');
      return;
    }
    localStorage.setItem('medicare-user', JSON.stringify(data.user));
    localStorage.setItem('medicare-token', data.token);
    onLogin(data.user);
    setMessage('Authenticated successfully');
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <h1>Medicare Portal</h1>
        <div className="toggle-row">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('medicare-user') || 'null'));

  return (
    <div className="app-shell">
      <nav className="nav-bar">
        <Link to="/">Medicare</Link>
        <div>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="logout-btn" onClick={() => {
                localStorage.removeItem('medicare-user');
                localStorage.removeItem('medicare-token');
                setUser(null);
              }}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<div className="container"><div className="card"><h1>Hospital Management System</h1><p>Start with authentication, then expand with doctor and appointment modules.</p></div></div>} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}

export default App;
